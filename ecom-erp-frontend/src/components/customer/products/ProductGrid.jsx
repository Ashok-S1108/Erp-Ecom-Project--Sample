import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Pagination, 
  Snackbar,
  Alert 
} from '@mui/material';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import Loading from '../../shared/Loading';
import api from '../../../services/api';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...products];
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category_id === filters.category || 
        product.category_id?._id === filters.category
      );
    }
    
    // Price filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }
    
    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    }
    
    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(product => product.is_featured);
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredProducts(filtered);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return <Loading />;
  }

  // Calculate pagination
  const count = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <Box className="products-page">
      <Typography variant="h4" component="h1" className="page-title">
        All Products
      </Typography>
      
      <Box className="products-container">
        <ProductFilters 
          onFilterChange={handleFilterChange} 
          categories={categories}
        />
        
        <Box className="products-grid-container">
          {paginatedProducts.length > 0 ? (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </Typography>
              
              <Grid container spacing={3} className="products-grid">
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              
              {count > 1 && (
                <Box className="pagination-container" sx={{ mt: 4 }}>
                  <Pagination
                    count={count}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box className="no-products">
              <Typography variant="h6" color="textSecondary">
                No products found matching your criteria.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => setFilteredProducts(products)}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductGrid;