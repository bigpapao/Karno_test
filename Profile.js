import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          My Profile
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary">Name</Typography>
                <Typography>{user?.firstName || ''} {user?.lastName || ''}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary">Email</Typography>
                <Typography>{user?.email || ''}</Typography>
              </Box>
              {user?.phone && (
                <Box sx={{ mb: 2 }}>
                  <Typography color="text.secondary">Phone</Typography>
                  <Typography>{user.phone}</Typography>
                </Box>
              )}
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                component={RouterLink}
                to="/edit-profile"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No orders have been placed yet.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
