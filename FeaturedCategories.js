import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';

const categories = [
  {
    id: 1,
    title: 'قطعات موتور',
    description: 'قطعات موتور با کیفیت بالا برای عملکرد بهینه',
    image: '/images/categories/engine.jpg',
    link: '/products?category=engine',
  },
  {
    id: 2,
    title: 'سیستم ترمز',
    description: 'قطعات ترمز قابل اعتماد برای ایمنی شما',
    image: '/images/categories/brakes.jpg',
    link: '/products?category=brakes',
  },
  {
    id: 3,
    title: 'سیستم تعلیق',
    description: 'سواری راحت با قطعات تعلیق با کیفیت',
    image: '/images/categories/suspension.jpg',
    link: '/products?category=suspension',
  },
  {
    id: 4,
    title: 'گیربکس',
    description: 'گیربکس خود را به راحتی روان نگه دارید',
    image: '/images/categories/transmission.jpg',
    link: '/products?category=transmission',
  },
  {
    id: 5,
    title: 'برق خودرو',
    description: 'قطعات الکتریکی برای تمام مدل‌های خودرو',
    image: '/images/categories/electrical.jpg',
    link: '/products?category=electrical',
  },
  {
    id: 6,
    title: 'قطعات بدنه',
    description: 'قطعات بدنه با کیفیت برای تعمیرات و ارتقاء',
    image: '/images/categories/body.jpg',
    link: '/products?category=body',
  },
];

const FeaturedCategories = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 4,
            direction: 'rtl',
          }}
        >
          خرید بر اساس دسته‌بندی
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(category.link)}
                  sx={{ flexGrow: 1 }}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: category.id % 2 === 0 ? '#2196f3' : '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" color="white" align="center">
                      {category.title}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      sx={{ fontWeight: 600, direction: 'rtl' }}
                    >
                      {category.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, direction: 'rtl' }}
                    >
                      {category.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&::after': {
                          content: '"→"',
                          marginLeft: '4px',
                          transition: 'transform 0.2s',
                        },
                        '&:hover::after': {
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      مشاهده دسته‌بندی
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedCategories;
