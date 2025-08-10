import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss'
})
export class CartItemComponent {
  private cart = inject(CartService);
  private router = inject(Router);

  // expose signals used by the template
  cartItems = this.cart.cartItems;
  totalItems = this.cart.totalItems;
  cartTotal = this.cart.cartTotal;
  isLoading = this.cart.isLoading;

  // template event handlers
  updateQuantity(productId: string | number, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }

  removeItem(productId: string | number): void {
    this.cart.removeFromCart(productId);
  }

  clearCart(): void {
    this.cart.clearCart();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
