import { Injectable, computed, signal } from '@angular/core';
import { Product } from './product';

export interface BasketItem {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly quantity: number;
}

// Creates a shared instance of basket between pages; refreshing clears it. to fix this it should be added to session storage.
@Injectable({ providedIn: 'root' })

export class BasketService {
  // signal containing the array, simlish to states in react
  private readonly state = signal<readonly BasketItem[]>([]); 
  // signal exposed as read only for checkout. methods not included.
  readonly items = this.state.asReadonly();

  readonly total = computed(() => this.items().reduce(
    (total, item) => total + this.lineTotal(item), 0
  ) / 100);

  add(product: Pick<Product, 'id' | 'title' | 'price'>): void {
    this.state.update((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { id: product.id, title: product.title, price: product.price, quantity: 1 }];
    });
  }

  setQuantity(id: number, quantity: number): void {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return;
    this.state.update((items) => items.map((item) => item.id === id ? { ...item, quantity } : item));
  }

  remove(id: number): void {
    this.state.update((items) => items.filter((item) => item.id !== id));
  }

  // Calculate in öre to avoid floating-point rounding in totals.
  private lineTotal(item: BasketItem): number {
    return Math.round(item.price * 100) * item.quantity;
  }

  itemTotal(item: BasketItem): number {
    return this.lineTotal(item) / 100;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(price);
  }
}
