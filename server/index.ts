import { existsSync, readFileSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { createApp } from './app';
import type { CatalogSeed } from '../shared/catalog';
const seed = JSON.parse(
  readFileSync(new URL('../data/products.json', import.meta.url), 'utf8'),
) as CatalogSeed;
const app = createApp(seed);
if (existsSync('.env')) loadEnvFile();
const port = Number(process.env.PORT ?? 3001);
app.listen(port, '127.0.0.1', () => console.log('API: http://127.0.0.1:' + port));
