<script setup lang="ts">
import { computed } from 'vue';
import type { ProductVariant } from '../../../../shared/catalog';
import ColorSwatch from '../../atoms/ColorSwatch/ColorSwatch.vue';
const props = defineProps<{ variants: ProductVariant[]; color: string; size?: string }>();
defineEmits<{ (event: 'color', value: string): void; (event: 'size', value: string): void }>();
const colors = computed(() =>
  Array.from(
    new Map(props.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values(),
  ),
);
const sizes = computed(() => [
  ...new Set(props.variants.map((v) => v.size).filter((s): s is string => !!s)),
]);
function hasSize(size: string) {
  return props.variants.some((v) => v.color === props.color && v.size === size && v.available);
}
function hasColor(color: string) {
  return props.variants.some((v) => v.color === color && v.available);
}
</script>
<template>
  <div>
    <fieldset>
      <legend class="mb-3 text-xs font-semibold">
        Cor <span class="ml-2 font-normal text-stone-600">{{ color || 'Escolha uma cor' }}</span>
      </legend>
      <div class="flex flex-wrap gap-2">
        <ColorSwatch
          v-for="item in colors"
          :key="item.name"
          :color="item.name"
          :hex="item.hex"
          :selected="color === item.name"
          :disabled="!hasColor(item.name)"
          @select="$emit('color', item.name)"
        />
      </div>
    </fieldset>
    <fieldset v-if="sizes.length" class="mt-6">
      <legend class="mb-3 text-xs font-semibold">
        Tamanho
        <span class="ml-2 font-normal text-stone-600">{{ size || 'Escolha seu tamanho' }}</span>
      </legend>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in sizes"
          :key="item"
          type="button"
          class="size-option"
          :class="{ selected: size === item }"
          :aria-pressed="size === item"
          :disabled="!hasSize(item)"
          @click="$emit('size', item)"
        >
          {{ item }}
        </button>
      </div>
      <p v-if="!color" class="mt-3 text-xs text-stone-500">
        Selecione uma cor para ver os tamanhos disponíveis.
      </p>
    </fieldset>
  </div>
</template>
<style scoped>
.size-option {
  min-width: 44px;
  height: 44px;
  padding: 0 10px;
  border: 1px solid #bdb5a8;
  border-radius: 3px;
  font-size: 12px;
}
.size-option.selected {
  color: #f7f3ea;
  background: #22211f;
  border-color: #22211f;
}
.size-option:disabled {
  opacity: 0.3;
  text-decoration: line-through;
}
</style>
