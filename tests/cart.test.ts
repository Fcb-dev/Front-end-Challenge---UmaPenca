import { describe, expect, it, vi } from 'vitest';
import { addLine, lineKey, parseCart, resolveCart, subtotal } from '../src/domain/cart';
import { createCart, CART_KEY } from '../src/composables/useCart';
import { product } from '../src/stories/fixtures';
describe('regras da sacola', () => {
  it('soma mesma variante e separa variantes e produtos', () => {
    let lines = addLine([], product.id, 'preto-p');
    lines = addLine(lines, product.id, 'preto-p');
    lines = addLine(lines, product.id, 'preto-m');
    lines = addLine(lines, 'other', 'preto-p');
    expect(lines).toHaveLength(3);
    expect(lines[0].quantity).toBe(2);
    expect(subtotal(resolveCart(lines, [product]))).toBe(17970);
  });
  it('recusa conteúdo inválido, versões e quantidades corrompidas', () => {
    expect(parseCart('{invalid')).toEqual([]);
    expect(parseCart('{"version":2,"lines":[]}')).toEqual([]);
    const lines = [
      { productId: 'demo', variantId: 'preto-p', quantity: -1 },
      { productId: 'demo', variantId: 'preto-m', quantity: 1.5 },
    ];
    expect(parseCart(JSON.stringify({ version: 1, lines }))).toEqual([]);
  });
  it('revalida preços e remove variantes ausentes ou indisponíveis', () => {
    const lines = [
      { productId: 'demo', variantId: 'preto-p', quantity: 2 },
      { productId: 'demo', variantId: 'gone', quantity: 1 },
    ];
    const updated = {
      ...product,
      variants: product.variants.map((v) => ({ ...v, priceCents: 7000 })),
    };
    expect(subtotal(resolveCart(lines, [updated]))).toBe(14000);
    expect(
      resolveCart(lines, [
        { ...updated, variants: updated.variants.map((v) => ({ ...v, available: false })) },
      ]),
    ).toEqual([]);
  });
  it('persiste apenas identidade/quantidade, altera e remove sem preços obsoletos', () => {
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn() };
    const cart = createCart(storage);
    cart.add(product, 'preto-p');
    const key = lineKey(cart.state.lines[0]);
    cart.update(key, 3);
    expect(cart.total.value).toBe(17970);
    cart.update(key, 0);
    expect(cart.count.value).toBe(3);
    expect(storage.setItem).toHaveBeenLastCalledWith(
      CART_KEY,
      JSON.stringify({
        version: 1,
        lines: [{ productId: 'demo', variantId: 'preto-p', quantity: 3 }],
      }),
    );
    cart.remove(key);
    expect(cart.total.value).toBe(0);
  });
  it('mantém sacola funcional quando armazenamento falha', () => {
    const cart = createCart({
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    });
    cart.add(product, 'preto-p');
    expect(cart.count.value).toBe(1);
    expect(cart.state.notice).toContain('não foi possível salvá-la');
  });
});
