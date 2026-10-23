<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import type { Product } from '../../shared/catalog';
import { fetchProduct, ApiError } from '../services/catalog';
import { useCart } from '../composables/useCart';
import ProductDetails from '../components/organisms/ProductDetails/ProductDetails.vue';
import StatusPanel from '../components/molecules/StatusPanel/StatusPanel.vue';
import AppIcon from '../components/atoms/AppIcon/AppIcon.vue';
const vm = getCurrentInstance()!.proxy;
const cart = useCart();
const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref('');
const missing = ref(false);
let request = 0;
async function load() {
  const token = ++request;
  loading.value = true;
  error.value = '';
  missing.value = false;
  product.value = null;
  try {
    const result = await fetchProduct(vm.$route.params.id);
    if (token !== request) return;
    product.value = result;
    document.title = result.name + ' — Bossa';
  } catch (failure) {
    if (token !== request) return;
    missing.value = failure instanceof ApiError && failure.status === 404;
    error.value = missing.value
      ? 'Essa peça não está na nossa seleção atual.'
      : 'Confira sua conexão e tente carregar a peça novamente.';
  } finally {
    if (token === request) loading.value = false;
  }
}
watch(() => vm.$route.params.id, load, { immediate: true });
onBeforeUnmount(() => {
  request++;
});
</script>
<template>
  <div class="container-page py-8 md:py-10">
    <router-link to="/" class="mb-8 inline-flex min-h-[44px] items-center gap-2 text-xs"
      ><AppIcon name="back" :size="16" /> Voltar à coleção</router-link
    >
    <div v-if="loading" role="status" class="grid gap-10 md:grid-cols-2">
      <div class="aspect-[4/5] animate-pulse bg-stone-200" />
      <div class="py-10">
        <p>Carregando sua próxima ideia...</p>
        <div class="mt-8 h-12 animate-pulse bg-stone-200" />
      </div>
    </div>
    <StatusPanel
      v-else-if="error"
      :title="missing ? 'Peça não encontrada' : 'Não conseguimos abrir esta peça'"
      :message="error"
      :action="missing ? undefined : 'Tentar novamente'"
      error
      @action="load"
    />
    <ProductDetails
      v-else-if="product"
      :key="product.id"
      :product="product"
      :busy="cart.state.loading"
      :cart-error="cart.state.error"
      @add="cart.add(product, $event)"
      @retry="cart.hydrate"
    />
  </div>
</template>
