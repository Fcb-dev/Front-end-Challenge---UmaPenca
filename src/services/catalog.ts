import type { CatalogResponse, Product } from '../../shared/catalog';
const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
async function get<T>(path: string): Promise<T> {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(15000) });
  if (!response.ok)
    throw new ApiError(
      response.status,
      response.status === 404 ? 'Produto não encontrado.' : 'Não foi possível carregar a coleção.',
    );
  return response.json() as Promise<T>;
}
let cached: CatalogResponse | null = null;
let pending: Promise<CatalogResponse> | null = null;
export function fetchCatalog(): Promise<CatalogResponse> {
  if (cached) return Promise.resolve(cached);
  if (!pending)
    pending = get<CatalogResponse>('/products')
      .then((data) => {
        if (!Array.isArray(data.products)) throw new Error('Resposta de catálogo inválida.');
        cached = data;
        return data;
      })
      .finally(() => {
        pending = null;
      });
  return pending;
}
export async function fetchProduct(id: string): Promise<Product> {
  const known = cached?.products.find((p) => p.id === id);
  return known ?? get<Product>('/products/' + encodeURIComponent(id));
}
