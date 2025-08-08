export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  subtotal: number;      // Add this
  shipping: number;      // Add this
  tax: number;          // Add this
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
  paymentMethod?: string;    // Add this
  trackingNumber?: string;   // Add this
}