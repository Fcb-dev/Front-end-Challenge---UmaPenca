<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import type { CartRow } from '../../../domain/cart';
import { money } from '../../../domain/catalog';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
import BaseButton from '../../atoms/BaseButton/BaseButton.vue';
import CartItem from '../../molecules/CartItem/CartItem.vue';
const props = defineProps<{
  open: boolean;
  items: CartRow[];
  total: number;
  loading?: boolean;
  error?: string;
  notice?: string;
}>();
const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'quantity', key: string, value: number): void;
  (event: 'remove', key: string): void;
  (event: 'retry'): void;
}>();
const dialog = ref<HTMLDialogElement | null>(null);
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';
watch(
  () => props.open,
  async (open) => {
    await nextTick();
    if (!dialog.value) return;
    if (open && !dialog.value.open) {
      previousFocus = document.activeElement as HTMLElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.value.showModal();
    } else if (!open && dialog.value.open) {
      dialog.value.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    }
  },
  { immediate: true },
);
function outside(event: MouseEvent) {
  if (event.target !== dialog.value || !dialog.value) return;
  const rect = dialog.value.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    emit('close');
}
onBeforeUnmount(() => {
  if (dialog.value?.open) document.body.style.overflow = previousOverflow;
});
</script>
<template>
  <dialog
    ref="dialog"
    class="cart-drawer"
    aria-labelledby="cart-title"
    @cancel.prevent="$emit('close')"
    @click="outside"
  >
    <div class="drawer-layout">
      <header class="flex items-center justify-between border-b border-stone-300 pb-5">
        <div>
          <p class="eyebrow mb-2 text-accent">Boas escolhas</p>
          <h2 id="cart-title" class="font-display text-3xl">
            Sua sacola<span class="text-accent">.</span>
          </h2>
        </div>
        <button
          autofocus
          type="button"
          class="grid h-11 w-11 place-items-center"
          aria-label="Fechar sacola"
          @click="$emit('close')"
        >
          <AppIcon name="close" />
        </button>
      </header>
      <div class="drawer-content">
        <p v-if="notice" role="status" class="my-4 rounded bg-stone-200 p-3 text-xs leading-5">
          {{ notice }}
        </p>
        <p v-if="loading" role="status" class="py-12 text-center text-sm">
          Conferindo suas escolhas...
        </p>
        <div v-else-if="error" role="alert" class="py-12 text-center">
          <p class="mb-4 text-sm">{{ error }}</p>
          <BaseButton variant="secondary" @click="$emit('retry')">Tentar novamente</BaseButton>
        </div>
        <div v-else-if="!items.length" class="py-20 text-center">
          <span class="font-display text-6xl text-accent" aria-hidden="true">✳</span>
          <h3 class="mt-6 font-display text-3xl">Espaço para boas ideias.</h3>
          <p class="mx-auto mt-4 max-w-[240px] text-sm leading-6 text-stone-600">
            Sua sacola está vazia. Que tal encontrar uma peça com a sua cara?
          </p>
          <BaseButton class="mt-6" variant="secondary" @click="$emit('close')"
            >Explorar a coleção</BaseButton
          >
        </div>
        <template v-else
          ><CartItem
            v-for="item in items"
            :key="item.key"
            :item="item"
            @quantity="$emit('quantity', item.key, $event)"
            @remove="$emit('remove', item.key)"
            @navigate="$emit('close')"
        /></template>
      </div>
      <footer v-if="items.length && !loading && !error" class="border-t border-stone-300 pt-6">
        <div class="flex items-center justify-between">
          <span class="text-sm">Subtotal</span
          ><strong class="text-xl" aria-live="polite">{{ money(total) }}</strong>
        </div>
        <p class="mb-5 mt-3 text-xs leading-5 text-stone-600">
          Esta é uma loja demonstrativa. Nenhuma compra será realizada.
        </p>
        <BaseButton variant="secondary" class="w-full" @click="$emit('close')"
          >Continuar explorando <AppIcon name="arrow" :size="18"
        /></BaseButton>
      </footer>
    </div>
  </dialog>
</template>
<style scoped>
.cart-drawer {
  margin: 0 0 0 auto;
  padding: 0;
  width: 480px;
  max-width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  border: 0;
  background: #f7f3ea;
  color: #22211f;
  box-shadow: -20px 0 60px #0002;
}
.cart-drawer::backdrop {
  background: #22211f80;
  backdrop-filter: blur(2px);
}
.drawer-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 28px;
}
.drawer-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
@media (max-width: 480px) {
  .cart-drawer {
    width: 100%;
  }
  .drawer-layout {
    padding: 20px;
  }
}
</style>
