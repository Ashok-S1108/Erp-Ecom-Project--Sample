import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/shared/Loading';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/history?page=${page}&limit=10`);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box className="order-history">
      <Typography variant="h5" gutterBottom>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Paper elevation={2} className="no-orders">
          <Typography variant="h6" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Start shopping to see your orders here.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>#{order._id.slice(-8).toUpperCase()}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>{order.items?.length || 0} item(s)</TableCell>
                    <TableCell>
                      ${(Number(order.total_amount) || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.order_status}
                        color={getStatusColor(order.order_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`/orders/${order._id}`}
                        size="small"
                        variant="outlined"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default OrderHistory;
