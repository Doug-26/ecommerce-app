import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ShippingAddress, PaymentMethod, CheckoutSummary, CheckoutData } from '../models/checkout';
import { CartService } from './cart';
import { AuthService } from './auth.service';
import { Order, OrderItem } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000';

  // Checkout state signals
  private _currentStep = signal<number>(1);
  private _shippingAddress = signal<ShippingAddress | null>(null);
  private _paymentMethod = signal<PaymentMethod | null>(null);
  private _isProcessing = signal<boolean>(false);

  // Computed properties
  currentStep = computed(() => this._currentStep());
  shippingAddress = computed(() => this._shippingAddress());
  paymentMethod = computed(() => this._paymentMethod());
  isProcessing = computed(() => this._isProcessing());

  // Checkout summary computed from cart
  checkoutSummary = computed((): CheckoutSummary => {
    const cartTotal = this.cartService.cartTotal();
    const itemCount = this.cartService.totalItems();
    const subtotal = cartTotal;
    const shipping = this.calculateShipping(subtotal);
    const tax = this.calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount
    };
  });

  private calculateShipping(subtotal: number): number {
    // Free shipping over $100
    return subtotal >= 100 ? 0 : 9.99;
  }

  private calculateTax(subtotal: number): number {
    // 8.5% tax rate
    return subtotal * 0.085;
  }

  // Step navigation
  nextStep(): void {
    const current = this._currentStep();
    if (current < 4) {
      this._currentStep.set(current + 1);
    }
  }

  previousStep(): void {
    const current = this._currentStep();
    if (current > 1) {
      this._currentStep.set(current - 1);
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 4) {
      this._currentStep.set(step);
    }
  }

  // Address management
  setShippingAddress(address: ShippingAddress): void {
    this._shippingAddress.set(address);
  }

  getUserAddresses(): Observable<ShippingAddress[]> {
    const id = this.authService.currentUser()?.id;
    if (!id) return of([]);
    return this.http.get<ShippingAddress[]>(`${this.apiUrl}/addresses?userId=${id.toString()}`);
  }

  getUserPaymentMethods(): Observable<PaymentMethod[]> {
    const id = this.authService.currentUser()?.id;
    if (!id) return of([]);
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/payment-methods?userId=${id.toString()}`);
  }

  // Payment management
  setPaymentMethod(payment: PaymentMethod): void {
    this._paymentMethod.set(payment);
  }

  saveAddress(address: ShippingAddress): Observable<ShippingAddress> {
    const user = this.authService.currentUser();
    const addressWithUser = { ...address, userId: user?.id };
    return this.http.post<ShippingAddress>(`${this.apiUrl}/addresses`, addressWithUser);
  }

  savePaymentMethod(payment: PaymentMethod): Observable<PaymentMethod> {
    const user = this.authService.currentUser();
    const paymentWithUser = { ...payment, userId: user?.id };
    return this.http.post<PaymentMethod>(`${this.apiUrl}/payment-methods`, paymentWithUser);
  }

  // Order processing
  processOrder(): Observable<Order> {
    this._isProcessing.set(true);

    const userId = this.authService.currentUser()?.id?.toString() ?? '';
    const cartItems = this.cartService.cartItems();
    const summary = this.checkoutSummary();
    const shippingAddr = this._shippingAddress();
    const payment = this._paymentMethod();

    if (!userId || !shippingAddr || !payment || cartItems.length === 0) {
      this._isProcessing.set(false);
      throw new Error('Missing required checkout information');
    }

    const orderItems: OrderItem[] = cartItems.map(i => ({
      productId: i.product.id,
      productName: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
      imageUrl: i.product.imageUrl
    }));

    const r2 = (n: number) => Math.round(n * 100) / 100;

    const newOrder: Order = {
      userId,
      items: orderItems,
      subtotal: r2(summary.subtotal),
      shipping: r2(summary.shipping),
      tax: r2(summary.tax),
      total: r2(summary.total),
      status: 'pending',
      orderDate: new Date().toISOString(),
      shippingAddress: `${shippingAddr.address}, ${shippingAddr.city}, ${shippingAddr.country} ${shippingAddr.zipCode}`,
      paymentMethod: payment.type,
      trackingNumber: this.generateTrackingNumber()
    };

    return this.http.post<Order>(`${this.apiUrl}/orders`, newOrder).pipe(
      map(order => {
        this.cartService.clearCart();
        this._isProcessing.set(false);
        this.resetCheckout();
        return order;
      })
    );
  }

  private generateTrackingNumber(): string {
    return 'TN' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  private resetCheckout(): void {
    this._currentStep.set(1);
    this._shippingAddress.set(null);
    this._paymentMethod.set(null);
  }

  // Validation helpers
  canProceedToStep(step: number): boolean {
    switch (step) {
      case 2: return this.cartService.totalItems() > 0;
      case 3: return !!this._shippingAddress();
      case 4: return !!this._shippingAddress() && !!this._paymentMethod();
      default: return true;
    }
  }
}
