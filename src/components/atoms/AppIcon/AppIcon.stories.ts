import type { Meta, StoryObj } from '@storybook/vue';
import AppIcon from './AppIcon.vue';
export default {
  title: 'Atoms/AppIcon',
  component: AppIcon,
  tags: ['autodocs'],
  args: { name: 'bag', size: 24 },
  argTypes: {
    name: {
      control: 'select',
      options: ['bag', 'arrow', 'close', 'minus', 'plus', 'filter', 'check', 'back'],
    },
  },
} as Meta;
export const Default: StoryObj = {};
