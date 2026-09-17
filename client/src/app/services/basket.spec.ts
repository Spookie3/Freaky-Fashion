import { BasketService } from './basket';

describe('BasketService', () => {
  let basket: BasketService;
  const product = { id: 1, title: 'Jacka', price: 199.90 };

  beforeEach(() => { basket = new BasketService(); });

  it('stores title and unit price and combines repeated products', () => {
    basket.add(product);
    basket.add(product);
    expect(basket.items()).toEqual([{ ...product, quantity: 2 }]);
    expect(basket.total()).toBe(399.8);
  });

  it('calculates item and basket totals with decimal prices', () => {
    basket.add(product);
    basket.add({ id: 2, title: 'Tröja', price: 0.1 });
    basket.setQuantity(1, 3);
    expect(basket.itemTotal(basket.items()[0])).toBe(599.7);
    expect(basket.total()).toBe(599.8);
  });

  it.each([0, -1, 1.5, NaN, Infinity])('ignores invalid quantity %s', (quantity) => {
    basket.add(product);
    basket.setQuantity(1, quantity);
    expect(basket.items()[0].quantity).toBe(1);
  });

  it('removes only the selected item and recalculates totals', () => {
    basket.add(product);
    basket.add({ id: 2, title: 'Tröja', price: 100 });
    basket.remove(1);
    expect(basket.items().map((item) => item.id)).toEqual([2]);
    expect(basket.total()).toBe(100);
    basket.remove(2);
    expect(basket.total()).toBe(0);
  });
});
