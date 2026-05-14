import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TablePagination, IconButton, Tooltip 
} from '@mui/material';
import { Visibility as ViewIcon, LocalShipping as ShipIcon, Receipt as InvoiceIcon } from '@mui/icons-material';
import api from '../../../services/api';
import './RecentOrders.css';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await api.get('/orders'); // adjust to your endpoint
        setOrders(response.data.orders || []); // assuming backend returns { orders: [...] }
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'shipped': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="recent-orders">
      <h3>Recent Orders</h3>
      <TableContainer component={Paper} className="orders-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>#{order._id.slice(-6)}</TableCell>
                    <TableCell>{order.user_id?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`status-badge ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="order-actions">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {order.order_status === 'pending' && (
                          <Tooltip title="Process Shipping">
                            <IconButton size="small">
                              <ShipIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View Invoice">
                          <IconButton size="small">
                            <InvoiceIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No recent orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default RecentOrders;
