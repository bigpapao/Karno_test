import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import {
  LocalShipping,
  Verified,
  Support,
  Security,
  ThumbUp,
  AttachMoney,
} from '@mui/icons-material';

const features = [
  {
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    title: 'ارسال سریع',
    description: 'تحویل سریع و قابل اعتماد در سراسر کشور با قابلیت ردیابی آنلاین',
  },
  {
    icon: <Verified sx={{ fontSize: 40 }} />,
    title: 'قطعات اصل',
    description: 'تمام قطعات اصل هستند و دارای گارانتی شرکت سازنده می‌باشند',
  },
  {
    icon: <Support sx={{ fontSize: 40 }} />,
    title: 'پشتیبانی 24/7',
    description: 'پشتیبانی فنی تخصصی در تمام ساعات شبانه‌روز',
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: 'خرید امن',
    description: 'تراکنش‌های شما با رمزگذاری پیشرفته محافظت می‌شوند',
  },
  {
    icon: <ThumbUp sx={{ fontSize: 40 }} />,
    title: 'بازگشت آسان',
    description: 'سیاست بازگشت 30 روزه بدون دردسر برای آرامش خاطر شما',
  },
  {
    icon: <AttachMoney sx={{ fontSize: 40 }} />,
    title: 'بهترین قیمت‌ها',
    description: 'قیمت‌های رقابتی با تخفیف‌ها و پیشنهادات منظم',
  },
];

const WhyChooseUs = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              direction: 'rtl',
            }}
          >
            چرا ما را انتخاب کنید
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              direction: 'rtl',
            }}
          >
            ما متعهد به ارائه بهترین تجربه خرید قطعات خودرو هستیم
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                    borderColor: 'primary.main',
                    '& .icon': {
                      color: 'primary.main',
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <Box
                  className="icon"
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: 600, direction: 'rtl' }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ direction: 'rtl' }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Trust Badges */}
        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 500, direction: 'rtl' }}
          >
            مورد اعتماد هزاران مشتری
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            {[
              'امنیت SSL',
              'رضایت تضمین شده',
              'قطعات اصل',
              'پرداخت امن',
            ].map((badge, index) => (
              <Grid item key={index}>
                <Paper
                  sx={{
                    height: 60,
                    width: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    opacity: 0.7,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {badge}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
