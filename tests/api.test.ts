// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import { createApp } from '../server/app';
import { adaptProduct } from '../scripts/scraping/adapter';

let server: Server;
let base: string;
const product = adaptProduct({
  id: 'sample',
  name: 'Produto de teste',
  price: 50,
  img_cover: 'https://example.com/item.jpg',
  full_link: 'https://umapenca.com/sample',
});
beforeAll(async () => {
  server = createApp({
    products: [product],
    collectedAt: '2026-10-09',
    pages: 1,
    source: 'fixture',
    skipped: [],
  }).listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Servidor indisponível');
  base = 'http://127.0.0.1:' + address.port;
});
afterAll(
  () =>
    new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    ),
);
describe('API própria', () => {
  it('serve catálogo e detalhe pelo mesmo contrato', async () => {
    expect(await (await fetch(base + '/api/products')).json()).toMatchObject({
      products: [product],
    });
    expect(await (await fetch(base + '/api/products/sample')).json()).toEqual(product);
  });
  it('retorna 404 JSON para produto e rota ausentes', async () => {
    const response = await fetch(base + '/api/products/missing');
    expect(response.status).toBe(404);
    expect(await response.json()).toHaveProperty('message');
    expect((await fetch(base + '/api/missing')).status).toBe(404);
  });
});
