import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BasketService } from '../../../services/basket';
import { Basket } from '../../../routes/basket/basket';
import { Checkout } from '../../../routes/checkout/checkout';
import { BasketItems } from './basket-items';

describe('BasketItems', () => {
  let fixture: ComponentFixture<BasketItems>;
  let basket: BasketService;
  const product = { id: 1, title: 'Vinterjacka', price: 799 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasketItems],
      providers: [provideRouter([
        { path: 'basket', component: Basket },
        { path: 'checkout', component: Checkout }
      ])]
    }).compileComponents();
    basket = TestBed.inject(BasketService);
    fixture = TestBed.createComponent(BasketItems);
    fixture.detectChanges();
  });

  it('shows an empty state without a checkout link', () => {
    expect(fixture.nativeElement.textContent).toContain('Your basket is empty.');
    expect(fixture.nativeElement.querySelector('a[href="/checkout"]')).toBeNull();
  });

  it('updates the line total when quantity changes on the right', () => {
    basket.add(product);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '3';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(basket.items()[0].quantity).toBe(3);
    expect(fixture.nativeElement.querySelector('.item-total').textContent).toBe(basket.formatPrice(2397));
    expect(fixture.nativeElement.textContent).toContain(product.title);
  });

  it('restores the previous quantity when an invalid amount is entered', () => {
    basket.add(product);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '0';
    input.dispatchEvent(new Event('change'));
    expect(input.value).toBe('1');
    expect(basket.total()).toBe(799);
  });

  it('removes the selected item when its trash button is clicked', () => {
    basket.add(product);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[aria-label="Remove Vinterjacka"]').click();
    fixture.detectChanges();
    expect(basket.items()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Your basket is empty.');
  });

  it('opens the basket from the cart and carries its items into checkout', async () => {
    basket.add(product);
    basket.setQuantity(1, 2);
    const harness = await RouterTestingHarness.create('/checkout');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('a[routerLink="/basket"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toBe('Basket');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('a[href="/checkout"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toBe('Checkout');
    expect(harness.routeNativeElement!.textContent).toContain('Vinterjacka');
    expect(harness.routeNativeElement!.textContent).toContain('Quantity: 2');
    expect(harness.routeNativeElement!.querySelector('.item-total')!.textContent).toBe(basket.formatPrice(1598));
    expect(harness.routeNativeElement!.querySelector('input[type="number"]')).toBeNull();
  });
});

