import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  private cartService = inject(CartService);
  totalItems = this.cartService.totalItems;

}
