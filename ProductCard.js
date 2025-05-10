import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AddShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { addItem } from '../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [favorite, setFavorite] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem(product));
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/products/${product.slug}`}
        sx={{ flexGrow: 1 }}
      >
        {product.discountPrice && (
          <Chip
            label={`تخفیف`}
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          />
        )}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
          onClick={handleToggleFavorite}
        >
          {favorite ? (
            <FavoriteIcon color="secondary" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        {product.image ? (
          <CardMedia
            component="img"
            height="200"
            image={product.image}
            alt={product.name}
            sx={{
              objectFit: 'contain',
              bgcolor: 'background.paper',
              p: 2,
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h6">{product.name}</Typography>
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, direction: 'rtl' }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            {product.brand}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="h3"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <Rating
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary">
              ({product.reviewCount} نظر)
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1,
            }}
          >
            <Typography variant="h6" color="primary">
              {product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} تومان
            </Typography>
            {product.discountPrice && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                {product.discountPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} تومان
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<CartIcon />}
          fullWidth
          onClick={handleAddToCart}
          sx={{ direction: 'rtl' }}
        >
          افزودن به سبد خرید
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
