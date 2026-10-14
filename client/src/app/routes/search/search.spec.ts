import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { Product } from '../../services/product';
import { Search } from './search';

describe('Search', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  const api = 'http://localhost:8000/api/products';
  const product: Product = {
    id: 1, title: 'Jacket', price: 799, brand: 'Fashion',
    description: '', imageurl: '/jacket.jpg', SKU: 'J1', date: '2026-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create('/search');
  });

  afterEach(() => http.verify());

  async function submit(term: string): Promise<void> {
    const input = harness.routeNativeElement!.querySelector<HTMLInputElement>('#product-search')!;
    input.value = term;
    input.dispatchEvent(new Event('input'));
    harness.routeNativeElement!.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  it('shows guidance and makes no request for an empty search', async () => {
    await submit('   ');
    expect(harness.routeNativeElement!.textContent).toContain('Enter a search term');
    http.expectNone((request) => request.url.startsWith(api));
  });

  it('connects the search form to the Search route and renders matching item components', async () => {
    await submit('  Jacket  ');
    expect(TestBed.inject(Router).url).toBe('/search?q=Jacket');
    expect(harness.routeNativeElement!.querySelector('[role="status"]')!.textContent).toContain('Searching');
    const request = http.expectOne(`${api}/search?q=Jacket`);
    expect(request.request.method).toBe('GET');
    request.flush([product, { ...product, id: 2, title: 'Blue jacket' }]);
    harness.detectChanges();
    http.expectOne(`${api}/1`).flush(product);
    http.expectOne(`${api}/2`).flush({ ...product, id: 2, title: 'Blue jacket' });
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelectorAll('app-item')).toHaveLength(2);
    expect(harness.routeNativeElement!.textContent).toContain('Blue jacket');
  });

  it('shows no matches and supports another search after a failed request', async () => {
    await submit('missing');
    http.expectOne(`${api}/search?q=missing`).flush([]);
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('No products');
    await submit('error');
    http.expectOne(`${api}/search?q=error`).flush({}, { status: 500, statusText: 'Server Error' });
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('[role="alert"]')).toBeTruthy();
    await submit('Jacket');
    http.expectOne(`${api}/search?q=Jacket`).flush([product]);
    harness.detectChanges();
    http.expectOne(`${api}/1`).flush(product);
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelectorAll('app-item')).toHaveLength(1);
    expect(harness.routeNativeElement!.querySelector('[role="alert"]')).toBeNull();
  });

  it('loads a direct search URL and cancels outdated searches', async () => {
    await harness.navigateByUrl('/search?q=first', Search);
    const first = http.expectOne(`${api}/search?q=first`);
    await harness.navigateByUrl('/search?q=second', Search);
    expect(first.cancelled).toBe(true);
    http.expectOne(`${api}/search?q=second`).flush([]);
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('second');
  });
});

