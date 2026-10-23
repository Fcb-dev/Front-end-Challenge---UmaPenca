import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { CatalogSeed } from '../../shared/catalog';

test('carrinho desliza mesmo com movimento reduzido e aguarda a saída', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir sacola', exact: true }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Fechar sacola' }).click();
  const transition = await drawer.evaluate((element) => {
    const animation = element.getAnimations().find((item) => item.effect instanceof KeyframeEffect);
    return {
      open: element.hasAttribute('open'),
      duration: animation?.effect?.getTiming().duration,
      transform: (animation?.effect as KeyframeEffect)?.getKeyframes().at(-1)?.transform,
    };
  });
  expect(transition).toEqual({ open: true, duration: 450, transform: 'translateX(100%)' });
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir sacola', exact: true })).toBeFocused();
});
const seed = JSON.parse(
  readFileSync(new URL('../../data/products.json', import.meta.url), 'utf8'),
) as CatalogSeed;

async function showFilters(page: Page) {
  const button = page.getByRole('button', { name: /^Filtrar/ });
  if (await button.isVisible()) await button.click();
}
test('dropdown permite seleção por teclado e fecha com Escape e clique externo', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(Math.min(28, seed.products.length));
  await showFilters(page);
  const type = page.getByRole('combobox', { name: 'Tipo de produto', exact: true });
  await type.focus();
  await type.press('Enter');
  await type.press('m');
  await type.press('Enter');
  await expect(type).toHaveText('Moletom');
  await expect(page).toHaveURL(/tipo=Moletom/);
  await type.press('Enter');
  await type.press('Escape');
  await expect(type).toHaveAttribute('aria-expanded', 'false');
  await expect(type).toBeFocused();
  await type.click();
  await page.getByRole('heading', { name: 'A coleção.', exact: true }).click();
  await expect(type).toHaveAttribute('aria-expanded', 'false');
});
test('botão flutuante retorna ao topo da página', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const backToTop = page.getByRole('button', { name: 'Voltar ao topo' });
  await expect(backToTop).toBeVisible();
  await backToTop.click();
  await page.waitForTimeout(150);
  const intermediate = await page.evaluate(() => window.scrollY);
  expect(intermediate).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(backToTop).not.toBeVisible();
});
test('cabeçalho permanece no topo durante a rolagem', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 900));
  const header = page.locator('.header-shell');
  await expect(header).toHaveCSS('position', 'sticky');
  await expect
    .poll(() => header.evaluate((element) => Math.round(element.getBoundingClientRect().top)))
    .toBe(0);
});
test('atalho do cabeçalho rola suavemente até a coleção', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install({ time: new Date('2026-01-01T12:00:00Z') });
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');
  // Aguarda a altura final do catálogo antes de medir a rolagem.
  await expect(page.locator('.product-card')).toHaveCount(Math.min(28, seed.products.length));
  await page.evaluate(() => document.fonts.ready);
  await page.clock.pauseAt(new Date('2026-01-01T13:00:00Z'));
  await page.getByRole('button', { name: 'A coleção', exact: true }).click();
  await expect(page).toHaveURL(/#collection$/);
  // Avança os frames da animação sem depender da velocidade do runner.
  await page.clock.runFor(150);
  const intermediate = await page.evaluate(() => window.scrollY);
  const target = await page
    .locator('#collection')
    .evaluate((element) => (element as HTMLElement).offsetTop - 24);
  expect(intermediate).toBeGreaterThan(0);
  expect(intermediate).toBeLessThan(target);
  await page.clock.runFor(700);
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(target, 0);
  await expect(page.locator('#collection')).toBeInViewport();
});
test('ação rápida permite escolher a variação sem sair do catálogo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const firstProduct = seed.products[0];
  const firstVariant = firstProduct.variants.find((variant) => variant.available)!;
  const card = page.locator('.product-card').first();
  const quickAdd = card.getByRole('button', {
    name: `Escolher opções de ${firstProduct.name}`,
  });
  const supportsHover = await page.evaluate(() => matchMedia('(hover: hover)').matches);
  if (supportsHover) {
    await expect(quickAdd).toHaveCSS('opacity', '0');
    await card.hover();
    expect(await quickAdd.evaluate((element) => getComputedStyle(element).animationName)).toContain(
      'quick-add-slide-top',
    );
  }
  await expect(quickAdd).toHaveCSS('opacity', '1');
  await quickAdd.click();
  await expect(page).toHaveURL(/\/$/);
  const selector = page.getByRole('dialog', { name: firstProduct.name });
  await expect(selector).toBeVisible();
  expect(await selector.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
  if (await page.evaluate(() => matchMedia('(max-width: 640px)').matches))
    await expect(selector.locator('.quick-image img')).toHaveCSS('object-fit', 'contain');
  await selector.getByRole('button', { name: firstVariant.color, exact: true }).click();
  if (firstVariant.size)
    await selector.getByRole('button', { name: firstVariant.size, exact: true }).click();
  await selector.getByRole('button', { name: 'Adicionar à sacola', exact: true }).click();
  const cart = page.getByRole('dialog', { name: 'Sua sacola.' });
  await expect(cart).toBeVisible();
  await expect(cart.locator('article')).toHaveCount(1);
  await expect(cart).toContainText(firstProduct.name);
  await page.getByRole('button', { name: 'Fechar sacola' }).click();
  await page.mouse.move(0, 0);
  await expect(cart).not.toBeVisible();
  await expect(quickAdd).toHaveCSS('opacity', supportsHover ? '0' : '1');
  await expect(page.getByText('Nosso olhar')).toHaveCount(0);
});
test('prévia de cores expande e revela todas as opções no card', async ({ page }) => {
  await page.goto('/');
  const productIndex = seed.products.findIndex(
    (product) => new Set(product.variants.map((variant) => variant.color)).size > 4,
  );
  const product = seed.products[productIndex];
  const colorCount = new Set(product.variants.map((variant) => variant.color)).size;
  const preview = page.locator('.product-card').nth(productIndex).locator('.color-preview');
  await expect(preview.locator('.color-collapsed .color-dot')).toHaveCount(3);
  await expect(preview.locator('.color-expanded .color-dot')).toHaveCount(colorCount);
  await expect(preview.locator('.color-collapsed')).toHaveCSS('opacity', '1');
  await expect(preview.locator('.color-panel')).toHaveCSS('width', '86px');
  await preview.hover();
  await expect(preview.locator('.color-panel')).toHaveCSS('width', `${colorCount * 16 + 28}px`);
  await expect(preview.locator('.color-collapsed')).toHaveCSS('opacity', '0');
  await expect(preview.locator('.color-expanded')).toHaveCSS('opacity', '1');
  const expandedLeftInset = await preview.evaluate((element) => {
    const panel = element.querySelector('.color-panel')!.getBoundingClientRect();
    const firstDot = element.querySelector('.color-expanded .color-dot')!.getBoundingClientRect();
    return Math.round(firstDot.left - panel.left);
  });
  expect(expandedLeftInset).toBe(6);

  const compactIndex = seed.products.findIndex(
    (item) => new Set(item.variants.map((variant) => variant.color)).size <= 2,
  );
  const compact = page.locator('.product-card').nth(compactIndex).locator('.color-preview');
  const rightInset = await compact.evaluate((element) => {
    const panel = element.querySelector('.color-panel')!.getBoundingClientRect();
    const lastDot = element
      .querySelector('.color-collapsed .color-dot:last-of-type')!
      .getBoundingClientRect();
    return Math.round(panel.right - lastDot.right);
  });
  expect(rightInset).toBe(6);
});
test('filtros combinam, sobrevivem ao reload e respeitam voltar', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(Math.min(28, seed.products.length));
  await showFilters(page);
  await page.getByRole('combobox', { name: 'Tipo de produto', exact: true }).click();
  await page.getByRole('option', { name: 'Moletom', exact: true }).click();
  await page.getByRole('combobox', { name: 'Cor', exact: true }).click();
  await page.getByRole('option', { name: 'Areia', exact: true }).click();
  await expect(page).toHaveURL(/tipo=Moletom.*cor=Areia/);
  const expected = seed.products.filter(
    (p) => p.type === 'Moletom' && p.variants.some((v) => v.color === 'Areia'),
  ).length;
  await expect(page.locator('.product-card')).toHaveCount(expected);
  await page.reload();
  await showFilters(page);
  await expect(page.getByRole('combobox', { name: 'Cor', exact: true })).toHaveText('Areia');
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('.product-card')).toHaveCount(Math.min(28, seed.products.length));
  await page.goBack();
  await expect(page).toHaveURL(/cor=Areia/);
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(Math.min(28, seed.products.length));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: info.outputPath('catalog.png'),
    fullPage: false,
    animations: 'disabled',
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('produto direto, variantes separadas, quantidade, persistência e remoção', async ({
  page,
}, info) => {
  await page.goto('/produto/431589');
  const add = page.getByRole('button', { name: 'Adicionar à sacola' });
  await expect(add).toBeDisabled();
  await page.getByRole('button', { name: 'Preto', exact: true }).click();
  await expect(add).toBeDisabled();
  await page.getByRole('button', { name: 'P', exact: true }).click();
  await add.click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('article')).toHaveCount(1);
  await drawer.getByRole('button', { name: /Aumentar quantidade/ }).click();
  await expect(drawer.locator('output')).toHaveText('2');
  await expect(drawer.locator('strong')).toContainText('101,80');
  await page.getByRole('button', { name: 'Fechar sacola' }).click();
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await add.click();
  await expect(drawer.locator('article')).toHaveCount(2);
  await expect(drawer.locator('strong')).toContainText('152,70');
  await page.screenshot({ path: info.outputPath('cart.png'), animations: 'disabled' });
  await page.reload();
  await page.getByRole('button', { name: 'Abrir sacola' }).click();
  await expect(drawer.locator('article')).toHaveCount(2);
  await expect(drawer.locator('strong')).toContainText('152,70');
  await drawer
    .getByRole('button', { name: /^Remover/ })
    .first()
    .click();
  await expect(drawer.locator('article')).toHaveCount(1);
  await drawer.getByRole('button', { name: /^Remover/ }).click();
  await expect(drawer.getByText('Espaço para boas ideias.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir sacola' })).toBeFocused();
  await page.screenshot({
    path: info.outputPath('product.png'),
    fullPage: true,
    animations: 'disabled',
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('erro da API oferece recuperação e filtro sem resultados oferece limpeza', async ({
  page,
}) => {
  await page.route('**/api/products?*', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: '{"message":"Indisponível"}',
    }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('A coleção fez uma pausa');
  await page.unroute('**/api/products?*');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('.product-card')).toHaveCount(Math.min(28, seed.products.length));
  await page.goto('/?tipo=tipo-inexistente');
  await expect(page.getByRole('status')).toContainText('Ainda não encontramos');
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).last().click();
  await expect(page.locator('.product-card')).toHaveCount(Math.min(28, seed.products.length));
});

