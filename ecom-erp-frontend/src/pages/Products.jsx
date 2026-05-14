import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Tune as FilterIcon,
  Clear as ClearIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/customer/products/ProductCard';
import ProductFilters from '../components/customer/products/ProductFilters';
import Loading from '../components/shared/Loading';
import api from '../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: [0, 3000],
    inStock: false,
    featured: false,
    search: searchParams.get('search') || ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productsPerPage = 12;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, sortBy]);

  useEffect(() => {
    // Update URL with current filters
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const applyFilters = () => {
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

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (isMobile) {
      setMobileFiltersOpen(false); // Close drawer after applying filters on mobile
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 3000],
      inStock: false,
      featured: false,
      search: ''
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Calculate pagination
  const count = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const activeFilterCount = [
    filters.category,
    filters.inStock,
    filters.featured,
    filters.search,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 3000
  ].filter(Boolean).length;

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="xl" className="products-page" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box className="products-header" sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" className="page-title" fontWeight="700" gutterBottom>
          Our Products
        </Typography>
        <Typography variant="h6" color="textSecondary" className="page-subtitle">
          Discover our amazing collection of products
        </Typography>
      </Box>

      {/* Search and Controls Bar */}
      <Paper
        elevation={0}
        className="products-controls"
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)'
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search products by name, description, or tags..."
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                sx={{ borderRadius: 2, backgroundColor: 'white' }}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="price-low">Price (Low to High)</MenuItem>
                <MenuItem value="price-high">Price (High to Low)</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { md: 'flex-end' } }}>
              <Badge badgeContent={activeFilterCount} color="primary">
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setMobileFiltersOpen(true)}
                  className="filter-toggle-btn"
                  sx={{ borderRadius: 2 }}
                >
                  Filters
                </Button>
              </Badge>

              {activeFilterCount > 0 && (
                <Button
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  sx={{ borderRadius: 2 }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Filters Display */}
      {(filters.search || filters.category) && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Active filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.search && (
              <Chip
                label={`Search: "${filters.search}"`}
                onDelete={() => setFilters(prev => ({ ...prev, search: '' }))}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.category && (
              <Chip
                label={`Category: ${categories.find(c => c._id === filters.category)?.name}`}
                onDelete={() => setFilters(prev => ({ ...prev, category: '' }))}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Paper>
      )}

      {/* Main Content */}
      <Grid container spacing={3} className="products-container">
        {/* Desktop Filters Sidebar */}
        {!isMobile && (
          <Grid item xs={12} md={3} className="desktop-filters">
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                position: 'sticky',
                top: 100,
                maxHeight: 'calc(100vh - 140px)',
                overflowY: 'auto'
              }}
            >
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
              />
            </Paper>
          </Grid>
        )}

        {/* Mobile Filters Drawer */}
        <Drawer
          anchor="right"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{
            sx: { width: { xs: '100%', sm: 400 } }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </Box>
        </Drawer>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Box className="products-grid-container">
            {/* Results Count */}
            <Box className="results-info" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" fontWeight="500">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <Grid container spacing={3} className="products-grid">
                  {paginatedProducts && paginatedProducts.map((product) => (
                    <Grid item xs={12} sm={6} lg={4} key={product._id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {count > 1 && (
                  <Box className="pagination-container" sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      count={count}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper elevation={0} className="no-products" sx={{ p: 6, textAlign: 'center' }}>
                <Box className="no-products-content">
                  <Typography variant="h5" color="textSecondary" gutterBottom fontWeight="500">
                    No products found
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                    Try adjusting your filters or search terms
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleClearFilters}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;