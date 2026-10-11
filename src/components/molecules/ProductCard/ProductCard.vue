<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Product } from '../../../../shared/catalog';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
import ProductImage from '../../atoms/ProductImage/ProductImage.vue';
import { money } from '../../../domain/catalog';
const props = defineProps<{ product: Product; eager?: boolean }>();
const hasHovered = ref(false);
const emit = defineEmits<{
  (event: 'quick-add', payload: { product: Product; variantId: string }): void;
}>();
const colors = computed(() =>
  Array.from(new Map(props.product.variants.map((v) => [v.color, v])).values()),
);
const quickVariant = computed(() => props.product.variants.find((variant) => variant.available));
const quickVariantLabel = computed(() => {
  if (!quickVariant.value) return '';
  return [quickVariant.value.color, quickVariant.value.size].filter(Boolean).join(' · ');
});
function quickAdd() {
  if (quickVariant.value)
    emit('quick-add', { product: props.product, variantId: quickVariant.value.id });
}
</script>
<template>
  <article
    class="product-card"
    :class="{ 'was-hovered': hasHovered }"
    @mouseenter="hasHovered = true"
  >
    <div class="product-card-surface">
      <div class="product-image-area">
        <router-link :to="'/produto/' + product.id" :aria-label="'Ver ' + product.name">
        <ProductImage :src="product.image" :alt="product.name" :eager="eager" />
        </router-link>
        <span class="card-type">{{ product.type }}</span>
        <button
          class="quick-add"
          type="button"
          :disabled="!quickVariant"
          :aria-label="
            quickVariant
              ? `Adicionar ${product.name}, ${quickVariantLabel}, à sacola`
              : `${product.name} indisponível`
          "
          @click="quickAdd"
        >
          <AppIcon name="bag" :size="16" />
          {{ quickVariant ? 'Adicionar à sacola' : 'Indisponível' }}
        </button>
      </div>
      <router-link
        :to="'/produto/' + product.id"
        class="product-details-link block px-4 pb-5 pt-4"
        :aria-label="'Ver detalhes de ' + product.name"
      >
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-stone-600">
          {{ product.creator }}
        </p>
        <h3 class="card-title">{{ product.name }}</h3>
        <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p class="card-price">{{ money(product.priceCents) }}</p>
          <div
            class="color-preview"
            :class="{ 'has-more-colors': colors.length > 3 }"
            :style="{ '--expanded-color-width': `${colors.length * 16 + 28}px` }"
            :aria-label="colors.length + ' cores: ' + colors.map((item) => item.color).join(', ')"
          >
            <div class="color-panel">
              <div class="color-strip color-collapsed">
                <span
                  v-for="color in colors.slice(0, 3)"
                  :key="'collapsed-' + color.color"
                  class="color-dot"
                  :style="{ background: color.colorHex }"
                  :title="color.color"
                />
                <span v-if="colors.length > 3" class="color-more">+{{ colors.length - 3 }}</span>
              </div>
              <div v-if="colors.length > 3" class="color-strip color-expanded">
                <span
                  v-for="color in colors"
                  :key="'expanded-' + color.color"
                  class="color-dot"
                  :style="{ background: color.colorHex }"
                  :title="color.color"
                />
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </article>
</template>
<style scoped>
.product-card-surface {
  background: #fcf9f2;
  border-radius: 6px;
  box-shadow: 0 4px 16px #38291d0a;
  transition: box-shadow 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
  transition-duration: 600ms !important;
}
.product-image-area {
  position: relative;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}
@media (hover: hover) {
  .product-card:hover .product-card-surface {
    box-shadow: 0 14px 30px #38291d1a;
  }
}
.product-card:focus-within .product-card-surface {
  box-shadow: 0 14px 30px #38291d1a;
}
@media (prefers-reduced-motion: reduce) {
  .quick-add,
  .product-card-surface {
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
.quick-add {
  position: absolute;
  bottom: 12px;
  left: 50%;
  min-height: 38px;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  background: #b42355;
  color: #fff9f3;
  padding: 9px 18px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 34px);
  box-shadow: 0 8px 24px #38291d33;
  will-change: transform, opacity;
  transition: background-color 180ms ease;
}
.product-card:hover .quick-add,
.quick-add:focus-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
  animation: quick-add-slide-top 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.product-card.was-hovered:not(:hover) .quick-add {
  animation: quick-add-slide-bottom 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.product-card.was-hovered:not(:hover) .quick-add:focus-visible {
  animation: quick-add-slide-top 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes quick-add-slide-top {
  0% {
    opacity: 0;
    transform: translate(-50%, 34px);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
@keyframes quick-add-slide-bottom {
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 34px);
  }
}
.quick-add:hover,
.quick-add:focus-visible {
  background: #8f1944;
}
.quick-add:disabled {
  background: #756f68;
}
@media (hover: none) {
  .quick-add {
    animation: none !important;
    opacity: 1;
    pointer-events: auto;
    transform: translate(-50%, 0);
  }
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-price {
  font-size: 16px;
  font-weight: 900;
  line-height: 1.4;
}
.color-dot {
  flex: 0 0 auto;
  width: 12px;
  height: 12px;
  border: 1px solid #7775;
  border-radius: 50%;
}
.color-preview {
  position: relative;
  z-index: 2;
  width: 86px;
  height: 28px;
}
.color-panel {
  position: absolute;
  right: 0;
  top: 50%;
  width: 86px;
  height: 28px;
  overflow: hidden;
  border-radius: 999px;
  background: #fcf9f2;
  transform: translateY(-50%);
  transition:
    width 450ms cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 300ms ease;
}
.color-strip {
  position: absolute;
  right: 6px;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  transform: translateY(-50%);
  white-space: nowrap;
  transition: opacity 180ms ease;
}
.color-more {
  display: grid;
  min-width: 22px;
  height: 20px;
  place-items: center;
  border-radius: 999px;
  background: #fcf9f2;
  font-size: 9px;
}
.color-expanded {
  left: 6px;
  right: auto;
  opacity: 0;
}
.color-preview.has-more-colors:hover .color-panel,
.product-details-link:focus-visible .color-preview.has-more-colors .color-panel {
  width: var(--expanded-color-width);
  box-shadow: 0 5px 16px #38291d1a;
}
.color-preview.has-more-colors:hover .color-collapsed,
.product-details-link:focus-visible .color-preview.has-more-colors .color-collapsed {
  opacity: 0;
}
.color-preview.has-more-colors:hover .color-expanded,
.product-details-link:focus-visible .color-preview.has-more-colors .color-expanded {
  opacity: 1;
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
