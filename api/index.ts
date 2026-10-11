import seed from '../data/products.json' with { type: 'json' };
import { createApp } from '../server/app.js';
import type { CatalogSeed } from '../shared/catalog';

export default createApp(seed as CatalogSeed);
