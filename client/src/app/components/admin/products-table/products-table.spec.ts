import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsTable } from './products-table';
import { provideRouter } from '@angular/router';
import { ProductService } from '../../../services/product';
import { of } from 'rxjs';

describe('ProductsTable', () => {
  let component: ProductsTable;
  let fixture: ComponentFixture<ProductsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsTable],
      providers: [provideRouter([]), { provide: ProductService, useValue: { getProducts: () => of([]) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
