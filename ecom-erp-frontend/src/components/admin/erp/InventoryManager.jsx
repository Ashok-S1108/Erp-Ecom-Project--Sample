import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import ReactTable from '../../common/ReactTable';
import { createColumnHelper, statusMaps } from '../../../utils/tableColumns';
import api from '../../../services/api';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    columnHelper.text('product.name', 'Product', { size: 250 }),
    columnHelper.text('sku', 'SKU', { size: 120 }),
    {
      accessorKey: 'quantity',
      header: 'Stock Level',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(100, (row.original.quantity / row.original.maxQuantity) * 100)}
            sx={{ width: '100px', height: '8px' }}
          />
          <Typography variant="body2">{row.original.quantity}</Typography>
        </Box>
      ),
      size: 150,
    },
    columnHelper.status('status', 'Status', statusMaps.inventory, { size: 120 }),
    columnHelper.text('location', 'Location', { size: 120 }),
  ], [columnHelper]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Inventory Management</Typography>
      <ReactTable
        data={inventory}
        columns={columns}
        isLoading={loading}
        onRefresh={fetchInventory}
      />
    </Box>
  );
};

export default InventoryManager;