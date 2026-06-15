const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/create-session', auth, async (req, res) => {
  try {
    const { addressId } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    const user = await User.findById(req.user.id);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const address = user.addresses.find(addr => addr._id === addressId);
    if (!address) {
      return res.status(400).json({ message: 'Address not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.productId.name,
            description: item.productId.description
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        userId: req.user.id,
        addressId: addressId
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id);
    const address = user.addresses.find(addr => addr._id === session.metadata.addressId);

    const order = new Order({
      userId: req.user.id,
      items: cart.items,
      deliveryAddress: address,
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      paymentMethod: 'stripe',
      paymentStatus: 'completed',
      stripePaymentId: session.payment_intent
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.json({ orderId: order._id, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
