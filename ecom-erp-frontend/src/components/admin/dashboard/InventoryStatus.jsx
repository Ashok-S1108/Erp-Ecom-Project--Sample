import React, { useEffect, useState } from 'react';
import { 
  DataGrid,
  GridToolbar,
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { 
  Warning as WarningIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { 
  Button,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import api from '../../../services/api';
import './InventoryStatus.css';

const InventoryStatus = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get('/inventory');
        setInventory(response.data);
        
        // Count low stock items (quantity < threshold)
        const lowStock = response.data.filter(item => 
          item.quantity < item.lowStockThreshold
        ).length;
        setLowStockCount(lowStock);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const columns = [
    { 
      field: 'productName', 
      headerName: 'Product', 
      width: 200,
      renderCell: (params) => (
        <div className="product-cell">
          <img 
            src={params.row.productImage || '/placeholder-product.png'} 
            alt={params.row.productName}
            className="product-image"
          />
          {params.row.productName}
        </div>
      )
    },
    { field: 'sku', headerName: 'SKU', width: 120 },
    { 
      field: 'quantity', 
      headerName: 'Stock', 
      width: 150,
      renderCell: (params) => (
        <div className="stock-cell">
          <LinearProgress 
            variant="determinate" 
            value={Math.min(100, (params.value / params.row.maxStock) * 100)}
            className={`stock-progress ${
              params.value < params.row.lowStockThreshold ? 'low' : 
              params.value === 0 ? 'out' : 'normal'
            }`}
          />
          <span className="stock-value">
            {params.value} {params.value < params.row.lowStockThreshold && (
              <WarningIcon color="warning" fontSize="small" />
            )}
          </span>
        </div>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          color={
            params.value === 'In Stock' ? 'success' :
            params.value === 'Low Stock' ? 'warning' : 'error'
          }
        />
      )
    },
    { field: 'location', headerName: 'Location', width: 120 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row.id)}
        />,
      ],
    },
  ];

  const handleEdit = (id) => {
    // Handle edit action
    console.log('Edit inventory item:', id);
  };

  const handleAddStock = () => {
    // Handle add stock action
  };

  return (
    <div className="inventory-status">
      <div className="inventory-header">
        <div className="header-title">
          <InventoryIcon fontSize="large" />
          <h3>Inventory Status</h3>
          {lowStockCount > 0 && (
            <Chip 
              label={`${lowStockCount} Low Stock Items`}
              color="warning"
              icon={<WarningIcon />}
            />
          )}
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStock}
        >
          Add Stock
        </Button>
      </div>

      {lowStockCount > 0 && (
        <Alert severity="warning" className="low-stock-alert">
          <AlertTitle>Attention Needed</AlertTitle>
          You have {lowStockCount} item{lowStockCount !== 1 ? 's' : ''} with low stock levels.
          Consider reordering soon to avoid stockouts.
        </Alert>
      )}

      <div className="inventory-grid">
        <DataGrid
          rows={inventory}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </div>
    </div>
  );
};

export default InventoryStatus;