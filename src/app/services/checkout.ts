import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

import { ShippingAddress, PaymentMethod, CheckoutSummary } from '../models/checkout';
import { CartService } from './cart';
import { AuthService } from './auth.service';
import { Order, OrderItem } from '../models/order';
import { environment } from '../app.config';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private cartService = inject(CartService);
  private apiUrl = environment.apiUrl;

  // Internal state signals
  private _currentStep = signal(1);               // 1 Shipping, 2 Payment, 3 Review, 4 Success
  private _shippingAddress = signal<ShippingAddress | null>(null);
  private _paymentMethod = signal<PaymentMethod | null>(null);
  private _isProcessing = signal(false);
  private _lastOrder = signal<Order | null>(null);

  // Collections (cached)
  private _addresses = signal<ShippingAddress[]>([]);
  private _paymentMethods = signal<PaymentMethod[]>([]);

  // Public read signals
  currentStep = computed(() => this._currentStep());
  shippingAddress = computed(() => this._shippingAddress());
  paymentMethod = computed(() => this._paymentMethod());
  isProcessing = computed(() => this._isProcessing());
  lastOrder = computed(() => this._lastOrder());

  addresses = computed(() => this._addresses());
  paymentMethods = computed(() => this._paymentMethods());

  // Summary derived from cart
  checkoutSummary = computed<CheckoutSummary>(() => {
    const subtotal = this.cartService.cartTotal();
    const itemCount = this.cartService.totalItems();
    const shipping = this.calculateShipping(subtotal);
    const tax = this.calculateTax(subtotal);
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total, itemCount };
  });

  // ---- Navigation ----
  nextStep(): void {
    const current = this._currentStep();
    console.log('[CheckoutService] nextStep called from:', new Error().stack);
    console.log('[CheckoutService] Current step before:', current);
    
    if (current < 4) {
      this._currentStep.set(current + 1);
      console.log('[CheckoutService] Advanced to step:', this._currentStep());
    }
  }
  previousStep(): void {
    if (this._currentStep() > 1) this._currentStep.set(this._currentStep() - 1);
  }
  goToStep(step: number): void {
    console.log('[CheckoutService] goToStep:', step);
    if (step >= 1 && step <= 4) {
      this._currentStep.set(step);
      console.log('[CheckoutService] Set to step:', this._currentStep());
    }
  }

  canProceedToStep(step: number): boolean {
    switch (step) {
      case 2: return this.cartService.totalItems() > 0;
      case 3: return !!this._shippingAddress();
      case 4: return !!this._shippingAddress() && !!this._paymentMethod();
      default: return true;
    }
  }

  // ---- Setters ----
  setShippingAddress(address: ShippingAddress): void {
    this._shippingAddress.set(address);
  }
  setPaymentMethod(payment: PaymentMethod): void {
    this._paymentMethod.set(payment);
  }

  // ---- Address CRUD ----
  refreshAddresses(): Observable<ShippingAddress[]> {
    const uid = this.auth.currentUser()?.id?.toString();
    if (!uid) {
      this._addresses.set([]);
      return of([]);
    }
    return this.http
      .get<ShippingAddress[]>(`${this.apiUrl}/addresses?userId=${encodeURIComponent(uid)}`)
      .pipe(
        map(list => {
          this._addresses.set(list);
          return list;
        })
      );
  }

  addAddress(addr: ShippingAddress): Observable<ShippingAddress | null> {
    const uid = this.auth.currentUser()?.id?.toString();
    if (!uid) {
      return of(null);
    }
    const payload = { ...addr, userId: uid };
    return this.http.post<ShippingAddress>(`${this.apiUrl}/addresses`, payload).pipe(
      map(created => {
        this._addresses.set([...this._addresses(), created]);
        return created;
      })
    );
  }

  updateAddress(id: string, addr: ShippingAddress): Observable<ShippingAddress | null> {
    if (!id) return of(null);
    return this.http.patch<ShippingAddress>(`${this.apiUrl}/addresses/${id}`, addr).pipe(
      map(updated => {
        this._addresses.set(this._addresses().map(a => a.id === id ? updated : a));
        if (this._shippingAddress()?.id === id) this._shippingAddress.set(updated);
        return updated;
      })
    );
  }

  deleteAddress(id: string): Observable<boolean> {
    if (!id) return of(false);
    return this.http.delete(`${this.apiUrl}/addresses/${id}`).pipe(
      map(() => {
        this._addresses.set(this._addresses().filter(a => a.id !== id));
        if (this._shippingAddress()?.id === id) this._shippingAddress.set(null);
        return true;
      })
    );
  }

  // (Optional legacy accessors)
  getUserAddresses(): Observable<ShippingAddress[]> {
    return this.refreshAddresses();
  }

  // ---- Payment Method CRUD ----
  refreshPaymentMethods(): Observable<PaymentMethod[]> {
    const uid = this.auth.currentUser()?.id?.toString();
    if (!uid) {
      this._paymentMethods.set([]);
      return of([]);
    }
    return this.http
      .get<PaymentMethod[]>(`${this.apiUrl}/payment-methods?userId=${encodeURIComponent(uid)}`)
      .pipe(
        map(list => {
          this._paymentMethods.set(list);
            return list;
        })
      );
  }

  addPaymentMethod(pm: PaymentMethod): Observable<PaymentMethod | null> {
    const uid = this.auth.currentUser()?.id?.toString();
    if (!uid) return of(null);
    const payload = { ...pm, userId: uid };
    return this.http.post<PaymentMethod>(`${this.apiUrl}/payment-methods`, payload).pipe(
      map(created => {
        this._paymentMethods.set([...this._paymentMethods(), created]);
        return created;
      })
    );
  }

  updatePaymentMethod(id: string, pm: PaymentMethod): Observable<PaymentMethod | null> {
    if (!id) return of(null);
    return this.http.patch<PaymentMethod>(`${this.apiUrl}/payment-methods/${id}`, pm).pipe(
      map(updated => {
        this._paymentMethods.set(
          this._paymentMethods().map(p => (p.id === id ? updated : p))
        );
        if (this._paymentMethod()?.id === id) this._paymentMethod.set(updated);
        return updated;
      })
    );
  }

  deletePaymentMethod(id: string): Observable<boolean> {
    if (!id) return of(false);
    return this.http.delete(`${this.apiUrl}/payment-methods/${id}`).pipe(
      map(() => {
        this._paymentMethods.set(this._paymentMethods().filter(p => p.id !== id));
        if (this._paymentMethod()?.id === id) this._paymentMethod.set(null);
        return true;
      })
    );
  }

  getUserPaymentMethods(): Observable<PaymentMethod[]> {
    return this.refreshPaymentMethods();
  }

  // ---- Order Processing ----
  processOrder(): Observable<Order> {
    this._isProcessing.set(true);

    const userId = this.auth.currentUser()?.id?.toString() ?? '';
    const shippingAddr = this._shippingAddress();
    const payment = this._paymentMethod();
    const cartItems = this.cartService.cartItems();

    // Enhanced validation
    if (!userId) {
      this._isProcessing.set(false);
      throw new Error('User not logged in');
    }

    if (!shippingAddr) {
      this._isProcessing.set(false);
      throw new Error('Shipping address not selected');
    }

    if (!payment) {
      this._isProcessing.set(false);
      throw new Error('Payment method not selected');
    }

    if (cartItems.length === 0) {
      this._isProcessing.set(false);
      throw new Error('Cart is empty');
    }

    const summary = this.checkoutSummary();
    const orderItems: OrderItem[] = cartItems.map(ci => ({
      productId: ci.product.id,
      productName: ci.product.name,
      quantity: ci.quantity,
      price: ci.product.price,
      imageUrl: ci.product.imageUrl
    }));

    const round2 = (n: number) => Math.round(n * 100) / 100;

    const newOrder: Omit<Order, 'id'> = {
      userId,
      items: orderItems,
      subtotal: round2(summary.subtotal),
      shipping: round2(summary.shipping),
      tax: round2(summary.tax),
      total: round2(summary.total),
      status: 'pending',
      orderDate: new Date().toISOString(),
      shippingAddress: `${shippingAddr.address}, ${shippingAddr.city}, ${shippingAddr.country} ${shippingAddr.zipCode}`,
      paymentMethod: payment.type,
      trackingNumber: this.generateTrackingNumber()
    };

    console.log('[CheckoutService] Processing order:', newOrder);

    return this.http.post<Order>(`${this.apiUrl}/orders`, newOrder).pipe(
      map(order => {
        console.log('[CheckoutService] Order processed successfully:', order);
        this.cartService.clearCart();
        this._isProcessing.set(false);
        this._lastOrder.set(order); // Store the last order
        return order;
      }),
      catchError(error => {
        console.error('[CheckoutService] Order processing failed:', error);
        this._isProcessing.set(false);
        throw error;
      })
    );
  }

  // ---- Utilities ----
  loadUserData(): void {
    // Kick off (don't subscribe here if caller wants the data; fire & forget is fine)
    this.refreshAddresses().subscribe();
    this.refreshPaymentMethods().subscribe();
  }

  resetCheckoutState(): void {
    this._currentStep.set(1);
    this._shippingAddress.set(null);
    this._paymentMethod.set(null);
    this._lastOrder.set(null);
  }

  private calculateShipping(subtotal: number): number {
    return subtotal >= 100 ? 0 : 9.99;
  }

  private calculateTax(subtotal: number): number {
    return subtotal * 0.085;
  }

  private generateTrackingNumber(): string {
    return 'TN' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  private resetCheckout(): void {
    this._currentStep.set(1);
    this._shippingAddress.set(null);
    this._paymentMethod.set(null);
  }
}
