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
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
      country: ['Philippines', Validators.required], // Changed default to Philippines
      phone: ['', [Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadSavedAddresses();
    
    // Check if we have existing shipping address
    const existingAddress = this.checkoutService.shippingAddress();
    if (existingAddress) {
      this.shippingForm.patchValue(existingAddress);
      this.showNewAddressForm = true;
    } else {
      this.prefillUserData();
    }
  }

  private loadSavedAddresses(): void {
    this.checkoutService.getUserAddresses().subscribe({
      next: (addresses) => {
        this.savedAddresses = addresses;
        // If no saved addresses, show the form immediately
        if (addresses.length === 0) {
          this.showNewAddressForm = true;
        }
      },
      error: (error) => {
        console.error('Failed to load addresses:', error);
        this.showNewAddressForm = true; // Show form on error
      }
    });
  }

  selectSavedAddress(address: ShippingAddress): void {
    console.log('Selecting address:', address); // Debug log
    
    // Patch the form with the selected address
    this.shippingForm.patchValue({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || ''
    });

    // Update country-specific validation
    this.onCountryChange(address.country);

    // Set the shipping address in the service
    this.checkoutService.setShippingAddress(address);

    // Continue to next step immediately
    this.onContinue.emit();
  }

  private prefillUserData(): void {
    const user = this.authService.currentUser();
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const isPhilippineAddress = user.address?.toLowerCase().includes('philippines') || 
                                 user.address?.toLowerCase().includes('ph');

      this.shippingForm.patchValue({
        firstName,
        lastName,
        phone: user.phone || '',
        address: user.address || '',
        country: isPhilippineAddress ? 'Philippines' : 'Philippines' // Default to Philippines
      });

      // Update validation based on detected country
      this.onCountryChange(isPhilippineAddress ? 'Philippines' : 'Philippines');
    }
  }

  onCountryChange(country: string): void {
    const zipControl = this.shippingForm.get('zipCode');
    const phoneControl = this.shippingForm.get('phone');

    if (country === 'Philippines') {
      zipControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{4}$/)]);
      phoneControl?.setValidators([Validators.pattern(/^(\+63|63|0)?[0-9]{10}$/)]);
    } else if (country === 'United States') {
      zipControl?.setValidators([Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]);
      phoneControl?.setValidators([Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]);
    } else {
      zipControl?.setValidators([Validators.required, Validators.pattern(/^[0-9A-Za-z\s\-]{3,10}$/)]);
      phoneControl?.setValidators([Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/)]);
    }

    zipControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();
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
