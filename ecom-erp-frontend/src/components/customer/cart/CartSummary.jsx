import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

const CartSummary = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <Paper elevation={2} className="cart-summary">
      <Typography variant="h6" className="summary-title">
        Order Summary
      </Typography>
      
      <List className="summary-details">
        <ListItem>
          <ListItemText primary="Subtotal" />
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </ListItem>
        
        <ListItem>
          <ListItemText primary="Shipping" />
          <Typography variant="body1">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </Typography>
        </ListItem>
        
        <ListItem>
          <ListItemText primary="Tax" />
          <Typography variant="body1">${tax.toFixed(2)}</Typography>
        </ListItem>
        
        <Divider className="summary-divider" />
        
        <ListItem className="total-row">
          <ListItemText primary="Total" />
          <Typography variant="h6" color="primary">
            ${total.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      
      {subtotal < 50 && shipping > 0 && (
        <Box className="free-shipping-note">
          <Typography variant="body2" color="primary" align="center">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </Typography>
        </Box>
      )}
      
      <Box className="summary-actions">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          component={Link}
          to="/checkout"
          className="checkout-btn"
        >
          Proceed to Checkout
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={handleClearCart}
          className="clear-cart-btn"
        >
          Clear Cart
        </Button>
      </Box>
      
      <Box className="security-notice">
        <Typography variant="body2" color="textSecondary" align="center">
          <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
          Secure checkout. All transactions are encrypted and secure.
        </Typography>
      </Box>
    </Paper>
  );
};

export default CartSummary;