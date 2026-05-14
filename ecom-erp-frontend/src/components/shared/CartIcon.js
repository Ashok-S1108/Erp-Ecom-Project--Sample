// components/shared/CartIcon.js
import React from 'react';
import { Badge, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => {
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getCartItemsCount();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <IconButton 
      color="inherit" 
      onClick={handleCartClick}
      sx={{ ml: 1 }}
    >
      <Badge badgeContent={itemCount} color="secondary">
        <ShoppingCart />
      </Badge>
    </IconButton>
  );
};

export default CartIcon;