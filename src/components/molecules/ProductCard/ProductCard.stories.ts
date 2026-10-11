import type { Meta, StoryObj } from '@storybook/vue';
import ProductCard from './ProductCard.vue';
import { product } from '../../../stories/fixtures';
export default {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  args: { product },
  argTypes: { quickAdd: { action: 'quick-add' } },
  decorators: [() => ({ template: '<div style="max-width:280px"><story /></div>' })],
} as Meta;
export const Default: StoryObj = {};
export const LongName: StoryObj = {
  args: {
    product: {
      ...product,
      name: 'Uma camiseta com um nome bem comprido que precisa continuar legível em qualquer tela',
    },
  },
};
export const MissingImage: StoryObj = { args: { product: { ...product, image: '/missing.jpg' } } };
