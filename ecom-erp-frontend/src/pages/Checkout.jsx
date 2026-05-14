import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/checkout/AddressForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderSummary from '../components/checkout/OrderSummary';
import api from '../services/api';

const steps = ['Shipping address', 'Payment method', 'Review your order'];

// Utility functions for currency formatting
const formatCurrency = (value) => {
  return parseFloat(parseFloat(value).toFixed(2));
};

const calculateTax = (subtotal, taxRate = 0.08) => {
  return formatCurrency(subtotal * taxRate);
};

const calculateTotal = (subtotal, tax, shipping = 5.99, discount = 0) => {
  return formatCurrency(subtotal + tax + shipping - discount);
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await api.get('/cart');
      console.log('Cart API response:', response.data);
      
      // Handle different response structures
      if (response.data.items) {
        setCartItems(response.data.items);
      } else if (response.data.cart && response.data.cart.items) {
        setCartItems(response.data.cart.items);
      } else {
        setCartItems(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      setError('Failed to load cart items. Please try again.');
      setCartItems([]);
    }
  };

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const backStep = () => setActiveStep((prev) => prev - 1);

  const handleAddressSubmit = (data) => {
    setShippingData(data);
    nextStep();
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    nextStep();
  };

  const calculateOrderTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.price || item.product_id?.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    const shippingCost = 5.99;
    const tax = subtotal * 0.08;
    const discount = 0;
    
    return subtotal + shippingCost + tax - discount;
  };

  const formatShippingAddress = (addressData) => {
    return `${addressData.firstName} ${addressData.lastName}, ${addressData.address1}, ${addressData.city}, ${addressData.state} ${addressData.zip}, ${addressData.country}`;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare order items with proper decimal formatting
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id?._id || item.product_id || item._id,
        quantity: item.quantity || 1,
        price: formatCurrency(item.price || item.product_id?.price || 0)
      }));

      // Calculate totals with fixed decimal precision
      const subtotal = formatCurrency(orderItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0));
      
      const tax_amount = calculateTax(subtotal);
      const shipping_cost = 5.99;
      const total_amount = calculateTotal(subtotal, tax_amount);

      // Create the order data with proper decimal formatting
      const orderData = {
        total_amount,
        shipping_address: formatShippingAddress(shippingData),
        tax_amount,
        discount_amount: 0,
        items: orderItems
      };
      
      console.log('Creating order with formatted data:', orderData);
      
      // Step 1: Create the order
      const orderResponse = await api.post('/orders', orderData);
      const newOrderId = orderResponse.data._id;
      setOrderId(newOrderId);
      
      // Step 2: Create payment record if payment method was selected
      if (paymentMethod) {
        try {
          const paymentData = {
            order_id: newOrderId,
            payment_method: paymentMethod,
            payment_status: 'pending'
          };
          
          await api.post('/payments', paymentData);
          console.log('Payment record created successfully');
        } catch (paymentError) {
          console.warn('Could not create payment record:', paymentError);
          // Continue with order creation even if payment record fails
        }
      }
      
      // Step 3: Clear cart after successful order creation
      try {
        await api.delete('/cart/clear');
      } catch (cartError) {
        console.warn('Could not clear cart:', cartError);
      }
      
      setSuccess('Order confirmed successfully!');
      nextStep();
      
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AddressForm 
            onSubmit={handleAddressSubmit}
            initialData={shippingData}
          />
        );
      case 1:
        return (
          <PaymentForm 
            onPaymentMethodSelect={handlePaymentMethodSelect}
            selectedMethod={paymentMethod}
          />
        );
      case 2:
        return (
          <OrderSummary 
            cartItems={cartItems} 
            shippingData={shippingData}
            paymentMethod={paymentMethod}
            shippingCost={5.99}
            tax={calculateOrderTotal() * 0.08}
            discount={0}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <Container component="main" maxWidth="md" sx={{ mb: 4, mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Add some products to your cart before proceeding to checkout.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                Order Confirmed!
              </Typography>
              <Typography variant="subtitle1" paragraph>
                Your order has been confirmed successfully. Order number: #{orderId ? orderId.slice(-8).toUpperCase() : 'N/A'}
              </Typography>
              {paymentMethod && (
                <Typography variant="body2" paragraph>
                  <strong>Payment Method:</strong> {paymentMethod.toUpperCase()}
                </Typography>
              )}
              <Typography variant="body2" paragraph>
                {paymentMethod 
                  ? 'Your payment is being processed. You will receive a confirmation email shortly.'
                  : 'You have selected to pay later. Please complete your payment before delivery.'}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/orders')}
                  sx={{ mr: 1 }}
                >
                  View Order Details
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>
              </Box>
            </>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={backStep} sx={{ mr: 1 }} disabled={loading}>
                    Back
                  </Button>
                )}
                {activeStep === 1 && (
                  <Button
                    variant="contained"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    Continue to Review
                  </Button>
                )}
                {activeStep === 2 && (
                  <Button
                    variant="contained"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Confirm Order'}
                  </Button>
                )}
              </Box>
            </>
          )}
        </>
      </Paper>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;