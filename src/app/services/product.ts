import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../models/products';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'api/products';
  private http = inject(HttpClient);

  // Add error handling to ProductService
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Failed to load products:', error);
        return of([]);
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Failed to load product with ID ${id}:`, error);
        return of(null);
      })
    );
  }

}
