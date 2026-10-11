import { expect, it } from 'vitest';
import { filterProducts, sortProducts, money, imageUrl } from '../src/domain/catalog';
import { adaptProduct } from '../scripts/scraping/adapter';
const a = adaptProduct({
  id: 1,
  name: 'A',
  price: 50,
  img_cover: 'https://example.com/a.jpg',
  type: { name: 'Camiseta' },
  fabrics: [{ product_color_name: 'Preto' }],
});
const b = adaptProduct({
  id: 2,
  name: 'B',
  price: 60,
  img_cover: 'https://example.com/b.jpg',
  type: { name: 'Caneca' },
  fabrics: [{ product_color_name: 'Branco' }],
});
it('combina tipo e cor por AND', () => {
  expect(filterProducts([a, b], 'Camiseta', 'Preto')).toEqual([a]);
  expect(filterProducts([a, b], 'Camiseta', 'Branco')).toEqual([]);
  expect(filterProducts([a, b], '', '')).toHaveLength(2);
});
it('filtra por faixa de preço e combina com tipo e cor', () => {
  expect(filterProducts([a, b], '', '', 'Até R$ 50')).toEqual([a]);
  expect(filterProducts([a, b], '', '', 'ate-50')).toEqual([a]);
  expect(filterProducts([a, b], '', '', 'R$ 50 a R$ 80')).toEqual([b]);
  expect(filterProducts([a, b], 'Camiseta', 'Preto', 'Até R$ 50')).toEqual([a]);
  expect(filterProducts([a, b], 'Camiseta', 'Preto', 'R$ 50 a R$ 80')).toEqual([]);
  expect(filterProducts([a, b], '', '', 'Acima de R$ 120')).toEqual([]);
});
it('ordena por menor preço, maior preço e mantém padrão', () => {
  expect(sortProducts([b, a], '')).toEqual([b, a]);
  expect(sortProducts([b, a], 'padrao')).toEqual([b, a]);
  expect(sortProducts([b, a], 'menor-preco')).toEqual([a, b]);
  expect(sortProducts([b, a], 'Menor preço')).toEqual([a, b]);
  expect(sortProducts([a, b], 'maior-preco')).toEqual([b, a]);
  expect(sortProducts([a, b], 'Maior preço')).toEqual([b, a]);
});
it('formata BRL e preserva parâmetros da imagem original', () => {
  expect(money(5090)).toContain('50,90');
  expect(imageUrl('https://umapenca.imgix.net/a.jpg?mark=art', 300)).toContain('mark=art');
  expect(imageUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
});
