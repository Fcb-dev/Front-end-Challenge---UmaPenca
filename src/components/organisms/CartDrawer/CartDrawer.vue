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
const closing = ref(false);
let motion: Animation | null = null;
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';
watch(
  () => props.open,
  async (open) => {
    await nextTick();
    const element = dialog.value;
    if (!element || open !== props.open) return;
    const wasOpen = element.open;
    const from = wasOpen ? getComputedStyle(element).transform : 'translateX(100%)';
    motion?.cancel();
    closing.value = !open;
    if (open && !wasOpen) {
      previousFocus = document.activeElement as HTMLElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      element.showModal();
    }
    if (!element.open) return;
    const animation = element.animate(
      [{ transform: from }, { transform: open ? 'translateX(0)' : 'translateX(100%)' }],
      {
        duration: 450,
        easing: 'cubic-bezier(.4, 0, .2, 1)',
        fill: 'forwards',
      },
    );
    motion = animation;
    try {
      await animation.finished;
    } catch {
      return; // A new interaction or unmount superseded this transition.
    }
    if (!props.open) {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    }
    animation.cancel();
    motion = null;
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
  motion?.cancel();
  if (dialog.value?.open) document.body.style.overflow = previousOverflow;
});
</script>
<template>
  <dialog
    ref="dialog"
    class="cart-drawer"
    :class="{ 'is-closing': closing }"
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
  animation: backdrop-in 450ms ease both;
}
.cart-drawer.is-closing::backdrop {
  animation: backdrop-out 450ms ease both;
}
@keyframes backdrop-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes backdrop-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cart-drawer::backdrop,
  .cart-drawer.is-closing::backdrop {
    animation-duration: 450ms !important;
    backdrop-filter: none;
  }
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
  scrollbar-width: thin;
  scrollbar-color: #b42355 #e9e2d7;
  scrollbar-gutter: stable;
}
.drawer-content::-webkit-scrollbar {
  width: 8px;
}
.drawer-content::-webkit-scrollbar-track {
  background: #e9e2d7;
  border-radius: 999px;
}
.drawer-content::-webkit-scrollbar-thumb {
  background: #b42355;
  border: 2px solid #e9e2d7;
  border-radius: 999px;
}
.drawer-content::-webkit-scrollbar-thumb:hover {
  background: #8f1944;
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
