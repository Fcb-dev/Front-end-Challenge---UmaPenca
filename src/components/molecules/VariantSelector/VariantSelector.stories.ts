import type { Meta, StoryObj } from '@storybook/vue';
import VariantSelector from './VariantSelector.vue';
import { product } from '../../../stories/fixtures';
export default {
  title: 'Molecules/VariantSelector',
  component: VariantSelector,
  tags: ['autodocs'],
  args: { variants: product.variants, color: '', size: null },
  argTypes: { color: { control: 'text' }, size: { control: 'text' } },
} as Meta;
export const Default: StoryObj = {};
export const Selected: StoryObj = { args: { color: 'Preto', size: 'P' } };
