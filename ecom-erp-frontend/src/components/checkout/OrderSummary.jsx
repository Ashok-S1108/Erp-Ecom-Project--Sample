import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  Divider,
  Paper
} from '@mui/material';

const OrderSummary = ({ cartItems, total, shippingCost = 0, tax = 0, discount = 0 }) => {
  // Safely calculate subtotal even if cartItems is undefined
  const calculateSubtotal = () => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const finalTotal = total || (subtotal + shippingCost + tax - discount);

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      
      {(!cartItems || cartItems.length === 0) ? (
        <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
          Your cart is empty
        </Typography>
      ) : (
        <List disablePadding>
          {cartItems.map((product, index) => (
            <ListItem key={product.id || product._id || `item-${index}`} sx={{ py: 1, px: 0 }}>
              <ListItemText 
                primary={product.name || 'Unnamed Product'} 
                secondary={`Quantity: ${product.quantity || 0}`} 
              />
              <Typography variant="body2">
                ${((product.price || 0) * (product.quantity || 0)).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
          
          <Divider sx={{ my: 1 }} />
          
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Subtotal" />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              ${subtotal.toFixed(2)}
            </Typography>
          </ListItem>
          
          {discount > 0 && (
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Discount" />
              <Typography variant="body2" color="green">
                -${discount.toFixed(2)}
              </Typography>
            </ListItem>
          )}
          
          {shippingCost > 0 && (
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Shipping" />
              <Typography variant="body2">${shippingCost.toFixed(2)}</Typography>
            </ListItem>
          )}
          
          {tax > 0 && (
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Tax" />
              <Typography variant="body2">${tax.toFixed(2)}</Typography>
            </ListItem>
          )}
          
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              ${finalTotal.toFixed(2)}
            </Typography>
          </ListItem>
        </List>
      )}
    </Paper>
  );
};

export default OrderSummary;