import { mount } from '@vue/test-utils';
import type { VueConstructor } from 'vue';
import { describe, expect, it } from 'vitest';
import ProductDetails from '../src/components/organisms/ProductDetails/ProductDetails.vue';
import { product } from '../src/stories/fixtures';
// VTU 1 usa VueConstructor; SFCs com setup de 2.7 expõem DefineComponent nos tipos.
const LegacyProductDetails = ProductDetails as unknown as VueConstructor;
describe('seleção de variantes', () => {
  it('bloqueia compra até selecionar cor e tamanho e emite a variante correta', async () => {
    const wrapper = mount(LegacyProductDetails, { propsData: { product } });
    const button = wrapper.find('.base-button');
    expect(button.attributes('disabled')).toBeDefined();
    await wrapper.find('button[aria-label="Preto"]').trigger('click');
    expect(button.attributes('disabled')).toBeDefined();
    await wrapper.findAll('.size-option').at(1).trigger('click');
    expect(button.attributes('disabled')).toBeUndefined();
    await button.trigger('click');
    expect(wrapper.emitted('add')?.[0]).toEqual(['preto-m']);
    await wrapper.find('button[aria-label="Areia"]').trigger('click');
    expect(button.attributes('disabled')).toBeDefined();
    wrapper.destroy();
  });
  it('acessório sem tamanho exige somente cor', async () => {
    const wrapper = mount(LegacyProductDetails, {
      propsData: { product: { ...product, variants: [{ ...product.variants[0], size: null }] } },
    });
    expect(wrapper.find('fieldset + fieldset').exists()).toBe(false);
    await wrapper.find('button[aria-label="Preto"]').trigger('click');
    expect(wrapper.find('.base-button').attributes('disabled')).toBeUndefined();
    wrapper.destroy();
  });
});
