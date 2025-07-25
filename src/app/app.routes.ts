import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'products', 
    loadComponent: () => import('./products/product-list/product-list').then(m => m.ProductList)
  },
  {
    path: 'products/:productId',
    loadComponent: () => import('./products/product-details/product-details').then(m => m.ProductDetails)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart-item/cart-item').then(m => m.CartItem),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./order/order').then(m => m.OrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    redirectTo: '/products', // Keep this as redirect for now
  },
  // Wildcard route - must be last
  { path: '**', redirectTo: '/products' }
];
