import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { CatalogSeed } from '../../shared/catalog';

test('movimento reduzido mantém fade e aguarda a saída antes de fechar', async ({ page }) => {
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
      opacity: (animation?.effect as KeyframeEffect)?.getKeyframes().at(-1)?.opacity,
    };
  });
  expect(transition).toEqual({ open: true, duration: 180, opacity: '0' });
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
test('filtros combinam, sobrevivem ao reload e respeitam voltar', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(seed.products.length);
  await showFilters(page);
  await page.getByLabel('Tipo de produto', { exact: true }).selectOption('Moletom');
  await page.getByLabel('Cor', { exact: true }).selectOption('Areia');
  await expect(page).toHaveURL(/tipo=Moletom.*cor=Areia/);
  const expected = seed.products.filter(
    (p) => p.type === 'Moletom' && p.variants.some((v) => v.color === 'Areia'),
  ).length;
  await expect(page.locator('.product-card')).toHaveCount(expected);
  await page.reload();
  await showFilters(page);
  await expect(page.getByLabel('Cor', { exact: true })).toHaveValue('Areia');
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
