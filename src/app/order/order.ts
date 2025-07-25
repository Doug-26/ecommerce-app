import { Component, OnInit, signal } from '@angular/core';
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
  styleUrls: ['./order.scss']
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;

    this.loading.set(true);
    this.orderService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load orders');
        this.loading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses = {
      'pending': 'bg-warning',
      'confirmed': 'bg-info',
      'shipped': 'bg-primary',
      'delivered': 'bg-success',
      'cancelled': 'bg-danger'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-secondary';
  }
}
