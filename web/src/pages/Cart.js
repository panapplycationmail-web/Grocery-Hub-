import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="cart-container"><div className="loading">लोड हो रहा है...</div></div>;

  return (
    <div className="cart-container">
      <h2>🛒 Shopping Cart</h2>
      {cart?.items?.length === 0 ? (
        <div className="empty-cart">
          <p>आपकी कार्ट खाली है</p>
          <p className="empty-msg">कुछ products जोड़ें शुरुआत करने के लिए</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart?.items?.map(item => (
              <div key={item.productId._id} className="cart-item">
                <div className="item-details">
                  <h4>{item.productId?.name}</h4>
                  <p>₹{item.price}</p>
                </div>
                <div className="item-controls">
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.productId._id)}
                >
                  हटाएं
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{cart?.subtotal?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (5%):</span>
              <span>₹{cart?.tax?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{cart?.deliveryFee?.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{cart?.total?.toFixed(2)}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout पर जाएं
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
