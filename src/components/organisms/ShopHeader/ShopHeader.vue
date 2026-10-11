<script setup lang="ts">
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
withDefaults(defineProps<{ count?: number }>(), { count: 0 });
defineEmits<{ (event: 'cart'): void }>();
</script>
<template>
  <header class="shop-header container-page">
    <router-link to="/" class="wordmark" aria-label="Bossa, início"
      >bossa<span>.</span><span class="wordmark-star" aria-hidden="true">✳</span></router-link
    >
    <nav class="hidden items-center gap-8 text-xs md:flex" aria-label="Principal">
      <router-link to="/">A coleção</router-link><a href="/#manifesto">Nosso olhar</a>
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
  font-family: 'Chocolate Covered Raindrops', cursive;
  font-size: 50px;
  font-weight: 700;
  letter-spacing: 0;
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
    font-size: 43px;
  }
}
</style>
