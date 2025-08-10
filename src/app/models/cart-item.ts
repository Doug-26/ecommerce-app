// Define both client-side and server-side cart item shapes
import { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

// Items stored in JSON Server (inside a user's cart document)
export interface ServerCartItem {
  productId: string;
  quantity: number;
}