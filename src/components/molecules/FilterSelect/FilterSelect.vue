<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
const props = defineProps<{
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: string[];
}>();
const emit = defineEmits<{ (event: 'input', value: string): void }>();
const root = ref<HTMLElement | null>(null);
const opened = ref(false);
const active = ref(0);
const choices = computed(() => ['', ...props.options]);
let search = '';
let searchTimer: ReturnType<typeof setTimeout> | undefined;
function reveal() {
  nextTick(() =>
    root.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }),
  );
}
function open() {
  opened.value = true;
  active.value = Math.max(0, choices.value.indexOf(props.value));
  reveal();
}
function choose(index: number) {
  emit('input', choices.value[index]);
  opened.value = false;
  root.value?.querySelector<HTMLButtonElement>('button')?.focus();
}
function keyboard(event: KeyboardEvent) {
  if (event.key === 'Tab' || event.key === 'Escape') {
    opened.value = false;
    return;
  }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
    if (!opened.value) {
      open();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      choose(active.value);
      return;
    }
    if (event.key === 'Home') active.value = 0;
    else if (event.key === 'End') active.value = choices.value.length - 1;
    else
      active.value =
        (active.value + (event.key === 'ArrowDown' ? 1 : -1) + choices.value.length) %
        choices.value.length;
    reveal();
  } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    if (!opened.value) open();
    clearTimeout(searchTimer);
    search += event.key.toLocaleLowerCase('pt-BR');
    const index = choices.value.findIndex((item) =>
      item.toLocaleLowerCase('pt-BR').startsWith(search),
    );
    if (index >= 0) {
      active.value = index;
      reveal();
    }
    searchTimer = setTimeout(() => {
      search = '';
    }, 600);
  }
}
function outside(event: Event) {
  if (!root.value?.contains(event.target as Node)) opened.value = false;
}
onMounted(() => {
  document.addEventListener('pointerdown', outside);
  document.addEventListener('focusin', outside);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside);
  document.removeEventListener('focusin', outside);
  clearTimeout(searchTimer);
});
</script>
<template>
  <div ref="root" class="filter-select">
    <button
      :id="id"
      type="button"
      role="combobox"
      class="select-trigger"
      :class="{ selected: value, expanded: opened }"
      :aria-label="label"
      :aria-expanded="opened ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-controls="id + '-list'"
      :aria-activedescendant="opened ? id + '-option-' + active : undefined"
      @click="opened ? (opened = false) : open()"
      @keydown="keyboard"
    >
      <span>{{ value || placeholder }}</span>
      <svg
        class="chevron"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m4 6 4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <transition name="select-menu">
      <ul
        v-if="opened"
        :id="id + '-list'"
        role="listbox"
        :aria-label="label"
        class="select-options"
      >
        <li
          v-for="(item, index) in choices"
          :id="id + '-option-' + index"
          :key="item"
          role="option"
          :aria-selected="value === item ? 'true' : 'false'"
          :data-active="String(active === index)"
          class="select-option"
          @mouseenter="active = index"
          @mousedown.prevent
          @click="choose(index)"
        >
          <span>{{ item || placeholder }}</span
          ><span class="selection-mark" aria-hidden="true">{{ value === item ? '✓' : '' }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>
<style scoped>
.filter-select {
  position: relative;
  min-width: 180px;
}
.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  min-height: 46px;
  padding: 12px 16px;
  border: 1px solid #d8d1c5;
  border-radius: 4px;
  background: #f7f3ea;
  color: #575047;
  font-size: 12px;
  text-align: left;
  transition:
    border-color 180ms,
    background 180ms;
}
.select-trigger:hover {
  border-color: #9b8974;
  background: #efe9dd;
}
.select-trigger.selected,
.select-trigger.expanded {
  border-color: #b42355;
  color: #b42355;
}
.chevron {
  flex-shrink: 0;
  transition: transform 180ms;
}
.expanded .chevron {
  transform: rotate(180deg);
}
.select-options {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  left: 0;
  width: max-content;
  min-width: 100%;
  max-width: min(300px, 85vw);
  max-height: 280px;
  overflow-y: auto;
  padding: 6px;
  margin: 0;
  list-style: none;
  border: 1px solid #d8d1c5;
  border-radius: 6px;
  background: #fcf9f2;
  box-shadow: 0 12px 32px #38291d1f;
  scrollbar-width: thin;
  scrollbar-color: #bdb5a8 transparent;
}
.select-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  min-height: 40px;
  padding: 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  color: #575047;
}
.select-option[data-active='true'] {
  background: #eee7dc;
}
.select-option[aria-selected='true'] {
  color: #b42355;
  background: #b423550c;
  font-weight: 600;
}
.selection-mark {
  width: 14px;
  flex-shrink: 0;
}
.select-menu-enter-active,
.select-menu-leave-active {
  transition:
    opacity 160ms,
    transform 160ms;
}
.select-menu-enter,
.select-menu-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
@media (max-width: 767px) {
  .filter-select {
    min-width: 0;
    flex: 1 1 140px;
  }
  .select-options {
    width: 100%;
  }
}
</style>
