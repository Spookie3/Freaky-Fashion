import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Start } from './start';

describe('Start', () => {
  let fixture: ComponentFixture<Start>;
  let http: HttpTestingController;
  const api = 'http://localhost:8000/api/products';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Start],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Start);
    fixture.detectChanges();
    http.expectOne(api).flush([]);
  });
  afterEach(() => http.verify());

  it('fetches and displays the eight newest items in the API order', () => {
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Loading');
    const products = Array.from({ length: 8 }, (_, index) => ({
      id: 20 - index, title: `Product ${20 - index}`, description: '', brand: 'Fashion',
      price: 100, imageurl: '/productImages/product_01.png', SKU: 'ABC123', date: '2026-01-01'
    }));
    const request = http.expectOne(`${api}/recent`);
    expect(request.request.method).toBe('GET');
    request.flush(products);
    fixture.detectChanges();
    for (const product of products) http.expectOne(`${api}/${product.id}`).flush(product);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-item')).toHaveLength(8);
    expect(Array.from(element.querySelectorAll('app-item h2'), (heading) => heading.textContent)).toEqual(products.map((product) => product.title));
  });

  it('shows an empty state when no products have been added', () => {
    http.expectOne(`${api}/recent`).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('There are no products yet.');
    expect(fixture.nativeElement.querySelector('app-item')).toBeNull();
  });

  it('shows a readable error when the request fails', () => {
    http.expectOne(`${api}/recent`).flush({}, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('could not be loaded');
    expect(fixture.nativeElement.querySelector('main').getAttribute('aria-busy')).toBe('false');
  });
});