test('produto ausente, rota desconhecida e armazenamento corrompido', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('penca:cart:v1', '{invalid'));
  await page.goto('/produto/inexistente');
  await expect(page.getByRole('alert')).toContainText('Peça não encontrada');
  await page.goto('/nao-existe');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Essa página saiu da coleção.');
  await page.getByRole('link', { name: 'Voltar à coleção' }).click();
  await page.getByRole('button', { name: 'Abrir sacola' }).click();
  await expect(page.getByRole('dialog')).toContainText('Espaço para boas ideias.');
});

test('scroll carrega o restante sem remover os primeiros 28 produtos', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.product-card');
  await expect(cards).toHaveCount(28);
  const first = await cards.first().textContent();
  await page.getByRole('button', { name: 'Carregar mais produtos' }).scrollIntoViewIfNeeded();
  await expect(cards).toHaveCount(seed.products.length);
  expect(await cards.first().textContent()).toBe(first);
  await expect(page.getByText(`Você viu todas as ${seed.products.length} peças`)).toBeVisible();
});

test('sacola preserva produtos de páginas diferentes após recarregar', async ({ page }) => {
  const lines = [seed.products[0], seed.products[28]].map((product) => ({
    productId: product.id,
    variantId: product.variants.find((v) => v.available)!.id,
    quantity: 1,
  }));
  await page.goto('/');
  await page.evaluate(
    (lines) => localStorage.setItem('penca:cart:v1', JSON.stringify({ version: 1, lines })),
    lines,
  );
  await page.reload();
  await page.getByRole('button', { name: 'Abrir sacola', exact: true }).click();
  await expect(page.locator('.cart-drawer article')).toHaveCount(2);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('penca:cart:v1')!).lines),
  ).toEqual(lines);
});

