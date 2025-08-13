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
  - **4-Step Checkout Wizard**: Shipping → Payment → Review → Success
  - **Reactive Step Navigation**: Angular Signals-based step management with visual progress indicator
  - **Shipping Address Management**: Full CRUD operations (add, edit, delete, select) with auto-selection
  - **Payment Method Storage**: Support for credit cards, debit cards, and PayPal with secure storage
  - **Order Summary**: Real-time calculations with shipping ($9.99 or free over $100), tax (8.5%), and total breakdown
  - **Form Validation**: Comprehensive validation with real-time error feedback using Angular Reactive Forms
  - **Address Auto-Selection**: Automatically selects first saved address/payment method
  - **Navigation Guards**: Prevents step skipping without completing prerequisites
  - **Order Processing**: Complete order creation with tracking number generation
  - **Cart Integration**: Seamless cart-to-order conversion with cart clearing on success

- **Enhanced Address & Payment Management**
  - **International Address Support**: Country-specific validation for multiple regions
  - **Address Book**: Save and manage multiple shipping addresses with edit/delete functionality
  - **Payment Wallet**: Store multiple payment methods with card masking (shows last 4 digits)
  - **Form Auto-Population**: Pre-fill forms when editing existing addresses/payments
  - **Real-time Validation**: Live form validation with visual feedback and error messages
  - **Responsive Design**: Mobile-optimized forms with touch-friendly interfaces

- **Advanced State Management**
  - **Angular Signals Architecture**: Complete migration to Angular's new reactivity system
  - **Effect-Based Side Effects**: Proper handling of auto-selection and data synchronization
  - **Computed Properties**: Derived state calculations for totals, counts, and availability
  - **Signal-Based Forms**: Integration between Reactive Forms and Angular Signals
  - **Cross-Component Communication**: Event-driven architecture with proper parent-child communication

- **Order Management System**
  - Complete order history page for authenticated users
  - Order status tracking (pending, confirmed, shipped, delivered, cancelled)
  - Detailed order information with product images and quantities
  - Order total breakdown (subtotal, shipping, tax, total)
  - Responsive order cards with status badges
  - Order action buttons (view details, reorder, cancel)
  - Tracking number generation and display

- **Navigation & UI**
  - Responsive Bootstrap 5 navbar with dark theme
  - Dynamic user dropdown menu with authentication state
  - Cart counter badge with real-time updates
  - Mobile-friendly collapsible navigation
  - Click-outside directive for dropdown management
  - Consistent brand styling with Font Awesome icons
  - Step progress indicators with completion states

### 🔄 In Progress
- **Checkout Flow Optimization**
  - Step navigation debugging and refinement
  - Enhanced error handling for payment processing
  - Order confirmation email system integration

- **Enhanced User Profile**
  - Profile settings page with editable user information
  - Account management features
  - Saved preferences and settings

### 🎯 Planned Features
- **Payment Integration**: Stripe/PayPal gateway integration with real transaction processing
- **Search & Filtering**: Advanced product search with faceted filtering
- **User Reviews**: Product rating and review system with moderation
- **Wishlist**: Save products for later purchase with sharing capabilities
- **Email Notifications**: Order confirmations, shipping updates, and promotional emails
- **Admin Panel**: Comprehensive product and order management dashboard
- **PWA Features**: Offline functionality and push notifications

## 🛠️ Tech Stack

- **Frontend**: Angular 20 (Standalone Components Architecture)
- **Styling**: Bootstrap 5.3.0 + Custom SCSS
- **Icons**: Font Awesome 6.0.0
- **State Management**: Angular Signals + RxJS Observables
- **HTTP Client**: Angular HttpClient with interceptors and error handling
- **Routing**: Angular Router with lazy loading and authentication guards
- **Forms**: Angular Reactive Forms with advanced validation and real-time feedback
- **Backend**: JSON Server (Development/Mock API)
- **Data Persistence**: localStorage + RESTful API with automatic synchronization

## 📁 Project Structure

