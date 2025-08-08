import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
    const user = this.authService.currentUser();
    if (!user) return new Observable(observer => observer.next([]));
    
    return this.http.get<ShippingAddress[]>(`${this.apiUrl}/addresses?userId=${user.id}`);
  }

  saveAddress(address: ShippingAddress): Observable<ShippingAddress> {
    const user = this.authService.currentUser();
    const addressWithUser = { ...address, userId: user?.id };
    return this.http.post<ShippingAddress>(`${this.apiUrl}/addresses`, addressWithUser);
  }

  // Payment management
  setPaymentMethod(payment: PaymentMethod): void {
    this._paymentMethod.set(payment);
  }

  getUserPaymentMethods(): Observable<PaymentMethod[]> {
    const user = this.authService.currentUser();
    if (!user) return new Observable(observer => observer.next([]));
    
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/payment-methods?userId=${user.id}`);
  }

  savePaymentMethod(payment: PaymentMethod): Observable<PaymentMethod> {
    const user = this.authService.currentUser();
    const paymentWithUser = { ...payment, userId: user?.id };
    return this.http.post<PaymentMethod>(`${this.apiUrl}/payment-methods`, paymentWithUser);
  }

  // Order processing
  processOrder(): Observable<Order> {
    this._isProcessing.set(true);
    
    const user = this.authService.currentUser();
    const cartItems = this.cartService.cartItems();
    const summary = this.checkoutSummary();
    const shippingAddr = this._shippingAddress();
    const payment = this._paymentMethod();

    if (!user || !shippingAddr || !payment || cartItems.length === 0) {
      throw new Error('Missing required checkout information');
    }

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      imageUrl: item.product.imageUrl
    }));

    const newOrder: Omit<Order, 'id'> = {
      userId: Number(user.id),
      items: orderItems,
      total: summary.total,
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      tax: summary.tax,
      status: 'pending',
      orderDate: new Date().toISOString(),
      shippingAddress: `${shippingAddr.address}, ${shippingAddr.city}, ${shippingAddr.state} ${shippingAddr.zipCode}`,
      paymentMethod: payment.type,
      trackingNumber: this.generateTrackingNumber()
    };

    return this.http.post<Order>(`${this.apiUrl}/orders`, newOrder).pipe(
      map(order => {
        // Clear cart after successful order
        this.cartService.clearCart();
        this._isProcessing.set(false);
        this.resetCheckout();
        return order;
      })
    );
  }

  private generateTrackingNumber(): string {
    return 'TN' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
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
