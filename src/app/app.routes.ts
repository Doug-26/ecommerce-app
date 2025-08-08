import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () => import('./products/product-list/product-list').then(m => m.ProductListComponent),
    title: 'Products - MyShop'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./products/product-details/product-details').then(m => m.ProductDetailsComponent),
    title: 'Product Details - MyShop'
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart-item/cart-item').then(m => m.CartItemComponent),
    canActivate: [authGuard], // Add auth guard here
    title: 'Shopping Cart - MyShop'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'Checkout - MyShop'
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./checkout/checkout-success/checkout-success').then(m => m.CheckoutSuccessComponent),
    canActivate: [authGuard],
    title: 'Order Confirmation - MyShop'
  },
  {
    path: 'orders',
    loadComponent: () => import('./order/order').then(m => m.OrdersComponent),
    canActivate: [authGuard],
    title: 'My Orders - MyShop'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent),
    title: 'Login - MyShop'
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent),
    title: 'Register - MyShop'
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