```
src/app/
├── auth/                    # Authentication module
│   ├── login/              # Login component with return URL support
│   └── register/           # Registration with password confirmation
├── cart/                   # Shopping cart module
│   └── cart-item/         # Cart management with checkout integration
├── checkout/               # Complete checkout process
│   ├── checkout.ts         # Main checkout orchestrator with step management
│   ├── checkout-shipping/  # Shipping address CRUD with international support
│   ├── checkout-payment/   # Payment method management with card masking
│   ├── checkout-review/    # Final order review and confirmation
│   └── checkout-success/   # Order confirmation with tracking information
├── core/                   # Core app functionality
├── directives/             # Custom directives
│   └── click-outside-directive.ts  # Outside click detection
├── guards/                 # Route protection
│   └── auth.guard.ts      # Authentication guard with redirect handling
├── models/                 # TypeScript interfaces
│   ├── user.ts            # User & authentication interfaces
│   ├── products.ts        # Product data models
│   ├── order.ts           # Order and order item interfaces
│   ├── cart-item.ts       # Cart item models (local & server)
│   └── checkout.ts        # Checkout, shipping, and payment interfaces
├── order/                  # Order management
│   ├── order.html         # Order history template with status tracking
│   ├── order.scss         # Order styling with responsive design
│   └── order.ts           # Order component with filtering and actions
├── products/               # Product catalog
│   ├── product-list/      # Product grid with pagination and filtering
│   └── product-details/   # Detailed product view with add-to-cart
├── services/               # Business logic services
│   ├── auth.service.ts    # Authentication & user management with signals
│   ├── product.ts         # Product data operations with caching
│   ├── cart.ts            # Advanced cart management with dual storage
│   ├── cart-api.ts        # Server-side cart operations
│   ├── checkout.ts        # Checkout process management with step navigation
│   ├── order.ts           # Order management service with status tracking
│   └── user.ts            # User profile operations
└── shared/                 # Shared components
    └── navbar/            # Navigation with real-time cart counter
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
      "description": "Premium quality wireless headphones with noise cancellation",
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
      "phone": "+1-555-123-4567",
      "address": "123 Main St, Anytown, CA 12345"
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
      "subtotal": 129.99,
      "shipping": 9.99,
      "tax": 11.05,
      "total": 151.03,
      "status": "pending",
      "orderDate": "2025-01-14T10:00:00Z",
      "shippingAddress": "123 Main St, Anytown, CA 12345",
      "paymentMethod": "credit_card",
      "trackingNumber": "TN12345678ABC"
    }
  ],
  "addresses": [
    {
      "id": "addr_1",
      "userId": "1",
      "firstName": "John",
      "lastName": "Doe",
      "address": "123 Main Street",
      "city": "Anytown",
      "state": "California",
      "zipCode": "12345",
      "country": "Philippines",
      "phone": "+63-915-690-9596"
    }
  ],
  "payment-methods": [
    {
      "id": "pm_1",
      "userId": "1",
      "type": "credit_card",
      "cardNumber": "4532123456781234",
      "last4": "1234",
      "expiryMonth": "12",
      "expiryYear": "2025",
      "cardholderName": "John Doe",
      "brand": "Visa"
    }
  ]
}
```

## 🌐 API Endpoints

### Products
- `GET /products` - Fetch all products with optional filtering
- `GET /products/:id` - Fetch product by ID with error handling

### Authentication
- `GET /users?email=:email` - User lookup for login validation
- `POST /users` - Create new user account (registration)

### Cart Management
- `GET /cart?userId=:id` - Fetch user's cart items
- `POST /cart` - Add item to cart with quantity validation
- `PATCH /cart/:id` - Update cart item quantity
- `DELETE /cart/:id` - Remove item from cart

### Orders
- `GET /orders?userId=:id` - Fetch user's order history with status
- `POST /orders` - Create new order from checkout data
- `PATCH /orders/:id` - Update order status and tracking

### Checkout Support
- `GET /addresses?userId=:id` - Fetch user's saved shipping addresses
- `POST /addresses` - Save new shipping address
- `PATCH /addresses/:id` - Update existing address
- `DELETE /addresses/:id` - Remove saved address
- `GET /payment-methods?userId=:id` - Fetch user's saved payment methods
- `POST /payment-methods` - Save new payment method
- `PATCH /payment-methods/:id` - Update existing payment method
- `DELETE /payment-methods/:id` - Remove saved payment method

## 🔐 Authentication & Security

### Authentication Flow
1. **Registration**: Email uniqueness validation, password requirements, comprehensive user data
2. **Login**: Credential validation with return URL support and session restoration
3. **Session Management**: Angular Signals-based state with localStorage persistence
4. **Route Protection**: Auth guards with automatic redirects to login
5. **Cart Migration**: Seamless guest-to-user cart transfer on authentication

### Security Features
- **Form Validation**: Real-time validation with comprehensive error messaging
- **Input Sanitization**: Protection against XSS and injection attacks
- **Secure Storage**: Encrypted local storage for sensitive session data
- **Route Guards**: Multi-level protection for authenticated routes
- **CSRF Protection**: Token-based request validation (ready for production)

## 🛒 Shopping Cart & Checkout Architecture

### Checkout Process Flow
1. **Cart Review**: Item verification with quantity adjustments and total calculations
2. **Shipping Information**: 
   - Address collection with international validation
   - Save multiple addresses with CRUD operations
   - Auto-selection of primary address
   - Real-time form validation with error feedback
3. **Payment Method**:
   - Credit card, debit card, and PayPal support
   - Secure payment method storage with card masking
   - Multiple payment method management
   - Dynamic form validation based on payment type
4. **Order Review**: 
   - Final order summary with detailed breakdown
   - Shipping and tax calculations
   - Terms and conditions acceptance
   - Order modification capabilities
5. **Order Success**: 
   - Order confirmation with tracking number
   - Cart clearing and state reset
   - Order history integration

### Advanced Features
- **Step Navigation**: Signal-based step management with progress indicators
- **Form Persistence**: Auto-save form data during checkout process
- **Error Recovery**: Graceful handling of network failures and validation errors
- **Mobile Optimization**: Touch-friendly interfaces with responsive design
- **Accessibility**: Screen reader support and keyboard navigation

