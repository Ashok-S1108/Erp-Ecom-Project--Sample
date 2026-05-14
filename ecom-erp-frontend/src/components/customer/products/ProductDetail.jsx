// pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  Fab
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ZoomIn,
  ArrowBack,
  Add,
  Remove
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import api from '../../../services/api';
import './ProductDetail.css';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Safe field mappings =====
  const stock = product?.stock_quantity ?? 0;
  const images = product?.images?.length > 0
    ? product.images
    : product?.image_url
      ? [product.image_url]
      : ['/images/placeholder-product.jpeg'];
  const mainImage = images[selectedImage] || '/images/placeholder-product.jpeg';
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;
  const category = product?.category || 'Uncategorized';

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) {
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (!product?._id) return;

    try {
      await addToCart(product._id, quantity);
      // Optionally show a success notification
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Implement wishlist API call
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setImageDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, stock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // ===== Loading & Error States =====
  if (loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/products">Products</Link>
        <Typography color="text.primary">{category}</Typography>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={mainImage}
                alt={product.name}
                sx={{ width: '100%', height: 400, objectFit: 'contain', cursor: 'zoom-in', borderRadius: 1 }}
                onClick={() => handleImageClick(selectedImage)}
                onError={(e) => {
                  if (e.target.src !== '/images/placeholder-product.jpeg') {
                    e.target.src = '/images/placeholder-product.jpeg';
                  }
                }}
              />

              <Fab
                size="small"
                color="primary"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                onClick={() => handleImageClick(selectedImage)}
              >
                <ZoomIn />
              </Fab>

              <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {isOutOfStock && <Chip label="Out of Stock" color="default" size="small" />}
                {isLowStock && !isOutOfStock && <Chip label="Low Stock" color="warning" size="small" />}
              </Box>
            </Box>

            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                {images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedImage === index ? 2 : 0,
                      borderColor: 'primary.main',
                      opacity: selectedImage === index ? 1 : 0.7,
                      transition: 'opacity 0.2s ease'
                    }}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => { if (e.target.src !== '/images/placeholder-product.jpeg') e.target.src = '/images/placeholder-product.jpeg'; }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="700">{product.name}</Typography>

            {category && <Chip label={category} variant="outlined" sx={{ mb: 2 }} />}

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary">${product.price?.toFixed(2) ?? '0.00'}</Typography>
            </Box>

            <Typography variant="body1" paragraph>{product.description}</Typography>
            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Quantity</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={decrementQuantity} disabled={quantity <= 1}><Remove /></IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(stock, parseInt(e.target.value) || 1));
                      setQuantity(value);
                    }}
                    inputProps={{ min: 1, max: stock, style: { textAlign: 'center', width: 60 } }}
                    sx={{ mx: 1 }}
                  />
                  <IconButton onClick={incrementQuantity} disabled={quantity >= stock}><Add /></IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">{stock} available in stock</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                sx={{ py: 1.5, px: 3, flexGrow: 1, minWidth: 200 }}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>

              <IconButton color={isWishlisted ? "error" : "default"} onClick={handleToggleWishlist} sx={{ border: 1, borderColor: 'divider', width: 56, height: 56 }}>
                {isWishlisted ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

              <IconButton onClick={handleShare} sx={{ border: 1, borderColor: 'divider', width: 56, height: 56 }}>
                <Share />
              </IconButton>
            </Box>

            {isLowStock && !isOutOfStock && (
              <Alert severity="warning" sx={{ mt: 2 }}>Only {stock} left in stock - order soon!</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Paper sx={{ mt: 4, borderRadius: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Description" />
          <Tab label="Shipping & Returns" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" whiteSpace="pre-line">{product.description}</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Shipping Information</Typography>
          <Typography variant="body1" paragraph>
            • Free shipping on orders over $50<br/>
            • Standard shipping: 3-5 business days<br/>
            • Express shipping available<br/>
            • International shipping available
          </Typography>
          <Typography variant="h6" gutterBottom>Return Policy</Typography>
          <Typography variant="body1">
            • 30-day money-back guarantee<br/>
            • Free returns within 30 days<br/>
            • Items must be in original condition
          </Typography>
        </TabPanel>
      </Paper>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="lg">
        <DialogContent>
          <Box
            component="img"
            src={mainImage}
            alt={product.name}
            sx={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
            onError={(e) => { if (e.target.src !== '/images/placeholder-product.jpeg') e.target.src = '/images/placeholder-product.jpeg'; }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProductDetail;
