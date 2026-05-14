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
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  InputAdornment,
  Grid,
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
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as ProcurementIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import api from '../../../services/api';
import './ProcurementManager.css';

// Utility functions
const statusChip = (status) => {
  const statusConfig = {
    pending: { label: 'Pending', color: 'warning' },
    approved: { label: 'Approved', color: 'info' },
    ordered: { label: 'Ordered', color: 'primary' },
    shipped: { label: 'Shipped', color: 'secondary' },
    completed: { label: 'Completed', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' }
  };

  const config = statusConfig[status] || { label: status, color: 'default' };
  return <Chip label={config.label} color={config.color} size="small" />;
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
const OrderItemsTable = ({ orderItems, products, onUpdateItem, onRemoveItem }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>Product</InputLabel>
                  <Select
                    value={item.product_id}
                    label="Product"
                    onChange={(e) => onUpdateItem(index, 'product_id', e.target.value)}
                    required
                  >
                    {products.map(product => (
                      <MenuItem key={product._id} value={product._id}>
                        {product.name} - {formatCurrency(product.price)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(index, 'quantity', e.target.value)}
                  inputProps={{ min: 1 }}
                  required
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  size="small"
                  value={item.unit_price}
                  onChange={(e) => onUpdateItem(index, 'unit_price', e.target.value)}
                  inputProps={{ step: "0.01", min: 0 }}
                  required
                />
              </TableCell>
              <TableCell>
                {formatCurrency(item.quantity * item.unit_price)}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onRemoveItem(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Procurement Form Component
const ProcurementForm = ({ procurement, suppliers, products, orderItems, setOrderItems, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    supplier_id: procurement?.supplier_id?._id || procurement?.supplier_id || '',
    expected_delivery_date: procurement?.expected_delivery_date?.split('T')[0] || '',
    notes: procurement?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      products: orderItems.map(item => ({
        product_id: item.product_id,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price)
      }))
    };
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeOrderItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const updateOrderItem = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
    
    if (field === 'product_id' && value) {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        newItems[index].unit_price = selectedProduct.price || 0;
      }
    }
    
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Supplier</InputLabel>
              <Select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                label="Supplier"
              >
                {suppliers.map(supplier => (
                  <MenuItem key={supplier._id} value={supplier._id}>
                    {supplier.name} - {supplier.phone}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="expected_delivery_date"
              label="Expected Delivery Date"
              type="date"
              value={formData.expected_delivery_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="notes"
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Order Items</Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={addOrderItem}>
                Add Item
              </Button>
            </Box>
            
            {orderItems.length > 0 ? (
              <OrderItemsTable
                orderItems={orderItems}
                products={products}
                onUpdateItem={updateOrderItem}
                onRemoveItem={removeOrderItem}
              />
            ) : (
              <Alert severity="info">No items added to this order</Alert>
            )}
            
            {orderItems.length > 0 && (
              <Box mt={2} textAlign="right">
                <Typography variant="h6">
                  Total: {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={orderItems.length === 0}>
          {procurement ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

// Procurement Detail Card Component
const ProcurementDetailCard = ({ procurement, onEdit, onStatusChange, onDelete }) => {
  if (!procurement) return null;
  
  const supplierName = procurement.supplier_id?.name || 'N/A';
  const totalAmount = procurement.total_amount || 0;
  const products = Array.isArray(procurement.products) ? procurement.products : [];
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Procurement #{procurement._id ? procurement._id.substring(0, 8) : 'N/A'}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon fontSize="small" />
              <Typography variant="body2">
                Supplier: {supplierName}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarIcon fontSize="small" />
              <Typography variant="body2">
                Expected: {formatDate(procurement.expected_delivery_date)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <MoneyIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                Total: {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </Box>
          {statusChip(procurement.status)}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Products ({products.length})
        </Typography>
        
        {products.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.product_id?.name || 'Unknown Product'}
                      {item.product_id?.sku && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          SKU: {item.product_id.sku}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">{item.quantity || 0}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unit_price || 0)}</TableCell>
                    <TableCell align="right">{formatCurrency((item.quantity || 0) * (item.unit_price || 0))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No products in this procurement
          </Typography>
        )}
        
        {procurement.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Notes:</Typography>
            <Typography variant="body2" color="textSecondary">
              {procurement.notes}
            </Typography>
          </>
        )}

        <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(procurement)}
            disabled={procurement.status === 'completed' || procurement.status === 'cancelled'}
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<MoreVertIcon />}
            onClick={(e) => onStatusChange(e, procurement)}
          >
            Change Status
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(procurement._id)}
            disabled={procurement.status === 'completed'}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// API service functions
const procurementAPI = {
  getProcurements: () => api.get('/procurements'),
  getProcurementById: (id) => api.get(`/procurements/${id}`),
  createProcurement: (data) => api.post('/procurements', data),
  updateProcurement: (id, data) => api.put(`/procurements/${id}`, data),
  updateProcurementStatus: (id, data) => api.put(`/procurements/${id}/status`, data),
  deleteProcurement: (id) => api.delete(`/procurements/${id}`)
};

// Main ProcurementManager Component
const ProcurementManager = () => {
  const [tabValue, setTabValue] = useState(0);
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProcurement, setCurrentProcurement] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [orderItems, setOrderItems] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, total: 0, limit: 10 });
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedProcurement, setSelectedProcurement] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [procurementsRes, suppliersRes, productsRes] = await Promise.all([
        procurementAPI.getProcurements(),
        api.get('/suppliers'),
        api.get('/products')
      ]);
      
      const procurementsData = procurementsRes.data?.procurements || procurementsRes.data || [];
      const suppliersData = suppliersRes.data?.suppliers || suppliersRes.data || [];
      const productsData = productsRes.data?.products || productsRes.data || [];
      
      let filteredProcurements = Array.isArray(procurementsData) ? procurementsData : [];
      if (tabValue === 1) filteredProcurements = filteredProcurements.filter(p => p.status === 'pending');
      if (tabValue === 2) filteredProcurements = filteredProcurements.filter(p => p.status === 'ordered');
      if (tabValue === 3) filteredProcurements = filteredProcurements.filter(p => p.status === 'completed');
      if (tabValue === 4) filteredProcurements = filteredProcurements.filter(p => p.status === 'cancelled');
      
      setProcurements(filteredProcurements);
      setSuppliers(suppliersData);
      setProducts(productsData);
      
      if (procurementsRes.data?.pagination) {
        setPagination(procurementsRes.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data: ' + error.message, 'error');
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

  const filteredProcurements = procurements.filter(procurement => {
    if (!procurement) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const supplierName = procurement.supplier_id?.name || '';
    const procurementId = procurement._id || '';
    
    return (
      procurementId.toLowerCase().includes(searchLower) ||
      supplierName.toLowerCase().includes(searchLower)
    );
  });

  const pendingCount = procurements.filter(p => p?.status === 'pending').length;
  const orderedCount = procurements.filter(p => p?.status === 'ordered').length;
  const completedCount = procurements.filter(p => p?.status === 'completed').length;
  const cancelledCount = procurements.filter(p => p?.status === 'cancelled').length;

  const getAvailableStatusOptions = (currentStatus) => {
    const statusOptions = {
      pending: ['approved', 'ordered', 'cancelled'],
      approved: ['ordered', 'cancelled'],
      ordered: ['shipped', 'completed', 'cancelled'],
      shipped: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };
    
    return statusOptions[currentStatus] || [];
  };

  const statusIcons = {
    approved: <CheckIcon fontSize="small" />,
    ordered: <ProcurementIcon fontSize="small" />,
    shipped: <ProcurementIcon fontSize="small" />,
    completed: <InventoryIcon fontSize="small" />,
    cancelled: <CloseIcon fontSize="small" />
  };

  const statusLabels = {
    approved: 'Approve',
    ordered: 'Mark as Ordered',
    shipped: 'Mark as Shipped',
    completed: 'Mark as Completed',
    cancelled: 'Cancel'
  };

  const handleStatusUpdate = async (procurementId, newStatus) => {
    try {
      await procurementAPI.updateProcurementStatus(procurementId, { status: newStatus });
      showSnackbar(`Procurement status updated to ${newStatus} successfully`);
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar('Error updating status: ' + error.message, 'error');
    } finally {
      setStatusMenuAnchor(null);
      setSelectedProcurement(null);
    }
  };

  const openStatusMenu = (event, procurement) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedProcurement(procurement);
  };

  const closeStatusMenu = () => {
    setStatusMenuAnchor(null);
    setSelectedProcurement(null);
  };

  const handleEdit = async (procurement) => {
    try {
      const response = await procurementAPI.getProcurementById(procurement._id);
      const fullProcurement = response.data;
      
      setCurrentProcurement(fullProcurement);
      setOrderItems(fullProcurement.products || []);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching procurement details:', error);
      showSnackbar('Error loading procurement details', 'error');
    }
  };

  const handleCreate = async (formData) => {
    try {
      await procurementAPI.createProcurement(formData);
      showSnackbar('Procurement created successfully');
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error creating procurement:', error);
      showSnackbar('Error creating procurement: ' + error.message, 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await procurementAPI.updateProcurement(currentProcurement._id, formData);
      showSnackbar('Procurement updated successfully');
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error updating procurement:', error);
      showSnackbar('Error updating procurement: ' + error.message, 'error');
    }
  };

  const handleDelete = async (procurementId) => {
    if (window.confirm('Are you sure you want to delete this procurement?')) {
      try {
        await procurementAPI.deleteProcurement(procurementId);
        showSnackbar('Procurement deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting procurement:', error);
        showSnackbar('Error deleting procurement: ' + error.message, 'error');
      }
    }
  };

  const StatusMenu = () => (
    <Menu
      anchorEl={statusMenuAnchor}
      open={Boolean(statusMenuAnchor)}
      onClose={closeStatusMenu}
    >
      {selectedProcurement && getAvailableStatusOptions(selectedProcurement.status).map(status => (
        <MenuItem key={status} onClick={() => handleStatusUpdate(selectedProcurement._id, status)}>
          <ListItemIcon>
            {statusIcons[status]}
          </ListItemIcon>
          <ListItemText>
            {statusLabels[status]}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );

  const columns = [
    { 
      field: '_id', 
      headerName: 'Procurement ID', 
      width: 150,
      valueGetter: (params) => params?.row?._id?.substring(0, 8) + '...' || 'N/A'
    },
    { 
      field: 'supplier', 
      headerName: 'Supplier', 
      width: 200,
      valueGetter: (params) => params?.row?.supplier_id?.name || 'N/A'
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => statusChip(params?.row?.status)
    },
    { 
      field: 'total_amount', 
      headerName: 'Total Amount', 
      width: 130,
      valueGetter: (params) => formatCurrency(params?.row?.total_amount || 0)
    },
    { 
      field: 'created_at', 
      headerName: 'Created Date', 
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
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<MoreVertIcon />}
          label="Change Status"
          onClick={(event) => openStatusMenu(event, params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => handleDelete(params.row._id)}
          showInMenu
          disabled={params.row.status === 'completed'}
        />
      ]
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAdd = () => {
    setCurrentProcurement(null);
    setOrderItems([]);
    setOpenDialog(true);
  };

  return (
    <div className="procurement-manager">
      <div className="header">
        <div className="title">
          <ProcurementIcon fontSize="large" />
          <Typography variant="h4" component="h2">
            Procurement Management
          </Typography>
          <Badge badgeContent={pendingCount} color="warning" sx={{ ml: 2 }}>
            <ProcurementIcon color="action" />
          </Badge>
          <Badge badgeContent={orderedCount} color="primary" sx={{ ml: 1 }}>
            <ProcurementIcon color="action" />
          </Badge>
          <Badge badgeContent={completedCount} color="success" sx={{ ml: 1 }}>
            <CheckIcon color="action" />
          </Badge>
          <Badge badgeContent={cancelledCount} color="error" sx={{ ml: 1 }}>
            <CloseIcon color="action" />
          </Badge>
        </div>
        <div className="controls">
          <TextField
            size="small"
            placeholder="Search procurements..."
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            New Procurement
          </Button>
        </div>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`All (${procurements.length})`} />
          <Tab label={`Pending (${pendingCount})`} />
          <Tab label={`Ordered (${orderedCount})`} />
          <Tab label={`Completed (${completedCount})`} />
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
          {filteredProcurements.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {filteredProcurements.map(procurement => (
                <ProcurementDetailCard
                  key={procurement._id}
                  procurement={procurement}
                  onEdit={handleEdit}
                  onStatusChange={openStatusMenu}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          )}

          <div className="data-grid-container">
            <DataGrid
              rows={filteredProcurements}
              columns={columns}
              loading={loading}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              components={{ Toolbar: GridToolbar }}
              disableSelectionOnClick
              getRowId={(row) => row._id || Math.random()}
              sx={{ 
                minHeight: 400, 
                display: filteredProcurements.length > 0 ? 'none' : 'block',
                '& .MuiDataGrid-cell': {
                  border: '1px solid #f0f0f0'
                }
              }}
            />
          </div>

          {filteredProcurements.length === 0 && !loading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No procurements found. {tabValue !== 0 && 'Try changing the filter or'} 
              <Button onClick={handleAdd} sx={{ ml: 1 }}>
                Create a new procurement
              </Button>
            </Alert>
          )}
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProcurement ? `Edit Procurement #${currentProcurement._id?.substring(0, 8)}` : 'Create New Procurement'}
        </DialogTitle>
        <ProcurementForm
          procurement={currentProcurement}
          suppliers={suppliers}
          products={products}
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          onSubmit={currentProcurement ? handleUpdate : handleCreate}
          onCancel={() => setOpenDialog(false)}
        />
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

export default ProcurementManager;