import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createApp } from '../server/app';
import type { CatalogSeed } from '../shared/catalog';

const seed = JSON.parse(
  readFileSync(join(process.cwd(), 'data/products.json'), 'utf8'),
) as CatalogSeed;
export default createApp(seed);
