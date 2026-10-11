import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { createApp } from './app';
import type { CatalogSeed } from '../shared/catalog';
import seed from '../data/products.json' with { type: 'json' };
const app = createApp(seed as CatalogSeed);
if (existsSync('.env')) loadEnvFile();
const port = Number(process.env.PORT ?? 3001);
app.listen(port, '127.0.0.1', () => console.log('API: http://127.0.0.1:' + port));
