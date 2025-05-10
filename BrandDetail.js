import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';

// Mock data - replace with API calls
const brandData = {
  kia: {
    name: 'Kia',
    logo: '/images/brands/kia.png',
    description:
      'Find genuine Kia parts and accessories for your vehicle. We offer a wide selection of OEM and aftermarket parts to keep your Kia running at its best.',
    popularModels: ['Sportage', 'Cerato', 'Sorento', 'Rio'],
  },
  hyundai: {
    name: 'Hyundai',
    logo: '/images/brands/hyundai.png',
    description:
      'Discover quality Hyundai parts for all models. Our extensive inventory includes everything you need for maintenance and repairs.',
    popularModels: ['Elantra', 'Tucson', 'Santa Fe', 'Accent'],
  },
  renault: {
    name: 'Renault',
    logo: '/images/brands/renault.png',
    description:
      'Shop for authentic Renault parts and accessories. We carry a complete line of OEM and aftermarket parts for your Renault vehicle.',
    popularModels: ['Duster', 'Logan', 'Sandero', 'Captur'],
  },
  geely: {
    name: 'Geely',
    logo: '/images/brands/geely.png',
    description:
      'Find the right Geely parts for your vehicle. Our selection includes genuine and compatible parts for all Geely models.',
    popularModels: ['Emgrand', 'Coolray', 'Atlas', 'Tugella'],
  },
  toyota: {
    name: 'Toyota',
    logo: '/images/brands/toyota.png',
    description:
      'Browse our collection of Toyota parts and accessories. We offer reliable parts to keep your Toyota performing at its best.',
    popularModels: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
  },
  honda: {
    name: 'Honda',
    logo: '/images/brands/honda.png',
    description:
      'Get genuine Honda parts for your vehicle. Our inventory includes everything from engine components to body parts.',
    popularModels: ['Civic', 'Accord', 'CR-V', 'Pilot'],
  },
  nissan: {
    name: 'Nissan',
    logo: '/images/brands/nissan.png',
    description:
      'Shop for quality Nissan parts and accessories. Find everything you need for your Nissan vehicle in one place.',
    popularModels: ['Altima', 'Maxima', 'Rogue', 'Pathfinder'],
  },
  bmw: {
    name: 'BMW',
    logo: '/images/brands/bmw.png',
    description:
      'Discover premium BMW parts and accessories. Our selection includes high-quality components for all BMW series.',
    popularModels: ['3 Series', '5 Series', 'X3', 'X5'],
  },
};

const products = [
  {
    id: 1,
    name: 'Kia Sportage Brake Pad Set',
    slug: 'kia-sportage-brake-pad-set',
    brand: 'Kia',
    price: 89.99,
    discount: 10,
    rating: 4.5,
    reviewCount: 128,
    image: '/images/products/brake-pads.jpg',
    category: 'Brakes',
  },
  // Add more products
];

const BrandDetail = () => {
  const { brandSlug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const brand = brandData[brandSlug] || {
    name: 'Brand Not Found',
    logo: '',
    description: 'The brand you are looking for is not available at the moment.',
    popularModels: [],
  };

  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brands: [
      { id: 1, name: 'OEM', count: 156, checked: false },
      { id: 2, name: 'Aftermarket', count: 98, checked: false },
    ],
    categories: [
      { id: 1, name: 'Engine', count: 45, selected: false },
      { id: 2, name: 'Brakes', count: 32, selected: false },
      { id: 3, name: 'Suspension', count: 28, selected: false },
    ],
    availability: {
      inStock: false,
      onSale: false,
    },
    rating: '',
    sortBy: 'popular',
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      ...filters,
      priceRange: [0, 1000],
      brands: filters.brands.map((b) => ({ ...b, checked: false })),
      categories: filters.categories.map((c) => ({ ...c, selected: false })),
      availability: { inStock: false, onSale: false },
      rating: '',
      sortBy: 'popular',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/brands" color="inherit">
          Brands
        </Link>
        <Typography color="text.primary">{brand.name}</Typography>
      </Breadcrumbs>

      {/* Brand Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            {brand.logo ? (
              <Box
                component="img"
                src={brand.logo}
                alt={brand.name}
                sx={{
                  width: '100%',
                  maxHeight: 120,
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.light',
                  color: 'white',
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {brand.name}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" component="h1" gutterBottom>
              {brand.name} Parts & Accessories
            </Typography>
            <Typography color="text.secondary" paragraph>
              {brand.description}
            </Typography>
            {brand.popularModels && brand.popularModels.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Popular Models:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {brand.popularModels.map((model) => (
                    <Button
                      key={model}
                      variant="outlined"
                      size="small"
                      component={RouterLink}
                      to={`/brands/${brandSlug}/${model.toLowerCase()}`}
                    >
                      {model}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar />
      </Box>

      {/* Tabs and Filter Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(e, value) => setCurrentTab(value)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="all" label="All Parts" />
          <Tab value="popular" label="Most Popular" />
          <Tab value="new" label="New Arrivals" />
          <Tab value="sale" label="On Sale" />
        </Tabs>
        {isMobile && (
          <IconButton
            onClick={() => setFilterOpen(true)}
            sx={{ ml: 2 }}
          >
            <FilterIcon />
          </IconButton>
        )}
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filter Sidebar */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Grid>
        )}

        {/* Product Grid */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} lg={4}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <FilterSidebar
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}
    </Container>
  );
};

export default BrandDetail;
