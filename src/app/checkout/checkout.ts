import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutService } from '../services/checkout';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment';
import { CheckoutReviewComponent } from './checkout-review/checkout-review';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    CheckoutShippingComponent,
    CheckoutPaymentComponent,
    CheckoutReviewComponent,
    CheckoutSuccessComponent
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent {
  private router = inject(Router);
  checkoutService = inject(CheckoutService);
  
  currentStep = this.checkoutService.currentStep;

  constructor() {
    console.log('[Checkout] Component initialized');
    // Force reset to step 1
    this.checkoutService.goToStep(1);
    this.checkoutService.loadUserData();
  }

  onShippingComplete() {
    const current = this.currentStep();
    console.log('[Checkout] onShippingComplete called, current step:', current);
    
    // Prevent multiple calls
    if (current !== 1) {
      console.log('[Checkout] Ignoring shipping complete - not on step 1');
      return;
    }
    
    // Verify shipping address is set
    const shippingAddr = this.checkoutService.shippingAddress();
    if (!shippingAddr) {
      console.log('[Checkout] No shipping address set, cannot proceed');
      return;
    }
    
    console.log('[Checkout] Advancing from shipping to payment');
    this.checkoutService.nextStep();
    console.log('[Checkout] New step:', this.currentStep());
  }

  onShippingBack() {
    console.log('[Checkout] Shipping back - going to cart');
    // Navigate back to cart since shipping is the first step
    this.router.navigate(['/cart']);
  }

  onPaymentComplete() {
    const current = this.currentStep();
    console.log('[Checkout] onPaymentComplete called, current step:', current);
    
    if (current !== 2) {
      console.log('[Checkout] Ignoring payment complete - not on step 2');
      return;
    }
    
    // Verify payment method is set
    const paymentMethod = this.checkoutService.paymentMethod();
    if (!paymentMethod) {
      console.log('[Checkout] No payment method set, cannot proceed');
      return;
    }
    
    console.log('[Checkout] Advancing from payment to review');
    this.checkoutService.nextStep();
    console.log('[Checkout] New step:', this.currentStep());
  }

  onPaymentBack() {
    console.log('[Checkout] Payment back - going to shipping');
    this.checkoutService.goToStep(1);
  }

  onReviewBack() {
    console.log('[Checkout] Review back - going to payment');
    this.checkoutService.goToStep(2);
  }

  onOrderComplete() {
    console.log('[Checkout] Order complete - going to success');
    this.checkoutService.nextStep();
  }
}
