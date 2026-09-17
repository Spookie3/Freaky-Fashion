import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, Subject, switchMap, startWith } from 'rxjs';
import { Product, ProductService } from '../../services/product';
import { Item } from '../../components/products/item/item';
import { Navigation } from '../../components/navigation/navigation';
import { Footer } from '../../components/footer/footer';
import { DetailedItem } from '../../components/products/detailed-item/detailed-item';
import { productIdFromSlug } from '../../services/product-slug';

@Component({
  imports: [Navigation, Footer, DetailedItem, Item],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html'
})
export class Products {
  private readonly service = inject(ProductService);
  readonly selectedProduct = new Subject<Product | null>();
  readonly related = toSignal(this.selectedProduct.pipe(
    switchMap((product) => {
      const empty = { products: [] as Product[], loading: false, error: '' };
      const prefix = product?.SKU.match(/^[a-z]+/i)?.[0];
      if (!product || !prefix) return of(empty);
      return this.service.getSimilarProducts(prefix, product.id).pipe(
        map((products) => ({ ...empty, products: products.filter((item) => item.id !== product.id).slice(0, 5) })),
        catchError(() => of({ ...empty, error: 'Related products could not be loaded.' })),
        startWith({ ...empty, loading: true })
      );
    })
  ), { initialValue: { products: [] as Product[], loading: false, error: '' } });
  readonly productId = toSignal(inject(ActivatedRoute).paramMap.pipe(
    map((params) => productIdFromSlug(params.get('slug') ?? ''))
  ), { initialValue: null });
}

