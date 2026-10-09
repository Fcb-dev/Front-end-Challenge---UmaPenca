<script setup lang="ts">
import type { Product } from '../../../../shared/catalog';
import ProductCard from '../../molecules/ProductCard/ProductCard.vue';
defineProps<{ products: Product[]; loading?: boolean }>();
</script>
<template>
  <div>
    <p v-if="loading" class="sr-only" role="status">Carregando coleção...</p>
    <div class="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      <template v-if="loading"
        ><div v-for="n in 8" :key="'skeleton-' + n" class="animate-pulse" aria-hidden="true">
          <div class="aspect-[4/5] bg-stone-200" />
          <div class="mt-4 h-4 w-3/4 bg-stone-200" />
          <div class="mt-3 h-3 w-1/3 bg-stone-200" /></div
      ></template>
      <template v-else
        ><ProductCard
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :eager="index < 4"
      /></template>
    </div>
  </div>
</template>
