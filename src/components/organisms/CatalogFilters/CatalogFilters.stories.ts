import type { Meta, StoryObj } from '@storybook/vue';
import CatalogFilters from './CatalogFilters.vue';
export default {
  title: 'Organisms/CatalogFilters',
  component: CatalogFilters,
  tags: ['autodocs'],
  args: {
    types: ['Camiseta', 'Caneca'],
    colors: ['Preto', 'Branco'],
    type: '',
    color: '',
    count: 24,
  },
  argTypes: { change: { action: 'change' }, clear: { action: 'clear' } },
} as Meta;
export const Default: StoryObj = {};
export const Active: StoryObj = { args: { type: 'Camiseta', color: 'Preto', count: 8 } };
