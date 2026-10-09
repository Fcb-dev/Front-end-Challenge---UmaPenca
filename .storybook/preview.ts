import type { Preview } from '@storybook/vue';
import '../src/styles/main.css';
const preview: Preview = {
  parameters: {
    backgrounds: { default: 'Papel', values: [{ name: 'Papel', value: '#F7F3EA' }] },
    layout: 'padded',
  },
};
export default preview;
