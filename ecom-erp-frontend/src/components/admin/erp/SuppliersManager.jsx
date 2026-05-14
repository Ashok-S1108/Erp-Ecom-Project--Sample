import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Chip } from '@mui/material';
import ReactTable from '../../common/ReactTable';
import { createColumnHelper } from '../../../utils/tableColumns';
import api from '../../../services/api';

const SuppliersManager = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'logo',
      header: '',
      cell: ({ row }) => (
        <Avatar src={row.original.logo} sx={{ width: 40, height: 40 }} />
      ),
      size: 60,
    },
    columnHelper.text('name', 'Supplier', { size: 200 }),
    columnHelper.text('email', 'Email', { size: 250 }),
    columnHelper.text('phone', 'Phone', { size: 150 }),
    columnHelper.number('products', 'Products', { size: 100 }),
    columnHelper.boolean('status', 'Active', { size: 100 }),
  ], [columnHelper]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Supplier Management</Typography>
      <ReactTable
        data={suppliers}
        columns={columns}
        isLoading={loading}
        onRefresh={fetchSuppliers}
      />
    </Box>
  );
};

export default SuppliersManager;