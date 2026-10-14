import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutForm } from './checkout-form';

describe('CheckoutForm', () => {
  let fixture: ComponentFixture<CheckoutForm>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckoutForm] }).compileComponents();
    fixture = TestBed.createComponent(CheckoutForm);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('renders the customer fields with associated labels and an address group', () => {
    expect(element.querySelector('h2')?.textContent).toBe('Customer details');
    const labels = Array.from(element.querySelectorAll<HTMLLabelElement>('label[for]'));
    expect(labels.map((label) => label.textContent)).toEqual([
      'First name', 'Last name', 'Email', 'Street', 'Postal code', 'City'
    ]);
    for (const label of labels) {
      expect(element.querySelector(`#${label.htmlFor}`)).toBeTruthy();
    }
    expect(element.querySelector('fieldset legend')?.textContent).toBe('Address');
    expect(element.querySelectorAll('fieldset input')).toHaveLength(3);
    expect(element.querySelector<HTMLInputElement>('#checkout-email')?.type).toBe('email');
  });

  it('allows typing and toggling the newsletter checkbox without application bindings', () => {
    const input = element.querySelector<HTMLInputElement>('#checkout-first-name')!;
    input.value = 'Anna';
    input.dispatchEvent(new Event('input'));
    const checkbox = element.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(checkbox.checked).toBe(false);
    checkbox.click();
    fixture.detectChanges();
    expect(input.value).toBe('Anna');
    expect(checkbox.checked).toBe(true);
  });

  it('keeps the buy button inert without a form submission', () => {
    const button = element.querySelector<HTMLButtonElement>('button')!;
    const input = element.querySelector<HTMLInputElement>('#checkout-first-name')!;
    input.value = 'Anna';
    const submit = vi.fn();
    element.addEventListener('submit', submit);
    expect(button.textContent).toBe('Buy');
    expect(button.type).toBe('button');
    expect(button.form).toBeNull();
    button.click();
    fixture.detectChanges();
    expect(submit).not.toHaveBeenCalled();
    expect(input.value).toBe('Anna');
  });
});

