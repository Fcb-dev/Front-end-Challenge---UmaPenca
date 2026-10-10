import { describe, expect, it } from 'vitest';
import { extractAssignedJson, parseListing } from '../scripts/scraping/parser';
import { adaptProduct, cents } from '../scripts/scraping/adapter';
const raw = {
  id: 123,
  name: 'Camiseta <b>Arte</b>',
  img_cover: 'https://example.com/photo.jpg',
  full_link: 'https://umapenca.com/art.html',
  price: 59.9,
  is_clothing: true,
  type: { name: 'Camiseta' },
};
describe('coleta e normalização', () => {
  it('usa informações reais do modelo quando a descrição individual está ausente', () => {
    const result = adaptProduct(raw, { description: null, info: '<p>Moletom com <strong>capuz</strong>.</p>' });
    expect(result.description).toBe('Moletom com capuz.');
    expect(result.enrichedFields).not.toContain('description');
  });
  it('extrai JSON com chaves em strings sem executar código posterior', () => {
    expect(
      extractAssignedJson(
        'window.data = {"name":"a } b", "a":{"b":1}}; throw Error();',
        'window.data',
      ),
    ).toEqual({ name: 'a } b', a: { b: 1 } });
  });
  it('recusa estrutura ausente e listagem vazia', () => {
    expect(() => parseListing('<html></html>')).toThrow();
    expect(() => parseListing('window.vueInitialData = {"products":{"hits":[]}};')).toThrow();
  });
  it('normaliza preço sem erro de ponto flutuante', () => {
    expect(cents('R$ 1.299,90')).toBe(129990);
    expect(cents(59.9)).toBe(5990);
    expect(() => cents('inválido')).toThrow();
  });
  it('enriquece dados ausentes de forma determinística e rastreável', () => {
    const p = adaptProduct(raw);
    expect(p).toEqual(adaptProduct(raw));
    expect(p.variants.map((v) => v.size)).toEqual(['P', 'M', 'G', 'GG']);
    expect(p.variants[0].color).toBe('Única');
    expect(p.enrichedFields).toContain('variants');
    expect(p.name).toBe('Camiseta Arte');
  });
  it('preserva variantes, disponibilidade e preços do modelo selecionado', () => {
    const p = adaptProduct(
      { ...raw, img_cover_model: 2, models: [{ id: 2, name: 'Regular' }] },
      {
        variations: [
          {
            variation_id: 1,
            product_model_id: 2,
            product_color_name: 'Areia',
            size_name: 'P',
            price: 60.9,
            quantity: 0,
            virtual_stock: true,
          },
          {
            variation_id: 2,
            product_model_id: 2,
            product_color_name: 'Areia',
            size_name: 'M',
            price: 62.9,
            quantity: 0,
            virtual_stock: false,
          },
          { variation_id: 3, product_model_id: 3, size_name: 'G', price: 90 },
        ],
      },
    );
    expect(p.variants).toHaveLength(2);
    expect(p.variants[0]).toMatchObject({ color: 'Areia', priceCents: 6090, available: true });
    expect(p.variants[1].available).toBe(false);
  });
});
