import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useCart } from '../../../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock_quantity) {
      // Show message about maximum quantity
      return;
    }
    updateQuantity(item._id || item.id, newQuantity);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= item.stock_quantity) {
      handleQuantityChange(value);
    }
  };

  const handleRemove = () => {
    removeFromCart(item._id || item.id);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <Paper elevation={0} className="cart-item">
      <Box className="cart-item-content">
        <Box className="cart-item-image">
          <img 
            src={item.image_url || '/images/placeholder-product.jpeg'} 
            alt={item.name}
            onError={(e) => {
              e.target.src = '/images/placeholder-product.jpeg';
            }}
          />
        </Box>
        
        <Box className="cart-item-details">
          <Typography variant="h6" className="item-name">
            {item.name}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" className="item-category">
            {item.category_id?.name || 'Uncategorized'}
          </Typography>
          
          {item.sku && (
            <Typography variant="body2" color="textSecondary" className="item-sku">
              SKU: {item.sku}
            </Typography>
          )}
          
          {item.stock_quantity <= 5 && item.stock_quantity > 0 && (
            <Typography variant="body2" color="warning.main">
              Only {item.stock_quantity} left in stock!
            </Typography>
          )}
          
          {item.stock_quantity === 0 && (
            <Typography variant="body2" color="error">
              Out of stock - remove from cart
            </Typography>
          )}
        </Box>
        
        <Box className="cart-item-price">
          <Typography variant="body1" className="current-price">
            ${item.price.toFixed(2)}
          </Typography>
        </Box>
        
        <Box className="cart-item-quantity">
          <Box className="quantity-controls">
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || item.stock_quantity === 0}
            >
              <RemoveIcon />
            </IconButton>
            
            <TextField
              size="small"
              value={item.quantity}
              onChange={handleInputChange}
              inputProps={{ 
                min: 1, 
                max: item.stock_quantity,
                style: { textAlign: 'center', width: '50px' }
              }}
              variant="outlined"
              disabled={item.stock_quantity === 0}
            />
            
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock_quantity || item.stock_quantity === 0}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box className="cart-item-total">
          <Typography variant="h6" className="item-total">
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>
        
        <Box className="cart-item-actions">
          <IconButton
            onClick={handleRemove}
            className="remove-btn"
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Divider className="cart-item-divider" />
    </Paper>
  );
};

export default CartItem;