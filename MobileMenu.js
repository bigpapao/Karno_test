import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  Home,
  DirectionsCar,
  Build,
  ShoppingCart,
  Person,
  Article,
  Info,
  ContactSupport,
  Close as CloseIcon,
} from '@mui/icons-material';
import { toggleMobileMenu } from '../store/slices/uiSlice';

const MobileMenu = () => {
  const dispatch = useDispatch();
  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(toggleMobileMenu());
  };

  const menuItems = [
    { text: 'صفحه اصلی', icon: <Home />, path: '/' },
    { text: 'برندها', icon: <DirectionsCar />, path: '/brands' },
    { text: 'محصولات', icon: <Build />, path: '/products' },
    { text: 'سبد خرید', icon: <ShoppingCart />, path: '/cart' },
    { text: 'وبلاگ', icon: <Article />, path: '/blog' },
    { text: 'درباره ما', icon: <Info />, path: '/about' },
    { text: 'تماس با ما', icon: <ContactSupport />, path: '/contact' },
  ];

  const accountItems = isAuthenticated
    ? [
        { text: 'پروفایل', icon: <Person />, path: '/profile' },
        { text: 'سفارشات', icon: <ShoppingCart />, path: '/orders' },
      ]
    : [
        { text: 'ورود', icon: <Person />, path: '/login' },
        { text: 'ثبت نام', icon: <Person />, path: '/register' },
      ];

  return (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 280 },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          کارنو
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {accountItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MobileMenu;
