import { Component, EventEmitter, Output, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  @Output() continue = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  private checkout = inject(CheckoutService);
  private fb = inject(FormBuilder);

  methods = this.checkout.paymentMethods;

  showForm = signal(false);
  editingPaymentId = signal<string | null>(null);
  selectedPaymentId = signal<string | null>(null);
  loadingList = signal(false);
  submitting = signal(false);
  attemptedSubmit = signal(false);
  justSavedPayment = signal(false);

  form: FormGroup = this.fb.group({
    type: ['credit_card', Validators.required],
    cardholderName: [''],
    cardNumber: [''],
    expiryMonth: [''],
    expiryYear: [''],
    brand: [''],
    last4: [''],
    email: ['']
  });

  private autoSelectEffect = effect(() => {
    const list = this.methods();
    if (list.length && !this.selectedPaymentId()) {
      this.selectedPaymentId.set(list[0].id || null);
    }
  });

  ngOnInit(): void {
    this.loadMethods();
    this.onTypeChange(); // initialize validators
  }

  loadMethods(): void {
    this.loadingList.set(true);
    this.checkout.refreshPaymentMethods().subscribe({
      next: () => this.loadingList.set(false),
      error: () => this.loadingList.set(false)
    });
  }

  isCard(): boolean {
    const t = this.form.get('type')?.value;
    return t === 'credit_card' || t === 'debit_card';
  }

  onTypeChange(): void {
    const cardControls = ['cardholderName', 'cardNumber', 'expiryMonth', 'expiryYear', 'last4'];
    if (this.isCard()) {
      cardControls.forEach(c => this.form.get(c)?.setValidators([Validators.required]));
      this.form.get('email')?.clearValidators();
    } else {
      cardControls.forEach(c => this.form.get(c)?.clearValidators());
      this.form.get('email')?.setValidators([Validators.required, Validators.email]);
    }
    [...cardControls, 'email'].forEach(c => this.form.get(c)?.updateValueAndValidity());
  }

  startAdd(): void {
    this.editingPaymentId.set(null);
    this.form.reset({
      type: 'credit_card',
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      brand: '',
      last4: '',
      email: ''
    });
    this.onTypeChange();
    this.attemptedSubmit.set(false);
    this.justSavedPayment.set(false);
    this.showForm.set(true);
  }

  startEdit(pm: PaymentMethod): void {
    if (!pm.id) return;
    this.editingPaymentId.set(pm.id);
    this.form.patchValue(pm);
    this.onTypeChange();
    this.attemptedSubmit.set(false);
    this.justSavedPayment.set(false);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingPaymentId.set(null);
    this.attemptedSubmit.set(false);
    this.justSavedPayment.set(false);
    // Emit back event to go to previous step
    this.back.emit();
  }

  submitForm(): void {
    this.attemptedSubmit.set(true);
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    if (this.submitting()) {
      return;
    }
    
    this.submitting.set(true);
    const payload: PaymentMethod = this.form.value;
    if (this.isCard() && payload.cardNumber) {
      payload.last4 = payload.cardNumber.slice(-4);
    }
    const editingId = this.editingPaymentId();
    
    const obs = editingId
      ? this.checkout.updatePaymentMethod(editingId, payload)
      : this.checkout.addPaymentMethod(payload);
    obs?.subscribe({
      next: (saved) => {
        if (saved?.id) {
          this.selectedPaymentId.set(saved.id);
          // Set chosen payment method in checkout state
          this.checkout.setPaymentMethod(saved);
          // Set flag to show continue button
          this.justSavedPayment.set(true);
        }
        this.submitting.set(false);
        this.showForm.set(false);
        this.attemptedSubmit.set(false);
      },
      error: (err) => {
        console.error('[Payment] save error', err);
        this.submitting.set(false);
        this.attemptedSubmit.set(false);
        alert('Failed to save payment method.');
      }
    });
  }

  selectPayment(id: string): void {
    this.selectedPaymentId.set(id);
  }

  removePayment(pm: PaymentMethod): void {
    if (!pm.id) return;
    if (!confirm('Delete this payment method?')) return;
    this.checkout.deletePaymentMethod(pm.id).subscribe({
      next: () => {
        if (this.selectedPaymentId() === pm.id) {
          this.selectedPaymentId.set(null);
          const list = this.methods();
          if (list.length) this.selectedPaymentId.set(list[0].id || null);
        }
      }
    });
  }

  labelForMethod(m: PaymentMethod): string {
    if (m.type === 'paypal') return 'PayPal';
    if (m.type === 'credit_card') return 'Credit Card';
    if (m.type === 'debit_card') return 'Debit Card';
    return m.type;
  }

  useSelectedPayment(): void {
    const pmId = this.selectedPaymentId();
    const pm = this.methods().find(p => p.id === pmId);
    if (pm) {
      console.log('[Payment] useSelectedPayment', pmId);
      this.checkout.setPaymentMethod(pm);
      this.justSavedPayment.set(false); // Reset the flag
      this.continue.emit();
    }
  }

  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    if (!c) return false;
    return this.attemptedSubmit() ? c.invalid : (c.invalid && (c.dirty || c.touched));
  }
}
