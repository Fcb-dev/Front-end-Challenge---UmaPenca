import type { Meta, StoryObj } from '@storybook/vue';
import StatusPanel from './StatusPanel.vue';
export default {
  title: 'Molecules/StatusPanel',
  component: StatusPanel,
  tags: ['autodocs'],
  argTypes: { action: { control: 'text' } },
} as Meta;
export const Empty: StoryObj = {
  args: {
    title: 'Nenhuma combinação encontrada',
    message: 'Experimente outra cor ou tipo de produto.',
    action: 'Limpar filtros',
  },
};
export const Error: StoryObj = {
  args: {
    title: 'A coleção fez uma pausa',
    message: 'Confira sua conexão e tente novamente.',
    action: 'Tentar novamente',
    error: true,
  },
};
