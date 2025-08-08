import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';
import { ClickOutsideDirective } from '../../directives/click-outside-directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  // Expose signals for template
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  totalItems = this.cartService.totalItems;
  
  dropdownOpen = false;

  // Methods used in template
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown();
  }
}
