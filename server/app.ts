import express, { Router } from 'express';
import { CATALOG_PAGE_SIZE, type CatalogSeed } from '../shared/catalog.js';
import { filterProducts, sortProducts } from '../src/domain/catalog.js';

export function createApp(seed: CatalogSeed) {
  const app = express();
  app.disable('x-powered-by');

  const router = Router();
  router.get('/health', (_req, res) => res.json({ status: 'ok', products: seed.products.length }));
  router.get('/products', (req, res) => {
    const rawOffset = req.query.offset ?? '0';
    if (
      typeof rawOffset !== 'string' ||
      !/^\d+$/.test(rawOffset) ||
      !Number.isSafeInteger(Number(rawOffset))
    ) {
      res.status(400).json({ message: 'Offset inválido.' });
      return;
    }
    const offset = Number(rawOffset);
    const value = (key: string) =>
      typeof req.query[key] === 'string' ? (req.query[key] as string) : '';
    const products = sortProducts(
      filterProducts(seed.products, value('tipo'), value('cor'), value('preco')),
      value('ordem'),
    );
    const end = offset + CATALOG_PAGE_SIZE;
    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      products: products.slice(offset, end),
      collectedAt: seed.collectedAt,
      total: products.length,
      nextOffset: end < products.length ? end : null,
      filters: {
        types: [...new Set(seed.products.map((p) => p.type))].sort(),
        colors: [...new Set(seed.products.flatMap((p) => p.variants.map((v) => v.color)))].sort(),
      },
    });
  });
  router.get('/products/:id', (req, res) => {
    const product = seed.products.find((p) => p.id === req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado.' });
      return;
    }
    res.json(product);
  });

  app.use('/api', router);
  app.use('/', router);
  app.use((_req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));

  return app;
}
