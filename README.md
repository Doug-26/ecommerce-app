# EcommerceApp

A modern ecommerce web application built with Angular 20, featuring user authentication, product management, shopping cart functionality with server-side persistence, and a complete checkout process with order management.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## 🚀 Features

### ✅ Completed Features
- **User Authentication System**
  - User registration with comprehensive form validation
  - User login with email/password authentication and return URL support
  - Secure authentication using localStorage with Angular Signals
  - Protected routes with auth guards
  - Automatic logout functionality
  - User session persistence across browser refreshes

- **Product Management**
  - Product listing with responsive card layout
  - Product details page with breadcrumbs and navigation
  - High-quality product images with hover effects
  - Stock management and availability display
  - Product categories and pricing information
  - Fallback error handling for missing products

- **Advanced Shopping Cart System**
  - **Dual Storage Architecture**: localStorage for guests + server-side for authenticated users
  - **Real-time Cart Synchronization**: Automatic sync between client and server
  - **Cart Migration**: Seamless transfer of guest cart to user account on login
  - **Persistent Cart State**: Cart survives page refreshes and browser sessions
  - **Quantity Management**: Update item quantities with +/- buttons and stock validation
  - **Individual Item Removal**: Remove specific items from cart
  - **Cart Total Calculations**: Real-time price calculations with tax and shipping estimates
  - **Loading States**: Visual feedback during cart operations
  - **Error Handling**: Graceful fallbacks for network issues
  - **Free Shipping Indicator**: Progress tracking toward free shipping threshold ($100+)

- **Complete Checkout Process**
  - **4-Step Checkout Wizard**: Cart Review → Shipping → Payment → Order Review
  - **Progress Indicator**: Visual step navigation with completion states
  - **Shipping Address Management**: Save and reuse multiple addresses
  - **International Support**: Country-specific validation for ZIP codes and phone numbers
  - **Payment Method Storage**: Support for credit cards, debit cards, and PayPal
  - **Order Summary**: Real-time calculations with shipping, tax, and total breakdown
  - **Form Validation**: Comprehensive validation with country-specific error messages
  - **Address Prefilling**: Auto-populate from user profile data
  - **Checkout Security**: Authentication required with seamless login flow

- **Navigation & UI**
  - Responsive Bootstrap 5 navbar with dark theme
  - Dynamic user dropdown menu with authentication state
  - Cart counter badge with real-time updates
  - Mobile-friendly collapsible navigation
  - Click-outside directive for dropdown management
  - Consistent brand styling with Font Awesome icons
  - Sticky order summary sidebar during checkout

- **Order Management System**
  - Complete order history page for authenticated users
  - Order status tracking (pending, confirmed, shipped, delivered, cancelled)
  - Detailed order information with product images and quantities
  - Order total breakdown (subtotal, shipping, tax, total)
  - Responsive order cards with status badges
  - Order action buttons (view details, reorder, cancel)
  - Tracking number generation and display

- **State Management**
  - Angular Signals for reactive state management
  - Computed properties for derived state (totals, counts)
  - Effect-based side effect handling
  - Optimized re-rendering with signal-based updates
  - Cross-component state synchronization

### 🔄 In Progress
- **Checkout Completion**
  - Payment processing integration
  - Order confirmation page
  - Email notifications for order updates

- **Enhanced User Profile**
  - Profile settings page
  - Edit user information functionality
  - Account management features

- **Advanced Cart Features**
  - Bulk operations (select all, clear selected)
  - Save for later functionality
  - Cart item recommendations

### 🎯 Planned Features
- **Payment Integration**: Stripe/PayPal gateway integration
- **Search & Filtering**: Advanced product search and filtering
- **User Reviews**: Product rating and review system
- **Wishlist**: Save products for later purchase
- **Email Notifications**: Order confirmations and updates
- **Admin Panel**: Product and order management dashboard

## 🛠️ Tech Stack

- **Frontend**: Angular 20 (Standalone Components Architecture)
- **Styling**: Bootstrap 5.3.0 + Custom SCSS
- **Icons**: Font Awesome 6.0.0
- **State Management**: Angular Signals + RxJS
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with lazy loading and guards
- **Forms**: Reactive Forms with advanced validation
- **Backend**: JSON Server (Development/Mock API)
- **Data Persistence**: localStorage + RESTful API

## 📁 Project Structure

