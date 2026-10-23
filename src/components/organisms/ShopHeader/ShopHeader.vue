<script setup lang="ts">
import { nextTick } from 'vue';
import { router } from '../../../router';
import { smoothScrollTo } from '../../../utils/smoothScroll';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
withDefaults(defineProps<{ count?: number }>(), { count: 0 });
defineEmits<{ (event: 'cart'): void }>();

async function goToCollection() {
  if (router.currentRoute.path !== '/') {
    await router.push({ path: '/', hash: '#collection' }).catch(() => {});
    await nextTick();
  } else if (router.currentRoute.hash !== '#collection') {
    await router
      .push({ path: '/', query: router.currentRoute.query, hash: '#collection' })
      .catch(() => {});
  }
  const collection = document.querySelector<HTMLElement>('#collection');
  if (collection) {
    const header = document.querySelector<HTMLElement>('.header-shell');
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const target = collection.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
    smoothScrollTo(Math.max(0, target));
  }
}
</script>
<template>
  <header class="shop-header container-page">
    <router-link to="/" class="wordmark" aria-label="Bossa, início"
      >bossa<span>.</span><span class="wordmark-star" aria-hidden="true">✳</span></router-link
    >
    <nav class="flex items-center gap-3 text-xs sm:gap-8" aria-label="Principal">
      <button type="button" class="collection-link" @click="goToCollection">A coleção</button>
    </nav>
    <button class="bag-button" aria-label="Abrir sacola" @click="$emit('cart')">
      <AppIcon name="bag" /><span class="hidden sm:inline">Sua sacola</span
      ><span class="bag-count">{{ count }}</span>
    </button>
  </header>
</template>
<style scoped>
.shop-header {
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d8d1c5;
}
.wordmark {
  display: flex;
  align-items: center;
  font-family: 'Nunito', sans-serif;
  font-size: 46px;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1;
}
.wordmark > span:first-child {
  color: #b42355;
}
.wordmark-star {
  font-family: sans-serif;
  font-size: 24px;
  margin-left: 8px;
  color: #b42355;
}
.bag-button {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  font-size: 12px;
}
.collection-link {
  min-height: 44px;
}
.bag-count {
  display: grid;
  place-items: center;
  border: 1px solid #bdb5a8;
  border-radius: 50%;
  min-width: 24px;
  height: 24px;
  font-size: 10px;
}
@media (max-width: 640px) {
  .shop-header {
    height: 80px;
  }
  .wordmark {
    font-size: 39px;
  }
}
</style>
