import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/Checkout.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch user addresses if available
  }, []);

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async () => {
    if (!selectedAddress && !newAddress.street) {
      alert('कृपया एक डिलीवरी address चुनें या नया add करें');
      return;
    }

    setLoading(true);
    try {
      const addressId = selectedAddress || 'new';
      const response = await axios.post(
        `${API_URL}/checkout/create-session`,
        { addressId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Checkout session बनाने में error हुई');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>🏠 Checkout</h2>

      <div className="address-section">
        <h3>डिलीवरी Address</h3>
        
        {addresses.length > 0 && (
          <div className="saved-addresses">
            <p className="section-label">पहले से saved addresses:</p>
            {addresses.map(addr => (
              <label key={addr._id} className="address-option">
                <input
                  type="radio"
                  checked={selectedAddress === addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                />
                <span>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</span>
              </label>
            ))}
          </div>
        )}

        <div className="new-address-form">
          <h4>नया Address दर्ज करें</h4>
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={newAddress.street}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newAddress.city}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={newAddress.state}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="zipCode"
            placeholder="ZIP Code"
            value={newAddress.zipCode}
            onChange={handleAddressChange}
          />
        </div>
      </div>

      <button 
        className="payment-btn" 
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Payment के लिए जाएं'}
      </button>
    </div>
  );
}

export default Checkout;
