import React from 'react';
import { Container } from '@mui/material';
import HeroSection from '../components/customer/home/HeroSection';
import FeaturedProducts from '../components/customer/home/FeaturedProducts';
import CategoriesSection from '../components/customer/home/CategoriesSection';
import Testimonials from '../components/customer/home/Testimonials';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <Container>
        <FeaturedProducts />
        <CategoriesSection />
        <Testimonials />
      </Container>
    </div>
  );
};

export default Home;