import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { Product, ProductService } from '../../services/product';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  host: { class: 'block' }
})
export class Hero {
  readonly state = toSignal(inject(ProductService).getProducts().pipe(
    map((products) => ({
      product: products.length ? products[Math.floor(Math.random() * products.length)] : null,
      loading: false,
      error: ''
    })),
    catchError(() => of({ product: null, loading: false, error: 'The featured product could not be loaded.' }))
  ), { initialValue: { product: null as Product | null, loading: true, error: '' } });
}

