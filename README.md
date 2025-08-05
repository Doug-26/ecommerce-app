# EcommerceApp

A modern ecommerce web application built with Angular 20, featuring user authentication, product management, shopping cart functionality with server-side persistence, and order management.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## 🚀 Features

### ✅ Completed Features
- **User Authentication System**
  - User registration with comprehensive form validation
  - User login with email/password authentication
  - Secure authentication using localStorage
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
  - **Quantity Management**: Update item quantities with +/- buttons
  - **Individual Item Removal**: Remove specific items from cart
  - **Cart Total Calculations**: Real-time price calculations
  - **Loading States**: Visual feedback during cart operations
  - **Error Handling**: Graceful fallbacks for network issues

- **Navigation & UI**
  - Responsive Bootstrap 5 navbar with dark theme
  - Dynamic user dropdown menu with authentication state
  - Cart counter badge with real-time updates
  - Mobile-friendly collapsible navigation
  - Click-outside directive for dropdown management
  - Consistent brand styling with Font Awesome icons

- **Order Management System**
  - Complete order history page for authenticated users
  - Order status tracking (pending, confirmed, shipped, delivered, cancelled)
  - Detailed order information with product images and quantities
  - Order total calculations and shipping addresses
  - Responsive order cards with status badges
  - Order action buttons (view details, reorder, cancel)

- **State Management**
  - Angular Signals for reactive state management
  - Computed properties for derived state (totals, counts)
  - Effect-based side effect handling
  - Optimized re-rendering with signal-based updates

### 🔄 In Progress
- **Enhanced User Profile**
  - Profile settings page
  - Edit user information functionality
  - Account management features

- **Advanced Cart Features**
  - Bulk operations (select all, clear selected)
  - Save for later functionality
  - Cart item recommendations

- **Checkout Process**
  - Multi-step checkout wizard
  - Shipping address management
  - Order confirmation system

### 🎯 Planned Features
- **Payment Integration**: Stripe/PayPal integration
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
│   ├── login/              # Login component with validation
│   └── register/           # Registration with password confirmation
├── cart/                   # Shopping cart module
│   └── cart-item/         # Cart management component
├── checkout/               # Checkout process (planned)
├── core/                   # Core app functionality
├── directives/             # Custom directives
│   └── click-outside-directive.ts  # Outside click detection
├── guards/                 # Route protection
│   └── auth.guard.ts      # Authentication guard
├── models/                 # TypeScript interfaces
│   ├── user.ts            # User & authentication interfaces
│   ├── products.ts        # Product data models
│   ├── order.ts           # Order and order item interfaces
│   └── cart-item.ts       # Cart item models (local & server)
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
│   ├── order.ts           # Order management service
│   └── user.ts            # User profile operations
└── shared/                 # Shared components
    └── navbar/            # Navigation with user menu
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
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "imageUrl": "https://example.com/image.jpg",
      "category": "Electronics",
      "stock": 50
    }
  ],
  "users": [
    {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "password": "password",
      "phone": "1234567890",
      "address": "User Address"
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
      "items": [...],
      "total": 199.98,
      "status": "delivered",
      "orderDate": "2024-12-01T10:00:00Z",
      "shippingAddress": "123 Main St"
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

## 🔐 Authentication & Security

### Authentication Flow
1. **Registration**: Users register with email, password, name, phone, and address
2. **Login**: Credentials validated against users database
3. **Session**: User data stored securely in localStorage
4. **Protection**: Auth guard protects cart and order routes
5. **Cart Migration**: Guest cart automatically transfers to user account on login

### Security Features
- Form validation with error handling
- Protected routes with automatic redirects
- Secure password requirements (6+ characters)
- Email validation and duplicate prevention

## 🛒 Shopping Cart Architecture

### Dual Storage System
- **Guest Users**: Cart stored in localStorage for persistence
- **Authenticated Users**: Cart synchronized with server database
- **Migration**: Automatic transfer from local to server on login

### Cart Operations
- **Add to Cart**: Intelligent quantity updates for existing items
- **Remove Items**: Individual item removal with server sync
- **Update Quantities**: Real-time quantity adjustments
- **Clear Cart**: Complete cart clearing with confirmation
- **Persistence**: Survives page refreshes and browser sessions

### State Management
- **Signals**: Reactive cart state with computed totals
- **Effects**: Automatic persistence based on auth state
- **Loading States**: Visual feedback during operations
- **Error Handling**: Graceful fallbacks and user notifications

## 📱 Responsive Design

- **Mobile-First**: Bootstrap 5 grid system
- **Breakpoints**: Optimized for xs, sm, md, lg, xl screens
- **Navigation**: Collapsible mobile menu
- **Cards**: Responsive product and order layouts
- **Forms**: Touch-friendly input fields
- **Buttons**: Accessible button sizing

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
- 🔄 User profile management
- 🔄 Checkout process implementation

### Phase 2: Advanced Features
- 🎯 Payment gateway integration
- 🎯 Product search and filtering
- 🎯 User reviews and ratings
- 🎯 Wishlist functionality

### Phase 3: Admin & Analytics
- 🎯 Admin dashboard
- 🎯 Inventory management
- 🎯 Sales analytics
- 🎯 User management

### Phase 4: Performance & Scale
- 🎯 PWA implementation
- 🎯 Real-time notifications
- 🎯 Advanced caching strategies
- 🎯 Performance optimization

## 🤝 Contributing

This project is primarily for learning Angular 20 and modern web development practices. Contributions, suggestions, and feedback are welcome!

### Development Guidelines
- Follow Angular style guide
- Use Angular Signals for state management
- Implement responsive design patterns
- Write comprehensive error handling
- Include proper TypeScript typing

## 📄 License

This project is for educational purposes and personal learning.

---

**Current Status**: 🔄 Active Development  
**Last Updated**: January 2025  
**Angular Version**: 20.0.4  
**Bootstrap Version**: 5.3.0  

### Recent Updates
- ✅ Implemented advanced cart management with dual storage
- ✅ Added server-side cart persistence and synchronization
- ✅ Enhanced order management with detailed history
- ✅ Improved responsive design and user experience
- ✅ Added comprehensive error handling and loading states
