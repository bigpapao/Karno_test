import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import BrandCard from '../components/BrandCard';

const brands = [
  {
    id: 1,
    name: 'Kia',
    slug: 'kia',
    logo: '/images/brands/kia.png',
    partsCount: 1245,
    featured: true,
  },
  {
    id: 2,
    name: 'Hyundai',
    slug: 'hyundai',
    logo: '/images/brands/hyundai.png',
    partsCount: 1532,
    featured: true,
  },
  {
    id: 3,
    name: 'Renault',
    slug: 'renault',
    logo: '/images/brands/renault.png',
    partsCount: 987,
    featured: true,
  },
  {
    id: 4,
    name: 'Geely',
    slug: 'geely',
    logo: '/images/brands/geely.png',
    partsCount: 654,
    featured: false,
  },
  // Add more brands as needed
];

const Brands = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState('all');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      currentTab === 'all' ||
      (currentTab === 'featured' && brand.featured);
    return matchesSearch && matchesTab;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Car Brands
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Browse our extensive collection of auto parts by car brand
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="all" label="All Brands" />
              <Tab value="featured" label="Featured Brands" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredBrands.map((brand) => (
          <Grid item key={brand.id} xs={12} sm={6} md={4} lg={3}>
            <BrandCard brand={brand} />
          </Grid>
        ))}
      </Grid>

      {filteredBrands.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No brands found matching your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Brands;
