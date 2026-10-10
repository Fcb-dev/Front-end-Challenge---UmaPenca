import type { Meta, StoryObj } from '@storybook/vue';
import QuantitySelector from './QuantitySelector.vue';
export default {
  title: 'Molecules/QuantitySelector',
  component: QuantitySelector,
  tags: ['autodocs'],
  args: { value: 1, label: 'Camiseta' },
  argTypes: { change: { action: 'change' } },
} as Meta;
export const Minimum: StoryObj = {};
export const Multiple: StoryObj = { args: { value: 3 } };
export const Maximum: StoryObj = { args: { value: 99 } };
