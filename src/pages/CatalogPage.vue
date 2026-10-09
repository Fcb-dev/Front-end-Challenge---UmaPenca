<script setup lang="ts">
import { computed, getCurrentInstance, onMounted } from 'vue';
import { useCatalog } from '../composables/useCatalog';
import { filterProducts } from '../domain/catalog';
import { router } from '../router';
import CatalogFilters from '../components/organisms/CatalogFilters/CatalogFilters.vue';
import ProductGrid from '../components/organisms/ProductGrid/ProductGrid.vue';
import StatusPanel from '../components/molecules/StatusPanel/StatusPanel.vue';
const vm = getCurrentInstance()!.proxy;
const { state, load } = useCatalog();
const query = computed(() => vm.$route.query);
const type = computed(() => (typeof query.value.tipo === 'string' ? query.value.tipo : ''));
const color = computed(() => (typeof query.value.cor === 'string' ? query.value.cor : ''));
const products = computed(() =>
  filterProducts(
    [...state.products] as import('../../shared/catalog').Product[],
    type.value,
    color.value,
  ),
);
const types = computed(() => Array.from(new Set(state.products.map((p) => p.type))).sort());
const colors = computed(() =>
  Array.from(new Set(state.products.flatMap((p) => p.variants.map((v) => v.color)))).sort(),
);
function change(key: string, value: string) {
  const next = { ...query.value };
  if (value) next[key] = value;
  else delete next[key];
  void router.push({ path: '/', query: next }).catch(() => {});
}
function clear() {
  void router.push({ path: '/', query: {} }).catch(() => {});
}
onMounted(load);
</script>
<template>
  <div class="container-page">
    <section class="editorial-hero">
      <div class="hero-copy">
        <p class="eyebrow mb-5 text-accent">Uma coleção de boas ideias</p>
        <h1>Vista suas ideias.<br /><span>Leve sua essência.</span></h1>
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
    <section aria-labelledby="collection-title">
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
        :type="type"
        :color="color"
        :count="products.length"
        @change="change"
        @clear="clear"
      />
      <StatusPanel
        v-if="state.error"
        title="A coleção fez uma pausa"
        :message="state.error"
        action="Tentar novamente"
        error
        @action="load"
      />
      <StatusPanel
        v-else-if="state.loaded && !products.length"
        title="Ainda não encontramos essa combinação"
        message="Experimente outra cor ou tipo de produto. Tem muita ideia boa por aqui."
        action="Limpar filtros"
        @action="clear"
      />
      <ProductGrid v-else :products="products" :loading="state.loading || !state.loaded" />
      <p v-if="state.loaded && products.length" class="mt-12 text-center text-xs text-stone-500">
        Você viu todas as {{ products.length }} peças desta seleção.
        <span aria-hidden="true">✳</span>
      </p>
    </section>
  </div>
</template>
<style scoped>
.editorial-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  padding: 64px 0 72px;
}
.hero-copy h1 {
  font-family: 'DM Serif Display', serif;
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
  font-family: 'DM Serif Display', serif;
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
