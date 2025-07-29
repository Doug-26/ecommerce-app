import { computed, effect, Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { CartItem, ServerCartItem } from '../models/cart-item';
import { Product } from '../models/products';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { CartApiService } from './cart-api';
import { ProductService } from './product';
import { forkJoin, of, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'ecommerce-cart';
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private cartApiService = inject(CartApiService);
  private productService = inject(ProductService);

  // Initialize signals
  private _cartItems = signal<CartItem[]>([]);
  private _isLoading = signal<boolean>(false);
  
  // Computed properties
  cartItems = computed(() => this._cartItems());
  totalItems = computed(() => this._cartItems().reduce((total, item) => total + item.quantity, 0));
  cartTotal = computed(() => 
    this._cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );
  isLoading = computed(() => this._isLoading());

  constructor() {
    // Effect to handle user login/logout
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        console.log('User logged in, loading server cart for user:', user.id);
        this.loadServerCart(user.id!);
      } else {
        console.log('User logged out, loading local cart');
        this.loadLocalCart();
      }
    });

    // Save to localStorage only when user is not logged in
    effect(() => {
      const cartItems = this._cartItems();
      const user = this.authService.currentUser();
      
      if (!user && isPlatformBrowser(this.platformId)) {
        console.log('Saving cart to localStorage:', cartItems);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartItems));
      }
    });
  }

  private loadLocalCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartItemsJson = localStorage.getItem(this.STORAGE_KEY);
      const items = cartItemsJson ? JSON.parse(cartItemsJson) : [];
      console.log('Loaded local cart:', items);
      this._cartItems.set(items);
    }
  }

  private loadServerCart(userId: string | number): void {
    this._isLoading.set(true);
    console.log('Loading server cart for user:', userId);
    
    this.cartApiService.getUserCart(Number(userId)).subscribe({
      next: (serverItems) => {
        console.log('Server cart items:', serverItems);
        if (serverItems.length > 0) {
          this.populateCartItemsWithProducts(serverItems);
        } else {
          // If no server cart, migrate local cart to server
          this.migrateLocalCartToServer(userId);
        }
      },
      error: (error) => {
        console.error('Failed to load server cart:', error);
        this._isLoading.set(false);
        // Fallback to local cart on error
        this.loadLocalCart();
      }
    });
  }

  private populateCartItemsWithProducts(serverItems: ServerCartItem[]): void {
    // Get all unique product IDs
    const productIds = [...new Set(serverItems.map(item => item.productId))];
    
    // Fetch all products
    const productRequests = productIds.map(id => 
      this.productService.getProductById(id)
    );

    forkJoin(productRequests).subscribe({
      next: (products) => {
        const validProducts = products.filter(p => p !== null) as Product[];
        const cartItems: CartItem[] = [];

        serverItems.forEach(serverItem => {
          const product = validProducts.find(p => p.id === serverItem.productId);
          if (product) {
            cartItems.push({
              product,
              quantity: serverItem.quantity,
              userId: serverItem.userId
            });
          }
        });

        console.log('Populated cart items:', cartItems);
        this._cartItems.set(cartItems);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to populate cart with products:', error);
        this._cartItems.set([]);
        this._isLoading.set(false);
      }
    });
  }

  private migrateLocalCartToServer(userId: string | number): void {
    const localItems = this.getLocalCartItems();
    console.log('Migrating local cart to server:', localItems);
    
    if (localItems.length === 0) {
      this._cartItems.set([]);
      this._isLoading.set(false);
      return;
    }

    // Convert local items to server format and save
    const serverRequests = localItems.map(item => {
      const serverItem: Omit<ServerCartItem, 'id'> = {
        userId: Number(userId),
        productId: item.product.id,
        quantity: item.quantity
      };
      return this.cartApiService.addToCart(serverItem);
    });

    forkJoin(serverRequests).subscribe({
      next: (savedItems) => {
        console.log('Local cart migrated to server:', savedItems);
        this._cartItems.set(localItems);
        this._isLoading.set(false);
        
        // Clear local storage after successful migration
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      },
      error: (error) => {
        console.error('Failed to migrate local cart:', error);
        this._cartItems.set(localItems);
        this._isLoading.set(false);
      }
    });
  }

  private getLocalCartItems(): CartItem[] {
    if (isPlatformBrowser(this.platformId)) {
      const cartItemsJson = localStorage.getItem(this.STORAGE_KEY);
      return cartItemsJson ? JSON.parse(cartItemsJson) : [];
    }
    return [];
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(item => item.product.id === product.id);
    
    let updatedItems: CartItem[];
    let newQuantity: number;

    if (existingIndex > -1) {
      // Update existing item
      updatedItems = [...currentItems];
      updatedItems[existingIndex].quantity++;
      newQuantity = updatedItems[existingIndex].quantity;
    } else {
      // Add new item
      const newItem: CartItem = { product, quantity: 1 };
      updatedItems = [...currentItems, newItem];
      newQuantity = 1;
    }

    // Update local state immediately
    this._cartItems.set(updatedItems);

    // Sync with server if user is logged in
    const user = this.authService.currentUser();
    if (user) {
      this.syncAddToServer(product, newQuantity, existingIndex > -1);
    }

    console.log(`Product added to cart: ${product.name}, quantity: ${newQuantity}`);
  }

  private syncAddToServer(product: Product, quantity: number, isUpdate: boolean): void {
    const user = this.authService.currentUser();
    if (!user) return;

    if (isUpdate) {
      // Find and update existing server item
      this.cartApiService.getUserCart(Number(user.id!)).subscribe({
        next: (serverItems) => {
          const existingItem = serverItems.find(item => item.productId === product.id);
          if (existingItem) {
            this.cartApiService.updateCartItem(existingItem.id!, quantity).subscribe({
              next: (updated) => console.log('Server cart updated:', updated),
              error: (error) => console.error('Failed to update server cart:', error)
            });
          }
        },
        error: (error) => console.error('Failed to get server cart for update:', error)
      });
    } else {
      // Add new item to server
      const serverItem: Omit<ServerCartItem, 'id'> = {
        userId: Number(user.id!),
        productId: product.id,
        quantity: quantity
      };

      this.cartApiService.addToCart(serverItem).subscribe({
        next: (added) => console.log('Item added to server cart:', added),
        error: (error) => console.error('Failed to add to server cart:', error)
      });
    }
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItems().filter(item => item.product.id !== productId);
    this._cartItems.set(updatedItems);

    // Remove from server if user is logged in
    const user = this.authService.currentUser();
    if (user) {
      this.cartApiService.getUserCart(Number(user.id!)).subscribe({
        next: (serverItems) => {
          const itemToRemove = serverItems.find(item => item.productId === productId);
          if (itemToRemove) {
            this.cartApiService.removeFromCart(itemToRemove.id!).subscribe({
              next: () => console.log('Item removed from server cart'),
              error: (error) => console.error('Failed to remove from server cart:', error)
            });
          }
        },
        error: (error) => console.error('Failed to get server cart for removal:', error)
      });
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex].quantity = quantity;
      this._cartItems.set(updatedItems);
      
      // Sync with server
      const user = this.authService.currentUser();
      if (user) {
        this.cartApiService.getUserCart(Number(user.id!)).subscribe({
          next: (serverItems) => {
            const serverItem = serverItems.find(item => item.productId === productId);
            if (serverItem) {
              this.cartApiService.updateCartItem(serverItem.id!, quantity).subscribe({
                next: (updated) => console.log('Server cart quantity updated:', updated),
                error: (error) => console.error('Failed to update server cart quantity:', error)
              });
            }
          },
          error: (error) => console.error('Failed to get server cart for quantity update:', error)
        });
      }
    }
  }

  clearCart(): void {
    this._cartItems.set([]);
    
    const user = this.authService.currentUser();
    if (user) {
      // Clear server cart
      this.cartApiService.getUserCart(Number(user.id!)).subscribe({
        next: (serverItems) => {
          const deleteRequests = serverItems.map(item => 
            this.cartApiService.removeFromCart(item.id!)
          );
          
          if (deleteRequests.length > 0) {
            forkJoin(deleteRequests).subscribe({
              next: () => console.log('Server cart cleared'),
              error: (error) => console.error('Failed to clear server cart:', error)
            });
          }
        },
        error: (error) => console.error('Failed to get server cart for clearing:', error)
      });
    } else {
      // Clear local storage
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  // Method to manually clear local storage (for debugging)
  clearLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Local cart storage cleared');
    }
  }
}
