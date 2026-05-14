import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip
} from '@mui/material';

// ✅ Correct icon imports
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import PeopleIcon from '@mui/icons-material/People';   // safer alternative to Diversity



import {
  Store as StoreIcon,
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  HeadsetMic as SupportIcon,
} from '@mui/icons-material';

import './About.css';

const About = () => {
  const features = [
  {
    icon: <StoreIcon sx={{ fontSize: 40 }} />,
    title: 'Wide Selection',
    description: 'Thousands of products across multiple categories to choose from'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure Shopping',
    description: 'Your data and payments are protected with industry-standard security'
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping to your doorstep'
  },
  {
    icon: <HeadsetMicIcon sx={{ fontSize: 40 }} />,
    title: '24/7 Support',
    description: 'Our customer service team is always here to help you'
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 40 }} />, // swapped Diversity1 for People
    title: 'Diverse Products',
    description: 'From electronics to fashion, we have something for everyone'
  }
];



  const stats = [
    { number: '100K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Products' },
    { number: '10+', label: 'Years Experience' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <Box className="about-page">
      {/* Hero Section */}
      <Box className="about-hero">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
              About ShopEasy
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', margin: '0 auto' }}>
              Your trusted partner for all your shopping needs. We make online shopping easy, secure, and enjoyable.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Our Story */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Our Story
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Founded in 2014, ShopEasy started as a small local business with a simple mission:
                to make online shopping accessible and enjoyable for everyone. What began as a modest
                online store has grown into a comprehensive e-commerce platform serving customers worldwide.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Our journey has been guided by our core values of quality, reliability, and customer
                satisfaction. We believe that shopping should be a seamless experience, and we're
                constantly innovating to make that vision a reality.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                Today, we're proud to offer a wide range of products, from electronics and fashion
                to home goods and beyond, all while maintaining the personal touch that made us who we are.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/api/placeholder/500/300"
                alt="Our Story"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Typography variant="h3" component="div" color="primary" gutterBottom>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 60,
                        height: 60,
                        margin: '0 auto 16px',
                        color: 'white'
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" component="h3" gutterBottom color="primary">
                Our Mission
              </Typography>
              <Typography variant="body1">
                To provide exceptional value and service to our customers by offering high-quality
                products, competitive prices, and an unparalleled shopping experience that makes
                e-commerce accessible to everyone.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" component="h3" gutterBottom color="primary">
                Our Vision
              </Typography>
              <Typography variant="body1">
                To become the world's most customer-centric online marketplace, where people can
                find and discover anything they want to buy online, with the trust and convenience
                that redefines the shopping experience.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Values */}
        <Box>
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Our Values
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {[
              'Customer First',
              'Innovation',
              'Integrity',
              'Quality',
              'Sustainability',
              'Community',
              'Excellence',
              'Trust'
            ].map((value, index) => (
              <Chip
                key={index}
                label={value}
                color="primary"
                variant="outlined"
                sx={{ m: 0.5, fontSize: '1.1rem', padding: 2 }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
