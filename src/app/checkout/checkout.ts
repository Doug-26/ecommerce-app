import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../services/checkout';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment';
import { CheckoutReviewComponent } from './checkout-review/checkout-review';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    CheckoutShippingComponent,
    CheckoutPaymentComponent,
    CheckoutReviewComponent
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent {
  private checkoutService = inject(CheckoutService);

  currentStep = this.checkoutService.currentStep;

  onContinueToPayment(): void {
    this.checkoutService.nextStep();
  }

  onContinueToReview(): void {
    this.checkoutService.nextStep();
  }

  onBackToShipping(): void {
    this.checkoutService.previousStep();
  }

  onBackToPayment(): void {
    this.checkoutService.previousStep();
  }

  goToStep(step: number): void {
    if (this.checkoutService.canProceedToStep(step)) {
      this.checkoutService.goToStep(step);
    }
  }
}
