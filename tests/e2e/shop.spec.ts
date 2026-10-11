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
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
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
  expect(await header.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(0);
});
test('atalho do cabeçalho rola suavemente até a coleção', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'A coleção', exact: true }).click();
  await expect(page).toHaveURL(/#collection$/);
  await page.waitForTimeout(150);
  const intermediate = await page.evaluate(() => window.scrollY);
  const target = await page
    .locator('#collection')
    .evaluate((element) => (element as HTMLElement).offsetTop - 24);
  expect(intermediate).toBeGreaterThan(0);
  expect(intermediate).toBeLessThan(target);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(page.locator('#collection')).toBeInViewport();
});
test('ação rápida adiciona a primeira variação disponível sem sair do catálogo', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const firstProduct = seed.products[0];
  const firstVariant = firstProduct.variants.find((variant) => variant.available)!;
  const card = page.locator('.product-card').first();
  const quickAdd = card.getByRole('button', {
    name: `Adicionar ${firstProduct.name}, ${firstVariant.color} · ${firstVariant.size}, à sacola`,
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
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('article')).toHaveCount(1);
  await expect(page.getByRole('dialog')).toContainText(firstProduct.name);
  await page.getByRole('button', { name: 'Fechar sacola' }).click();
  await page.mouse.move(0, 0);
  await expect(page.getByRole('dialog')).not.toBeVisible();
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
  await expect(preview.locator('.color-panel')).toHaveCSS(
    'width',
    `${colorCount * 16 + 28}px`,
  );
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
    const lastDot = element.querySelector('.color-collapsed .color-dot:last-of-type')!.getBoundingClientRect();
    return Math.round(panel.right - lastDot.right);
  });
  expect(rightInset).toBe(6);
});
test('filtros combinam, sobrevivem ao reload e respeitam voltar', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
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
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
  await page.goBack();
  await expect(page).toHaveURL(/cor=Areia/);
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
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
  await page.route('**/api/products', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: '{"message":"Indisponível"}',
    }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('A coleção fez uma pausa');
  await page.unroute('**/api/products');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
  await page.goto('/?tipo=tipo-inexistente');
  await expect(page.getByRole('status')).toContainText('Ainda não encontramos');
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).last().click();
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
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
