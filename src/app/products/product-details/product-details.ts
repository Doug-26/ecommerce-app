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

    this.productService.getProducts().subscribe(products => {
      // Find the product with the matching ID
      const foundProduct = products.find(product => product.id === id);
      
      // Update the product signal with the found product or null if not found
      this.product.set(foundProduct || null);
      
      // Log the product details for debugging
      console.log('Product details:', this.product());
    }
    )
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log(`Product added to cart: ${product.name}`);
  }
}
