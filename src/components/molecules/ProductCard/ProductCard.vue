<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../../../../shared/catalog';
import ProductImage from '../../atoms/ProductImage/ProductImage.vue';
import { money } from '../../../domain/catalog';
const props = defineProps<{ product: Product; eager?: boolean }>();
const colors = computed(() =>
  Array.from(new Map(props.product.variants.map((v) => [v.color, v])).values()),
);
</script>
<template>
  <article class="product-card">
    <router-link
      :to="'/produto/' + product.id"
      class="product-card-link"
      :aria-label="'Ver ' + product.name"
    >
      <div class="relative">
        <ProductImage :src="product.image" :alt="product.name" :eager="eager" />
        <span class="card-type">{{ product.type }}</span>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </div>
      <div class="px-4 pb-5 pt-4">
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-stone-600">
          {{ product.creator }}
        </p>
        <h3 class="card-title">{{ product.name }}</h3>
        <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold">{{ money(product.priceCents) }}</p>
          <div class="flex gap-1" :aria-label="colors.length + ' cores'">
            <span
              v-for="color in colors.slice(0, 4)"
              :key="color.color"
              class="color-dot"
              :style="{ background: color.colorHex }"
              :title="color.color"
            />
            <span v-if="colors.length > 4" class="text-[10px]">+{{ colors.length - 4 }}</span>
          </div>
        </div>
      </div>
    </router-link>
  </article>
</template>
<style scoped>
.product-card-link {
  display: block;
  background: #fcf9f2;
  border-radius: 6px;
  box-shadow: 0 4px 16px #38291d0a;
  transition:
    transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
  transition-duration: 600ms !important;
}
.product-card-link > .relative {
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}
@media (hover: hover) {
  .product-card-link:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 30px #38291d1a;
  }
}
.product-card-link:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px #38291d1a;
}
@media (prefers-reduced-motion: reduce) {
  .card-arrow,
  .product-card-link :deep(img) {
    transition: none !important;
  }
}
.card-type {
  position: absolute;
  left: 12px;
  top: 12px;
  background: #f7f3eaef;
  padding: 6px 10px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 2px;
}
.card-arrow {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  background: #f7f3ea;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}
.product-card-link:hover .card-arrow,
.product-card-link:focus-visible .card-arrow {
  opacity: 1;
}
.card-title {
  font-size: 14px;
  line-height: 1.5;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.color-dot {
  width: 12px;
  height: 12px;
  border: 1px solid #7775;
  border-radius: 50%;
}
@media (max-width: 480px) {
  .card-type {
    left: 8px;
    top: 8px;
    padding: 4px 6px;
    font-size: 8px;
  }
}
</style>
