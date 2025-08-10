import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../app.config';
import { Order } from '../models/order';
import { AuthService } from './auth.service'; // <-- add

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;
  private auth = inject(AuthService); // <-- add

  getMyOrders(): Observable<Order[]> {
    const uid = this.auth.currentUser()?.id?.toString() ?? '';
    return this.http
      .get<Order[]>(`${this.api}/orders?userId=${encodeURIComponent(uid)}`)
      .pipe(
        map(list =>
          [...list].sort(
            (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
        )
      );
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.api}/orders?userId=${encodeURIComponent(userId)}`)
      .pipe(
        map(list =>
          [...list].sort(
            (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
        )
      );
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.api}/orders/${id}`);
  }

  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(`${this.api}/orders`, order);
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> { // <-- string
    return this.http.patch<Order>(`${this.api}/orders/${orderId}`, { status });
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.api}/orders/${orderId}`, { status: 'cancelled' });
  }
}
