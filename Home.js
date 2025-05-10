import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedBrands from '../components/FeaturedBrands';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedBrands />
      <WhyChooseUs />
    </>
  );
};

export default Home;
