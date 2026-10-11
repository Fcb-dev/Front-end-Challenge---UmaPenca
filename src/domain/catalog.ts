import type { Product } from '../../shared/catalog';

export interface PriceRange {
  readonly id: string;
  readonly label: string;
  readonly min: number;
  readonly max: number;
}

export const PRICE_RANGES: readonly PriceRange[] = [
  { id: 'ate-50', label: 'Até R$ 50', min: 0, max: 5000 },
  { id: '50-80', label: 'R$ 50 a R$ 80', min: 5000, max: 8000 },
  { id: '80-120', label: 'R$ 80 a R$ 120', min: 8000, max: 12000 },
  { id: 'acima-120', label: 'Acima de R$ 120', min: 12000, max: Infinity },
];

export function matchPriceRange(priceCents: number, range: string): boolean {
  if (!range) return true;
  const target = PRICE_RANGES.find((r) => r.id === range || r.label === range);
  if (!target) return true;
  const meetsMin = target.min === 0 ? priceCents >= 0 : priceCents > target.min;
  const meetsMax = target.max === Infinity ? true : priceCents <= target.max;
  return meetsMin && meetsMax;
}

export function filterProducts(
  products: Product[],
  type = '',
  color = '',
  price = '',
): Product[] {
  return products.filter(
    (p) =>
      (!type || p.type === type) &&
      (!color || p.variants.some((v) => v.color === color)) &&
      (!price || matchPriceRange(p.priceCents, price)),
  );
}

export type SortOption = 'padrao' | 'menor-preco' | 'maior-preco';

export interface SortChoice {
  readonly id: SortOption;
  readonly label: string;
}

export const SORT_OPTIONS: readonly SortChoice[] = [
  { id: 'padrao', label: 'Ordem padrão' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
];

export function sortProducts(products: Product[], sort: string): Product[] {
  if (!sort || sort === 'padrao' || sort === 'default' || sort === 'Ordem padrão') {
    return products;
  }
  if (sort === 'menor-preco' || sort === 'price-asc' || sort === 'Menor preço') {
    return [...products].sort((a, b) => a.priceCents - b.priceCents);
  }
  if (sort === 'maior-preco' || sort === 'price-desc' || sort === 'Maior preço') {
    return [...products].sort((a, b) => b.priceCents - a.priceCents);
  }
  return products;
}
export function money(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}
export function imageUrl(url: string, width = 600): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith('.imgix.net')) {
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('q', '80');
      parsed.searchParams.set('fit', 'max');
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
