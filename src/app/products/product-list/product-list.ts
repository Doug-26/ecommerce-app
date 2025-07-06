import { Component, effect, inject } from '@angular/core';
import { ProductService } from '../../services/product';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  private productService = inject(ProductService);

  // Using toSignal to convert the Observable to a Signal
  // This allows us to use the products in the template directly  
  products = toSignal(this.productService.getProducts(), { initialValue: [] });

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
}
