import type { Meta, StoryObj } from '@storybook/vue';
import ProductImage from './ProductImage.vue';
export default {
  title: 'Atoms/ProductImage',
  component: ProductImage,
  tags: ['autodocs'],
  args: { src: '/storybook-product.svg', alt: 'Camiseta Boas Ideias' },
  decorators: [() => ({ template: '<div style="width:240px"><story /></div>' })],
} as Meta;
export const Default: StoryObj = {};
export const MissingImage: StoryObj = { args: { src: '/missing-image.jpg' } };
