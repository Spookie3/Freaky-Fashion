import { productIdFromSlug, productSlug } from './product-slug';

describe('product slugs', () => {
  it('normalizes Swedish titles and keeps identical titles distinct', () => {
    expect(productSlug({ id: 1, title: '  Blå & Grön Jacka! ' })).toBe('bla-gron-jacka-1');
    expect(productSlug({ id: 2, title: '  Blå & Grön Jacka! ' })).toBe('bla-gron-jacka-2');
    expect(productSlug({ id: 3, title: '!!!' })).toBe('produkt-3');
  });
  it('extracts IDs and rejects malformed slugs', () => {
    expect(productIdFromSlug('bla-jacka-42')).toBe(42);
    for (const slug of ['', 'jacka', 'jacka-0', 'jacka-1.5', 'jacka-9007199254740992']) {
      expect(productIdFromSlug(slug)).toBeNull();
    }
  });
});
