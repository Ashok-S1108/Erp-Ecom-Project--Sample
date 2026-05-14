import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <Box className="hero-section">
      <Grid container spacing={4} alignItems="center" className="hero-container">
        <Grid item xs={12} md={6}>
          <Box className="hero-content">
            <Typography variant="h2" component="h1" className="hero-title">
              Summer Collection 2023
            </Typography>
            <Typography variant="h6" className="hero-subtitle">
              Discover the latest trends and get up to 30% off on all new arrivals. 
              Free shipping on orders over $50.
            </Typography>
            <Box className="hero-actions">
              <Button 
                variant="contained" 
                size="large" 
                component={Link}
                to="/products"
                className="hero-btn primary"
              >
                Shop Now
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                className="hero-btn secondary"
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className="hero-image-container">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
              alt="Fashion Collection" 
              className="hero-image"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;