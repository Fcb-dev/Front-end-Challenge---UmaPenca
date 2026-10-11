<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { smoothScrollTo } from '../../../utils/smoothScroll';
import AppIcon from '../AppIcon/AppIcon.vue';

const props = withDefaults(defineProps<{ visibleAfter?: number }>(), { visibleAfter: 480 });
const visible = ref(false);

function updateVisibility() {
  visible.value = window.scrollY > props.visibleAfter;
}

function backToTop() {
  smoothScrollTo(0);
}

onMounted(() => {
  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener('scroll', updateVisibility));
</script>

<template>
  <transition name="back-to-top">
    <button
      v-show="visible"
      type="button"
      class="back-to-top-button"
      aria-label="Voltar ao topo"
      @click="backToTop"
    >
      <AppIcon name="back" :size="20" />
    </button>
  </transition>
</template>

<style scoped>
.back-to-top-button {
  position: fixed;
  z-index: 20;
  right: max(24px, env(safe-area-inset-right));
  bottom: max(24px, env(safe-area-inset-bottom));
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 50%;
  background: #b42355;
  color: #f7f3ea;
  box-shadow: 0 10px 28px #52243733;
  transition:
    transform 240ms ease,
    background 240ms ease,
    box-shadow 240ms ease;
}
.back-to-top-button :deep(svg) {
  transform: rotate(90deg);
}
.back-to-top-button:hover {
  transform: translateY(-3px);
  background: #941d47;
  box-shadow: 0 14px 34px #52243742;
}
.back-to-top-button:active {
  transform: translateY(0);
}
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}
.back-to-top-enter,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
@media (max-width: 640px) {
  .back-to-top-button {
    right: max(16px, env(safe-area-inset-right));
    bottom: max(16px, env(safe-area-inset-bottom));
    width: 48px;
    height: 48px;
  }
}
</style>
