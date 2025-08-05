import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
  userId?: number;
}

export interface ServerCartItem {
  id?: string | number; // Allow both string and number IDs
  userId: number;
  productId: number;
  quantity: number;
  product?: Product;
}