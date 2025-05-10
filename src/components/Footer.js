import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              کارنو
            </Typography>
            <Typography variant="body2" color="text.secondary">
              فروشگاه یک‌مرحله‌ای شما برای قطعات و لوازم جانبی با کیفیت خودرو.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              لینک‌های سریع
            </Typography>
            <Link
              component={RouterLink}
              to="/products"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              محصولات
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              درباره ما
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              تماس با ما
            </Link>
            <Link
              component={RouterLink}
              to="/blog"
              color="text.secondary"
              display="block"
            >
              وبلاگ
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              خدمات مشتری
            </Typography>
            <Link
              component={RouterLink}
              to="/shipping"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              اطلاعات ارسال
            </Link>
            <Link
              component={RouterLink}
              to="/returns"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              بازگشت و تعویض
            </Link>
            <Link
              component={RouterLink}
              to="/faq"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              سوالات متداول
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              display="block"
            >
              شرایط و قوانین
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              ارتباط با ما
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              خیابان شماره 1234
              <br />
              شهر، استان 12345
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              تلفن: 7890-456 (123)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ایمیل: info@karno.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 2 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} کارنو. تمامی حقوق محفوظ است.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
