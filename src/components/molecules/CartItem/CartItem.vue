<script setup lang="ts">
import type { CartRow } from '../../../domain/cart';
import { money } from '../../../domain/catalog';
import ProductImage from '../../atoms/ProductImage/ProductImage.vue';
import QuantitySelector from '../QuantitySelector/QuantitySelector.vue';
defineProps<{ item: CartRow }>();
defineEmits<{
  (event: 'quantity', value: number): void;
  (event: 'remove'): void;
  (event: 'navigate'): void;
}>();
</script>
<template>
  <article class="cart-item">
    <router-link
      :to="'/produto/' + item.productId"
      :aria-label="'Ver ' + item.product.name"
      @click.native="$emit('navigate')"
      ><ProductImage :src="item.variant.image" :alt="item.product.name" :width="200"
    /></router-link>
    <div class="min-w-0">
      <h3 class="text-sm font-medium leading-5">{{ item.product.name }}</h3>
      <p class="my-2 text-xs text-stone-600">
        {{ item.variant.color }}<span v-if="item.variant.size"> / {{ item.variant.size }}</span>
      </p>
      <p class="mb-3 text-xs font-semibold">
        {{ money(item.variant.priceCents) }}
        <span class="font-normal text-stone-500">/ unidade</span>
      </p>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <QuantitySelector
          :value="item.quantity"
          :label="item.product.name + ' ' + item.variant.color + ' ' + (item.variant.size || '')"
          @change="$emit('quantity', $event)"
        /><button
          type="button"
          class="min-h-[44px] text-xs text-stone-600 underline underline-offset-4"
          :aria-label="
            'Remover ' +
            item.product.name +
            ' ' +
            item.variant.color +
            ' ' +
            (item.variant.size || '')
          "
          @click="$emit('remove')"
        >
          Remover
        </button>
      </div>
    </div>
  </article>
</template>
<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid #ddd6ca;
}
@media (max-width: 380px) {
  .cart-item {
    grid-template-columns: 64px 1fr;
    gap: 12px;
  }
}
</style>
