<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
import FilterSelect from '../../molecules/FilterSelect/FilterSelect.vue';
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
      <FilterSelect
        id="filter-type"
        v-model="selectedType"
        label="Tipo de produto"
        placeholder="Todos os produtos"
        :options="types"
      />
      <FilterSelect
        id="filter-color"
        v-model="selectedColor"
        label="Cor"
        placeholder="Todas as cores"
        :options="colors"
      />
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
