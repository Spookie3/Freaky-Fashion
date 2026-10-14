import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([{ path: 'search', component: Footer }])]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the four shopping benefits with decorative icons', () => {
    const benefits = Array.from(element.querySelectorAll('.benefits li'));

    expect(benefits.map((benefit) => benefit.textContent?.trim())).toEqual([
      'Free shipping and returns',
      'Express shipping',
      'Secure payments',
      'New arrivals every day'
    ]);
    for (const benefit of benefits) {
      expect(benefit.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('should render the footer sections and copyright', () => {
    expect(element.querySelector('footer')?.getAttribute('lang')).toBe('en');
    expect(Array.from(element.querySelectorAll('.desktop-heading'), (heading) => heading.textContent)).toEqual([
      'Shopping', 'My pages', 'Customer service'
    ]);
    expect(element.querySelector('.copyright')?.textContent).toContain('© Freaky Fashion');
    const navigation = element.querySelector('nav');
    const headingId = navigation?.getAttribute('aria-labelledby');
    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId} .desktop-heading`)?.textContent).toBe('Shopping');
  });

  it('should link each category to its matching search query', () => {
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('.shopping a'));
    const categories = ['Vinterjackor', 'Pufferjackor', 'Kappa', 'Trenchcoats'];

    expect(links.map((link) => link.textContent)).toEqual(['Winter jackets', 'Puffer jackets', 'Coats', 'Trench coats']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      categories.map((category) => `/search?q=${category}`)
    );
  });

  it('should navigate to search when a category is clicked', async () => {
    element.querySelector<HTMLAnchorElement>('nav a')!.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/search?q=Vinterjackor');
  });

  it('expands and collapses each category independently', () => {
    for (const button of element.querySelectorAll<HTMLButtonElement>('.category-toggle')) {
      const panel = element.querySelector(`#${button.getAttribute('aria-controls')}`)!;
      const initiallyExpanded = button.getAttribute('aria-expanded') === 'true';
      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe(String(!initiallyExpanded));
      expect(panel.classList.contains('collapsed')).toBe(initiallyExpanded);
      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe(String(initiallyExpanded));
      expect(panel.classList.contains('collapsed')).toBe(!initiallyExpanded);
    }
  });

  it('renders the account and support links without navigating', () => {
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('.footer-category:not(.shopping) a'));
    expect(links.map((link) => link.textContent)).toEqual([
      'My orders', 'My account', 'Return policy', 'Privacy policy'
    ]);
    for (const link of links) {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(TestBed.inject(Router).url).toBe('/');
  });
});


