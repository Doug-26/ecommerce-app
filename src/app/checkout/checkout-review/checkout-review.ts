import { Component, inject, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() placeOrder = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  checkoutSummary = this.checkoutService.checkoutSummary;
  shippingAddress = this.checkoutService.shippingAddress;
  paymentMethod = this.checkoutService.paymentMethod;
  isProcessing = this.checkoutService.isProcessing;

  // Computed property to check if order can be placed
  canPlaceOrder = computed(() => {
    return this.cartItems().length > 0 && 
           this.shippingAddress() !== null && 
           this.paymentMethod() !== null;
  });

  placeOrderAction(): void {
    // Additional validation before placing order
    if (!this.canPlaceOrder()) {
      alert('Please ensure you have items in your cart, a shipping address, and a payment method selected.');
      return;
    }

    this.checkoutService.processOrder().subscribe({
      next: (order) => {
        console.log('Order placed successfully:', order);
        // Emit the event to let parent component handle navigation
        this.placeOrder.emit();
      },
      error: (error) => {
        console.error('Failed to place order:', error);
        let errorMessage = 'Failed to place order. Please try again.';
        
        if (error.status === 400) {
          errorMessage = 'Invalid order data. Please check your information and try again.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        alert(errorMessage);
      }
    });
  }

  getPaymentMethodLabel(type: string): string {
    switch (type) {
      case 'credit_card': return 'Credit Card';
      case 'debit_card': return 'Debit Card';
      case 'paypal': return 'PayPal';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
}
