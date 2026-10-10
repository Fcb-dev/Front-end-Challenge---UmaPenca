<script setup lang="ts">
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
import { MAX_QUANTITY } from '../../../domain/cart';
defineProps<{ value: number; label: string }>();
defineEmits<{ (event: 'change', value: number): void }>();
</script>
<template>
  <div class="quantity-selector" role="group" :aria-label="'Quantidade de ' + label">
    <button
      type="button"
      :aria-label="'Diminuir quantidade de ' + label"
      :disabled="value <= 1"
      @click="$emit('change', value - 1)"
    >
      <AppIcon name="minus" :size="14" />
    </button>
    <output aria-live="polite">{{ value }}</output>
    <button
      type="button"
      :aria-label="'Aumentar quantidade de ' + label"
      :disabled="value >= MAX_QUANTITY"
      @click="$emit('change', value + 1)"
    >
      <AppIcon name="plus" :size="14" />
    </button>
  </div>
</template>
<style scoped>
.quantity-selector {
  display: inline-flex;
  border: 1px solid #c9c1b4;
  border-radius: 3px;
  align-items: center;
}
button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
}
button:disabled {
  opacity: 0.3;
}
output {
  min-width: 20px;
  text-align: center;
  font-size: 12px;
}
</style>
