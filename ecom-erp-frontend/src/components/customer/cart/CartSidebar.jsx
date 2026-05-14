// components/customer/cart/CartSidebar.js
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { useCart } from '../../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items = [], getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const total = getCartTotal();
  const itemCount = items.length;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <CartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Your Cart ({itemCount})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', my: 2 }}>
          {itemCount === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Your cart is empty
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
              {itemCount} items in cart
            </Typography>
          )}
        </Box>

        {/* Footer */}
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
            Total: ${total.toFixed(2)}
          </Typography>
          
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleCheckout}
            disabled={itemCount === 0}
            sx={{ mb: 1 }}
          >
            Checkout
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={handleViewCart}
          >
            View Full Cart
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartSidebar;