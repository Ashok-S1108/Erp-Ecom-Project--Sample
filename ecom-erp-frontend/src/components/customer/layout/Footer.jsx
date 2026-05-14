// src/components/customer/layout/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import './Footer.css';

const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box className="footer-section">
              <Typography variant="h6" gutterBottom className="footer-title">
                🛍️ ShopEasy
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your one-stop destination for quality products at affordable prices. 
                We're committed to providing the best shopping experience.
              </Typography>
              <Box className="social-links">
                <IconButton size="small" className="social-btn">
                  <Facebook />
                </IconButton>
                <IconButton size="small" className="social-btn">
                  <Twitter />
                </IconButton>
                <IconButton size="small" className="social-btn">
                  <Instagram />
                </IconButton>
                <IconButton size="small" className="social-btn">
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Box className="footer-section">
              <Typography variant="h6" gutterBottom className="footer-title">
                Shop
              </Typography>
              <Link href="/products" className="footer-link">All Products</Link>
              <Link href="/categories" className="footer-link">Categories</Link>
              <Link href="/new-arrivals" className="footer-link">New Arrivals</Link>
              <Link href="/featured" className="footer-link">Featured</Link>
              <Link href="/deals" className="footer-link">Deals & Offers</Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} md={2}>
            <Box className="footer-section">
              <Typography variant="h6" gutterBottom className="footer-title">
                Support
              </Typography>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/faq" className="footer-link">FAQ</Link>
              <Link href="/shipping" className="footer-link">Shipping Info</Link>
              <Link href="/returns" className="footer-link">Returns</Link>
              <Link href="/size-guide" className="footer-link">Size Guide</Link>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} md={2}>
            <Box className="footer-section">
              <Typography variant="h6" gutterBottom className="footer-title">
                Company
              </Typography>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/careers" className="footer-link">Careers</Link>
              <Link href="/blog" className="footer-link">Blog</Link>
              <Link href="/press" className="footer-link">Press</Link>
              <Link href="/affiliates" className="footer-link">Affiliates</Link>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={2}>
            <Box className="footer-section">
              <Typography variant="h6" gutterBottom className="footer-title">
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Subscribe to get special offers, free giveaways, and updates.
              </Typography>
              <TextField
                size="small"
                placeholder="Your email"
                fullWidth
                sx={{ mb: 1 }}
              />
              <Button variant="contained" fullWidth>
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Contact Info */}
        <Box className="contact-info">
          <Box className="contact-item">
            <Phone fontSize="small" />
            <Typography variant="body2">+1 (555) 123-4567</Typography>
          </Box>
          <Box className="contact-item">
            <Email fontSize="small" />
            <Typography variant="body2">support@shopeasy.com</Typography>
          </Box>
          <Box className="contact-item">
            <LocationOn fontSize="small" />
            <Typography variant="body2">123 Commerce St, City, State 12345</Typography>
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Box className="footer-bottom">
          <Typography variant="body2">
            © 2024 ShopEasy. All rights reserved.
          </Typography>
          <Box className="footer-bottom-links">
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/cookies" className="footer-link">Cookie Policy</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;