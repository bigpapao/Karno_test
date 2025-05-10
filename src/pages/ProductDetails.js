import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetails = () => {
  const { productSlug } = useParams();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  
  // Find the product by slug
  const product = products?.find(p => p.slug === productSlug);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <Container>
        <Typography>Product not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {product.image ? (
            <ProductImageGallery images={[{ url: product.image, alt: product.name }]} />
          ) : (
            <Box
              sx={{
                height: 400,
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4">{product.name}</Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" color="primary">
              ${product.price.toFixed(2)}
            </Typography>
            {product.discountPrice && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${product.discountPrice.toFixed(2)}
              </Typography>
            )}
          </Box>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Box sx={{ my: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() =>
                dispatch({ type: 'cart/addItem', payload: product })
              }
            >
              Add to Cart
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Brand:
              </Typography>
              <Typography variant="body2">{product.brand}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Category:
              </Typography>
              <Typography variant="body2">{product.category}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Availability:
              </Typography>
              <Typography variant="body2" color={product.inStock ? 'success.main' : 'error.main'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6">{product.rating}</Typography>
          <Typography variant="body2">out of 5</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Based on {product.reviewCount} reviews
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Related Products
        </Typography>
        <Grid container spacing={3}>
          {products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 3)
            .map(relatedProduct => (
              <Grid item xs={12} sm={6} md={4} key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetails;
