import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/products';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Using signal to hold the product details
  // This allows us to reactively update the UI when the product changes
  product = signal<Product | null>(null);

  constructor() {
    // Fetch the product ID from the route parameters
    const id = Number(this.route.snapshot.paramMap.get('productId'));
    this.getProductById(id);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log(`Product added to cart: ${product.name}`);
  }

  getProductById(id: number): void {
    this.productService.getProductById(id).subscribe(product => {
      if (product) {
        this.product.set(product);
        console.log('Product details fetched:', product);
      } else {
        console.error(`Product with ID ${id} not found.`);
      }
    });
  }
}
