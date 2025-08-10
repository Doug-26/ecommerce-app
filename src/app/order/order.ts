import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Order } from '../models/order';
import { OrderService } from '../services/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order.html',
  styleUrl: './order.scss' // was styleUrls
})
export class OrdersComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.error.set('User not logged in');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    // Pass string userId to service
    this.orderService.getUserOrders(user.id.toString()).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
        this.error.set('Failed to load orders. Please try again.');
        this.loading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      pending: 'bg-warning text-dark',
      paid: 'bg-info text-white',
      fulfilled: 'bg-primary text-white',
      shipped: 'bg-primary text-white',
      delivered: 'bg-success text-white',
      cancelled: 'bg-danger text-white',
      confirmed: 'bg-info text-white'
    };
    return statusClasses[status] ?? 'bg-secondary text-white';
  }

  viewOrderDetails(orderId: string): void {
    console.log('View order details:', orderId);
  }

  reorderItems(order: Order): void {
    console.log('Reorder items:', order);
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => this.loadOrders(),
        error: (error) => {
          console.error('Failed to cancel order:', error);
          alert('Failed to cancel order. Please try again.');
        }
      });
    }
  }
}
