import type { Meta, StoryObj } from '@storybook/vue';
import FilterSelect from './FilterSelect.vue';
export default {
  title: 'Molecules/FilterSelect',
  component: FilterSelect,
  tags: ['autodocs'],
  args: {
    id: 'example-filter',
    label: 'Tipo de produto',
    placeholder: 'Todos os produtos',
    value: '',
    options: ['Camiseta', 'Caneca', 'Moletom'],
  },
  render: (args) => ({
    components: { FilterSelect },
    props: Object.keys(args),
    data: () => ({ selection: args.value }),
    template: '<FilterSelect v-bind="$props" v-model="selection" />',
  }),
} as Meta;
export const Default: StoryObj = {};
export const Selected: StoryObj = { args: { id: 'selected-filter', value: 'Caneca' } };
