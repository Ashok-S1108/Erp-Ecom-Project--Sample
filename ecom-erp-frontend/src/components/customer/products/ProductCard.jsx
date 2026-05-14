// components/customer/products/ProductCard.js
import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Rating,
  Tooltip,
  Fade,
  Skeleton
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Visibility,
  FlashOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, loading = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Safe access to product properties with fallbacks
  const safeProduct = product || {};
  const productName = safeProduct.name || 'Product Name';
  const productDescription = safeProduct.description || '';
  const productPrice = safeProduct.price || 0;
  const productRating = safeProduct.rating || 0;
  const productReviewCount = safeProduct.review_count || 0;
  const productDiscount = safeProduct.discount_percentage || 0;
  const productImage = safeProduct.image_url || safeProduct.image || '/images/placeholder-product.jpeg';
  const productIsFeatured = safeProduct.is_featured || false;
  
  // Stock calculation with safe defaults
  const stock = safeProduct.stock_quantity !== undefined 
    ? safeProduct.stock_quantity 
    : safeProduct.stock !== undefined 
      ? safeProduct.stock 
      : 0;
  
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!product || !product._id) return;
    
    if (!localStorage.getItem('token')) {
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const result = await addToCart(product._id, 1);
    // Show success/error message
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleViewDetails = () => {
    if (!product || !product._id) return;
    navigate(`/products/${product._id}`);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    // Implement quick view modal
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className="product-card loading">
        <Skeleton variant="rectangular" height={250} animation="wave" />
        <CardContent>
          <Skeleton variant="text" height={32} animation="wave" />
          <Skeleton variant="text" height={72} animation="wave" />
          <Skeleton variant="text" width="60%" animation="wave" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width="100%" height={36} animation="wave" />
        </CardActions>
      </Card>
    );
  }

  // If no product data, show error card
  if (!product) {
    return (
      <Card className="product-card error">
        <CardContent>
          <Typography color="error" variant="h6">
            Product unavailable
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This product cannot be displayed at this time.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in timeout={800}>
      <Card 
        className={`product-card ${isHovered ? 'hovered' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewDetails}
      >
        {/* Product Image with Overlays */}
        <Box className="product-image-container">
          <CardMedia
            component="img"
            height="250"
            image={imageError ? '/images/placeholder-product.jpeg' : productImage}
            alt={productName}
            onError={handleImageError}
            className="product-image"
          />
          
          {/* Product Badges */}
          <Box className="product-badges">
            {productIsFeatured && (
              <Chip 
                label="Featured" 
                size="small" 
                color="primary" 
                className="product-badge"
              />
            )}
            {isOutOfStock && (
              <Chip 
                label="Out of Stock" 
                size="small" 
                color="default"
                className="product-badge"
              />
            )}
            {isLowStock && !isOutOfStock && (
              <Chip 
                label="Low Stock" 
                size="small" 
                color="warning"
                className="product-badge"
              />
            )}
            {productDiscount > 0 && (
              <Chip 
                label={`-${productDiscount}%`} 
                size="small" 
                color="error"
                className="product-badge"
              />
            )}
          </Box>

          {/* Hover Actions */}
          <Box className={`product-hover-actions ${isHovered ? 'visible' : ''}`}>
            <Tooltip title="Quick View">
              <IconButton 
                className="hover-action-btn"
                onClick={handleQuickView}
                size="small"
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
              <IconButton 
                className="hover-action-btn"
                onClick={handleToggleWishlist}
                size="small"
              >
                {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Product Content */}
        <CardContent className="product-content">
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h3" 
            className="product-title"
            noWrap
          >
            {productName}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            className="product-description"
          >
            {productDescription && productDescription.length > 80 
              ? `${productDescription.substring(0, 80)}...` 
              : productDescription
            }
          </Typography>
          
          {/* Rating */}
          <Box className="product-rating">
            <Rating 
              value={productRating} 
              readOnly 
              size="small" 
              precision={0.1}
            />
            <Typography variant="caption" color="text.secondary">
              ({productReviewCount})
            </Typography>
          </Box>

          {/* Price */}
          <Box className="product-price">
            {productDiscount > 0 ? (
              <>
                <Typography variant="h6" color="primary" className="current-price">
                  ${(productPrice * (1 - productDiscount / 100)).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="original-price">
                  ${productPrice.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" color="primary">
                ${productPrice.toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* Stock Info */}
          {!isOutOfStock && isLowStock && (
            <Typography variant="caption" color="warning.main">
              Only {stock} left in stock!
            </Typography>
          )}
        </CardContent>

        {/* Product Actions */}
        <CardActions className="product-actions">
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Tooltip title={isOutOfStock ? "Out of Stock" : "Add to Cart"}>
            <span>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                fullWidth
                className="add-to-cart-btn"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </span>
          </Tooltip>
        </CardActions>
      </Card>
    </Fade>
  );
};

export default ProductCard;