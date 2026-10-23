import type { CatalogQuery, CatalogResponse, Product } from '../../shared/catalog';
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
const knownProducts = new Map<string, Product>();
export async function fetchCatalog(query: CatalogQuery = {}, offset = 0): Promise<CatalogResponse> {
  const params = new URLSearchParams({ ...query, offset: String(offset) });
  const data = await get<CatalogResponse>('/products?' + params.toString());
  if (!Array.isArray(data.products)) throw new Error('Resposta de catálogo inválida.');
  data.products.forEach((product) => knownProducts.set(product.id, product));
  return data;
}
export async function fetchProduct(id: string, fresh = false): Promise<Product> {
  const known = fresh ? undefined : knownProducts.get(id);
  return known ?? get<Product>('/products/' + encodeURIComponent(id));
}