```
src/app/
├── auth/                    # Authentication module
│   ├── login/              # Login component with return URL support
│   └── register/           # Registration with password confirmation
├── cart/                   # Shopping cart module
│   └── cart-item/         # Cart management with checkout integration
├── checkout/               # Complete checkout process
│   ├── checkout.ts         # Main checkout orchestrator
│   ├── checkout-shipping/  # Shipping address form with international support
│   ├── checkout-payment/   # Payment method selection and storage
│   ├── checkout-review/    # Final order review and confirmation
│   └── checkout-success/   # Order confirmation page
├── core/                   # Core app functionality
├── directives/             # Custom directives
│   └── click-outside-directive.ts  # Outside click detection
├── guards/                 # Route protection
│   └── auth.guard.ts      # Authentication guard
├── models/                 # TypeScript interfaces
│   ├── user.ts            # User & authentication interfaces
│   ├── products.ts        # Product data models
│   ├── order.ts           # Order and order item interfaces
│   ├── cart-item.ts       # Cart item models (local & server)
│   └── checkout.ts        # Checkout, shipping, and payment interfaces
├── order/                  # Order management
│   ├── order.html         # Order history template
│   ├── order.scss         # Order styling
│   └── order.ts           # Order component logic
├── products/               # Product catalog
│   ├── product-list/      # Product grid with pagination
│   └── product-details/   # Detailed product view
├── services/               # Business logic services
│   ├── auth.service.ts    # Authentication & user management
│   ├── product.ts         # Product data operations
│   ├── cart.ts            # Advanced cart management
│   ├── cart-api.ts        # Server-side cart operations
│   ├── checkout.ts        # Checkout process management
│   ├── order.ts           # Order management service
│   └── user.ts            # User profile operations
└── shared/                 # Shared components
    └── navbar/            # Navigation with cart counter
```

## 🔧 Development Setup

### Prerequisites
- Node.js (v18+ LTS recommended)
- Angular CLI 20+
- JSON Server for mock backend

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install JSON Server globally**
   ```bash
   npm install -g json-server
   ```

4. **Start the mock backend API**
   ```bash
   json-server --watch db.json --port 3000
   ```
   The API will be available at `http://localhost:3000`

5. **Start the Angular development server**
   ```bash
   ng serve
   ```
   The app will be available at `http://localhost:4200`

### Database Schema (db.json)

```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "Premium quality wireless headphones",
      "price": 129.99,
      "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
      "category": "Electronics",
      "stock": 50
    }
  ],
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "phone": "09516909596",
      "address": "123 Main St, City, State"
    }
  ],
  "cart": [
    {
      "id": 1,
      "userId": 1,
      "productId": 1,
      "quantity": 2
    }
  ],
  "orders": [
    {
      "id": 1,
      "userId": 1,
      "items": [
        {
          "productId": 1,
          "productName": "Wireless Headphones",
          "quantity": 1,
          "price": 129.99,
          "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
        }
      ],
      "total": 149.03,
      "subtotal": 129.99,
      "shipping": 9.99,
      "tax": 11.05,
      "status": "delivered",
      "orderDate": "2024-12-01T10:00:00Z",
      "shippingAddress": "123 Main St, City, State 12345",
      "paymentMethod": "credit_card",
      "trackingNumber": "TN12345678ABC"
    }
  ],
  "addresses": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "United States",
      "phone": "(555) 123-4567"
    }
  ],
  "payment-methods": [
    {
      "id": 1,
      "userId": 1,
      "type": "credit_card",
      "cardNumber": "****1234",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "cardholderName": "John Doe",
      "isDefault": true
    }
  ]
}
```

## 🌐 API Endpoints

### Products
- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch product by ID

### Authentication
- `GET /users` - Fetch users (for login validation)
- `POST /users` - Create new user (registration)

### Cart Management
- `GET /cart?userId=:id` - Fetch user's cart items
- `POST /cart` - Add item to cart
- `PATCH /cart/:id` - Update cart item quantity
- `DELETE /cart/:id` - Remove item from cart

### Orders
- `GET /orders?userId=:id` - Fetch user's order history
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order status

### Checkout Support
- `GET /addresses?userId=:id` - Fetch user's saved addresses
- `POST /addresses` - Save new shipping address
- `GET /payment-methods?userId=:id` - Fetch user's saved payment methods
- `POST /payment-methods` - Save new payment method

