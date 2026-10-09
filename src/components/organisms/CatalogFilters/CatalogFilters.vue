<script setup lang="ts">
import { ref } from 'vue';
import AppIcon from '../../atoms/AppIcon/AppIcon.vue';
defineProps<{ types: string[]; colors: string[]; type: string; color: string; count: number }>();
defineEmits<{
  (event: 'change', key: 'tipo' | 'cor', value: string): void;
  (event: 'clear'): void;
}>();
const expanded = ref(false);
function value(event: Event) {
  return (event.target as HTMLSelectElement).value;
}
</script>
<template>
  <section class="filters" aria-label="Filtros de produtos">
    <div class="flex items-center justify-between gap-4">
      <p class="text-xs text-stone-600" aria-live="polite">{{ count }} peças para descobrir</p>
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
        ><select :value="type" @change="$emit('change', 'tipo', value($event))">
          <option value="">Todos os produtos</option>
          <option v-for="item in types" :key="item" :value="item">{{ item }}</option>
        </select></label
      >
      <label
        ><span class="sr-only">Cor</span
        ><select :value="color" @change="$emit('change', 'cor', value($event))">
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
