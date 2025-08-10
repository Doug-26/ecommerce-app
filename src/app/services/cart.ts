import { computed, effect, Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { CartItem, ServerCartItem } from '../models/cart-item';
import { Product } from '../models/products';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { CartApiService } from './cart-api';
import { ProductService } from './product';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'ecommerce-cart';
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private cartApiService = inject(CartApiService);
  private productService = inject(ProductService);

  private _cartItems = signal<CartItem[]>([]);
  private _isLoading = signal<boolean>(false);

  cartItems = computed(() => this._cartItems());
  totalItems = computed(() => this._cartItems().reduce((t, i) => t + i.quantity, 0));
  cartTotal = computed(() => this._cartItems().reduce((t, i) => t + (i.product.price * i.quantity), 0));
  isLoading = computed(() => this._isLoading());
  cartItemCount = computed(() => this.totalItems());

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadServerCart();
      } else {
        this.loadLocalCart();
      }
    });

    effect(() => {
      const user = this.authService.currentUser();
      if (!user && isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._cartItems()));
      }
    });
  }

  private loadLocalCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const json = localStorage.getItem(this.STORAGE_KEY);
    const items = json ? JSON.parse(json) : [];
    this._cartItems.set(items);
  }

  private loadServerCart(): void {
    this._isLoading.set(true);
    this.cartApiService.load().subscribe({
      next: (serverItems) => this.populateCartItemsWithProducts(serverItems),
      error: () => {
        this._isLoading.set(false);
        this.loadLocalCart();
      }
    });
  }

  private populateCartItemsWithProducts(serverItems: ServerCartItem[]): void {
    const productIds = [...new Set(serverItems.map(i => String(i.productId)))];
    const requests = productIds.map(id => this.productService.getProduct(id)); // <- changed

    forkJoin(requests).subscribe({
      next: (products) => {
        const valid = (products || []).filter(p => !!p) as Product[];
        const cartItems: CartItem[] = serverItems
          .map(si => {
            const p = valid.find(v => String(v.id) === String(si.productId));
            return p ? { product: p, quantity: si.quantity } : null;
          })
          .filter((x): x is CartItem => !!x);

        this._cartItems.set(cartItems);
        this._isLoading.set(false);
      },
      error: () => {
        this._cartItems.set([]);
        this._isLoading.set(false);
      }
    });
  }

  private toServerItems(): ServerCartItem[] {
    return this._cartItems().map(ci => ({
      productId: String(ci.product.id),
      quantity: ci.quantity
    }));
  }

  private saveServerCart(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.cartApiService.save(this.toServerItems()).subscribe({ next: () => {}, error: () => {} });
  }

  addToCart(product: Product): void {
    const items = [...this._cartItems()];
    const idx = items.findIndex(i => String(i.product.id) === String(product.id));
    if (idx > -1) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
    } else {
      items.push({ product, quantity: 1 });
    }
    this._cartItems.set(items);

    if (this.authService.currentUser()) this.saveServerCart();
  }

  removeFromCart(productId: string | number): void {
    const pid = String(productId);
    const items = this._cartItems().filter(i => String(i.product.id) !== pid);
    this._cartItems.set(items);

    if (this.authService.currentUser()) this.saveServerCart();
    else if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  updateQuantity(productId: string | number, quantity: number): void {
    if (quantity <= 0) return this.removeFromCart(productId);

    const pid = String(productId);
    const items = this._cartItems().map(i =>
      String(i.product.id) === pid ? { ...i, quantity } : i
    );
    this._cartItems.set(items);

    if (this.authService.currentUser()) this.saveServerCart();
    else if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  clearCart(): void {
    this._cartItems.set([]);
    if (this.authService.currentUser()) this.saveServerCart(); // saves empty array
    else if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.STORAGE_KEY);
  }

  clearLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.STORAGE_KEY);
  }
}
