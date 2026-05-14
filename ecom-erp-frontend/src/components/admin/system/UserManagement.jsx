import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ReactTable from '../../common/ReactTable';
import { createColumnHelper } from '../../../utils/tableColumns';
import api from '../../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
    columnHelper.text('role', 'Role', { size: 120 }),
    columnHelper.boolean('status', 'Active', { size: 100 }),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small"><Edit fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
      ),
      size: 100,
    },
  ], [columnHelper]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <ReactTable
        data={users}
        columns={columns}
        isLoading={loading}
        onRefresh={fetchUsers}
      />
    </Box>
  );
};

export default UserManagement;