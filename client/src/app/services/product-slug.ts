import { Product } from './product';

export function productSlug(product: Pick<Product, 'id' | 'title'>): string {
  const title = product.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${title || 'produkt'}-${product.id}`;
}

export function productIdFromSlug(slug: string): number | null {
  const match = /^.+-([1-9]\d*)$/.exec(slug);
  const id = match ? Number(match[1]) : NaN;
  return Number.isSafeInteger(id) ? id : null;
}
