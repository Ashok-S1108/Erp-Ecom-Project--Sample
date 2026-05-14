import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import api from '../../../services/api';
import './OrdersManager.css';

// Utility functions
const statusChip = (status, type = 'order') => {
  const orderStatusConfig = {
    pending: { label: 'Pending', color: 'warning' },
    confirmed: { label: 'Confirmed', color: 'info' },
    processing: { label: 'Processing', color: 'secondary' },
    shipped: { label: 'Shipped', color: 'primary' },
    delivered: { label: 'Delivered', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' },
    refunded: { label: 'Refunded', color: 'default' }
  };

  const paymentStatusConfig = {
    pending: { label: 'Pending', color: 'warning' },
    paid: { label: 'Paid', color: 'success' },
    failed: { label: 'Failed', color: 'error' },
    refunded: { label: 'Refunded', color: 'info' },
    partially_refunded: { label: 'Partially Refunded', color: 'default' }
  };

  const config = type === 'payment' ? paymentStatusConfig[status] : orderStatusConfig[status];
  return config ? <Chip label={config.label} color={config.color} size="small" /> : <Chip label={status} size="small" />;
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

// Order Items Table Component
const OrderItemsTable = ({ items }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <TableRow key={item._id || index}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 50, height: 50 }}>
                      {item.product_id?.name?.charAt(0) || 'P'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {item.product_id?.name || 'Unknown Product'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        SKU: {item.product_id?.sku || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">{item.quantity || 0}</TableCell>
                <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                <TableCell align="right">
                  {formatCurrency((item.quantity || 0) * (item.price || 0))}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="textSecondary">
                  No items in this order
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Order Detail Component
const OrderDetailCard = ({ order, onStatusChange, onViewDetails }) => {
  if (!order) return null;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order._id?.substring(0, 8).toUpperCase()}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon fontSize="small" />
              <Typography variant="body2">
                Customer: {order.user_id?.name || 'Unknown Customer'} ({order.user_id?.email})
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarIcon fontSize="small" />
              <Typography variant="body2">
                Order Date: {formatDate(order.created_at)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <MoneyIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                Total: {formatCurrency(order.total_amount)}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
            {statusChip(order.order_status, 'order')}
            {statusChip(order.payment_status, 'payment')}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Order Items ({order.items?.length || 0})
        </Typography>

        <OrderItemsTable items={order.items} />

        {order.shipping_address && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Shipping Address:</Typography>
            <Typography variant="body2" color="textSecondary">
              {order.shipping_address}
            </Typography>
          </>
        )}

        {order.discount_amount > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Discount:</Typography>
            <Typography variant="body2" color="textSecondary">
              {formatCurrency(order.discount_amount)}
            </Typography>
          </>
        )}

        {order.tax_amount > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Tax:</Typography>
            <Typography variant="body2" color="textSecondary">
              {formatCurrency(order.tax_amount)}
            </Typography>
          </>
        )}

        <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
          <Button
            size="small"
            startIcon={<MoreVertIcon />}
            onClick={(e) => onStatusChange(e, order, 'order')}
          >
            Change Status
          </Button>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => onViewDetails(order)}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// API service functions
const orderAPI = {
  getOrders: () => api.get('/orders'),
  updateOrder: (id, data) => api.patch(`/orders/${id}`, data)
};

// Main OrderManager Component
const OrderManager = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Store all orders for filtering
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []); // Fetch data only once on component mount

  useEffect(() => {
    // Filter orders based on tab selection
    if (allOrders.length === 0) return;
    
    let filteredOrders = [...allOrders];
    
    // Filter by status based on tab selection
    if (tabValue === 1) filteredOrders = filteredOrders.filter(o => o.order_status === 'pending');
    if (tabValue === 2) filteredOrders = filteredOrders.filter(o => o.order_status === 'confirmed');
    if (tabValue === 3) filteredOrders = filteredOrders.filter(o => o.order_status === 'processing');
    if (tabValue === 4) filteredOrders = filteredOrders.filter(o => o.order_status === 'shipped');
    if (tabValue === 5) filteredOrders = filteredOrders.filter(o => o.order_status === 'delivered');
    if (tabValue === 6) filteredOrders = filteredOrders.filter(o => o.order_status === 'cancelled');
    
    setOrders(filteredOrders);
  }, [tabValue, allOrders]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ordersRes = await orderAPI.getOrders();
      
      // Extract orders array from response
      const ordersData = ordersRes.data?.orders || ordersRes.data || [];
      
      const validOrders = Array.isArray(ordersData) ? ordersData : [];
      setAllOrders(validOrders);
      setOrders(validOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Error fetching orders: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const orderId = order._id || '';
    const shippingAddress = order.shipping_address || '';
    const customerName = order.user_id?.name || '';
    const customerEmail = order.user_id?.email || '';
    
    return (
      orderId.toLowerCase().includes(searchLower) ||
      shippingAddress.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower) ||
      customerEmail.toLowerCase().includes(searchLower)
    );
  });

  const pendingCount = allOrders.filter(o => o?.order_status === 'pending').length;
  const confirmedCount = allOrders.filter(o => o?.order_status === 'confirmed').length;
  const processingCount = allOrders.filter(o => o?.order_status === 'processing').length;
  const shippedCount = allOrders.filter(o => o?.order_status === 'shipped').length;
  const deliveredCount = allOrders.filter(o => o?.order_status === 'delivered').length;
  const cancelledCount = allOrders.filter(o => o?.order_status === 'cancelled').length;

  const getAvailableOrderStatusOptions = (currentStatus) => {
    const statusOptions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };
    
    return statusOptions[currentStatus] || [];
  };

  const getAvailablePaymentStatusOptions = (currentStatus) => {
    const statusOptions = {
      pending: ['paid', 'failed'],
      paid: ['refunded', 'partially_refunded'],
      failed: ['pending'],
      refunded: [],
      partially_refunded: []
    };
    
    return statusOptions[currentStatus] || [];
  };

  const statusIcons = {
    confirmed: <CheckIcon fontSize="small" />,
    processing: <OrderIcon fontSize="small" />,
    shipped: <ShippingIcon fontSize="small" />,
    delivered: <CheckIcon fontSize="small" />,
    cancelled: <CloseIcon fontSize="small" />,
    paid: <PaymentIcon fontSize="small" />,
    refunded: <PaymentIcon fontSize="small" />,
    failed: <CloseIcon fontSize="small" />
  };

  const statusLabels = {
    confirmed: 'Confirm Order',
    processing: 'Mark as Processing',
    shipped: 'Mark as Shipped',
    delivered: 'Mark as Delivered',
    cancelled: 'Cancel Order',
    paid: 'Mark as Paid',
    refunded: 'Issue Full Refund',
    partially_refunded: 'Issue Partial Refund',
    failed: 'Mark as Failed'
  };

  const handleStatusUpdate = async (orderId, statusType, newStatus) => {
    try {
      const updateData = {};
      if (statusType === 'order') {
        updateData.order_status = newStatus;
      } else {
        updateData.payment_status = newStatus;
      }
      
      await orderAPI.updateOrder(orderId, updateData);
      showSnackbar(`Order ${statusType} status updated to ${newStatus} successfully`);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar('Error updating status: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setStatusMenuAnchor(null);
      setSelectedOrder(null);
    }
  };

  const openStatusMenu = (event, order, statusType) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedOrder({ ...order, statusType });
  };

  const closeStatusMenu = () => {
    setStatusMenuAnchor(null);
    setSelectedOrder(null);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const StatusMenu = () => (
    <Menu
      anchorEl={statusMenuAnchor}
      open={Boolean(statusMenuAnchor)}
      onClose={closeStatusMenu}
    >
      {selectedOrder && selectedOrder.statusType === 'order' && 
        getAvailableOrderStatusOptions(selectedOrder.order_status).map(status => (
          <MenuItem key={status} onClick={() => handleStatusUpdate(selectedOrder._id, 'order', status)}>
            <ListItemIcon>
              {statusIcons[status]}
            </ListItemIcon>
            <ListItemText>
              {statusLabels[status]}
            </ListItemText>
          </MenuItem>
        ))
      }
      
      {selectedOrder && selectedOrder.statusType === 'payment' && 
        getAvailablePaymentStatusOptions(selectedOrder.payment_status).map(status => (
          <MenuItem key={status} onClick={() => handleStatusUpdate(selectedOrder._id, 'payment', status)}>
            <ListItemIcon>
              {statusIcons[status]}
            </ListItemIcon>
            <ListItemText>
              {statusLabels[status]}
            </ListItemText>
          </MenuItem>
        ))
      }
    </Menu>
  );

  const columns = [
    { 
      field: '_id', 
      headerName: 'Order ID', 
      width: 150,
      valueGetter: (params) => params?.row?._id?.substring(0, 8).toUpperCase() || 'N/A'
    },
    { 
      field: 'customer', 
      headerName: 'Customer', 
      width: 200,
      valueGetter: (params) => `${params?.row?.user_id?.name || 'Unknown'} (${params?.row?.user_id?.email || 'N/A'})`
    },
    { 
      field: 'order_status', 
      headerName: 'Order Status', 
      width: 130,
      renderCell: (params) => statusChip(params?.row?.order_status, 'order')
    },
    { 
      field: 'payment_status', 
      headerName: 'Payment Status', 
      width: 130,
      renderCell: (params) => statusChip(params?.row?.payment_status, 'payment')
    },
    { 
      field: 'total_amount', 
      headerName: 'Total Amount', 
      width: 130,
      valueGetter: (params) => formatCurrency(params?.row?.total_amount || 0)
    },
    { 
      field: 'created_at', 
      headerName: 'Order Date', 
      width: 120,
      valueGetter: (params) => formatDate(params?.row?.created_at)
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MoreVertIcon />}
          label="Change Order Status"
          onClick={(event) => openStatusMenu(event, params.row, 'order')}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<PaymentIcon />}
          label="Change Payment Status"
          onClick={(event) => openStatusMenu(event, params.row, 'payment')}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="View Details"
          onClick={() => handleViewDetails(params.row)}
          showInMenu
        />
      ]
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="order-manager">
      <div className="header">
        <div className="title">
          <OrderIcon fontSize="large" />
          <Typography variant="h4" component="h2">
            Order Management
          </Typography>
          <Badge badgeContent={pendingCount} color="warning" sx={{ ml: 2 }}>
            <OrderIcon color="action" />
          </Badge>
          <Badge badgeContent={processingCount} color="info" sx={{ ml: 1 }}>
            <OrderIcon color="action" />
          </Badge>
          <Badge badgeContent={shippedCount} color="primary" sx={{ ml: 1 }}>
            <ShippingIcon color="action" />
          </Badge>
          <Badge badgeContent={deliveredCount} color="success" sx={{ ml: 1 }}>
            <CheckIcon color="action" />
          </Badge>
        </div>
        <div className="controls">
          <TextField
            size="small"
            placeholder="Search orders..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 250 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`All (${allOrders.length})`} />
          <Tab label={`Pending (${pendingCount})`} />
          <Tab label={`Confirmed (${confirmedCount})`} />
          <Tab label={`Processing (${processingCount})`} />
          <Tab label={`Shipped (${shippedCount})`} />
          <Tab label={`Delivered (${deliveredCount})`} />
          <Tab label={`Cancelled (${cancelledCount})`} />
        </Tabs>
      </Box>

      <StatusMenu />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredOrders.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {filteredOrders.map(order => (
                <OrderDetailCard
                  key={order._id}
                  order={order}
                  onStatusChange={(e, order, type) => openStatusMenu(e, order, type)}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </Box>
          )}

          <div className="data-grid-container">
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              loading={loading}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              components={{ Toolbar: GridToolbar }}
              disableSelectionOnClick
              getRowId={(row) => row._id || Math.random()}
              sx={{ 
                minHeight: 400, 
                display: filteredOrders.length > 0 ? 'none' : 'block',
                '& .MuiDataGrid-cell': {
                  border: '1px solid #f0f0f0'
                }
              }}
            />
          </div>

          {filteredOrders.length === 0 && !loading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No orders found. {tabValue !== 0 && 'Try changing the filter.'}
            </Alert>
          )}
        </>
      )}

      {/* Order Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Order Details #{selectedOrder?._id?.substring(0, 8).toUpperCase()}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <OrderDetailCard 
              order={selectedOrder} 
              onStatusChange={(e, order, type) => openStatusMenu(e, order, type)}
              onViewDetails={() => {}}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderManager;