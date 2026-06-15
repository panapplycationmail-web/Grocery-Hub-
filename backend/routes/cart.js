const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.price });
    }

    await updateCartTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.post('/remove', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await updateCartTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quantity
router.post('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
    }

    await updateCartTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.post('/clear', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await updateCartTotals(cart);
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function updateCartTotals(cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.subtotal = subtotal;
  cart.tax = Math.round(subtotal * 0.05 * 100) / 100;
  cart.total = subtotal + cart.tax + cart.deliveryFee;
}

module.exports = router;
