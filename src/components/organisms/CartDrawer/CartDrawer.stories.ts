import type { Meta, StoryObj } from '@storybook/vue';
import CartDrawer from './CartDrawer.vue';
import BaseButton from '../../atoms/BaseButton/BaseButton.vue';
import { product } from '../../../stories/fixtures';
import { resolveCart, subtotal } from '../../../domain/cart';
const items = resolveCart(
  [
    { productId: product.id, variantId: 'preto-p', quantity: 2 },
    { productId: product.id, variantId: 'areia-p', quantity: 1 },
  ],
  [product],
);
export default {
  title: 'Organisms/CartDrawer',
  component: CartDrawer,
  tags: ['autodocs'],
  args: { open: false, items, total: subtotal(items) },
  render: (_args, { argTypes }) => ({
    components: { CartDrawer, BaseButton },
    props: Object.keys(argTypes),
    data: () => ({ visible: false }),
    template:
      '<div><BaseButton @click="visible = true">Abrir sacola</BaseButton><CartDrawer v-bind="$props" :open="visible" @close="visible = false" /></div>',
  }),
  argTypes: {
    close: { action: 'close' },
    quantity: { action: 'quantity' },
    remove: { action: 'remove' },
  },
} as Meta;
export const Filled: StoryObj = {};
export const Empty: StoryObj = { args: { items: [], total: 0 } };
export const Loading: StoryObj = { args: { loading: true } };
export const Error: StoryObj = { args: { error: 'Não foi possível conferir sua sacola.' } };
