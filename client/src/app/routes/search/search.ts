import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { Product, ProductService } from '../../services/product';
import { Navigation } from '../../components/navigation/navigation';
import { Footer } from '../../components/footer/footer';
import { Item } from '../../components/products/item/item';

interface SearchState {
  query: string;
  products: Product[];
  loading: boolean;
  error: string;
}

@Component({
  imports: [Navigation, Footer, Item],
  selector: 'app-search',
  styleUrl: './search.css',
  templateUrl: './search.html',
})
export class Search {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly state = toSignal(this.route.queryParamMap.pipe(
    map((params) => params.get('q')?.trim() ?? ''),
    distinctUntilChanged(),
    switchMap((query) => {
      const empty: SearchState = { query, products: [], loading: false, error: '' };
      if (!query) return of(empty);

      return this.productService.searchProducts(query).pipe(
        map((products): SearchState => ({ ...empty, products })),
        catchError(() => of({ ...empty, error: 'The search could not be completed. Please try again.' })),
        startWith({ ...empty, loading: true })
      );
    })
  ), { initialValue: { query: '', products: [], loading: false, error: '' } as SearchState });
}

