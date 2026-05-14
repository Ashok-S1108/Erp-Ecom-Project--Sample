// components/checkout/PaymentForm.js
import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button
} from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';

const PaymentForm = ({ onPaymentMethodSelect, selectedMethod }) => {
  const paymentMethods = [
    {
      value: 'credit_card',
      label: 'Credit Card',
      icon: <PaymentsIcon />,
      description: 'Pay with Visa, MasterCard, or American Express'
    },
    {
      value: 'paypal',
      label: 'PayPal',
      icon: <PaymentsIcon />,
      description: 'Pay securely with your PayPal account'
    },
    {
      value: 'bank_transfer',
      label: 'Bank Transfer',
      icon: <PaymentsIcon />,
      description: 'Direct bank transfer payment'
    },
    {
      value: 'cash_on_delivery',
      label: 'Cash on Delivery',
      icon: <PaymentsIcon />,
      description: 'Pay in cash when your order is delivered'
    }
  ];

  const handleMethodSelect = (event) => {
    const method = event.target.value;
    onPaymentMethodSelect(method);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>
      
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Choose how you want to pay</FormLabel>
        <RadioGroup
          value={selectedMethod}
          onChange={handleMethodSelect}
          sx={{ mt: 2 }}
        >
          {paymentMethods.map((method) => (
            <Paper
              key={method.value}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                borderColor: selectedMethod === method.value ? 'primary.main' : 'grey.300',
                backgroundColor: selectedMethod === method.value ? 'primary.light' : 'background.paper',
              }}
            >
              <FormControlLabel
                value={method.value}
                control={<Radio />}
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle1" component="div">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {method.icon}
                        {method.label}
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.description}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Paper>
          ))}
        </RadioGroup>
      </FormControl>

      {selectedMethod && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>Selected:</strong> {paymentMethods.find(m => m.value === selectedMethod)?.label}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Payment will be processed after order confirmation. You can complete the payment later.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PaymentForm;