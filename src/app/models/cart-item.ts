import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
  userId?: number; // Add userId for server-side storage
}

export interface ServerCartItem {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: Product; // Optional for populated responses
}