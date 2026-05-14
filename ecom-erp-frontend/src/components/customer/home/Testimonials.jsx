import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Rating } from '@mui/material';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Loyal Customer',
      avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
      rating: 5,
      text: 'The quality of the products is exceptional. I\'ve been shopping here for years and have never been disappointed.'
    },
    {
      id: 2,
      name: 'Michael Thompson',
      role: 'Verified Buyer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4,
      text: 'Fast shipping and excellent customer service. The return process was hassle-free when I needed to exchange a product.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Frequent Shopper',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5,
      text: 'Great prices and even better quality. I always check here first before buying anything online.'
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'New Customer',
      avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
      rating: 5,
      text: 'The website is easy to navigate and the checkout process was smooth. Will definitely shop here again!'
    }
  ];

  return (
    <Box className="testimonials-section">
      <Typography variant="h3" component="h2" className="section-title">
        What Our Customers Say
      </Typography>
      <Box className="testimonials-container">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="testimonial-card">
            <CardContent>
              <Rating value={testimonial.rating} readOnly className="testimonial-rating" />
              <Typography variant="body1" className="testimonial-text">
                "{testimonial.text}"
              </Typography>
              <Box className="testimonial-author">
                <Avatar 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />
                <Box className="testimonial-author-info">
                  <Typography variant="subtitle1" className="author-name">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.role}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;