test('voltar dos detalhes restaura os lotes e a posição da coleção', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Carregar mais produtos' }).scrollIntoViewIfNeeded();
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
  const link = page.locator('.product-card').nth(35).locator('a').first();
  await link.scrollIntoViewIfNeeded();
  const position = await page.evaluate(() => window.scrollY);
  await link.click();
  await expect(page).toHaveURL(/produto/);
  await page.goBack();
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - position))
    .toBeLessThan(5);
});

test('atalho da coleção preserva filtros na URL e após recarga', async ({ page }) => {
  await page.goto('/?tipo=Moletom');
  await expect(page.locator('.product-card')).toHaveCount(
    seed.products.filter((p) => p.type === 'Moletom').length,
  );
  await page.getByRole('button', { name: 'A coleção', exact: true }).click();
  await expect(page).toHaveURL(/tipo=Moletom#collection$/);
  await page.reload();
  await showFilters(page);
  await expect(page.getByRole('combobox', { name: 'Tipo de produto', exact: true })).toHaveText(
    'Moletom',
  );
});

test('adição rápida permite recuperar falha na sacola sem perder a seleção', async ({ page }) => {
  const product = seed.products[0];
  const variant = product.variants.find((v) => v.available)!;
  await page.goto('/');
  await page.evaluate(
    ({ product, variant }) =>
      localStorage.setItem(
        'penca:cart:v1',
        JSON.stringify({
          version: 1,
          lines: [{ productId: product.id, variantId: variant.id, quantity: 1 }],
        }),
      ),
    { product, variant },
  );
  await page.route('**/api/products/' + product.id, (route) =>
    route.fulfill({ status: 503, body: '{}' }),
  );
  await page.reload();
  const card = page.locator('.product-card').first();
  await card.hover();
  await card.getByRole('button').click();
  const modal = page.locator('.quick-modal');
  await modal.getByRole('button', { name: variant.color, exact: true }).click();
  if (variant.size) await modal.getByRole('button', { name: variant.size, exact: true }).click();
  await expect(modal.getByRole('alert')).toBeVisible();
  const add = modal.getByRole('button', { name: 'Adicionar à sacola', exact: true });
  await expect(add).toBeDisabled();
  await page.unroute('**/api/products/' + product.id);
  await modal.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(add).toBeEnabled();
  await add.click();
  await expect(modal).not.toBeVisible();
  await expect(page.locator('.cart-drawer output')).toHaveText('2');
});
