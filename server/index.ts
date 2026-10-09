import { readFileSync } from 'node:fs';
import { createApp } from './app';
import type { CatalogSeed } from '../shared/catalog';
const seed = JSON.parse(
  readFileSync(new URL('../data/products.json', import.meta.url), 'utf8'),
) as CatalogSeed;
const app = createApp(seed);
app.listen(Number(process.env.PORT ?? 3001), '127.0.0.1', () =>
  console.log('API: http://127.0.0.1:3001'),
);
