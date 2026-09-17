import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Hero } from './hero';

describe('Hero', () => {
  let fixture: ComponentFixture<Hero>;
  let http: HttpTestingController;
  const api = 'http://localhost:8000/api/products';
  const products = [
    { id: 1, title: 'Jacka', description: 'En varm jacka.', imageurl: '/productImages/product_01.png' },
    { id: 2, title: 'Tröja', description: 'En mjuk tröja.', imageurl: '/productImages/product_02.png' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero], providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
  });
  afterEach(() => { http.verify(); vi.restoreAllMocks(); });

  it.each([[0, 0], [0.99, 1]])('selects a random product for random value %s', (random, index) => {
    vi.spyOn(Math, 'random').mockReturnValue(random);
    expect(fixture.nativeElement.textContent).toContain('Loading');
    http.expectOne(api).flush(products);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h2')?.textContent).toBe(products[index].title);
    expect(element.textContent).toContain(products[index].description);
    expect(element.querySelector('img')?.getAttribute('src')).toBe(products[index].imageurl);
    expect(element.querySelector('img')?.alt).toBe(products[index].title);
    fixture.detectChanges();
    expect(element.querySelector('h2')?.textContent).toBe(products[index].title);
  });

  it('handles an empty catalogue', () => {
    http.expectOne(api).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('no products');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('handles failed requests', () => {
    http.expectOne(api).flush({}, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('section').getAttribute('aria-busy')).toBe('false');
  });
});

