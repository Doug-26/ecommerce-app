import { Component, effect, inject } from '@angular/core';
import { ProductService } from '../../services/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart';
import { Product } from '../../models/products';
import { RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Using toSignal to convert the Observable to a Signal
  // This allows us to use the products in the template directly  
  products = toSignal(this.productService.getProducts(), { initialValue: [] });

  // Add loading state to ProductList
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    // The products are now available as a Signal
    // You can use this.products() in the template to access the product list
    
    // Effect to log the product list whenever it changes
    // This is useful for debugging or side effects
    effect(() => {
      const productList = this.products();
      console.log('Product list updated:', productList);
    });
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }
    
    // Call the addToCart method from CartService to add the product to the cart
    this.cartService.addToCart(product);
    console.log(`Product added to cart: ${product.name}`);
  }
}
