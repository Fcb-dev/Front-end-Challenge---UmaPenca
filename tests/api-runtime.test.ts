// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { expect, it } from 'vitest';

it('runs the compiled serverless entrypoint in native Node ESM', () => {
  const root = resolve('.');
  mkdirSync(join(root, 'tmp'), { recursive: true });
  const output = mkdtempSync(join(root, 'tmp', 'api-runtime-'));
  try {
    const program = ts.createProgram([join(root, 'api/index.ts')], {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      esModuleInterop: true,
      resolveJsonModule: true,
      skipLibCheck: true,
      rootDir: root,
      outDir: output,
      types: ['node'],
    });
    const result = program.emit();
    expect(result.emitSkipped).toBe(false);
    const entry = pathToFileURL(join(output, 'api/index.js')).href;
    // No tsx/Vite loader: relative imports must resolve in the emitted JavaScript.
    const script = `
      import assert from 'node:assert/strict';
      import { once } from 'node:events';
      const { default: app } = await import(${JSON.stringify(entry)});
      const server = app.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const base = 'http://127.0.0.1:' + server.address().port;
      async function get(path) {
        const response = await fetch(base + path);
        assert.equal(response.status, 200);
        return response.json();
      }
      try {
        assert.equal((await get('/api/health')).status, 'ok');
        const first = await get('/api/products?offset=0');
        assert.equal(first.products.length, 28);
        assert.equal(first.nextOffset, 28);
        const last = await get('/api/products?offset=' + first.nextOffset);
        assert.equal(first.products.length + last.products.length, first.total);
        assert.equal(last.nextOffset, null);
        const product = first.products[0];
        assert.equal((await get('/api/products/' + product.id)).id, product.id);
        console.log('native-esm-ok');
      } finally {
        server.closeAllConnections();
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
      }
    `;
    const env = { ...process.env };
    delete env.NODE_OPTIONS;
    const stdout = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
      cwd: root,
      env,
      encoding: 'utf8',
      timeout: 15000,
    });
    expect(stdout).toContain('native-esm-ok');
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
}, 30000);
