import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Chip } from '@mui/material';
import ReactTable from '../../common/ReactTable';
import { createColumnHelper } from '../../../utils/tableColumns';
import api from '../../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/audit-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    columnHelper.date('timestamp', 'Date/Time', { size: 180 }),
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={row.original.user?.avatar} sx={{ width: 32, height: 32 }} />
          {row.original.user?.name || 'System'}
        </Box>
      ),
      size: 200,
    },
    columnHelper.text('action', 'Action', { size: 150 }),
    columnHelper.text('entity', 'Entity', { size: 120 }),
    columnHelper.text('entityId', 'Entity ID', { size: 120 }),
    columnHelper.text('details', 'Details', { size: 300 }),
    columnHelper.text('ipAddress', 'IP Address', { size: 150 }),
  ], [columnHelper]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Audit Logs</Typography>
      <ReactTable
        data={logs}
        columns={columns}
        isLoading={loading}
        onRefresh={fetchLogs}
      />
    </Box>
  );
};

export default AuditLogs;