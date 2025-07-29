import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  updateCartItem(id: number, quantity: number): Observable<ServerCartItem> {
    return this.http.patch<ServerCartItem>(`${this.apiUrl}/${id}`, { quantity });
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  clearUserCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?userId=${userId}`);
  }
}
