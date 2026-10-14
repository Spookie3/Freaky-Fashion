import { Component, Input, OnChanges, OnDestroy, inject, signal, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product, ProductService } from '../../../services/product';
import { BasketService } from '../../../services/basket';

@Component({
  selector: 'app-detailed-item',
  templateUrl: './detailed-item.html',
  styleUrl: './detailed-item.css'
})
export class DetailedItem implements OnChanges, OnDestroy {
  readonly productLoaded = output<Product | null>();
  readonly basket = inject(BasketService);
  readonly addedMessage = signal('');

  addToBasket(product: Product): void {
    this.basket.add(product);
    this.addedMessage.set(`${product.title} has been added to your basket.`);
  }
  @Input({ required: true }) productId!: number;

  private readonly productService = inject(ProductService);
  private request?: Subscription;

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnChanges(): void {
    this.productLoaded.emit(null);
    this.addedMessage.set('');
    this.request?.unsubscribe();
    this.product.set(null);
    this.errorMessage.set('');
    this.isLoading.set(false);

    if (!Number.isInteger(this.productId) || this.productId <= 0) {
      this.errorMessage.set('Invalid product ID.');
      return;
    }

    this.isLoading.set(true);
    this.request = this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.productLoaded.emit(product);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('The product could not be loaded.');
        this.isLoading.set(false);
      }
    });
  }

  isNew(product: Product): boolean {
    const age = Date.now() - Date.parse(product.date);
    return age >= 0 && age < 7 * 24 * 60 * 60 * 1000;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency', currency: 'SEK', maximumFractionDigits: 2
    }).format(price);
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }
}



