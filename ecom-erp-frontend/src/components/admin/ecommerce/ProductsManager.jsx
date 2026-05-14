import React, { useState, useEffect, useMemo } from 'react';
import { Button, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import ReactTable from '../../common/ReactTable';
import { createColumnHelper } from '../../../utils/tableColumns';
import api from '../../../services/api';
import AddProductModal from './AddProductModal';

const ProductsManager = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const columnHelper = createColumnHelper();
  const [pagination, setPagination] = useState({ pageIndex: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setPagination({ pageIndex: 0 });
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditOpen(true);
  };

  const columns = useMemo(() => [
    columnHelper.image('image_url', 'Image'),
    columnHelper.text('name', 'Product Name', { size: 200 }),
    columnHelper.currency('price', 'Price', { size: 100 }),
    columnHelper.number('stock_quantity', 'Stock', { size: 100 }),
    columnHelper.text('sku', 'SKU', { size: 120 }),
    columnHelper.boolean('is_featured', 'Featured', { size: 100 }),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small"><Visibility fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(row.original)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.original._id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      size: 120,
    },
  ], [columnHelper, products]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Product Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      <ReactTable
        data={products}
        columns={columns}
        isLoading={loading}
        onRefresh={fetchProducts}
      />

      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onProductAdded={fetchProducts}
      />
      <AddProductModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingProduct(null);
        }}
        onProductAdded={() => {
          fetchProducts();
          setEditOpen(false);
          setEditingProduct(null);
        }}
        initialData={editingProduct}
      />
    </Box>
  );
};

export default ProductsManager;