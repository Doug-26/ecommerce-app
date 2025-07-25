import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, map } from 'rxjs';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:3000/products';
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Failed to load products:', error);
        return of([]);
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    // Try the RESTful approach first
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.warn(`RESTful URL failed for product ${id}, trying query parameter approach:`, error);
        // Fallback to query parameter approach
        return this.http.get<Product[]>(`${this.baseUrl}?id=${id}`).pipe(
          map(products => products.length > 0 ? products[0] : null),
          catchError(queryError => {
            console.error(`Both URL patterns failed for product with ID ${id}:`, queryError);
            return of(null);
          })
        );
      })
    );
  }
}
