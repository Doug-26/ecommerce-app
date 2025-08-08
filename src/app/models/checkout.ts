export interface ShippingAddress {
  id?: number;
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
  id?: number;
  type: 'credit_card' | 'debit_card' | 'paypal';
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  cardholderName?: string;
  isDefault?: boolean;
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