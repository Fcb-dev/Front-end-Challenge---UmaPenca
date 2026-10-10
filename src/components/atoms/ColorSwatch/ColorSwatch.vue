<script setup lang="ts">
defineProps<{ color: string; hex: string; selected?: boolean; disabled?: boolean }>();
defineEmits<{ (event: 'select'): void }>();
</script>
<template>
  <button
    type="button"
    class="swatch"
    :class="{ selected }"
    :aria-label="color"
    :aria-pressed="!!selected"
    :disabled="disabled"
    @click="$emit('select')"
  >
    <span :style="{ background: hex }" /><span class="sr-only">{{ color }}</span>
  </button>
</template>
<style scoped>
.swatch {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid transparent;
  border-radius: 50%;
}
.swatch > span:first-child {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #7776;
}
.swatch.selected {
  border-color: #22211f;
}
.swatch:disabled {
  opacity: 0.3;
}
</style>
