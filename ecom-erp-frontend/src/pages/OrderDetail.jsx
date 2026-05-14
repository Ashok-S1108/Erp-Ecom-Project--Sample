import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import api from '../../services/api';
import Loading from '../shared/Loading';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <Container>
        <Typography variant="h4">Order not found</Typography>
      </Container>
    );
  }

  return (
    <Container className="order-detail-page">
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          to="/orders"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Order #{order._id.slice(-8).toUpperCase()}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            size="large"
          />
        </Box>
        
        <Typography variant="body2" color="textSecondary">
          Placed on {formatDate(order.createdAt)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            
            <List>
              {order.items.map((item, index) => (
                <React.Fragment key={item._id || index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        src={item.image_url}
                        alt={item.name}
                        variant="square"
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                  {index < order.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShippingIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Shipping Address</Typography>
            </Box>
            
            <Typography variant="body1">
              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress?.street}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress?.country}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress?.phone}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaymentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Payment Information</Typography>
            </Box>
            
            <Typography variant="body2">
              Method: {order.paymentMethod}
            </Typography>
            <Typography variant="body2">
              Status: {order.paymentStatus || 'Paid'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">${order.subtotal?.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Shipping:</Typography>
              <Typography variant="body2">${order.shipping?.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2">${order.tax?.toFixed(2)}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${order.total?.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;