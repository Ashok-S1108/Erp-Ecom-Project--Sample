// components/customer/layout/Layout.js
import React, { useState } from 'react';
import Header from './Header';
import CartSidebar from '../cart/CartSidebar';
import Footer from './Footer';
import './Layout.css';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  return (
    <div className="layout">
      <Header onCartOpen={handleCartOpen} />
      <main className="main-content">
        <Outlet />
      </main>
      <CartSidebar isOpen={cartOpen} onClose={handleCartClose} />
      <Footer />
    </div>
  );
};

export default Layout;