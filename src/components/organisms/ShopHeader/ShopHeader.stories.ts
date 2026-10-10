import type { Meta, StoryObj } from '@storybook/vue';
import ShopHeader from './ShopHeader.vue';
export default {
  title: 'Organisms/ShopHeader',
  component: ShopHeader,
  tags: ['autodocs'],
  args: { count: 0 },
  argTypes: { cart: { action: 'cart' } },
  parameters: { layout: 'fullscreen' },
} as Meta;
export const EmptyCart: StoryObj = {};
export const FilledCart: StoryObj = { args: { count: 3 } };
