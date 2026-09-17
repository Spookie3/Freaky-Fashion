import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { Product, ProductService } from '../../services/product';
import { Navigation } from "../../components/navigation/navigation";
import { Footer } from "../../components/footer/footer";
import { Item } from "../../components/products/item/item";
import { Hero } from '../../components/hero/hero';

@Component({
  imports: [Navigation, Footer, Item, Hero],
  selector: 'app-start',
  styleUrl: './start.css',
  templateUrl: './start.html',
})
export class Start {
  // Signal for loading the items on the starting page. Observable is turned into a signal after calling the endpoint. Removes the loading text and replaces it with a product.
  readonly state = toSignal(inject(ProductService).getRecentProducts().pipe(
    map((products) => ({ products, loading: false, error: '' })),
    catchError(() => of({ products: [] as Product[], loading: false, error: 'Products could not be loaded. Please try again later.' }))
  ), { initialValue: { products: [] as Product[], loading: true, error: '' } });
}

