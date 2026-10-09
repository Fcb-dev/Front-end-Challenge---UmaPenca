import type { Meta, StoryObj } from '@storybook/vue';
import BaseButton from './BaseButton.vue';
const meta: Meta = {
  title: 'Atoms/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  render: (_args, { argTypes }) => ({
    components: { BaseButton },
    props: Object.keys(argTypes),
    template: '<BaseButton v-bind="$props" @click="onClick">Adicionar à sacola</BaseButton>',
  }),
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    onClick: { action: 'click' },
  },
  args: { variant: 'primary', disabled: false },
};
export default meta;
export const Primary: StoryObj = {};
export const Secondary: StoryObj = { args: { variant: 'secondary' } };
export const Disabled: StoryObj = { args: { disabled: true } };
