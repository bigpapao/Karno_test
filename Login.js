import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { login, clearError, googleLogin } from '../store/slices/authSlice';
import { auth, signInWithEmailAndPassword, signInWithGoogle } from '../firebase';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // Keep this for redirect after successful login

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth); // Added isAuthenticated

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'info' });

  // Effect to handle displaying messages (redirect, Redux errors)
  useEffect(() => {
    const fromRedirect = location.state?.from;
    const currentPath = location.pathname; // Added for dependency array

    if (error) { // Prioritize showing login attempt errors from Redux
      setAlertInfo({ open: true, message: error, severity: 'error' });
      dispatch(clearError()); // Clear error from Redux after displaying
      if (fromRedirect) {
        navigate(currentPath, { replace: true, state: {} });
      }
    } else if (fromRedirect && !isAuthenticated) { // Show redirect message if no error and not authenticated
      setAlertInfo({
        open: true,
        message: 'لطفا به حساب کاربری خود وارد شوید.',
        severity: 'info',
      });
      navigate(currentPath, { replace: true, state: {} });
    } 
  }, [location.state, location.pathname, isAuthenticated, error, dispatch, navigate]); // Added location.pathname to dependencies

  // Clear Redux error when component mounts (first load)
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = 'ایمیل الزامی است';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'فرمت ایمیل نامعتبر است';
    }

    if (!formData.password) {
      errors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      errors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormErrors({}); // Clear previous errors

    try {
      // Step 1: Sign in with Firebase
      console.log('Attempting Firebase login with:', { email: formData.email, password: '***' });
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      console.log('Firebase login successful:', firebaseUser.uid);

      // Step 2: Dispatch action to log in with your backend (if needed)
      // This might be for fetching user profile, roles, or setting backend session
      console.log('Attempting backend login with:', { email: formData.email, password: '***' });
      const result = await dispatch(login(formData)).unwrap(); // formData contains email and password
      console.log('Backend login successful:', result);
      
      if (result.user && result.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'خطا در ورود. لطفا دوباره تلاش کنید.';
      if (err.code) { // Firebase error
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-credential': // Covers wrong password and user not found for newer SDKs
            errorMessage = 'ایمیل یا رمز عبور نامعتبر است.';
            break;
          case 'auth/wrong-password': // Older SDK might still throw this specifically
            errorMessage = 'رمز عبور اشتباه است.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'فرمت ایمیل نامعتبر است.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'دسترسی به این حساب به دلیل فعالیت غیرمعمول به طور موقت غیرفعال شده است. لطفا رمز عبور خود را بازنشانی کنید یا بعدا دوباره امتحان کنید.';
            break;
          default:
            errorMessage = err.message; // Default Firebase error message
        }
      } else if (err.message) { // Backend error from dispatch(login)
         if (err.message.includes('اتصال به سرور')) {
          errorMessage = 'خطا در اتصال به سرور. لطفا از اتصال اینترنت خود اطمینان حاصل کنید یا با پشتیبانی تماس بگیرید.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setFormErrors({ ...formErrors, general: errorMessage });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAlertInfo({ open: false, message: '', severity: 'info' }); // Clear previous alerts
      const firebaseUser = await signInWithGoogle(auth); // Correctly expect User object
      
      if (firebaseUser) { // Check if firebaseUser (the User object itself) is returned
        const idToken = await firebaseUser.getIdToken();
        console.log('Firebase ID Token from frontend:', idToken); // Log the token
        dispatch(googleLogin(idToken));
      } else {
        // This path should ideally not be hit if signInWithGoogle throws on failure
        throw new Error('Google Sign-In did not return a user.');
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      let errorMessage = 'Google Sign-In failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google Sign-In cancelled.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setAlertInfo({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 450,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ direction: 'rtl' }}>
          ورود به حساب کاربری
        </Typography>
        
        {/* Unified Alert Display based on alertInfo state */}
        {alertInfo.open && (
          <Alert 
            severity={alertInfo.severity} 
            sx={{ mb: 2, width: '100%', textAlign: 'right' }}
            onClose={() => setAlertInfo(prev => ({ ...prev, open: false }))} // Allow closing info/error messages
          >
            {alertInfo.message}
          </Alert>
        )}

        {/* Display form validation errors (formErrors.general for now) */}
        {formErrors.general && (
          <Alert severity="error" sx={{ mb: 2, width: '100%', textAlign: 'right' }}>
            {formErrors.general}
          </Alert>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, direction: 'rtl' }}>
          برای دسترسی به حساب خود، اطلاعات ورود را وارد کنید
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="ایمیل"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
            inputProps={{ dir: 'ltr' }}
          />

          <TextField
            fullWidth
            label="رمز عبور"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
            inputProps={{ dir: 'ltr' }}
          />

          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              underline="hover"
              sx={{ direction: 'rtl', display: 'inline-block' }}
            >
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mb: 3 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'ورود'
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 2, py: 1.5, borderColor: 'grey.500', color: 'text.primary' }}
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ direction: 'rtl' }}>
            حساب کاربری ندارید؟{' '}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              ثبت نام
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
