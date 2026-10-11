import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Rewrite {
  source: string;
  destination: string;
}

describe('configuração de deploy da Vercel', () => {
  it('encaminha a API antes do fallback da SPA', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
      rewrites: Rewrite[];
    };

    expect(config.rewrites.slice(0, 2)).toEqual([
      { source: '/api', destination: '/api/index.ts' },
      { source: '/api/(.*)', destination: '/api/index.ts' },
    ]);
    expect(config.rewrites.at(-1)).toEqual({
      source: '/((?!api/|assets/|storybook/).*)',
      destination: '/index.html',
    });
  });
});
