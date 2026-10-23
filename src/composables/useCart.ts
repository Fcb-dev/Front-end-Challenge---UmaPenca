import { computed, reactive } from 'vue';
import type { Product } from '../../shared/catalog';
import {
  addLine,
  lineKey,
  parseCart,
  resolveCart,
  subtotal,
  validQuantity,
  type CartLine,
} from '../domain/cart';
import { ApiError, fetchProduct } from '../services/catalog';

// Chave legada mantida para preservar sacolas salvas antes da identidade Bossa.
export const CART_KEY = 'penca:cart:v1';
type CartStorage = Pick<Storage, 'getItem' | 'setItem'>;
export function createCart(storage?: CartStorage) {
  const state = reactive({
    lines: [] as CartLine[],
    products: [] as Product[],
    open: false,
    loading: false,
    error: '',
    notice: '',
  });
  const rows = computed(() => resolveCart(state.lines, state.products));
  const count = computed(() => state.lines.reduce((sum, line) => sum + line.quantity, 0));
  const total = computed(() => subtotal(rows.value));
  function persist() {
    try {
      storage?.setItem(CART_KEY, JSON.stringify({ version: 1, lines: state.lines }));
    } catch {
      state.notice =
        'Sua sacola funciona nesta sessão, mas não foi possível salvá-la neste navegador.';
    }
  }
  async function hydrate() {
    if (state.loading) return;
    if (!state.lines.length) {
      try {
        state.lines = parseCart(storage?.getItem(CART_KEY) ?? null);
      } catch {
        state.notice = 'O armazenamento do navegador está indisponível.';
      }
    }
    if (!state.lines.length) return;
    state.loading = true;
    state.error = '';
    try {
      const products = await Promise.all(
        [...new Set(state.lines.map((line) => line.productId))].map(async (id) => {
          try {
            return await fetchProduct(id, true);
          } catch (error) {
            if (error instanceof ApiError && error.status === 404) return null;
            throw error;
          }
        }),
      );
      state.products = products.filter((product): product is Product => product !== null);
      const valid = resolveCart(state.lines, state.products);
      if (valid.length !== state.lines.length)
        state.notice = 'Alguns itens não estão mais disponíveis e foram removidos da sacola.';
      state.lines = valid.map(({ productId, variantId, quantity }) => ({
        productId,
        variantId,
        quantity,
      }));
      persist();
    } catch {
      state.error = 'Não foi possível conferir sua sacola. Tente novamente.';
    } finally {
      state.loading = false;
    }
  }
  function add(product: Product, variantId: string) {
    if (
      !product.variants.some((v) => v.id === variantId && v.available) ||
      state.loading ||
      state.error
    )
      return false;
    state.products = [...state.products.filter((p) => p.id !== product.id), product];
    state.lines = addLine(state.lines, product.id, variantId);
    persist();
    state.open = true;
    return true;
  }
  function update(key: string, quantity: number) {
    if (!validQuantity(quantity)) return;
    state.lines = state.lines.map((line) => (lineKey(line) === key ? { ...line, quantity } : line));
    persist();
  }
  function remove(key: string) {
    state.lines = state.lines.filter((line) => lineKey(line) !== key);
    persist();
  }
  return { state, rows, count, total, hydrate, add, update, remove };
}
let storage: Storage | undefined;
try {
  storage = window.localStorage;
} catch {
  /* Navegadores privados podem bloquear localStorage. */
}
const cart = createCart(storage);
export function useCart() {
  return cart;
}
