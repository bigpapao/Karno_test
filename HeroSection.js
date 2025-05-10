import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchBar from './SearchBar';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        color: 'white',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                direction: 'rtl',
              }}
            >
              قطعات مناسب خودروی خود را پیدا کنید
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontWeight: 400,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                direction: 'rtl',
              }}
            >
              قطعات خودرو با کیفیت برای تمام برندهای معتبر با پشتیبانی تخصصی و تحویل سریع
            </Typography>
            
            <Box sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: 2, borderRadius: 2, boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
              <SearchBar />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm="auto">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/products')}
                  fullWidth={isMobile}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                  }}
                >
                  خرید کنید
                </Button>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/brands')}
                  fullWidth={isMobile}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  مشاهده برندها
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                height: 400,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.3))',
              }}
            >
              <Typography variant="h4" color="white" align="center" sx={{ direction: 'rtl' }}>
                قطعات خودرو با کیفیت برتر
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Trust Indicators */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 4,
            borderTop: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            {[
              { number: '50,000+', text: 'قطعات موجود' },
              { number: '24/7', text: 'پشتیبانی مشتری' },
              { number: '100%', text: 'محصولات اصل' },
              { number: 'سریع', text: 'تحویل سراسری' },
            ].map((item, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {item.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.9,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
