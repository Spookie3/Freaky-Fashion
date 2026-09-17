import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { BasketService } from '../../services/basket';
import { Product } from '../../services/product';

describe('Products', () => {
  let http: HttpTestingController;
  const api = 'http://localhost:8000/api/products';
  const product: Product = { id: 42, title: 'Blå jacka', description: 'En varm jacka.', brand: 'Fashion', price: 799, imageurl: '/jacket.jpg', SKU: 'J42', date: '2026-01-01' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('opens a search card as a detail page and adds the selected product to the basket', async () => {
    const harness = await RouterTestingHarness.create('/search?q=jacka');
    http.expectOne(`${api}/search?q=jacka`).flush([product]);
    harness.detectChanges();
    http.expectOne(`${api}/42`).flush(product);
    harness.detectChanges();
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('app-item a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    http.expectOne(`${api}/42`).flush(product);
    harness.detectChanges();
    http.expectOne(`${api}/sku/J?excludeId=42`).flush([]);
    const detail = harness.routeNativeElement!.querySelector('app-detailed-item')!;
    expect(detail.querySelector('h1')!.textContent).toBe(product.title);
    expect(detail.textContent).toContain(product.description);
    detail.querySelector<HTMLButtonElement>('button')!.click();
    expect(TestBed.inject(BasketService).items()).toEqual([{ id: 42, title: product.title, price: 799, quantity: 1 }]);
  });

  it('fetches direct URLs and changes the selected product when the slug changes', async () => {
    const harness = await RouterTestingHarness.create('/products/bla-jacka-42');
    http.expectOne(`${api}/42`).flush(product);
    harness.detectChanges();
    http.expectOne(`${api}/sku/J?excludeId=42`).flush([]);
    expect(harness.routeNativeElement!.textContent).toContain(product.description);
    await harness.navigateByUrl('/products/annan-jacka-43');
    http.expectOne(`${api}/43`).flush({ ...product, id: 43, title: 'Annan jacka' });
    harness.detectChanges();
    http.expectOne(`${api}/sku/J?excludeId=43`).flush([]);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toBe('Annan jacka');
  });

  it('shows a fetch error for a missing product', async () => {
    const harness = await RouterTestingHarness.create('/products/saknas-99');
    http.expectOne(`${api}/99`).flush({}, { status: 404, statusText: 'Not Found' });
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('[role="alert"]')).toBeTruthy();
    expect(harness.routeNativeElement!.querySelector('app-detailed-item button')).toBeNull();
  });

  it('renders five related cards and excludes the selected product', async () => {
    const harness = await RouterTestingHarness.create('/products/bla-jacka-42');
    http.expectOne(`${api}/42`).flush(product);
    const related = Array.from({ length: 6 }, (_, index) => ({ ...product, id: 50 + index }));
    http.expectOne(`${api}/sku/J?excludeId=42`).flush([product, ...related]);
    harness.detectChanges();
    for (const item of related.slice(0, 5)) http.expectOne(`${api}/${item.id}`).flush(item);
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelectorAll('.related-row app-item')).toHaveLength(5);
    http.expectNone(`${api}/55`);
  });
});

