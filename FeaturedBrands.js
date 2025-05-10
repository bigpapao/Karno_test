import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Button,
} from '@mui/material';

const brands = [
  {
    id: 1,
    name: 'Kia',
    logo: '/images/brands/kia.png',
    slug: 'kia',
  },
  {
    id: 2,
    name: 'Hyundai',
    logo: '/images/brands/hyundai.png',
    slug: 'hyundai',
  },
  {
    id: 3,
    name: 'Renault',
    logo: '/images/brands/renault.png',
    slug: 'renault',
  },
  {
    id: 4,
    name: 'Geely',
    logo: '/images/brands/geely.png',
    slug: 'geely',
  },
  {
    id: 5,
    name: 'Toyota',
    logo: '/images/brands/toyota.png',
    slug: 'toyota',
  },
  {
    id: 6,
    name: 'Honda',
    logo: '/images/brands/honda.png',
    slug: 'honda',
  },
  {
    id: 7,
    name: 'Nissan',
    logo: '/images/brands/nissan.png',
    slug: 'nissan',
  },
  {
    id: 8,
    name: 'BMW',
    logo: '/images/brands/bmw.png',
    slug: 'bmw',
  },
];

const FeaturedBrands = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              direction: 'rtl',
            }}
          >
            برندهای محبوب
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/brands')}
            sx={{
              display: { xs: 'none', sm: 'block' },
              textTransform: 'none',
            }}
          >
            مشاهده همه برندها
          </Button>
        </Box>

        <Grid container spacing={3}>
          {brands.map((brand) => (
            <Grid item xs={6} sm={4} md={3} key={brand.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/brands/${brand.slug}`)}
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      bgcolor: 'primary.light',
                      color: 'white',
                      borderRadius: 1,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {brand.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{ fontWeight: 500 }}
                  >
                    {brand.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'center',
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => navigate('/brands')}
            sx={{ textTransform: 'none' }}
          >
            مشاهده همه برندها
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedBrands;
