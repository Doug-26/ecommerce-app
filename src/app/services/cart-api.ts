import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, switchMap, map } from 'rxjs';
import { ServerCartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private apiUrl = 'http://localhost:3000/cart';
  private http = inject(HttpClient);

  getUserCart(userId: number): Observable<ServerCartItem[]> {
    return this.http.get<ServerCartItem[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addToCart(cartItem: Omit<ServerCartItem, 'id'>): Observable<ServerCartItem> {
    return this.http.post<ServerCartItem>(this.apiUrl, cartItem);
  }

  updateCartItem(id: string | number, quantity: number): Observable<ServerCartItem> {
    return this.http.patch<ServerCartItem>(`${this.apiUrl}/${id}`, { quantity });
  }

  removeFromCart(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  clearUserCart(userId: number): Observable<void> {
    // Note: JSON Server doesn't support bulk delete by query, so we need to handle this differently
    return this.getUserCart(userId).pipe(
      switchMap(items => {
        if (items.length === 0) {
          return of(null);
        }
        const deleteRequests = items.map(item => this.removeFromCart(item.id!));
        return forkJoin(deleteRequests);
      }),
      map(() => void 0)
    );
  }
}
