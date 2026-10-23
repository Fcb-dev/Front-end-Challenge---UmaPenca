// @vitest-environment node
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import app from '../api/index';
import seed from '../data/products.json';
import { filterProducts, sortProducts } from '../src/domain/catalog';

let server: Server;
let base: string;

beforeAll(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Servidor indisponível');
  base = `http://127.0.0.1:${address.port}`;
});

afterAll(
  () =>
    new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    ),
);

describe('Vercel function entrypoint', () => {
  it('paginates all scraped products in batches of 28 without duplicates', async () => {
    const first = await (await fetch(`${base}/api/products`)).json();
    const last = await (await fetch(`${base}/api/products?offset=28`)).json();
    expect(first.products).toEqual(seed.products.slice(0, 28));
    expect(first.nextOffset).toBe(28);
    expect(first.total).toBe(seed.products.length);
    expect(last.products).toEqual(seed.products.slice(28));
    expect(last.nextOffset).toBeNull();
    const empty = await (await fetch(`${base}/api/products?offset=500`)).json();
    expect(empty.products).toEqual([]);
    expect(empty.nextOffset).toBeNull();
  });

  it('filters and sorts the entire collection before pagination', async () => {
    const expected = sortProducts(filterProducts(seed.products, 'Moletom'), 'maior-preco');
    const data = await (await fetch(`${base}/api/products?tipo=Moletom&ordem=maior-preco`)).json();
    expect(data.products).toEqual(expected.slice(0, 28));
    expect(data.total).toBe(expected.length);
    expect(data.filters.types).toEqual([...new Set(seed.products.map((p) => p.type))].sort());
  });

  it.each(['-1', '1.5', 'abc', '9007199254740992'])('rejects invalid offset %s', async (offset) => {
    expect((await fetch(`${base}/api/products?offset=${offset}`)).status).toBe(400);
  });

  it('starts with the bundled catalog and exposes the health route', async () => {
    const response = await fetch(`${base}/api/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok', products: 50 });
  });
});
