import { load } from 'cheerio';

export type RecordData = Record<string, unknown>;
export function record(value: unknown): RecordData {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as RecordData)
    : {};
}
export function records(value: unknown): RecordData[] {
  return Array.isArray(value) ? value.map(record) : [];
}
export function plainText(value: unknown): string {
  return typeof value === 'string' ? load(value).text().replace(/\s+/g, ' ').trim() : '';
}

// Delimita apenas o objeto JSON. O HTML pode conter outros comandos após a atribuição.
export function extractAssignedJson(html: string, variable: string): RecordData {
  const marker = html.indexOf(variable);
  if (marker < 0) throw new Error('Dados estruturados ausentes: ' + variable);
  const equal = html.indexOf('=', marker + variable.length);
  const start = html.indexOf('{', equal);
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let i = start; i < html.length; i++) {
    const char = html[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) {
      return record(JSON.parse(html.slice(start, i + 1)));
    }
  }
  throw new Error('JSON incompleto: ' + variable);
}
export function parseListing(html: string): RecordData[] {
  const data = extractAssignedJson(html, 'window.vueInitialData');
  const hits = records(record(data.products).hits);
  if (!hits.length) throw new Error('Listagem sem produtos; seed anterior preservado.');
  return hits;
}
export function parseDetail(html: string): RecordData {
  const data = extractAssignedJson(html, 'window.initialScope');
  const product = record(data.ELASTIC_PRODUCT);
  if (!product.id) throw new Error('Detalhe sem produto.');
  return product;
}
