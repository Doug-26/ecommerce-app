import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders?userId=${userId}&_sort=orderDate&_order=desc`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`);
  }

  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  updateOrderStatus(orderId: number, status: Order['status']): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}`, { status });
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }
}
