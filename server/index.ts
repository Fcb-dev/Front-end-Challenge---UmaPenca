import express from 'express';
const app = express();
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(Number(process.env.PORT ?? 3001), '127.0.0.1', () =>
  console.log('API: http://127.0.0.1:3001'),
);
