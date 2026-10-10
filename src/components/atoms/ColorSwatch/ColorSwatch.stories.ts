import type { Meta, StoryObj } from '@storybook/vue';
import ColorSwatch from './ColorSwatch.vue';
export default {
  title: 'Atoms/ColorSwatch',
  component: ColorSwatch,
  tags: ['autodocs'],
  args: { color: 'Areia', hex: '#d5c4a8', selected: false },
  argTypes: { select: { action: 'select' } },
} as Meta;
export const Default: StoryObj = {};
export const Selected: StoryObj = { args: { selected: true } };
export const Disabled: StoryObj = { args: { disabled: true } };
