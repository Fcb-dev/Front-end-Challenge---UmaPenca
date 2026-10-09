<script setup lang="ts">
import BaseButton from '../../atoms/BaseButton/BaseButton.vue';
defineProps<{ title: string; message: string; action?: string; error?: boolean }>();
defineEmits<{ (event: 'action'): void }>();
</script>
<template>
  <div class="status-panel" :role="error ? 'alert' : 'status'">
    <span class="font-display text-5xl text-accent" aria-hidden="true">{{
      error ? '!' : '∅'
    }}</span>
    <h2 class="mt-4 font-display text-3xl">{{ title }}</h2>
    <p class="mx-auto my-4 max-w-md text-sm leading-relaxed text-stone-600">{{ message }}</p>
    <BaseButton v-if="action" variant="secondary" @click="$emit('action')">{{ action }}</BaseButton>
  </div>
</template>
<style scoped>
.status-panel {
  padding: 64px 20px;
  text-align: center;
  border: 1px solid #ddd6ca;
}
</style>
