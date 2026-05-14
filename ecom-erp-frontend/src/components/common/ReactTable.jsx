// components/common/ReactTable.jsx
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  Box,
  IconButton,
  Typography,
  Chip,
  Checkbox,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
  FilterList,
  Refresh,
} from '@mui/icons-material';

const ReactTable = ({
  data,
  columns,
  isLoading = false,
  enablePagination = true,
  enableSorting = true,
  enableFiltering = true,
  enableRowSelection = false,
  onRowClick,
  onRefresh,
  rowSelection,
  onRowSelectionChange,
  density = 'medium',
}) => {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const rows = data.map(row => ({ ...row, id: row._id }));

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      rowSelection,
    },
    getRowId: row => row._id || row.id, // <-- Add this line
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection,
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  const densityStyles = {
    small: { padding: '8px' },
    medium: { padding: '12px' },
    large: { padding: '16px' },
  };

  return (
    <Box>
      {/* Table Controls */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {enableFiltering && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <FilterList color="action" />
            <TextField
              size="small"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              sx={{ minWidth: 300 }}
            />
          </Box>
        )}

        {onRefresh && (
          <IconButton onClick={onRefresh} size="small">
            <Refresh />
          </IconButton>
        )}

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={density === 'small'}
              onChange={(e) => console.log('Density changed')}
            />
          }
          label="Compact view"
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          {/* Header */}
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableRowSelection && (
                  <TableCell sx={{ backgroundColor: 'grey.100', width: '50px' }}>
                    <Checkbox
                      size="small"
                      checked={table.getIsAllRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                  </TableCell>
                )}
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'grey.100',
                      cursor: enableSorting && header.column.getCanSort() ? 'pointer' : 'default',
                      width: header.column.columnDef.size,
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {enableSorting && header.column.getCanSort() && (
                        <TableSortLabel
                          active={header.column.getIsSorted() !== false}
                          direction={header.column.getIsSorted() || 'asc'}
                        />
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          {/* Body */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)} 
                  align="center"
                  sx={densityStyles[density]}
                >
                  <Typography>Loading data...</Typography>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)} 
                  align="center"
                  sx={densityStyles[density]}
                >
                  <Typography>No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': onRowClick ? { backgroundColor: 'action.hover' } : {},
                  }}
                >
                  {enableRowSelection && (
                    <TableCell sx={densityStyles[density]}>
                      <Checkbox
                        size="small"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={densityStyles[density]}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {enablePagination && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              size="small"
            >
              <FirstPage />
            </IconButton>
            <IconButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="body2">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </Typography>
            
            <IconButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="small"
            >
              <ChevronRight />
            </IconButton>
            <IconButton
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              size="small"
            >
              <LastPage />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Show</Typography>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <Typography variant="body2">entries</Typography>
          </Box>

          <Typography variant="body2">
            {table.getFilteredRowModel().rows.length} total records
          </Typography>

          {enableRowSelection && (
            <Typography variant="body2">
              {Object.keys(rowSelection || {}).length} selected
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ReactTable;