import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkout } from './checkout';
import { provideRouter } from '@angular/router';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the basket summary and customer form', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-basket-items')).toBeTruthy();
    expect(element.querySelector('app-checkout-form h2')?.textContent).toBe('Customer details');
  });
});

