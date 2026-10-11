<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import type { Product } from '../../../../shared/catalog';
import { money } from '../../../domain/catalog';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
import BaseButton from '../../atoms/BaseButton/BaseButton.vue';
import ProductImage from '../../atoms/ProductImage/ProductImage.vue';
import VariantSelector from '../../molecules/VariantSelector/VariantSelector.vue';

const props = defineProps<{ open: boolean; product: Product | null }>();
const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'add', product: Product, variantId: string): void;
}>();
const dialog = ref<HTMLDialogElement | null>(null);
const color = ref('');
const size = ref<string | null>(null);
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';

const selected = computed(() =>
  props.product?.variants.find(
    (variant) => variant.color === color.value && variant.size === size.value && variant.available,
  ),
);
const image = computed(
  () =>
    props.product?.variants.find((variant) => variant.color === color.value)?.image ||
    props.product?.image ||
    '',
);
const variedPrice = computed(
  () => new Set(props.product?.variants.map((variant) => variant.priceCents)).size > 1,
);

function resetSelection() {
  color.value = '';
  size.value = null;
}
function selectColor(value: string) {
  color.value = value;
  if (
    !props.product?.variants.some(
      (variant) => variant.color === value && variant.size === size.value && variant.available,
    )
  )
    size.value = null;
}
function close() {
  emit('close');
}
function outside(event: MouseEvent) {
  if (event.target !== dialog.value || !dialog.value) return;
  const rect = dialog.value.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    close();
}
function add() {
  if (props.product && selected.value) emit('add', props.product, selected.value.id);
}

watch(
  () => props.open,
  async (open) => {
    await nextTick();
    const element = dialog.value;
    if (!element) return;
    if (open && !element.open) {
      resetSelection();
      previousFocus = document.activeElement as HTMLElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      element.showModal();
      return;
    }
    if (!open && element.open) {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  if (dialog.value?.open) document.body.style.overflow = previousOverflow;
});
</script>

<template>
  <dialog
    ref="dialog"
    class="quick-modal"
    aria-labelledby="quick-modal-title"
    @cancel.prevent="close"
    @click="outside"
  >
    <div v-if="product" class="quick-modal-card">
      <button
        autofocus
        type="button"
        class="close-button"
        aria-label="Fechar seleção"
        @click="close"
      >
        <AppIcon name="close" />
      </button>
      <div class="quick-image">
        <ProductImage :src="image" :alt="product.name" :width="640" />
      </div>
      <div class="quick-content">
        <p class="eyebrow mb-1 text-accent">Escolha a sua</p>
        <h2 id="quick-modal-title" class="font-display text-2xl leading-tight">
          {{ product.name }}
        </h2>
        <p class="mb-4 mt-2 text-lg font-black" aria-live="polite">
          {{ money(selected ? selected.priceCents : product.priceCents) }}
          <span v-if="!selected && variedPrice" class="text-xs font-normal text-stone-500">
            a partir de
          </span>
        </p>
        <VariantSelector
          :variants="product.variants"
          :color="color"
          :size="size || undefined"
          @color="selectColor"
          @size="size = $event"
        />
        <BaseButton class="mt-5 w-full" :disabled="!selected" @click="add">
          <AppIcon name="bag" :size="18" />Adicionar à sacola
        </BaseButton>
        <p class="mt-2 text-center text-xs text-stone-600" aria-live="polite">
          {{ selected ? 'Sua escolha está pronta.' : 'Escolha cor e tamanho para continuar.' }}
        </p>
        <router-link :to="'/produto/' + product.id" class="details-link" @click.native="close">
          Ver todos os detalhes
        </router-link>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.quick-modal {
  width: min(760px, calc(100% - 32px));
  max-height: calc(100dvh - 32px);
  padding: 0;
  overflow: auto;
  border: 0;
  border-radius: 10px;
  background: #fcf9f2;
  color: #22211f;
  box-shadow: 0 24px 80px #38291d55;
}
.quick-modal[open] {
  animation: modal-in 280ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
}
.quick-modal::backdrop {
  background: #21191299;
  animation: backdrop-in 220ms ease both;
}
.quick-modal-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.98fr) minmax(320px, 1.02fr);
}
.quick-image {
  min-width: 0;
  min-height: 100%;
  overflow: hidden;
  background: #eee8dc;
}
.quick-image :deep(.product-image) {
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
}
.quick-image :deep(img) {
  object-fit: cover;
}
.quick-content {
  min-width: 0;
  padding: 34px 38px 28px;
  overflow-wrap: anywhere;
}
.quick-content :deep(legend) {
  margin-bottom: 8px;
}
.quick-content :deep(fieldset + fieldset) {
  margin-top: 16px;
}
.close-button {
  position: absolute;
  z-index: 2;
  right: 14px;
  top: 14px;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: #fcf9f2dd;
}
.details-link {
  display: block;
  margin-top: 14px;
  text-align: center;
  font-size: 12px;
  text-decoration: underline;
  text-underline-offset: 4px;
}
@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes backdrop-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@media (max-width: 640px) {
  .quick-modal-card {
    grid-template-columns: 1fr;
  }
  .quick-image {
    height: min(42vh, 300px);
    min-height: 240px;
  }
  .quick-image :deep(img) {
    object-fit: contain;
  }
  .quick-content {
    padding: 22px 22px 20px;
  }
}
</style>
