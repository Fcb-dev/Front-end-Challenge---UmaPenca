<script setup lang="ts">
import { ref, watch } from 'vue';
import { imageUrl } from '../../../domain/catalog';
const props = withDefaults(
  defineProps<{ src: string; alt: string; eager?: boolean; width?: number }>(),
  { eager: false, width: 600 },
);
const failed = ref(false);
watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);
</script>
<template>
  <div class="product-image">
    <img
      v-if="!failed"
      :src="imageUrl(src, width)"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      width="600"
      height="750"
      @error="failed = true"
    />
    <div v-else role="img" :aria-label="alt + ' — imagem indisponível'" class="image-fallback">
      <span class="font-display text-5xl">p.</span><span>Imagem indisponível</span>
    </div>
  </div>
</template>
<style scoped>
.product-image {
  background: #e8e5df;
  overflow: hidden;
  aspect-ratio: 4 / 5;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s;
}
.image-fallback {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  font-size: 12px;
  text-align: center;
}
</style>
