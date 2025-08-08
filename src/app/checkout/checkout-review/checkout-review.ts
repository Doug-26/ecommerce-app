import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-review.html',
  styleUrl: './checkout-review.scss'
})
export class CheckoutReviewComponent {
  @Output() onBack = new EventEmitter<void>();

  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);
  private router = inject(Router);

  cartItems = this.cartService.cartItems;
  checkoutSummary = this.checkoutService.checkoutSummary;
  shippingAddress = this.checkoutService.shippingAddress;
  paymentMethod = this.checkoutService.paymentMethod;
  isProcessing = this.checkoutService.isProcessing;

  placeOrder(): void {
    this.checkoutService.processOrder().subscribe({
      next: (order) => {
        console.log('Order placed successfully:', order);
        this.router.navigate(['/checkout/success'], { state: { order } });
      },
      error: (error) => {
        console.error('Failed to place order:', error);
        alert('Failed to place order. Please try again.');
      }
    });
  }
}
