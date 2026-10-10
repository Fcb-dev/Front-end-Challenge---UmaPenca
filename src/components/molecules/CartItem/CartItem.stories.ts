import type { Meta, StoryObj } from '@storybook/vue';
import CartItem from './CartItem.vue';
import { product } from '../../../stories/fixtures';
import { resolveCart } from '../../../domain/cart';
export default {
  title: 'Molecules/CartItem',
  component: CartItem,
  tags: ['autodocs'],
  args: {
    item: resolveCart([{ productId: product.id, variantId: 'preto-p', quantity: 2 }], [product])[0],
  },
  argTypes: {
    quantity: { action: 'quantity' },
    remove: { action: 'remove' },
    navigate: { action: 'navigate' },
  },
  decorators: [() => ({ template: '<div style="max-width:440px"><story /></div>' })],
} as Meta;
export const Default: StoryObj = {};
