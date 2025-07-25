import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/products';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('productId'));
    console.log('Product ID from route:', id); // Debug log
    
    if (id && !isNaN(id)) {
      this.getProductById(id);
    } else {
      this.error.set('Invalid product ID');
      this.loading.set(false);
    }
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.cartService.addToCart(product);
    console.log(`Product added to cart: ${product.name}`);
  }

  getProductById(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    
    console.log(`Fetching product with ID: ${id}`); // Debug log
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        console.log('Product received:', product); // Debug log
        if (product) {
          this.product.set(product);
        } else {
          this.error.set(`Product with ID ${id} not found.`);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching product:', error);
        this.error.set('Failed to load product details. Please try again.');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
