import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/products';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.error.set('Failed to load products. Please try again.');
        this.loading.set(false);
      }
    });
  }

  addToCart(product: Product): void {
    // Check if user is logged in first
    if (!this.authService.isLoggedIn()) {
      // Redirect to login with return URL
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/products' }
      });
      return;
    }

    this.cartService.addToCart(product);
    console.log(`Added ${product.name} to cart`);
  }
}
