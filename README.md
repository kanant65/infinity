# Adobe Analytics Practice Store

A comprehensive e-commerce practice site built with vanilla JavaScript, HTML5, and CSS3 for learning Adobe Analytics implementation and web development best practices.

## 🚀 Features

### Product Management
- **Dynamic Product Catalog**: Fetch products from dummyjson.com API
- **Product Listing Page (PLP)**: Browse products with filtering and sorting
- **Product Detail Page (PDP)**: Full product information with image gallery
- **Global Search**: Search products across the entire catalog by title, category, or description
- **Admin Inventory Management**: Manage all products with import/export capabilities

### Shopping & Checkout
- **Shopping Cart**: Add/remove products with quantity management
- **Persistent Cart**: Cart data saved in localStorage
- **Smart Checkout**: Auto-fill shipping information for returning customers
- **Multiple Payment Methods**: Credit Card, Debit Card, PayPal, Apple Pay, Google Pay, and Boyfriend
- **Order Management**: Complete order history with status tracking

### User Management
- **User Authentication**: Login and registration system
- **User Profiles**: Save shipping information for faster checkout
- **Admin Dashboard**: Back office for order and user management
- **Role-based Access**: Admin and user roles with different permissions

### Data & Analytics
- **Order Database**: Persistent order storage with complete details
- **Adobe Analytics Integration**: Data layer tracking for all user actions
- **Admin Analytics**: Order statistics, revenue tracking, and reporting
- **Data Export**: Export orders as JSON or CSV for external analysis

### UI/UX Features
- **User Avatar**: Profile avatar with dropdown menu for quick access
- **Shopping Cart Icon**: Quick access to cart from any page
- **Breadcrumb Navigation**: Clear navigation path on all pages
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Hover effects and transitions throughout

## 📁 Project Structure

```
adobe-analytics-practice-site/
├── index.html              # Home page with carousel and featured products
├── plp.html                # Product listing page
├── pdp.html                # Product detail page
├── cart.html               # Shopping cart
├── checkout.html           # Checkout with shipping & payment
├── confirmation.html       # Order confirmation
├── login.html              # User login
├── register.html           # User registration
├── info.html               # Information page
├── admin/
│   ├── dashboard.html      # Admin dashboard with analytics
│   └── inventory.html      # Product inventory management
├── css/
│   └── style.css           # Global styles
├── js/
│   ├── analytics.js        # Adobe Analytics integration
│   ├── auth.js             # Authentication logic
│   ├── cart-logic.js       # Shopping cart functionality
│   ├── data.js             # Data initialization
│   ├── db-init.js          # Database initialization
│   ├── db-manager.js       # Database management utilities
│   └── search.js           # Global search functionality
└── README.md               # This file
```

## 🛠 Getting Started

### Prerequisites
- Python 3.x (for local server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/adobe-analytics-practice-site.git
cd adobe-analytics-practice-site
```

2. Start a local server:
```bash
python3 -m http.server 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 👤 Test Credentials

### Admin User
- Email: `admin@practice.com`
- Password: `password123`

### Regular User
- Email: `test@user.com`
- Password: `password123`

## 💾 Data Storage

The application uses browser localStorage for data persistence:
- **users**: Registered user accounts
- **orders**: Complete order history with shipping and payment details
- **cart**: Current shopping cart items
- **dummyJsonProducts**: Imported product catalog
- **currentUser**: Currently logged-in user
- **currentOrder**: Last completed order
- **searchResults**: Latest search results

## 🔍 Search Functionality

- **Global Search Bar**: Available on all pages (Home, Shop, Product Detail, Cart)
- **Real-time Filtering**: Search by product name, category, or description
- **API Integration**: Searches against the complete dummyjson.com catalog
- **Results Display**: Dedicated search results page with product cards

## 📊 Admin Features

### Dashboard
- Order statistics (total orders, revenue, pending orders)
- User management (view all registered users)
- Order management (view, update status, delete orders)
- Export functionality (JSON and CSV formats)

### Inventory Management
- Import all products from dummyjson.com with one click
- Search and filter products
- View detailed product information
- Add custom products to the catalog
- Remove products from inventory

## 🛒 Shopping Experience

1. **Browse**: Use PLP to view all products or use search to find specific items
2. **Details**: Click on any product to view full details on PDP
3. **Add to Cart**: Select quantity and add to cart (auto-redirects to cart)
4. **Review**: Check cart contents before checkout
5. **Checkout**: Enter or confirm shipping address and select payment method
6. **Confirm**: View order confirmation with all details
7. **Track**: Admin can update order status from dashboard

## 🔐 Security Notes

- This is a practice/learning project - not for production use
- Passwords and payment information are not encrypted
- No server-side validation or authentication
- All data stored locally in browser

## 📈 Analytics Tracking

All major user actions are tracked with Adobe Analytics:
- Page views
- Product clicks
- Add to cart actions
- Checkout events
- Purchase completion

## 🤝 Contributing

This is a practice project. Feel free to fork and modify for learning purposes.

## 📝 License

Educational use only

## 🔗 Resources

- [dummyjson.com](https://dummyjson.com) - Product API
- [Adobe Analytics Docs](https://experienceleague.adobe.com/docs/analytics/analyze/landing.html)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

**Created**: February 2026  
**Last Updated**: February 12, 2026  
**Author**: Anant Kumar
