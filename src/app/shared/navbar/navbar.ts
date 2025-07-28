import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../directives/click-outside-directive';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, ClickOutsideDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  
  totalItems = this.cartService.totalItems;
  
  // Expose auth service properties for template
  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  // Add dropdown state
  dropdownOpen = false;

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

  // Initialize Bootstrap after view init
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Ensure Bootstrap is loaded
      setTimeout(() => {
        if (typeof (window as any).bootstrap !== 'undefined') {
          console.log('Bootstrap is loaded');
        } else {
          console.warn('Bootstrap JavaScript not loaded');
        }
      }, 100);
    }
  }
}