### International Support
- **Multi-Country Address Validation**: Support for various address formats
- **Phone Number Formatting**: International phone number validation
- **Currency Support**: Ready for multi-currency implementation
- **Localization**: Prepared for multi-language support

## 📱 Responsive Design & UX

### Design Principles
- **Mobile-First Approach**: Progressive enhancement from mobile to desktop
- **Bootstrap 5 Integration**: Consistent grid system and utility classes
- **Angular Signals UI**: Reactive interfaces with instant feedback
- **Loading States**: Comprehensive loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages with recovery actions

### User Experience Features
- **Smart Navigation**: Breadcrumbs, progress indicators, and contextual navigation
- **Auto-Save**: Form data persistence during complex workflows
- **Instant Feedback**: Real-time validation and status updates
- **Accessibility**: WCAG 2.1 compliance with keyboard and screen reader support
- **Performance**: Optimized loading with lazy loading and caching strategies

## 🧪 Testing & Quality Assurance

### Testing Strategy
```bash
# Unit tests
ng test

# End-to-end tests
ng e2e

# Production build
ng build --prod

# Development build with source maps
ng build
```

### Code Quality
- **TypeScript Strict Mode**: Enhanced type safety and error prevention
- **Angular ESLint**: Code style consistency and best practices
- **Accessibility Testing**: Automated a11y testing with axe-core
- **Performance Monitoring**: Lighthouse integration for performance metrics

## 🔮 Roadmap & Future Enhancements

### Phase 1: Core Completion (Current - Q1 2025)
- ✅ Complete checkout process with step navigation
- ✅ Address and payment management with CRUD operations
- ✅ Order processing with tracking number generation
- 🔄 Payment gateway integration (Stripe/PayPal)
- 🔄 Email notification system
- 🔄 Advanced error handling and recovery

### Phase 2: Enhanced Features (Q2 2025)
- 🎯 Product search and filtering with faceted navigation
- 🎯 User reviews and ratings system
- 🎯 Wishlist functionality with sharing
- 🎯 Advanced user profile management
- 🎯 Order tracking with real-time updates
- 🎯 Inventory management with low stock alerts

### Phase 3: Advanced Capabilities (Q3 2025)
- 🎯 Admin dashboard with analytics
- 🎯 Multi-vendor marketplace support
- 🎯 Advanced recommendation engine
- 🎯 Social commerce features
- 🎯 Mobile app development (Ionic/React Native)
- 🎯 Real-time chat support

### Phase 4: Scale & Performance (Q4 2025)
- 🎯 Progressive Web App (PWA) implementation
- 🎯 Offline functionality with service workers
- 🎯 Advanced caching strategies
- 🎯 Multi-language and multi-currency support
- 🎯 Enterprise-grade security features
- 🎯 Microservices architecture migration

## 🤝 Contributing

This project demonstrates modern Angular development practices and is open for contributions, suggestions, and educational use.

### Development Standards
- **Angular 20 Features**: Standalone components, Angular Signals, modern reactive patterns
- **TypeScript Best Practices**: Strict typing, interface definitions, generic constraints
- **Responsive Design**: Bootstrap 5 with custom SCSS, mobile-first approach
- **Accessibility**: WCAG 2.1 guidelines, semantic HTML, ARIA attributes
- **Performance**: Lazy loading, OnPush change detection, optimized bundle sizes
- **Testing**: Unit tests, integration tests, end-to-end testing strategies

### Code Style
- **Angular Style Guide**: Official Angular coding standards
- **Signal-Based Architecture**: Reactive state management with Angular Signals
- **Component Communication**: Proper parent-child data flow and event handling
- **Service Layer**: Clean separation of concerns with dependency injection
- **Error Handling**: Comprehensive error boundaries and user feedback

## 📄 License

This project is developed for educational purposes and modern Angular learning.

---

**Current Status**: 🚀 Production Ready (Core Features)  
**Last Updated**: January 14, 2025  
**Angular Version**: 20.0.4  
**Bootstrap Version**: 5.3.0  
**Development Stage**: Advanced Implementation

### Recent Achievements
- ✅ **Complete Checkout Process**: 4-step wizard with full CRUD operations for addresses and payment methods
- ✅ **Angular Signals Migration**: Full reactive state management with effects and computed properties
- ✅ **Advanced Form Handling**: Real-time validation, auto-selection, and error recovery
- ✅ **Order Management**: Complete order lifecycle from cart to confirmation
- ✅ **International Support**: Multi-country address validation and payment processing
- ✅ **Responsive Design**: Mobile-optimized interfaces with accessibility features
- ✅ **State Synchronization**: Seamless client-server state management with error handling

### Current Focus
- 🔄 **Payment Integration**: Implementing Stripe/PayPal for real transaction processing
- 🔄 **User Experience**: Enhancing navigation flow and error handling
- 🔄 **Performance Optimization**: Bundle size reduction and loading time improvements
- 🔄 **Testing Coverage**: Comprehensive unit and integration testing
