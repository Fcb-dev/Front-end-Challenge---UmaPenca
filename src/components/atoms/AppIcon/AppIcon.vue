<script setup lang="ts">
withDefaults(
  defineProps<{
    name: 'bag' | 'arrow' | 'close' | 'minus' | 'plus' | 'filter' | 'check' | 'back';
    size?: number;
  }>(),
  { size: 22 },
);
const paths = {
  bag: 'M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  back: 'M20 12H4m6-6-6 6 6 6',
  close: 'm6 6 12 12M6 18 18 6',
  minus: 'M5 12h14',
  plus: 'M5 12h14M12 5v14',
  filter: 'M4 7h16M4 17h16M8 4v6m8 4v6',
  check: 'm5 12 4 4L19 6',
};
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name]" />
  </svg>
</template>
