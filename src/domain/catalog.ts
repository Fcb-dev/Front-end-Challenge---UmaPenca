import type { Product } from '../../shared/catalog';
export function filterProducts(products: Product[], type: string, color: string): Product[] {
  return products.filter(
    (p) => (!type || p.type === type) && (!color || p.variants.some((v) => v.color === color)),
  );
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
