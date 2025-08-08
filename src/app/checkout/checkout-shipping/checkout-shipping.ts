import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from '../../services/checkout';
import { AuthService } from '../../services/auth.service';
import { ShippingAddress } from '../../models/checkout';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-shipping.html',
  styleUrl: './checkout-shipping.scss'
})
export class CheckoutShippingComponent implements OnInit {
  @Output() onContinue = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private checkoutService = inject(CheckoutService);
  private authService = inject(AuthService);

  shippingForm: FormGroup;
  isLoading = false;
  showNewAddressForm = false;
  savedAddresses: ShippingAddress[] = [];

  constructor() {
    this.shippingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      // Updated ZIP code pattern to support international formats
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
      country: ['United States', Validators.required],
      // Updated phone pattern to support international formats
      phone: ['', [Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadSavedAddresses();
    this.prefillUserData();
  }

  // Update the prefill method to set Philippines as default for Philippine addresses
  private prefillUserData(): void {
    const user = this.authService.currentUser();
    if (user) {
      // Extract name parts
      const nameParts = user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Check if user address suggests Philippines
      const isPhilippineAddress = user.address?.toLowerCase().includes('philippines') || 
                                 user.address?.toLowerCase().includes('ph');

      this.shippingForm.patchValue({
        firstName,
        lastName,
        phone: user.phone || '',
        address: user.address || '',
        country: isPhilippineAddress ? 'Philippines' : 'United States'
      });
    }
  }

  // Add method to update validation based on country
  onCountryChange(country: string): void {
    const zipControl = this.shippingForm.get('zipCode');
    const phoneControl = this.shippingForm.get('phone');

    if (country === 'Philippines') {
      // Philippine ZIP codes are 4 digits
      zipControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{4}$/)]);
      // Philippine phone numbers (various formats)
      phoneControl?.setValidators([Validators.pattern(/^(\+63|63|0)?[0-9]{10}$/)]);
    } else if (country === 'United States') {
      // US ZIP codes
      zipControl?.setValidators([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]);
      // US phone numbers
      phoneControl?.setValidators([Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]);
    } else {
      // International formats
      zipControl?.setValidators([Validators.required, Validators.pattern(/^[0-9A-Za-z\s\-]{3,10}$/)]);
      phoneControl?.setValidators([Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/)]);
    }

    zipControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();
  }

  private loadSavedAddresses(): void {
    this.checkoutService.getUserAddresses().subscribe({
      next: (addresses) => this.savedAddresses = addresses,
      error: (error) => console.error('Failed to load addresses:', error)
    });
  }

  selectSavedAddress(address: ShippingAddress): void {
    this.shippingForm.patchValue(address);
    this.showNewAddressForm = false;
  }

  onSubmit(): void {
    if (this.shippingForm.valid) {
      this.isLoading = true;
      const shippingData: ShippingAddress = this.shippingForm.value;
      
      this.checkoutService.setShippingAddress(shippingData);
      
      // Save the address for future use
      this.checkoutService.saveAddress(shippingData).subscribe({
        next: () => {
          this.isLoading = false;
          this.onContinue.emit();
        },
        error: (error) => {
          console.error('Failed to save address:', error);
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
    Object.keys(this.shippingForm.controls).forEach(key => {
      const control = this.shippingForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.shippingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.shippingForm.get(fieldName);
    const country = this.shippingForm.get('country')?.value;
    
    if (field?.errors) {
      if (field.errors['required']) return `${this.formatFieldName(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.formatFieldName(fieldName)} is too short`;
      if (field.errors['pattern']) {
        if (fieldName === 'zipCode') {
          if (country === 'Philippines') return 'Philippine ZIP codes must be 4 digits (e.g., 4400)';
          if (country === 'United States') return 'US ZIP codes must be 5 digits (e.g., 12345 or 12345-6789)';
          return 'Invalid ZIP code format';
        }
        if (fieldName === 'phone') {
          if (country === 'Philippines') return 'Philippine phone numbers (e.g., 09516909596 or +639516909596)';
          if (country === 'United States') return 'US phone numbers (e.g., (555) 123-4567)';
          return 'Invalid phone number format';
        }
        return `Invalid ${this.formatFieldName(fieldName)} format`;
      }
    }
    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
  }

  // Add this method to your component:
  getPhonePlaceholder(): string {
    const country = this.shippingForm.get('country')?.value;
    switch (country) {
      case 'Philippines': return '09516909596 or +639516909596';
      case 'United States': return '(555) 123-4567';
      case 'Canada': return '+1 (555) 123-4567';
      default: return 'Enter phone number';
    }
  }
}
