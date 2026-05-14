// components/customer/cart/CartPage.js
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as EmptyCartIcon
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const CartPage = () => {
  const { items, loading, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [updatingItem, setUpdatingItem] = useState(null);
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    setUpdatingItem(itemId);
    try {
      const result = await updateQuantity(itemId, newQuantity);
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update quantity',
        severity: 'error'
      });
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItem(itemId);
    try {
      const result = await removeFromCart(itemId);
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove item',
        severity: 'error'
      });
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleClearCart = async () => {
    try {
      const result = await clearCart();
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to clear cart',
        severity: 'error'
      });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <EmptyCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="textSecondary">
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinueShopping}
            sx={{ borderRadius: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  const total = getCartTotal();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="700">
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClearCart}
                disabled={updatingItem !== null}
              >
                Clear Cart
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {items.map((item) => (
              <Box key={item._id} className="cart-item">
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3, pb: 3 }}>
                  <Grid item xs={3} sm={2}>
                    <Box
                      component="img"
                      src={item.product_id.image || '/images/placeholder-product.jpeg'}
                      alt={item.product_id.name}
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                      onError={(e) => {
                        if (e.target.src !== '/images/placeholder-product.jpeg') {
                          e.target.src = '/images/placeholder-product.jpeg';
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={5} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      {item.product_id.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.product_id.category?.name || 'Uncategorized'}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${item.product_id.price?.toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={updatingItem === item._id || item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        
                        <TextField
                          size="small"
                          value={item.quantity}
                          sx={{ 
                            width: 60, 
                            mx: 1,
                            '& .MuiInputBase-input': { 
                              textAlign: 'center',
                              py: 0.5
                            }
                          }}
                          inputProps={{ 
                            min: 1, 
                            style: { textAlign: 'center' } 
                          }}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            handleQuantityChange(item._id, newQuantity);
                          }}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={updatingItem === item._id}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={updatingItem === item._id}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" sx={{ textAlign: 'right', mt: 1 }}>
                      ${(item.product_id.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${total.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">$0.00</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">${(total * 0.1).toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary">
                ${(total * 1.1).toFixed(2)}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                mb: 2
              }}
            >
              Proceed to Checkout
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleContinueShopping}
              sx={{ borderRadius: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;