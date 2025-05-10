import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  Alert,
  Snackbar,
  Button,
  Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendedProducts from '../components/RecommendedProducts';

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Get products from Redux store
  const { products, loading } = useSelector((state) => state.product) || { products: [], loading: false };
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brands: [],
    categories: [],
    availability: 'all',
    rating: 0,
    sortBy: 'relevance',
  });
  
  // Check for welcome message from registration
  useEffect(() => {
    if (location.state && location.state.message) {
      setAlertMessage(location.state.message);
      setAlertOpen(true);
    }
  }, [location]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      brands: [],
      categories: [],
      availability: 'all',
      rating: 0,
      sortBy: 'relevance',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome message snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      
      {/* Welcome section for new users */}
      {location.state && location.state.message && (
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 2, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            direction: 'rtl',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
            به فروشگاه کارنو خوش آمدید!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            برای شروع، می‌توانید از محصولات زیر دیدن کنید یا از فیلترها برای یافتن محصولات مورد نظر خود استفاده کنید.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => setAlertOpen(false)}
            sx={{ alignSelf: 'flex-start' }}
          >
            شروع خرید
          </Button>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, direction: 'rtl' }}>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          محصولات ما
        </Typography>
        {isMobile && (
          <IconButton
            onClick={() => setMobileFilterOpen(true)}
            sx={{ mr: 2 }}
            aria-label="نمایش فیلترها"
          >
            <FilterListIcon />
          </IconButton>
        )}
      </Box>
      <Grid container spacing={3}>
        {!isMobile ? (
          <Grid item xs={12} md={3}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Grid>
        ) : (
          <Drawer
            anchor="left"
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onClose={() => setMobileFilterOpen(false)}
            />
          </Drawer>
        )}
        <Grid item xs={12} md={9}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Show recommended products for new users */}
              {location.state && location.state.message && (
                <Box sx={{ mb: 5 }}>
                  <RecommendedProducts title="محصولات پرفروش" limit={4} />
                  <Divider sx={{ my: 4 }} />
                </Box>
              )}
              
              <Grid container spacing={3}>
                {products && products.length > 0 ? (
                  products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id || index}>
                      <ProductCard product={product} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography align="center" sx={{ direction: 'rtl' }}>
                      هیچ محصولی مطابق با معیارهای شما یافت نشد
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;
