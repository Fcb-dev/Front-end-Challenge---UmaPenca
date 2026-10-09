import type { Preview } from '@storybook/vue';
import '../src/styles/main.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const preview: Preview = {
  decorators: [
    () => ({ router: new VueRouter({ mode: 'abstract', routes: [] }), template: '<story />' }),
  ],
  parameters: {
    backgrounds: { default: 'Papel', values: [{ name: 'Papel', value: '#F7F3EA' }] },
    layout: 'padded',
  },
};
export default preview;
