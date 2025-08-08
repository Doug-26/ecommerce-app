import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CheckoutService } from '../services/checkout';
import { CartService } from '../services/cart';
import { AuthService } from '../services/auth.service';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment';
import { CheckoutReviewComponent } from './checkout-review/checkout-review';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CheckoutShippingComponent,
    CheckoutPaymentComponent,
    CheckoutReviewComponent
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent implements OnInit {
  private router = inject(Router);
  
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  currentStep = this.checkoutService.currentStep;
  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  checkoutSummary = this.checkoutService.checkoutSummary;

  ngOnInit(): void {
    // Redirect if not logged in or cart is empty
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.totalItems() === 0) {
      this.router.navigate(['/cart']);
      return;
    }
  }

  goToStep(step: number): void {
    if (this.checkoutService.canProceedToStep(step)) {
      this.checkoutService.goToStep(step);
    }
  }

  nextStep(): void {
    this.checkoutService.nextStep();
  }

  previousStep(): void {
    this.checkoutService.previousStep();
  }
}
