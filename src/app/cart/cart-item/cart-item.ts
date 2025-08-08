import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss'
})
export class CartItemComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  cartTotal = this.cartService.cartTotal;
  isLoading = this.cartService.isLoading;

  updateQuantity(productId: number, newQuantity: number): void {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    console.log('Proceeding to checkout...');
    console.log('Current user:', this.authService.currentUser());
    console.log('Total items:', this.totalItems());
    
    // Check if user is logged in
    if (!this.authService.currentUser()) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }

    // Check if cart has items
    if (this.totalItems() === 0) {
      console.log('Cart is empty');
      alert('Your cart is empty. Add some items before proceeding to checkout.');
      return;
    }

    // Navigate to checkout
    console.log('Navigating to checkout');
    this.router.navigate(['/checkout']).then(
      (success) => console.log('Navigation success:', success),
      (error) => console.error('Navigation error:', error)
    );
  }
}
