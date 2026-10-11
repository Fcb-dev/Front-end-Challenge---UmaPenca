import { mount } from '@vue/test-utils';
import type { VueConstructor } from 'vue';
import { describe, expect, it } from 'vitest';
import QuickAddModal from '../src/components/organisms/QuickAddModal/QuickAddModal.vue';
import { product } from '../src/stories/fixtures';

const LegacyQuickAddModal = QuickAddModal as unknown as VueConstructor;

describe('compra rápida', () => {
  it('exige uma combinação válida e emite a variante escolhida', async () => {
    const wrapper = mount(LegacyQuickAddModal, {
      propsData: { product, open: false },
      stubs: { RouterLink: true },
    });
    const add = wrapper.find('.base-button');

    expect(add.attributes('disabled')).toBeDefined();
    await wrapper.find('button[aria-label="Preto"]').trigger('click');
    await wrapper.findAll('.size-option').at(1).trigger('click');
    expect(add.attributes('disabled')).toBeUndefined();

    await add.trigger('click');
    expect(wrapper.emitted('add')?.[0]).toEqual([product, 'preto-m']);
    wrapper.destroy();
  });
});
