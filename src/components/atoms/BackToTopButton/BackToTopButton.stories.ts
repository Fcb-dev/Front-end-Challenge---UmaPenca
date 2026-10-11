import type { Meta, StoryObj } from '@storybook/vue';
import BackToTopButton from './BackToTopButton.vue';

export default {
  title: 'Atoms/BackToTopButton',
  component: BackToTopButton,
  tags: ['autodocs'],
  args: { visibleAfter: -1 },
  parameters: { layout: 'fullscreen' },
} as Meta;

export const Default: StoryObj = {};
