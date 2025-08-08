import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from '../../services/checkout';
import { PaymentMethod } from '../../models/checkout';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.scss'
})
export class CheckoutPaymentComponent implements OnInit {
  @Output() onContinue = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private checkoutService = inject(CheckoutService);

  paymentForm: FormGroup;
  isLoading = false;
  selectedPaymentType: 'credit_card' | 'debit_card' | 'paypal' = 'credit_card';
  savedPaymentMethods: PaymentMethod[] = [];

  constructor() {
    this.paymentForm = this.fb.group({
      type: ['credit_card', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.min(2024)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardholderName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadSavedPaymentMethods();
  }

  private loadSavedPaymentMethods(): void {
    this.checkoutService.getUserPaymentMethods().subscribe({
      next: (methods) => this.savedPaymentMethods = methods,
      error: (error) => console.error('Failed to load payment methods:', error)
    });
  }

  onPaymentTypeChange(type: 'credit_card' | 'debit_card' | 'paypal'): void {
    this.selectedPaymentType = type;
    this.paymentForm.patchValue({ type });
    
    if (type === 'paypal') {
      // Disable card fields for PayPal
      this.paymentForm.get('cardNumber')?.disable();
      this.paymentForm.get('expiryMonth')?.disable();
      this.paymentForm.get('expiryYear')?.disable();
      this.paymentForm.get('cvv')?.disable();
      this.paymentForm.get('cardholderName')?.disable();
    } else {
      // Enable card fields for card payments
      this.paymentForm.get('cardNumber')?.enable();
      this.paymentForm.get('expiryMonth')?.enable();
      this.paymentForm.get('expiryYear')?.enable();
      this.paymentForm.get('cvv')?.enable();
      this.paymentForm.get('cardholderName')?.enable();
    }
  }

  selectSavedPayment(payment: PaymentMethod): void {
    this.paymentForm.patchValue({
      type: payment.type,
      cardNumber: payment.cardNumber,
      expiryMonth: payment.expiryMonth,
      expiryYear: payment.expiryYear,
      cardholderName: payment.cardholderName
    });
    this.selectedPaymentType = payment.type;
  }

  onSubmit(): void {
    if (this.selectedPaymentType === 'paypal' || this.paymentForm.valid) {
      this.isLoading = true;
      
      const paymentData: PaymentMethod = this.selectedPaymentType === 'paypal' 
        ? { type: 'paypal' }
        : this.paymentForm.value;
      
      this.checkoutService.setPaymentMethod(paymentData);
      
      // Optionally save payment method
      this.checkoutService.savePaymentMethod(paymentData).subscribe({
        next: () => {
          this.isLoading = false;
          this.onContinue.emit();
        },
        error: (error) => {
          console.error('Failed to save payment method:', error);
          this.isLoading = false;
          // Still continue even if save fails
          this.onContinue.emit();
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      if (control?.enabled) {
        control.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && field.touched && field.enabled);
  }

  getFieldError(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.formatFieldName(fieldName)} is required`;
      if (field.errors['pattern']) return `Invalid ${this.formatFieldName(fieldName)} format`;
      if (field.errors['minlength']) return `${this.formatFieldName(fieldName)} is too short`;
      if (field.errors['min'] || field.errors['max']) return `Invalid ${this.formatFieldName(fieldName)}`;
    }
    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
  }

  maskCardNumber(value: string): string {
    if (!value) return '';
    return '**** **** **** ' + value.slice(-4);
  }

  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  }
}
