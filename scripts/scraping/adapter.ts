import type { Product, ProductVariant } from '../../shared/catalog';
import { plainText, record, records, type RecordData } from './parser';

export function cents(value: unknown): number {
  const amount =
    typeof value === 'string'
      ? Number(
          value
            .replace(/R\$|\s/g, '')
            .replace(/\.(?=\d{3}(?:\D|$))/g, '')
            .replace(',', '.'),
        )
      : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Preço inválido.');
  return Math.round(amount * 100);
}
function safeImage(value: unknown): string {
  if (typeof value !== 'string') return '';
  try {
    return new URL(value).protocol === 'https:' ? value : '';
  } catch {
    return '';
  }
}
export function adaptProduct(listing: RecordData, detail: RecordData = {}): Product {
  const raw = { ...listing, ...detail };
  const id = String(raw.id ?? '');
  const name = plainText(raw.name);
  const image = safeImage(listing.img_cover ?? raw.img_cover);
  if (!id || !name || !image) throw new Error('Produto sem ID, nome ou imagem.');
  const type = plainText(record(raw.type).name) || 'Outros';
  const models = records(raw.models);
  // Um modelo por produto mantém a seleção de cor/tamanho fiel ao escopo do teste.
  const model = models.find((m) => m.id === listing.img_cover_model) ?? models[0] ?? {};
  const enrichedFields: string[] = [];
  const fabrics = records(raw.fabrics);
  const images = records(raw.images_by_fabric);
  const basePrice = cents(raw.price || listing.price || raw.price_min);
  let variations = records(raw.variations).filter(
    (v) => !model.id || v.product_model_id === model.id,
  );
  if (!variations.length) {
    enrichedFields.push('variants');
    const sizes = raw.is_clothing
      ? /infantil/i.test(type)
        ? ['4', '6', '8', '10', '12']
        : ['P', 'M', 'G', 'GG']
      : [null];
    const colors = fabrics.length
      ? fabrics
      : [{ product_color_name: 'Única', product_color_hexa: '#D7D1C6' }];
    variations = colors.flatMap((f) =>
      sizes.map((size) => ({
        product_color_name: f.product_color_name || f.name,
        product_color_hexa: f.product_color_hexa || f.hexa,
        fabric_id: f.id,
        size_name: size,
        price: basePrice / 100,
        virtual_stock: true,
      })),
    );
  }
  const variants: ProductVariant[] = variations.map((v) => {
    const color = plainText(v.product_color_name || v.color_name) || 'Única';
    const size = plainText(v.size_name) || null;
    const variantImage =
      images.find(
        (i) => i.fabric_id === v.fabric_id && i.product_model_id === model.id && safeImage(i.url),
      ) || images.find((i) => i.fabric_id === v.fabric_id && safeImage(i.url));
    return {
      id: String(v.variation_id ?? [id, color, size ?? 'unico'].join('-')),
      color,
      colorHex: /^#[0-9a-f]{6}$/i.test(String(v.product_color_hexa))
        ? String(v.product_color_hexa)
        : '#D7D1C6',
      size,
      priceCents: v.price ? cents(v.price) : basePrice,
      image: safeImage(variantImage?.url) || image,
      available: v.virtual_stock === true || Number(v.quantity) > 0,
    };
  });
  const uniqueVariants = Array.from(new Map(variants.map((v) => [v.id, v])).values());
  const description =
    plainText(raw.description) ||
    plainText(raw.info) ||
    plainText(model.description) ||
    plainText(record(raw.type).description);
  if (!description) enrichedFields.push('description');
  return {
    id,
    name,
    type,
    creator: plainText(record(raw.store).name) || 'Uma Penca',
    model: plainText(model.name) || type,
    description: description || 'A fonte não disponibilizou uma descrição para este produto.',
    image,
    images: Array.from(new Set([image, ...uniqueVariants.map((v) => v.image)].filter(Boolean))),
    priceCents: Math.min(...uniqueVariants.map((v) => v.priceCents)),
    variants: uniqueVariants,
    sourceUrl: String(listing.full_link),
    enrichedFields,
  };
}
