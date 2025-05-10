import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Chip,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  Divider,
  TextField,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { fetchProductDetails } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import ProductImageGallery from '../components/ProductImageGallery';
import RelatedProducts from '../components/RelatedProducts';
import ReviewSection from '../components/ReviewSection';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= product?.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleFavorite = () => {
    if (isAuthenticated) {
      setIsFavorite(!isFavorite);
      // TODO: Implement wishlist functionality
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" py={8} sx={{ direction: 'rtl' }}>
          خطا در بارگذاری جزئیات محصول. لطفا بعدا دوباره امتحان کنید.
        </Typography>
      </Container>
    );
  }
  if (!product) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3, direction: 'rtl' }}>
        <Link component={RouterLink} to="/" color="inherit">
          خانه
        </Link>
        <Link component={RouterLink} to="/products" color="inherit">
          محصولات
        </Link>
        <Link
          component={RouterLink}
          to={`/products?category=${product.category}`}
          color="inherit"
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {/* Product Overview */}
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <ProductImageGallery images={product.images} />
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ direction: 'rtl' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                ({product.reviewCount} نظر)
              </Typography>
            </Box>

            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              {product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} تومان
            </Typography>

            {product.stockQuantity > 0 ? (
              <Chip
                label="موجود"
                color="success"
                size="small"
                sx={{ mb: 2 }}
              />
            ) : (
              <Chip
                label="ناموجود"
                color="error"
                size="small"
                sx={{ mb: 2 }}
              />
            )}

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ ml: 2 }}>تعداد:</Typography>
              <IconButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                type="number"
                size="small"
                inputProps={{ min: 1, max: product.stockQuantity }}
                sx={{ width: 60, mx: 1 }}
              />
              <IconButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stockQuantity}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={!product.stockQuantity}
                fullWidth
                sx={{ direction: 'rtl' }}
              >
                افزودن به سبد خرید
              </Button>
              <IconButton onClick={toggleFavorite} color={isFavorite ? 'primary' : 'default'}>
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Box>

            {/* Product Details */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ direction: 'rtl' }}>
                مشخصات محصول:
              </Typography>
              <Grid container spacing={2} sx={{ direction: 'rtl' }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    برند:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{product.brand}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    کد محصول:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{product.sku}</Typography>
                </Grid>
                {/* Add more product details as needed */}
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Box sx={{ mt: 6, direction: 'rtl' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="توضیحات" />
          <Tab label="مشخصات فنی" />
          <Tab label="نظرات" />
          <Tab label="ارسال و مرجوعی" />
        </Tabs>
        <Divider />
        <Box sx={{ py: 4 }}>
          {activeTab === 0 && (
            <Typography variant="body1" sx={{ direction: 'rtl' }}>{product.fullDescription}</Typography>
          )}
          {activeTab === 1 && (
            <Grid container spacing={2} sx={{ direction: 'rtl' }}>
              {product.specifications?.map((spec, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      {spec.name}:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Typography variant="body2">{spec.value}</Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          )}
          {activeTab === 2 && <ReviewSection productId={id} />}
          {activeTab === 3 && (
            <Box sx={{ direction: 'rtl' }}>
              <Typography variant="h6" gutterBottom>
                اطلاعات ارسال
              </Typography>
              <Typography variant="body2" paragraph>
                ارسال رایگان برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان. زمان ارسال استاندارد ۳ تا ۵ روز کاری است.
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                شرایط مرجوعی
              </Typography>
              <Typography variant="body2">
                اگر از خرید خود راضی نیستید، می‌توانید آن را ظرف مدت ۳۰ روز برای دریافت کامل وجه برگردانید.
                لطفاً اطمینان حاصل کنید که کالا استفاده نشده و در بسته‌بندی اصلی خود است.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Related Products */}
      <Box sx={{ mt: 6, direction: 'rtl' }}>
        <Typography variant="h5" gutterBottom>
          محصولات مرتبط
        </Typography>
        <RelatedProducts
          category={product.category}
          currentProductId={id}
        />
      </Box>
    </Container>
  );
};

export default ProductDetail;
