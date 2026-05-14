// utils/tableColumns.js
import { Chip, Avatar } from '@mui/material';

export const createColumnHelper = () => {
  return {
    text: (accessor, header, options = {}) => ({
      accessorKey: accessor,
      header,
      ...options,
    }),

    number: (accessor, header, options = {}) => ({
      accessorKey: accessor,
      header,
      cell: ({ getValue }) => getValue()?.toLocaleString() || '0',
      ...options,
    }),

    currency: (accessor, header, options = {}) => ({
      accessorKey: accessor,
      header,
      cell: ({ getValue }) => getValue() ? `$${getValue().toFixed(2)}` : '$0.00',
      ...options,
    }),

    date: (accessor, header, options = {}) => ({
      accessorKey: accessor,
      header,
      cell: ({ getValue }) => getValue() ? new Date(getValue()).toLocaleDateString() : 'N/A',
      ...options,
    }),

    boolean: (accessor, header, options = {}) => ({
      accessorKey: accessor,
      header,
      cell: ({ getValue }) => (
        <Chip
          label={getValue() ? 'Yes' : 'No'}
          color={getValue() ? 'success' : 'default'}
          size="small"
        />
      ),
      ...options,
    }),

    image: (accessor, header, options = {}) => ({
      accessorKey: accessor,
      header,
      cell: ({ getValue }) => (
        <Avatar
          src={getValue() || '/placeholder.png'}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      ),
      size: 70,
      ...options,
    }),

    status: (accessor, header, statusMap, options = {}) => ({
      accessorKey: accessor,
      header,
      cell: ({ getValue }) => {
        const status = statusMap[getValue()] || statusMap.default;
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
          />
        );
      },
      ...options,
    }),
  };
};

// Status maps for common use cases
export const statusMaps = {
  order: {
    pending: { label: 'Pending', color: 'warning' },
    processing: { label: 'Processing', color: 'info' },
    completed: { label: 'Completed', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' },
    default: { label: 'Unknown', color: 'default' },
  },
  payment: {
    pending: { label: 'Pending', color: 'warning' },
    paid: { label: 'Paid', color: 'success' },
    failed: { label: 'Failed', color: 'error' },
    refunded: { label: 'Refunded', color: 'info' },
    default: { label: 'Unknown', color: 'default' },
  },
  inventory: {
    in_stock: { label: 'In Stock', color: 'success' },
    low_stock: { label: 'Low Stock', color: 'warning' },
    out_of_stock: { label: 'Out of Stock', color: 'error' },
    default: { label: 'Unknown', color: 'default' },
  },
};