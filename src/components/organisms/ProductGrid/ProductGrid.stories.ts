import type { Meta, StoryObj } from '@storybook/vue';
import ProductGrid from './ProductGrid.vue';
import { product } from '../../../stories/fixtures';
export default {
  title: 'Organisms/ProductGrid',
  component: ProductGrid,
  tags: ['autodocs'],
  args: { products: Array.from({ length: 4 }, (_, i) => ({ ...product, id: String(i) })) },
} as Meta;
export const Loaded: StoryObj = {};
export const Loading: StoryObj = { args: { loading: true, products: [] } };
