<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
const props = defineProps<{
  types: string[];
  colors: string[];
  type: string;
  color: string;
  count: number;
}>();
const emit = defineEmits<{
  (event: 'change', key: 'tipo' | 'cor', value: string): void;
  (event: 'clear'): void;
}>();
const expanded = ref(false);
// v-model reaplica a seleção quando as opções chegam da API após a URL inicial.
const selectedType = computed({
  get: () => props.type,
  set: (value: string) => emit('change', 'tipo', value),
});
const selectedColor = computed({
  get: () => props.color,
  set: (value: string) => emit('change', 'cor', value),
});
</script>
<template>
  <section class="filters" aria-label="Filtros de produtos">
    <div class="flex items-center justify-between gap-4">
      <p class="text-xs text-stone-600" aria-live="polite">
        {{ count }} {{ count === 1 ? 'peça' : 'peças' }} para descobrir
      </p>
      <button
        class="flex min-h-[44px] items-center gap-2 text-sm md:hidden"
        :aria-expanded="expanded"
        aria-controls="filter-controls"
        @click="expanded = !expanded"
      >
        <AppIcon name="filter" :size="18" /> Filtrar {{ type || color ? '(ativo)' : '' }}
      </button>
    </div>
    <div id="filter-controls" class="filter-controls" :class="{ expanded }">
      <label
        ><span class="sr-only">Tipo de produto</span
        ><select v-model="selectedType" aria-label="Tipo de produto">
          <option value="">Todos os produtos</option>
          <option v-for="item in types" :key="item" :value="item">{{ item }}</option>
        </select></label
      >
      <label
        ><span class="sr-only">Cor</span
        ><select v-model="selectedColor" aria-label="Cor">
          <option value="">Todas as cores</option>
          <option v-for="item in colors" :key="item" :value="item">{{ item }}</option>
        </select></label
      >
      <button
        v-if="type || color"
        class="min-h-[44px] text-xs underline underline-offset-4"
        @click="$emit('clear')"
      >
        Limpar filtros
      </button>
    </div>
  </section>
</template>
<style scoped>
.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 0;
  margin-bottom: 12px;
  border-top: 1px solid #d8d1c5;
}
.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}
select {
  min-height: 44px;
  border: 1px solid #bdb5a8;
  background: transparent;
  padding: 8px 32px 8px 12px;
  font-size: 12px;
  border-radius: 3px;
  max-width: 100%;
}
@media (max-width: 767px) {
  .filters {
    display: block;
  }
  .filter-controls {
    display: none;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  .filter-controls.expanded {
    display: flex;
  }
}
</style>
