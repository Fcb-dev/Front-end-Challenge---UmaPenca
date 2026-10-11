import type { Meta, StoryObj } from '@storybook/vue';
import { ref } from 'vue';
import BaseButton from '../../atoms/BaseButton/BaseButton.vue';
import { product } from '../../../stories/fixtures';
import QuickAddModal from './QuickAddModal.vue';

export default {
  title: 'Organisms/QuickAddModal',
  component: QuickAddModal,
  tags: ['autodocs'],
  args: { product, open: true },
  render: (args) => ({
    components: { BaseButton, QuickAddModal },
    setup() {
      const visible = ref(args.open);
      return { args, visible };
    },
    template:
      '<div><BaseButton @click="visible = true">Escolher opções</BaseButton><QuickAddModal v-bind="args" :open="visible" @close="visible = false" /></div>',
  }),
} as Meta;

export const MultipleVariants: StoryObj = {};
