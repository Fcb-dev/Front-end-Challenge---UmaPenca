import type { Product, ProductVariant } from '../../shared/catalog';
export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}
export interface CartRow extends CartLine {
  key: string;
  product: Product;
  variant: ProductVariant;
}
export const MAX_QUANTITY = 99;
export function lineKey(line: Pick<CartLine, 'productId' | 'variantId'>): string {
  return JSON.stringify([line.productId, line.variantId]);
}
export function validQuantity(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_QUANTITY;
}
export function addLine(lines: CartLine[], productId: string, variantId: string): CartLine[] {
  const key = lineKey({ productId, variantId });
  const existing = lines.find((line) => lineKey(line) === key);
  if (!existing) return [...lines, { productId, variantId, quantity: 1 }];
  return lines.map((line) =>
    lineKey(line) === key ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) } : line,
  );
}
export function parseCart(raw: string | null): CartLine[] {
  try {
    const data: unknown = JSON.parse(raw || 'null');
    if (
      !data ||
      typeof data !== 'object' ||
      !('version' in data) ||
      data.version !== 1 ||
      !('lines' in data) ||
      !Array.isArray(data.lines)
    )
      return [];
    const result = new Map<string, CartLine>();
    for (const value of data.lines.slice(0, 200)) {
      if (!value || typeof value !== 'object') continue;
      const { productId, variantId, quantity } = value as Partial<CartLine>;
      if (
        typeof productId !== 'string' ||
        typeof variantId !== 'string' ||
        typeof quantity !== 'number' ||
        !validQuantity(quantity)
      )
        continue;
      const line = { productId, variantId, quantity };
      const key = lineKey(line);
      result.set(key, {
        ...line,
        quantity: Math.min(MAX_QUANTITY, quantity + (result.get(key)?.quantity ?? 0)),
      });
    }
    return [...result.values()];
  } catch {
    return [];
  }
}
export function resolveCart(lines: CartLine[], products: Product[]): CartRow[] {
  return lines.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId && v.available);
    return product && variant ? [{ ...line, key: lineKey(line), product, variant }] : [];
  });
}
export function subtotal(rows: CartRow[]): number {
  return rows.reduce((sum, row) => sum + row.quantity * row.variant.priceCents, 0);
}
