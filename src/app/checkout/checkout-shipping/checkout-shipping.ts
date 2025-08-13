import { Component, EventEmitter, Output, OnInit, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CheckoutService } from '../../services/checkout';
import { ShippingAddress } from '../../models/checkout';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-shipping.html',
  styleUrl: './checkout-shipping.scss'
})
export class CheckoutShippingComponent implements OnInit {
  @Output() onContinue = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private checkout = inject(CheckoutService);
  private auth = inject(AuthService);

  addresses = this.checkout.addresses;
  isLoggedIn = computed(() => !!this.auth.currentUser());

  showForm = signal(false);
  editingAddressId = signal<string | null>(null);
  selectedAddressId = signal<string | null>(null);
  loadingList = signal(false);
  loadError = signal('');
  submitting = signal(false);
  attemptedSubmit = signal(false);
  justSavedAddress = signal(false);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
    country: ['Philippines', Validators.required],
    phone: ['']
  });

  // Auto-select only (do NOT flip showForm)
  private autoSelectEffect = effect(() => {
    const list = this.addresses();
    if (list.length && !this.selectedAddressId()) {
      this.selectedAddressId.set(list[0].id || null);
    }
  });

  ngOnInit(): void {
    this.fetchAddresses();
  }

  fetchAddresses(): void {
    console.log('[Shipping] fetchAddresses');
    this.loadingList.set(true);
    this.loadError.set('');
    this.checkout.refreshAddresses().subscribe({
      next: list => {
        console.log('[Shipping] loaded', list);
        this.loadingList.set(false);
        // If none loaded, keep showForm false so empty-state shows
        if (!list.length) {
          this.showForm.set(false); // show empty state
          this.selectedAddressId.set(null);
        }
      },
      error: err => {
        console.error('[Shipping] load error', err);
        this.loadingList.set(false);
        this.loadError.set('Failed to load addresses.');
      }
    });
  }

  // UI actions
  startAdd(): void {
    console.log('[Shipping] startAdd');
    if (!this.isLoggedIn()) {
      alert('Please log in to add an address.');
      return;
    }
    this.editingAddressId.set(null);
    this.form.reset({
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Philippines',
      phone: ''
    });
    this.attemptedSubmit.set(false);
    this.justSavedAddress.set(false);
    this.showForm.set(true);
  }

  startEdit(addr: ShippingAddress): void {
    if (!addr.id) return;
    console.log('[Shipping] startEdit', addr.id);
    this.editingAddressId.set(addr.id);
    this.form.patchValue(addr);
    this.attemptedSubmit.set(false);
    this.justSavedAddress.set(false);
    this.showForm.set(true);
  }

  cancelForm(): void {
    console.log('[Shipping] cancelForm');
    this.showForm.set(false);
    this.editingAddressId.set(null);
    this.submitting.set(false);
    this.justSavedAddress.set(false);
    // Emit back event to go to previous step
    this.back.emit();
  }

  selectAddress(id: string): void {
    console.log('[Shipping] selectAddress', id);
    this.selectedAddressId.set(id);
  }

  submitForm(): void {
    this.attemptedSubmit.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.isLoggedIn()) {
      alert('Please log in before saving an address.');
      return;
    }

    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    const payload: ShippingAddress = this.form.value;
    const editingId = this.editingAddressId();

    const obs = editingId
      ? this.checkout.updateAddress(editingId, payload)
      : this.checkout.addAddress(payload);

    obs.subscribe({
      next: saved => {
        if (saved?.id) {
          this.selectedAddressId.set(saved.id);
          // set chosen shipping address in checkout state
          this.checkout.setShippingAddress(saved);
          // Set flag to show continue button
          this.justSavedAddress.set(true);
        }
        this.submitting.set(false);
        this.showForm.set(false);
      },
      error: err => {
        console.error('[Shipping] save error', err);
        this.submitting.set(false);
        alert('Failed to save address.');
      }
    });
  }

  removeAddress(addr: ShippingAddress): void {
    if (!addr.id) return;
    if (!confirm('Delete this address?')) return;
    console.log('[Shipping] removeAddress', addr.id);
    this.checkout.deleteAddress(addr.id).subscribe({
      next: () => {
        if (this.selectedAddressId() === addr.id) {
          this.selectedAddressId.set(null);
          const list = this.addresses();
          if (list.length) this.selectedAddressId.set(list[0].id || null);
        }
      },
      error: err => console.error('[Shipping] delete error', err)
    });
  }

  useSelectedAddress(): void {
    const id = this.selectedAddressId();
    const found = this.addresses().find(a => a.id === id);
    if (found) {
      console.log('[Shipping] useSelectedAddress', id);
      this.checkout.setShippingAddress(found);
      this.justSavedAddress.set(false); // Reset the flag
      this.onContinue.emit();
    }
  }

  resetJustSavedFlag(): void {
    this.justSavedAddress.set(false);
  }

  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    if (!c) return false;
    return this.attemptedSubmit() ? c.invalid : (c.invalid && (c.dirty || c.touched));
  }
}
