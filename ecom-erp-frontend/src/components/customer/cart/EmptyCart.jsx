import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ShoppingCart as EmptyCartIcon } from '@mui/icons-material';

const EmptyCart = () => {
  return (
    <Container className="empty-cart-page">
      <Paper elevation={2} className="empty-cart-container">
        <Box className="empty-cart-content">
          <EmptyCartIcon className="empty-cart-icon" />
          
          <Typography variant="h4" className="empty-cart-title">
            Your cart is empty
          </Typography>
          
          <Typography variant="body1" color="textSecondary" className="empty-cart-message">
            Looks like you haven't added any items to your cart yet.
          </Typography>
          
          <Box className="empty-cart-actions">
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/products"
              className="start-shopping-btn"
            >
              Start Shopping
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/"
              className="continue-shopping-btn"
            >
              Continue to Homepage
            </Button>
          </Box>
          
          <Box className="empty-cart-features">
            <Typography variant="h6" gutterBottom>
              Why shop with us?
            </Typography>
            
            <Box className="features-list">
              <Box className="feature-item">
                <i className="fas fa-shipping-fast"></i>
                <Typography variant="body2">Free shipping on orders over $50</Typography>
              </Box>
              
              <Box className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <Typography variant="body2">Secure payment processing</Typography>
              </Box>
              
              <Box className="feature-item">
                <i className="fas fa-undo"></i>
                <Typography variant="body2">Easy returns within 30 days</Typography>
              </Box>
              
              <Box className="feature-item">
                <i className="fas fa-headset"></i>
                <Typography variant="body2">24/7 customer support</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmptyCart;