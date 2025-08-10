export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'fulfilled'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  // JSON Server generates id; keep optional so creation compiles
  id?: string; // or: string | number

  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  orderDate: string;            // ISO string
  shippingAddress: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | string;
  trackingNumber?: string;
}