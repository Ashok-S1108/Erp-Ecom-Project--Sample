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
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PayPal as PayPalIcon
} from '@mui/icons-material';

const PaymentForm = ({ onPaymentMethodSelect, selectedMethod }) => {
  const paymentMethods = [
    {
      value: 'credit_card',
      label: 'Credit Card',
      icon: <CreditCardIcon />,
      description: 'Pay with Visa, MasterCard, or American Express'
    },
    {
      value: 'paypal',
      label: 'PayPal',
      icon: <PayPalIcon />,
      description: 'Pay securely with your PayPal account'
    },
    {
      value: 'bank_transfer',
      label: 'Bank Transfer',
      icon: <BankIcon />,
      description: 'Direct bank transfer payment'
    },
    {
      value: 'cash_on_delivery',
      label: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay in cash when your order is delivered'
    }
  ];

  const handleMethodSelect = (method) => {
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
          sx={{ mt: 2 }}
        >
          {paymentMethods.map((method) => (
            <Paper
              key={method.value}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                cursor: 'pointer',
                borderColor: selectedMethod === method.value ? 'primary.main' : 'grey.300',
                backgroundColor: selectedMethod === method.value ? 'primary.light' : 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleMethodSelect(method.value)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  sx={{ flexGrow: 1, m: 0 }}
                />
              </Box>
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