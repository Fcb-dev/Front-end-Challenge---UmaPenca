import type { Meta, StoryObj } from '@storybook/vue';
import CatalogFilters from './CatalogFilters.vue';
export default {
  title: 'Organisms/CatalogFilters',
  component: CatalogFilters,
  tags: ['autodocs'],
  args: {
    types: ['Camiseta', 'Caneca'],
    colors: ['Preto', 'Branco'],
    prices: ['Até R$ 50', 'R$ 50 a R$ 80', 'R$ 80 a R$ 120', 'Acima de R$ 120'],
    type: '',
    color: '',
    price: '',
    sort: '',
    count: 24,
  },
  argTypes: { change: { action: 'change' }, clear: { action: 'clear' } },
} as Meta;
export const Default: StoryObj = {};
export const Active: StoryObj = {
  args: {
    type: 'Camiseta',
    color: 'Preto',
    price: 'R$ 80 a R$ 120',
    sort: 'Menor preço',
    count: 8,
  },
};
