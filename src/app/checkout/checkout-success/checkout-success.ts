import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Order } from '../../models/order';
import { CheckoutService } from '../../services/checkout';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss'
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private checkoutService = inject(CheckoutService);
  
  order: Order | null = null;

  constructor() {
    // Try to get order from router state first
    const navigation = this.router.getCurrentNavigation();
    this.order = navigation?.extras?.state?.['order'] || null;
  }

  ngOnInit(): void {
    // If no order in router state, try to get from service
    if (!this.order) {
      this.order = this.checkoutService.lastOrder();
    }
    
    // If still no order, redirect to orders page
    if (!this.order) {
      this.router.navigate(['/orders']);
    }
  }

  ngOnDestroy(): void {
    // Reset checkout state when leaving the success page
    this.checkoutService.resetCheckoutState();
  }

  printOrder(): void {
    if (this.order) {
      // Create a print-friendly version
      const printContent = this.generatePrintContent();
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  }

  private generatePrintContent(): string {
    if (!this.order) return '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt - ${this.order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .order-info { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .totals { margin-left: auto; width: 250px; }
            .total-row { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MyShop</h1>
            <h2>Order Receipt</h2>
          </div>
          
          <div class="order-info">
            <p><strong>Order Number:</strong> ${this.order.id}</p>
            <p><strong>Date:</strong> ${new Date(this.order.orderDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${this.order.status}</p>
            ${this.order.trackingNumber ? `<p><strong>Tracking:</strong> ${this.order.trackingNumber}</p>` : ''}
          </div>

          <div class="order-info">
            <h3>Shipping Address</h3>
            <p>${this.order.shippingAddress}</p>
            <h3>Payment Method</h3>
            <p>${this.order.paymentMethod}</p>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${this.order.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <p>Subtotal: $${this.order.subtotal.toFixed(2)}</p>
            <p>Shipping: ${this.order.shipping === 0 ? 'FREE' : '$' + this.order.shipping.toFixed(2)}</p>
            <p>Tax: $${this.order.tax.toFixed(2)}</p>
            <p class="total-row">Total: $${this.order.total.toFixed(2)}</p>
          </div>

          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
            <p>Thank you for shopping with MyShop!</p>
            <p>Contact us: support@myshop.com | 1-800-MYSHOP</p>
          </div>
        </body>
      </html>
    `;
  }
}
