import type { Meta, StoryObj } from '@storybook/vue';
import ProductDetails from './ProductDetails.vue';
import { product } from '../../../stories/fixtures';
export default {
  title: 'Organisms/ProductDetails',
  component: ProductDetails,
  tags: ['autodocs'],
  args: { product },
  argTypes: { add: { action: 'add' } },
} as Meta;
export const Default: StoryObj = {};
export const Accessory: StoryObj = {
  args: {
    product: {
      ...product,
      type: 'Caneca',
      model: 'Caneca',
      variants: [{ ...product.variants[0], size: null }],
    },
  },
};
export const Unavailable: StoryObj = {
  args: {
    product: { ...product, variants: product.variants.map((v) => ({ ...v, available: false })) },
  },
};
