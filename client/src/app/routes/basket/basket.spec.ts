import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Basket } from './basket';
import { provideRouter } from '@angular/router';

describe('Basket', () => {
  let component: Basket;
  let fixture: ComponentFixture<Basket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Basket],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Basket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
