export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size: string | null;
  priceCents: number;
  image: string;
  available: boolean;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  creator: string;
  model: string;
  image: string;
  images: string[];
  priceCents: number;
  variants: ProductVariant[];
  sourceUrl: string;
  enrichedFields: string[];
}
export interface CatalogSeed {
  collectedAt: string;
  source: string;
  pages: number;
  skipped: { url: string; reason: string }[];
  products: Product[];
}
export interface CatalogResponse {
  products: Product[];
  collectedAt: string;
}
