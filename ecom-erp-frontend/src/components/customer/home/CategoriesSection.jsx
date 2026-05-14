import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: 'Clothing',
      icon: 'fas fa-tshirt',
      items: 1245,
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      name: 'Electronics',
      icon: 'fas fa-mobile-alt',
      items: 876,
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      name: 'Home & Garden',
      icon: 'fas fa-couch',
      items: 543,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      name: 'Health & Beauty',
      icon: 'fas fa-heartbeat',
      items: 765,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 5,
      name: 'Sports',
      icon: 'fas fa-futbol',
      items: 432,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 6,
      name: 'Books',
      icon: 'fas fa-book',
      items: 987,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <Box className="categories-section">
      <Typography variant="h3" component="h2" className="section-title">
        Shop by Category
      </Typography>
      <Grid container spacing={3} className="categories-grid">
        {categories.map((category) => (
          <Grid item xs={6} md={4} lg={2} key={category.id}>
            <Card 
              component={Link} 
              to={`/products?category=${category.name}`}
              className="category-card"
            >
              <Box className="category-image-container">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="category-image"
                />
                <Box className="category-overlay">
                  <i className={category.icon}></i>
                </Box>
              </Box>
              <CardContent className="category-content">
                <Typography variant="h6" className="category-name">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {category.items} items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoriesSection;