import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Product, ProductService } from '../../../services/product';
import { AddProduct } from '../add-product/add-product';

@Component({
  imports: [AddProduct],
  selector: 'app-products-table',
  styleUrl: './products-table.css',
  templateUrl: './products-table.html',
})
export class ProductsTable implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly deletingProductIds = signal<ReadonlySet<number>>(new Set());
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    if (!window.confirm(`Delete ${product.title}?`)) {
      return;
    }

    this.deletingProductIds.update((ids) => new Set(ids).add(product.id));
    this.errorMessage.set('');

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products.update((products) =>
          products.filter((item) => item.id !== product.id)
        );
        this.removeDeletingProductId(product.id);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.error?.message ?? 'The product could not be deleted.'
        );
        this.removeDeletingProductId(product.id);
      }
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.error?.message ?? 'The products could not be loaded.'
        );
      }
    });
  }

  private removeDeletingProductId(id: number): void {
    this.deletingProductIds.update((ids) => {
      const updatedIds = new Set(ids);
      updatedIds.delete(id);
      return updatedIds;
    });
  }
}
