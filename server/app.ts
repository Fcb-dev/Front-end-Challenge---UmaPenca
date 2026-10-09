import express from 'express';
import type { CatalogSeed } from '../shared/catalog';

export function createApp(seed: CatalogSeed) {
  const app = express();
  app.disable('x-powered-by');
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', products: seed.products.length }));
  app.get('/api/products', (_req, res) => {
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ products: seed.products, collectedAt: seed.collectedAt });
  });
  app.get('/api/products/:id', (req, res) => {
    const product = seed.products.find((p) => p.id === req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado.' });
      return;
    }
    res.json(product);
  });
  app.use('/api', (_req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));
  return app;
}
