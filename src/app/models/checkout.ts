export interface ShippingAddress {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  id?: string;
  userId?: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | string;
  cardholderName?: string;
  cardNumber?: string;
  expiryMonth?: number | string;
  expiryYear?: number | string;
  provider?: string;
  email?: string; // for PayPal etc.
  last4?: string;
  brand?: string;
}

export interface CheckoutSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  summary: CheckoutSummary;
  orderNotes?: string;
}