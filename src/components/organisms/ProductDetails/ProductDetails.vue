<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Product } from '../../../../shared/catalog';
import ProductImage from '../../atoms/ProductImage/ProductImage.vue';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
import BaseButton from '../../atoms/BaseButton/BaseButton.vue';
import VariantSelector from '../../molecules/VariantSelector/VariantSelector.vue';
import { money } from '../../../domain/catalog';
const props = defineProps<{ product: Product; busy?: boolean }>();
defineEmits<{ (event: 'add', variantId: string): void }>();
const color = ref('');
const size = ref<string | null>(null);
watch(
  () => props.product.id,
  () => {
    color.value = '';
    size.value = null;
  },
);
const selected = computed(() =>
  props.product.variants.find(
    (v) => v.color === color.value && v.size === size.value && v.available,
  ),
);
const image = computed(
  () =>
    props.product.variants.find((v) => v.color === color.value && v.image)?.image ||
    props.product.image,
);
const available = computed(() => props.product.variants.some((v) => v.available));
function selectColor(value: string) {
  color.value = value;
  if (
    !props.product.variants.some((v) => v.color === value && v.size === size.value && v.available)
  )
    size.value = null;
}
</script>
<template>
  <div class="product-details">
    <div class="product-photo">
      <ProductImage :src="image" :alt="product.name" eager :width="1000" />
      <p class="mt-4 text-center text-[10px] uppercase tracking-[.12em] text-stone-500">
        Uma ideia de {{ product.creator }}
      </p>
    </div>
    <div class="product-information">
      <p class="eyebrow mb-4 text-accent">{{ product.creator }}</p>
      <h1 class="font-display text-4xl leading-tight md:text-5xl">{{ product.name }}</h1>
      <p class="mt-3 text-xs text-stone-600">{{ product.model }}</p>
      <p class="my-7 text-2xl font-medium" aria-live="polite">
        {{ money(selected ? selected.priceCents : product.priceCents)
        }}<span
          v-if="!selected && new Set(product.variants.map((v) => v.priceCents)).size > 1"
          class="ml-2 text-xs font-normal text-stone-500"
          >a partir de</span
        >
      </p>
      <div class="border-t border-stone-300 pt-6">
        <VariantSelector
          :variants="product.variants"
          :color="color"
          :size="size || undefined"
          @color="selectColor"
          @size="size = $event"
        />
      </div>
      <BaseButton
        class="mt-8 w-full"
        :disabled="!selected || busy"
        @click="selected && $emit('add', selected.id)"
        ><AppIcon name="bag" :size="19" />{{
          !available ? 'Indisponível nesta seleção' : 'Adicionar à sacola'
        }}</BaseButton
      >
      <p class="mt-3 text-center text-xs text-stone-600" aria-live="polite">
        {{
          busy
            ? 'Conferindo sua sacola...'
            : selected
              ? 'Sua escolha está pronta para ir com você.'
              : 'Escolha as opções acima para adicionar.'
        }}
      </p>
      <div class="mt-8 border-t border-stone-300 pt-6">
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider">Sobre esta peça</h2>
        <p class="whitespace-pre-line text-sm leading-7 text-stone-600">
          {{ product.description }}
        </p>
      </div>
      <a
        :href="product.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-6 inline-block text-xs underline underline-offset-4"
        >Ver peça na Uma Penca ↗</a
      >
    </div>
  </div>
</template>
<style scoped>
.product-details {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}
.product-photo {
  max-width: 580px;
}
.product-information {
  padding: 12px 0;
}
@media (max-width: 767px) {
  .product-details {
    grid-template-columns: 1fr;
  }
  .product-photo {
    max-width: none;
  }
}
</style>
