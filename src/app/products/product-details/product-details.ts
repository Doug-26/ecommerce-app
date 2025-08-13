import { Component, inject, signal, OnInit } from '@angular/core';
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
export class ProductDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('productId');
    if (id) {
      this.loadProduct(id);
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

  private loadProduct(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load product', err);
        this.error.set('Product not found or failed to load.');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
