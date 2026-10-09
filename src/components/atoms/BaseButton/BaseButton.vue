<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    type?: 'button' | 'submit';
  }>(),
  {
    variant: 'primary',
    disabled: false,
    type: 'button',
  },
);
defineEmits<{ (event: 'click', value: MouseEvent): void }>();
</script>
<template>
  <button
    :type="type"
    :disabled="disabled"
    class="base-button"
    :class="variant"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  padding: 0.8rem 1.4rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    background 0.15s,
    transform 0.15s;
}
.primary {
  background: #b42355;
  color: white;
}
.primary:hover:not(:disabled) {
  background: #921b44;
}
.secondary {
  border-color: #22211f;
  color: #22211f;
  background: transparent;
}
.secondary:hover:not(:disabled) {
  background: #eae5db;
}
.base-button:disabled {
  opacity: 0.45;
}
</style>
