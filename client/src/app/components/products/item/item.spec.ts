import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../../services/product';
import { Item } from './item';
import { BasketService } from '../../../services/basket';
import { provideRouter } from '@angular/router';

describe('Item', () => {
  let fixture: ComponentFixture<Item>;
  let http: HttpTestingController;
  const now = Date.parse('2026-09-09T12:00:00Z');
  const product: Product = {
    id: 42, title: 'Vinterjacka', brand: 'Freaky Fashion', price: 799,
    imageurl: '/jacket.jpg', description: 'Varm jacka', SKU: 'JKT42',
    date: '2026-09-08'
  };

  beforeEach(async () => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
    await TestBed.configureTestingModule({
      imports: [Item],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Item);
    fixture.componentRef.setInput('productId', 42);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  function respond(value: Product = product): HTMLElement {
    const request = http.expectOne('http://localhost:8000/api/products/42');
    expect(request.request.method).toBe('GET');
    request.flush(value);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('requests the specified item and displays its image, title, brand and SEK price', () => {
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Loading');
    const element = respond();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/jacket.jpg');
    expect(element.querySelector('img')?.alt).toBe('Vinterjacka');
    expect(element.querySelector('h2')?.textContent).toBe('Vinterjacka');
    expect(element.querySelector('.brand')?.textContent).toBe('Freaky Fashion');
    expect(element.querySelector('.price')?.textContent?.replace(/\s/g, ' ')).toBe('799,00 kr');
    expect(element.querySelector('[role="status"]')).toBeNull();
  });

  it.each([
    ['just created', new Date(now).toISOString(), true],
    ['less than seven days old', new Date(now - 7 * 86400000 + 1).toISOString(), true],
    ['exactly seven days old', new Date(now - 7 * 86400000).toISOString(), false],
    ['older than seven days', '2026-08-01', false],
    ['in the future', '2026-09-10', false],
    ['invalid date', 'invalid', false]
  ])('handles the New badge for a product %s', (_label, date, expected) => {
    const element = respond({ ...product, date });
    expect(element.querySelector('.new-badge')?.textContent ?? null).toBe(expected ? 'New' : null);
  });

  it('shows an error when the item cannot be fetched and recovers when the ID changes', () => {
    http.expectOne('http://localhost:8000/api/products/42').flush({}, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('could not be loaded');
    fixture.componentRef.setInput('productId', 43);
    fixture.detectChanges();
    http.expectOne('http://localhost:8000/api/products/43').flush({ ...product, id: 43 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe(product.title);
  });

  it('cancels the previous request when the ID changes', () => {
    const first = http.expectOne('http://localhost:8000/api/products/42');
    fixture.componentRef.setInput('productId', 43);
    fixture.detectChanges();
    expect(first.cancelled).toBe(true);
    http.expectOne('http://localhost:8000/api/products/43').flush({ ...product, id: 43 });
  });

  it('rejects invalid IDs without sending another request', () => {
    respond();
    fixture.componentRef.setInput('productId', -1);
    fixture.detectChanges();
    http.expectNone('http://localhost:8000/api/products/-1');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Invalid');
  });

  it('links the whole card to the product slug without an add button', () => {
    const element = respond();
    const link = element.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/products/vinterjacka-42');
    expect(link.querySelector('img')).toBeTruthy();
    expect(link.querySelector('h2')?.textContent).toBe(product.title);
    expect(element.querySelector('button')).toBeNull();
    expect(TestBed.inject(BasketService).items()).toEqual([]);
  });

  it('cancels pending requests when destroyed', () => {
    const request = http.expectOne('http://localhost:8000/api/products/42');
    fixture.destroy();
    expect(request.cancelled).toBe(true);
  });
});

