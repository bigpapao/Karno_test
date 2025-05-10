import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;
