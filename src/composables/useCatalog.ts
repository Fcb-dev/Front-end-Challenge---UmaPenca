import { reactive, readonly } from 'vue';
import type { CatalogQuery, CatalogResponse, Product } from '../../shared/catalog';
import { fetchCatalog } from '../services/catalog';

const cache = new Map<string, CatalogResponse>();
const queryKey = (query: CatalogQuery) =>
  JSON.stringify([query.tipo || '', query.cor || '', query.preco || '', query.ordem || '']);

export function useCatalog() {
  const state = reactive({
    products: [] as Product[],
    loading: false,
    loaded: false,
    error: '',
    total: 0,
    nextOffset: null as number | null,
    types: [] as string[],
    colors: [] as string[],
  });
  let query: CatalogQuery = {};
  let generation = 0;
  async function load() {
    if (state.loading || (state.loaded && state.nextOffset === null)) return;
    const current = generation;
    state.loading = true;
    state.error = '';
    try {
      const data = await fetchCatalog(query, state.nextOffset ?? 0);
      if (current !== generation) return;
      state.products.push(...data.products);
      state.total = data.total;
      state.nextOffset = data.nextOffset;
      state.types = data.filters.types;
      state.colors = data.filters.colors;
      state.loaded = true;
      cache.set(queryKey(query), { ...data, products: [...state.products] });
    } catch {
      if (current === generation)
        state.error = 'Não conseguimos carregar a coleção. Confira sua conexão e tente de novo.';
    } finally {
      if (current === generation) state.loading = false;
    }
  }
  function reset(nextQuery: CatalogQuery) {
    generation++;
    query = { ...nextQuery };
    state.products = [];
    state.total = 0;
    state.nextOffset = null;
    state.loaded = false;
    state.loading = false;
    state.error = '';
    const cached = cache.get(queryKey(query));
    if (cached) {
      state.products = [...cached.products];
      state.total = cached.total;
      state.nextOffset = cached.nextOffset;
      state.types = cached.filters.types;
      state.colors = cached.filters.colors;
      state.loaded = true;
      return Promise.resolve();
    }
    return load();
  }
  return { state: readonly(state), load, reset };
}
