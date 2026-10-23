<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import { useCatalog } from '../composables/useCatalog';
import { useCart } from '../composables/useCart';
import type { Product } from '../../shared/catalog';
import { PRICE_RANGES, SORT_OPTIONS } from '../domain/catalog';
import { router } from '../router';
import CatalogFilters from '../components/organisms/CatalogFilters/CatalogFilters.vue';
import ProductGrid from '../components/organisms/ProductGrid/ProductGrid.vue';
import StatusPanel from '../components/molecules/StatusPanel/StatusPanel.vue';
import QuickAddModal from '../components/organisms/QuickAddModal/QuickAddModal.vue';
const vm = getCurrentInstance()!.proxy;
const { state, load, reset } = useCatalog();
const cart = useCart();
const query = computed(() => vm.$route.query);
const type = computed(() => (typeof query.value.tipo === 'string' ? query.value.tipo : ''));
const color = computed(() => (typeof query.value.cor === 'string' ? query.value.cor : ''));
const rawPrice = computed(() => (typeof query.value.preco === 'string' ? query.value.preco : ''));
const price = computed(() => {
  const match = PRICE_RANGES.find((r) => r.id === rawPrice.value || r.label === rawPrice.value);
  return match ? match.label : rawPrice.value;
});
const rawSort = computed(() => (typeof query.value.ordem === 'string' ? query.value.ordem : ''));
const sort = computed(() => {
  const match = SORT_OPTIONS.find((s) => s.id === rawSort.value || s.label === rawSort.value);
  return match && match.id !== 'padrao' ? match.label : '';
});
const products = computed(() => [...state.products] as Product[]);
const types = computed(() => [...state.types]);
const colors = computed(() => [...state.colors]);
watch(
  () => [type.value, color.value, price.value, sort.value],
  () => {
    void reset({ tipo: type.value, cor: color.value, preco: price.value, ordem: sort.value });
  },
  { immediate: true },
);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | undefined;
watch(
  () => [sentinel.value, state.loading, state.nextOffset, state.error],
  () => {
    observer?.disconnect();
    if (!sentinel.value || state.loading || state.error || state.nextOffset === null) return;
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void load();
    });
    observer.observe(sentinel.value);
  },
  { flush: 'post' },
);
onBeforeUnmount(() => observer?.disconnect());
const prices = computed(() => PRICE_RANGES.map((r) => r.label));
function change(key: string, value: string) {
  const next = { ...query.value };
  if (value) next[key] = value;
  else delete next[key];
  void router.push({ path: '/', query: next }).catch(() => {});
}
function clear() {
  void router.push({ path: '/', query: {} }).catch(() => {});
}
const quickProduct = ref<Product | null>(null);
function quickAdd(product: Product) {
  const variants = product.variants.filter((variant) => variant.available);
  if (variants.length === 1) {
    cart.add(product, variants[0].id);
    return;
  }
  quickProduct.value = product;
}
function addQuickVariant(product: Product, variantId: string) {
  quickProduct.value = null;
  cart.add(product, variantId);
}
</script>
<template>
  <div class="container-page">
    <section class="editorial-hero">
      <div class="hero-copy">
        <p class="eyebrow mb-5 text-accent">Uma coleção de boas ideias</p>
        <h1>Vista suas ideias.<br /><span>Leve sua bossa.</span></h1>
        <p class="hero-description">
          Estampas com voz, objetos com afeto.<br />Descubra peças que dizem um pouco de você.
        </p>
      </div>
      <div class="hero-note" aria-hidden="true">
        <span class="hero-star">✳</span>
        <p>feito para<br /><em>ser você.</em></p>
        <span class="hero-note-small">SELEÇÃO INDEPENDENTE / 01</span>
      </div>
    </section>
    <section id="collection" aria-labelledby="collection-title">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="eyebrow mb-2 text-stone-600">Encontre seu próximo favorito</p>
          <h2 id="collection-title" class="font-display text-4xl">
            A coleção<span class="text-accent">.</span>
          </h2>
        </div>
        <span class="hidden text-xs text-stone-500 sm:inline"
          >Peças únicas, muitas possibilidades ↙</span
        >
      </div>
      <CatalogFilters
        :types="types"
        :colors="colors"
        :prices="prices"
        :type="type"
        :color="color"
        :price="price"
        :sort="sort"
        :count="state.total"
        @change="change"
        @clear="clear"
      />
      <StatusPanel
        v-if="state.error && !state.loaded"
        title="A coleção fez uma pausa"
        :message="state.error"
        action="Tentar novamente"
        error
        @action="load"
      />
      <StatusPanel
        v-else-if="state.loaded && !products.length"
        title="Ainda não encontramos essa combinação"
        message="Experimente outra cor, tipo de produto ou faixa de preço. Tem muita ideia boa por aqui."
        action="Limpar filtros"
        @action="clear"
      />
      <ProductGrid v-else :products="products" :loading="!state.loaded" @quick-add="quickAdd" />
      <div
        v-if="state.loaded && state.nextOffset !== null"
        ref="sentinel"
        class="mt-12 text-center"
      >
        <p v-if="state.loading" role="status">Carregando mais produtos...</p>
        <StatusPanel
          v-else-if="state.error"
          title="Não foi possível carregar mais produtos"
          :message="state.error"
          action="Tentar novamente"
          error
          @action="load"
        />
        <button v-else type="button" class="text-sm underline" @click="load">
          Carregar mais produtos
        </button>
      </div>
      <p
        v-if="state.loaded && state.nextOffset === null && products.length"
        class="mt-12 text-center text-xs text-stone-500"
      >
        Você viu todas as {{ products.length }} peças desta seleção.
        <span aria-hidden="true">✳</span>
      </p>
    </section>
    <QuickAddModal
      :open="!!quickProduct"
      :product="quickProduct"
      @close="quickProduct = null"
      @add="addQuickVariant"
    />
  </div>
</template>
<style scoped>
.editorial-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  padding: 44px 0 48px;
}
#collection {
  scroll-margin-top: 24px;
}
.hero-copy h1 {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: clamp(44px, 5.3vw, 76px);
  line-height: 1.05;
  letter-spacing: -2px;
}
.hero-copy h1 span {
  color: #b42355;
}
.hero-description {
  margin-top: 24px;
  font-size: 13px;
  line-height: 1.8;
  color: #666057;
}
.hero-note {
  border-left: 1px solid #d8d1c5;
  padding: 16px 24px 16px 64px;
  min-width: 250px;
  transform: rotate(-4deg);
  text-align: center;
}
.hero-star {
  display: block;
  color: #b42355;
  font-size: 80px;
  line-height: 1;
}
.hero-note p {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.2;
  margin: 16px 0 22px;
}
.hero-note-small {
  font-size: 8px;
  letter-spacing: 0.15em;
}
@media (max-width: 767px) {
  .editorial-hero {
    padding: 42px 0;
  }
  .hero-note {
    display: none;
  }
  .hero-copy h1 {
    letter-spacing: -1px;
  }
}
</style>
