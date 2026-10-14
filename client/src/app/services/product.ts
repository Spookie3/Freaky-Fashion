import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateProductRequest {
  title: string;
  description: string;
  imageurl: string;
  brand: string;
  SKU: string;
  price: number;
  date: string;
}

export interface Product extends CreateProductRequest {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api/products';

  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getRecentProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/recent`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getSimilarProducts(sku: string, excludeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/sku/${encodeURIComponent(sku)}`, { params: { excludeId } });
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
