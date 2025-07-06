import { computed, effect, Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/products';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'ecommerce-cart';
  private platformId = inject(PLATFORM_ID);

  // Initialize signal from localStorage
  private _cartItems = signal<CartItem[]>(this.loadCartItems());
  // Computed property to get the cart items
  // This will automatically update when _cartItems changes
  cartItems = computed(() => this._cartItems());
  // Computed property to get the total items in the cart
  // This will automatically update when _cartItems changes
  totalItems = computed(() => this._cartItems().reduce((total, item) => total + item.quantity, 0));

  constructor() {
    // Effect 
    effect(() => {
      // Whenever cartItems changes, save it to localStorage (only in browser)
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._cartItems()));
      }
    });
  }

  private loadCartItems(): CartItem[] {
    if (isPlatformBrowser(this.platformId)) {
      const cartItemsJson = localStorage.getItem(this.STORAGE_KEY);
      return cartItemsJson ? JSON.parse(cartItemsJson) : [];
    }
    return [];
  }

  addToCart(product: Product): void {
    // Check if the product is already in the cart
    const item = this.cartItems();
    // Find the index of the product in the cart
    const index = item.findIndex(cartItem => cartItem.product.id === product.id);

    if (index > -1) {
      // If the product is already in the cart, increase the quantity
      item[index].quantity++;
    } else {
      // If the product is not in the cart, add it with quantity 1
      item.push({ product, quantity: 1 });
    }
    // Update the cart items signal with a new array to trigger change detection
    this._cartItems.set([...item]); // Create a new array to trigger change detection
  }

  clearCart(): void {
    // Clear the cart items signal
    this._cartItems.set([]);
  }

  removeFromCart(productId: number): void {
    // Filter out the product with the given ID
    const updatedItems = this.cartItems().filter(item => item.product.id !== productId);
    // Update the cart items signal with the filtered array
    this._cartItems.set(updatedItems);
  }
}
