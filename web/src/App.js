import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>🏪 Grocery Hub</h1>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
