import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductList } from './products/product-list/product-list';

@Component({
  selector: 'app-root',
  imports: [ProductList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ecommerce-app';
}
