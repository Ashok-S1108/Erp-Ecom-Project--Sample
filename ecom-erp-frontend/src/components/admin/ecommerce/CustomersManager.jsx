import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Chip } from '@mui/material';
import ReactTable from '../../common/ReactTable';
import { createColumnHelper } from '../../../utils/tableColumns';
import api from '../../../services/api';

const CustomersManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => (
        <Avatar src={row.original.avatar} sx={{ width: 40, height: 40 }} />
      ),
      size: 60,
    },
    columnHelper.text('name', 'Name', { size: 200 }),
    columnHelper.text('email', 'Email', { size: 250 }),
    columnHelper.number('orders', 'Orders', { size: 100 }),
    columnHelper.number('loyaltyPoints', 'Loyalty Points', { size: 120 }),
    columnHelper.boolean('status', 'Active', { size: 100 }),
  ], [columnHelper]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Customer Management</Typography>
      <ReactTable
        data={customers}
        columns={columns}
        isLoading={loading}
        onRefresh={fetchCustomers}
      />
    </Box>
  );
};

export default CustomersManager;