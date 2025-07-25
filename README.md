# EcommerceApp

A modern ecommerce web application built with Angular 20, featuring user authentication, product management, and shopping cart functionality.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## 🚀 Features

### ✅ Completed Features
- **User Authentication System**
  - User registration with form validation
  - User login with email/password
  - JWT-like authentication using localStorage
  - Protected routes with auth guards
  - Automatic logout functionality

- **Product Management**
  - Product listing with responsive card layout
  - Product details page with breadcrumbs
  - Product images and descriptions
  - Stock management display

- **Navigation & UI**
  - Responsive Bootstrap navbar
  - User dropdown menu with authentication state
  - Mobile-friendly design
  - Click-outside directive for dropdowns

- **Shopping Cart**
  - Add products to cart (requires authentication)
  - Cart item counter in navbar
  - Local storage persistence
  - Cart management (add/remove items)

- **Order Management**
  - Order history page
  - Order status tracking (pending, confirmed, shipped, delivered, cancelled)
  - Order details with product information

### 🔄 In Progress
- **Cart Enhancement**
  - Complete cart page with quantity updates
  - Cart total calculations
  - Remove individual items functionality

- **Checkout Process**
  - Shipping address form
  - Order summary
  - Payment integration (planned)

- **User Profile**
  - Profile management page
  - Edit user information
  - Order history integration

## 🛠️ Tech Stack

- **Frontend**: Angular 20 (Standalone Components)
- **Styling**: Bootstrap 5.3.0 + Custom SCSS
- **Icons**: Font Awesome 6.0.0
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router with Guards
- **Forms**: Reactive Forms with Validation
- **Backend**: JSON Server (Development)

## 📁 Project Structure

```
src/app/
├── auth/                 # Authentication components
│   ├── login/           # Login component
│   └── register/        # Registration component
├── cart/                # Shopping cart components
├── guards/              # Route guards
├── models/              # TypeScript interfaces
│   ├── user.ts         # User & Auth interfaces
│   ├── products.ts     # Product interface
│   ├── order.ts        # Order interfaces
│   └── cart-item.ts    # Cart item interface
├── order/               # Order management
├── products/            # Product components
│   ├── product-list/   # Product listing
│   └── product-details/ # Product details
├── services/            # Angular services
│   ├── auth.service.ts # Authentication service
│   ├── product.ts      # Product service
│   ├── cart.ts         # Cart service
│   └── order.ts        # Order service
├── shared/              # Shared components
│   └── navbar/         # Navigation component
└── directives/          # Custom directives
```

## 🔧 Development Setup

### Prerequisites
- Node.js (Latest LTS version)
- Angular CLI 20+
- JSON Server (for backend API)

### Installation

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

4. **Start the backend API**
   ```bash
   json-server --watch db.json --port 3000
   ```

5. **Start the development server**
   ```bash
   ng serve
   ```

6. **Open your browser**
   Navigate to `http://localhost:4200/`

## 🌐 API Endpoints

The application uses JSON Server with the following endpoints:

- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch product by ID
- `GET /users` - Fetch all users (for authentication)
- `POST /users` - Create new user (registration)
- `GET /orders?userId=:id` - Fetch user orders
- `POST /orders` - Create new order

## 🔐 Authentication Flow

1. Users can register with email, password, name, phone, and address
2. Login validates credentials against the users database
3. Successful authentication stores user data in localStorage
4. Protected routes redirect unauthenticated users to login
5. Cart functionality requires authentication

## 📱 Responsive Design

- Mobile-first approach using Bootstrap 5
- Responsive navbar with collapsible menu
- Card-based product layout that adapts to screen size
- Touch-friendly buttons and interactions

## 🧪 Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## 🚀 Building for Production

```bash
ng build --prod
```

Build artifacts will be stored in the `dist/` directory.

## 🔮 Upcoming Features

- **Payment Integration**: Stripe/PayPal integration
- **Search & Filtering**: Product search and category filtering
- **User Reviews**: Product rating and review system
- **Wishlist**: Save products for later
- **Email Notifications**: Order confirmations and updates
- **Admin Panel**: Product and order management
- **Real-time Updates**: WebSocket integration for live updates

## 🤝 Contributing

This is a learning project. Feel free to suggest improvements or report issues.

## 📄 License

This project is for educational purposes.

---

**Current Status**: 🔄 Active Development
**Last Updated**: December 2024
