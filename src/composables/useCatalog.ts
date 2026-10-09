import { reactive, readonly } from 'vue';
import type { Product } from '../../shared/catalog';
import { fetchCatalog } from '../services/catalog';
const state = reactive({ products: [] as Product[], loading: false, loaded: false, error: '' });
export function useCatalog() {
  async function load() {
    if (state.loaded || state.loading) return;
    state.loading = true;
    state.error = '';
    try {
      state.products = (await fetchCatalog()).products;
      state.loaded = true;
    } catch {
      state.error = 'Não conseguimos carregar a coleção. Confira sua conexão e tente de novo.';
    } finally {
      state.loading = false;
    }
  }
  return { state: readonly(state), load };
}
