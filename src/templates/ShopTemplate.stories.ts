import type { Meta, StoryObj } from '@storybook/vue';
import ShopTemplate from './ShopTemplate.vue';
export default {
  title: 'Templates/ShopTemplate',
  component: ShopTemplate,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { ShopTemplate },
    template:
      '<ShopTemplate><div class="container-page py-20"><h1 class="font-display text-5xl">Espaço para boas ideias.</h1><p class="mt-6">Conteúdo da página dentro do layout compartilhado.</p></div></ShopTemplate>',
  }),
} as Meta;
export const Default: StoryObj = {};
