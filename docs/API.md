# Grocery Hub API Documentation

## API Endpoints

### Cart API

#### Get Cart
```
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "...",
  "userId": "...",
  "items": [
    {
      "productId": "...",
      "quantity": 2,
      "price": 150
    }
  ],
  "subtotal": 300,
  "tax": 15,
  "deliveryFee": 50,
  "total": 365
}
```

#### Add to Cart
```
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "...",
  "quantity": 1
}
```

#### Remove from Cart
```
POST /api/cart/remove
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "..."
}
```

#### Update Quantity
```
POST /api/cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "...",
  "quantity": 3
}
```

#### Clear Cart
```
POST /api/cart/clear
Authorization: Bearer <token>
```

### Checkout API

#### Create Checkout Session
```
POST /api/checkout/create-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": "..."
}
```

**Response:**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Confirm Payment
```
POST /api/checkout/confirm-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "cs_..."
}
```

### Orders API

#### Get User Orders
```
GET /api/orders
Authorization: Bearer <token>
```

#### Get Order Details
```
GET /api/orders/:orderId
Authorization: Bearer <token>
```

#### Cancel Order
```
POST /api/orders/:orderId/cancel
Authorization: Bearer <token>
```
