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
  styleUrls: ['./order.scss']
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
    const user = this.authService.currentUser(); // Use currentUser() signal
    if (!user?.id) {
      this.error.set('User not logged in');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    
    this.orderService.getUserOrders(Number(user.id)).subscribe({
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
    const statusClasses = {
      'pending': 'bg-warning text-dark',
      'confirmed': 'bg-info text-white',
      'shipped': 'bg-primary text-white',
      'delivered': 'bg-success text-white',
      'cancelled': 'bg-danger text-white'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-secondary text-white';
  }

  viewOrderDetails(orderId: number): void {
    // Navigate to order details page
    console.log('View order details:', orderId);
  }

  reorderItems(order: Order): void {
    // Add order items back to cart
    console.log('Reorder items:', order);
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders(); // Refresh orders
        },
        error: (error) => {
          console.error('Failed to cancel order:', error);
          alert('Failed to cancel order. Please try again.');
        }
      });
    }
  }
}
