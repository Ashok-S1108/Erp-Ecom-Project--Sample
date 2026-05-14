import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ProductCard from '../products/ProductCard';
import Loading from '../../shared/Loading';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchFeaturedProducts = async () => {
      try {
        // In a real app, this would be an API call
        const mockProducts = [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 129.99,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.5,
            reviews: 128
          },
          {
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            category: 'Accessories',
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.2,
            reviews: 86
          },
          {
            id: 3,
            name: 'Wireless Earbuds',
            price: 89.99,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.7,
            reviews: 204
          },
          {
            id: 4,
            name: 'Running Shoes',
            price: 79.99,
            category: 'Footwear',
            image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.3,
            reviews: 152
          }
        ];
        
        setProducts(mockProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Box className="featured-products-section">
      <Typography variant="h3" component="h2" className="section-title">
        Featured Products
      </Typography>
      <Grid container spacing={3} className="products-grid">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;