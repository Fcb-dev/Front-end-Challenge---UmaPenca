import { mount } from '@vue/test-utils';
import type { VueConstructor } from 'vue';
import { describe, expect, it } from 'vitest';
import ProductDetails from '../src/components/organisms/ProductDetails/ProductDetails.vue';
import { product } from '../src/stories/fixtures';
import seed from '../data/products.json';
import { imageUrl } from '../src/domain/catalog';
// VTU 1 usa VueConstructor; SFCs com setup de 2.7 expõem DefineComponent nos tipos.
const LegacyProductDetails = ProductDetails as unknown as VueConstructor;
describe('seleção de variantes', () => {
  it.each(seed.products)('exibe a imagem de cada cor do produto $id', async (item) => {
    const wrapper = mount(LegacyProductDetails, { propsData: { product: item } });
    for (const color of new Set(item.variants.map((v) => v.color))) {
      await wrapper.find(`button[aria-label="${color}"]`).trigger('click');
      const expected = item.variants.find((v) => v.color === color && v.image)?.image;
      expect(wrapper.find('img').attributes('src')).toBe(imageUrl(expected || item.image, 1000));
    }
    wrapper.destroy();
  });
  it('troca a foto pela cor antes de escolher tamanho e retorna à capa sem foto específica', async () => {
    const wrapper = mount(LegacyProductDetails, {
      propsData: {
        product: {
          ...product,
          variants: product.variants.map((v, index) => ({
            ...v,
            image: index === 1 ? '/preto.jpg' : '',
          })),
        },
      },
    });
    expect(wrapper.find('img').attributes('src')).toBe(product.image);
    await wrapper.find('button[aria-label="Preto"]').trigger('click');
    expect(wrapper.find('img').attributes('src')).toBe('/preto.jpg');
    await wrapper.find('button[aria-label="Areia"]').trigger('click');
    expect(wrapper.find('img').attributes('src')).toBe(product.image);
    wrapper.destroy();
  });
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
