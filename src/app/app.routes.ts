import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./products/product-list/product-list').then(m => m.ProductList) },
    { path: 'cart', loadComponent: () => import('./cart/cart-item/cart-item').then(m => m.CartItem) },
];
