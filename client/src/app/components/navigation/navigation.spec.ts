import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo, search field, and basket link', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.logo')).toBeTruthy();
    expect(element.querySelector('#product-search')).toBeTruthy();
    expect(element.querySelector('a[routerLink="/basket"]')).toBeTruthy();
  });
});
