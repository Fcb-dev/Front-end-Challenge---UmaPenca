import { mkdir, writeFile, rename } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { parseListing, parseDetail, type RecordData } from './parser';
import { adaptProduct } from './adapter';
import type { CatalogSeed } from '../../shared/catalog';

const pageArg = process.argv.find((a) => a.startsWith('--pages='));
const pages = pageArg ? Number(pageArg.split('=')[1]) : 2;
if (!Number.isInteger(pages) || pages < 1 || pages > 5)
  throw new Error('Use --pages=1 até --pages=5.');
let lastRequest = 0;
async function get(url: string): Promise<string> {
  await delay(Math.max(0, 1100 - (Date.now() - lastRequest)));
  lastRequest = Date.now();
  const response = await fetch(url, {
    headers: { 'User-Agent': 'UmaPencaTechnicalChallenge/1.0 (educational catalog snapshot)' },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.text();
}
const seed: CatalogSeed = {
  collectedAt: new Date().toISOString(),
  source: 'https://umapenca.com/loja/',
  pages,
  skipped: [],
  products: [],
};
const listings = new Map<string, RecordData>();
for (let page = 1; page <= pages; page++) {
  const products = parseListing(await get(seed.source + '?page=' + page));
  for (const product of products) listings.set(String(product.id), product);
  console.log('Listagem ' + page + ': ' + products.length + ' produtos.');
}
for (const item of listings.values()) {
  const url = String(item.full_link);
  if (new URL(url).hostname !== 'umapenca.com') {
    seed.skipped.push({ url, reason: 'Domínio externo; coleta limitada à Uma Penca.' });
    continue;
  }
  try {
    const detail = parseDetail(await get(url));
    seed.products.push(adaptProduct(item, detail));
    console.log('Coletado: ' + item.id + ' (' + seed.products.length + ')');
  } catch (error) {
    seed.skipped.push({
      url,
      reason: error instanceof Error ? error.message : 'Falha desconhecida',
    });
  }
}
if (!seed.products.length) throw new Error('Nenhum produto válido; seed anterior preservado.');
const directory = fileURLToPath(new URL('../../data/', import.meta.url));
await mkdir(directory, { recursive: true });
const target = directory + '/products.json';
await writeFile(target + '.tmp', JSON.stringify(seed, null, 2) + '\n');
await rename(target + '.tmp', target);
console.log(
  'Seed salvo: ' + seed.products.length + ' produtos, ' + seed.skipped.length + ' ignorados.',
);