## 🔐 Authentication & Security

### Authentication Flow
1. **Registration**: Users register with email, password, name, phone, and address
2. **Login**: Credentials validated against users database with return URL support
3. **Session**: User data stored securely in localStorage using Angular Signals
4. **Protection**: Auth guard protects cart, checkout, and order routes
5. **Cart Migration**: Guest cart automatically transfers to user account on login

### Security Features
- Comprehensive form validation with real-time error handling
- Protected routes with automatic redirects
- Secure password requirements (6+ characters)
- Email validation and duplicate prevention
- International phone and address validation

## 🛒 Shopping Cart & Checkout Architecture

### Dual Storage System
- **Guest Users**: Cart stored in localStorage for persistence
- **Authenticated Users**: Cart synchronized with server database
- **Migration**: Automatic transfer from local to server on login
- **Checkout Integration**: Seamless transition from cart to checkout

### Checkout Process Flow
1. **Cart Review**: Verify items, quantities, and pricing
2. **Shipping Information**: Address collection with international support
3. **Payment Method**: Secure payment information capture
4. **Order Review**: Final confirmation before processing
5. **Order Completion**: Success page with tracking information

### Cart Operations
- **Add to Cart**: Intelligent quantity updates for existing items
- **Remove Items**: Individual item removal with server sync
- **Update Quantities**: Real-time quantity adjustments with stock validation
- **Clear Cart**: Complete cart clearing with confirmation
- **Persistence**: Survives page refreshes and browser sessions
- **Checkout Navigation**: Direct integration with checkout process

### International Support
- **Address Validation**: Country-specific ZIP code and phone number formats
- **Multi-Currency**: Ready for international pricing (USD base)
- **Shipping Calculation**: Country-specific shipping rates
- **Tax Calculation**: Configurable tax rates by region

## 📱 Responsive Design

- **Mobile-First**: Bootstrap 5 grid system
- **Breakpoints**: Optimized for xs, sm, md, lg, xl screens
- **Navigation**: Collapsible mobile menu with cart counter
- **Cards**: Responsive product and order layouts
- **Forms**: Touch-friendly input fields with validation
- **Checkout**: Multi-step process optimized for all devices
- **Sticky Elements**: Order summary stays visible during checkout

## 🧪 Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

Build for production:
```bash
ng build
```

## 🔮 Roadmap

### Phase 1: Core Enhancement (Current)
- ✅ Advanced cart management with server sync
- ✅ Order history and status tracking
- ✅ Complete checkout process with international support
- 🔄 Payment gateway integration
- 🔄 Order confirmation and success flow

### Phase 2: Advanced Features
- 🎯 Real payment processing (Stripe/PayPal)
- 🎯 Product search and filtering
- 🎯 User reviews and ratings
- 🎯 Wishlist functionality
- 🎯 Email notifications

### Phase 3: Admin & Analytics
- 🎯 Admin dashboard
- 🎯 Inventory management
- 🎯 Sales analytics and reporting
- 🎯 User management
- 🎯 Order fulfillment tools

### Phase 4: Performance & Scale
- 🎯 PWA implementation
- 🎯 Real-time notifications
- 🎯 Advanced caching strategies
- 🎯 Performance optimization
- 🎯 Multi-language support

## 🤝 Contributing

This project is primarily for learning Angular 20 and modern web development practices. Contributions, suggestions, and feedback are welcome!

### Development Guidelines
- Follow Angular style guide and standalone components architecture
- Use Angular Signals for state management
- Implement responsive design patterns with Bootstrap 5
- Write comprehensive error handling and validation
- Include proper TypeScript typing
- Follow international best practices for forms and validation

## 📄 License

This project is for educational purposes and personal learning.

---

**Current Status**: 🔄 Active Development  
**Last Updated**: January 2025  
**Angular Version**: 20.0.4  
**Bootstrap Version**: 5.3.0  

### Recent Updates
- ✅ Implemented complete checkout process with 4-step wizard
- ✅ Added international address and phone validation
- ✅ Enhanced cart with checkout integration and free shipping indicator
- ✅ Improved authentication flow with return URL support
- ✅ Added comprehensive order management with detailed tracking
- ✅ Implemented responsive design across all components
- ✅ Added Angular Signals throughout for reactive state management
