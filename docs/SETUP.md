# Grocery Hub - Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe Account
- Git

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-hub
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

## Web Setup

1. Navigate to web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start the development server:
```bash
npm start
```

## Mobile Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. For Android:
```bash
npm run android
```

4. For iOS:
```bash
npm run ios
```

## Database Initialization

Create sample products in MongoDB:
```javascript
db.products.insertMany([
  {
    name: "Fresh Apples",
    description: "Red, juicy apples",
    price: 150,
    category: "Fruits",
    stock: 50,
    rating: 4.5,
    reviews: 120
  },
  {
    name: "Organic Milk",
    description: "1L fresh milk",
    price: 60,
    category: "Dairy",
    stock: 100,
    rating: 4.8,
    reviews: 250
  }
]);
```

## Testing Flow

1. Register/Login to get JWT token
2. Add products to cart
3. Navigate to checkout
4. Use Stripe test card: 4242 4242 4242 4242
5. Complete payment
6. View order confirmation
