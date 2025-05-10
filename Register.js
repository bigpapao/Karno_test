import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { register } from '../store/slices/authSlice';
import { auth, createUserWithEmailAndPassword } from '../firebase';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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
    // Iranian mobile number validation - must start with 9 and have 10 digits
    const phoneRegex = /^9\d{9}$/;

    if (!formData.firstName.trim()) {
      errors.firstName = 'نام الزامی است';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'نام خانوادگی الزامی است';
    }

    if (!formData.email) {
      errors.email = 'ایمیل الزامی است';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'فرمت ایمیل نامعتبر است';
    } 

    if (!formData.phone) {
      errors.phone = 'شماره تلفن الزامی است';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'شماره موبایل باید با 9 شروع شود و 10 رقم باشد';
    }

    if (!formData.password) {
      errors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 8) {
      errors.password = 'رمز عبور باید حداقل 8 کاراکتر باشد';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'لطفا رمز عبور خود را تایید کنید';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'رمزهای عبور مطابقت ندارند';
    }

    if (!agreeToTerms) {
      errors.terms = 'شما باید با قوانین و مقررات موافقت کنید';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormErrors({}); // Clear previous errors

    try {
      // Step 1: Create user with Firebase
      console.log('Attempting Firebase user creation...');
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      console.log('Firebase user created successfully:', firebaseUser.uid);

      // Step 2: Dispatch action to register user in your backend (if needed)
      // You might want to include firebaseUser.uid in submissionData
      const submissionData = {
        ...formData,
        phone: `+98${formData.phone}`,
        role: 'buyer',
        cart: [],
        wishlist: [],
        addresses: [],
        orderHistory: [],
        firebaseUid: firebaseUser.uid, // Optionally link to Firebase user
      };

      console.log('Submitting registration form to backend...');
      const result = await dispatch(register(submissionData)).unwrap();
      console.log('Backend registration successful:', result);
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      });
      setAgreeToTerms(false);
      
      // Redirect to products page instead of login page
      const successMessage = 'ثبت نام با موفقیت انجام شد! به فروشگاه کارنو خوش آمدید.';
      navigate('/products', {
        state: { message: successMessage },
      });

    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'خطا در ثبت نام. لطفا دوباره تلاش کنید.';
      if (err.code) { // Firebase error
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'این ایمیل قبلا ثبت نام شده است. لطفا وارد شوید یا از ایمیل دیگری استفاده کنید.';
            setFormErrors((prev) => ({ ...prev, email: errorMessage }));
            break;
          case 'auth/weak-password':
            errorMessage = 'رمز عبور ضعیف است. باید حداقل ۶ کاراکتر باشد.';
            setFormErrors((prev) => ({ ...prev, password: errorMessage }));
            break;
          case 'auth/invalid-email':
            errorMessage = 'فرمت ایمیل نامعتبر است.';
            setFormErrors((prev) => ({ ...prev, email: errorMessage }));
            break;
          default:
            errorMessage = err.message; // Default Firebase error message
        }
      } else if (err.message) { // Backend error from dispatch(register)
        errorMessage = err.message;
      }
      
      setFormErrors((prev) => ({ ...prev, general: errorMessage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', py: 4, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, maxWidth: 900, mx: 'auto', gap: 4 }}>
        {/* Benefits section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: { xs: 500, md: 350 },
            mx: 2,
            borderRadius: 2,
            direction: 'rtl',
            display: { xs: 'none', md: 'block' },
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            مزایای عضویت در کارنو
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: '50%', p: 1, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}>
                1
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  دسترسی سریع به محصولات
                </Typography>
                <Typography variant="body2">
                  با ثبت نام در کارنو، به راحتی می‌توانید به تمامی محصولات دسترسی داشته باشید.
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: '50%', p: 1, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}>
                2
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  پیگیری سفارشات
                </Typography>
                <Typography variant="body2">
                  سفارشات خود را به راحتی پیگیری کنید و از وضعیت آنها مطلع شوید.
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: '50%', p: 1, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}>
                3
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  تخفیف‌های ویژه
                </Typography>
                <Typography variant="body2">
                  از تخفیف‌های ویژه مخصوص اعضا بهره‌مند شوید و در هزینه‌های خود صرفه‌جویی کنید.
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: '50%', p: 1, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}>
                4
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  پشتیبانی اختصاصی
                </Typography>
                <Typography variant="body2">
                  از خدمات پشتیبانی اختصاصی کارنو بهره‌مند شوید و سوالات خود را مطرح کنید.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        
        {/* Registration form */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
            mx: 2,
            borderRadius: 2,
            direction: 'rtl',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ direction: 'rtl' }}>
            ایجاد حساب کاربری
          </Typography>
          
          {/* Display general errors */}
          {(formErrors.general || error) && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'right' }}>
              {formErrors.general || error}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, direction: 'rtl' }}>
            به جامعه علاقه‌مندان خودرو بپیوندید
          </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="نام"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              inputProps={{ dir: 'rtl' }}
            />
            <TextField
              fullWidth
              label="نام خانوادگی"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              inputProps={{ dir: 'rtl' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
              inputProps={{ dir: 'ltr' }}
            />
            <TextField
              fullWidth
              label="تلفن"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon color="action" />
                      <Typography sx={{ ml: 1, color: 'text.secondary' }}>+98</Typography>
                    </Box>
                  </InputAdornment>
                ),
              }}
              placeholder="9XXXXXXXXX"
              inputProps={{
                dir: 'ltr',
                maxLength: 10,
                pattern: '9[0-9]{9}',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
              inputProps={{ dir: 'ltr' }}
            />
            <TextField
              fullWidth
              label="تایید رمز عبور"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ dir: 'ltr' }}
            />
          </Box>

          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" sx={{ direction: 'rtl' }}>
                  من با{' '}
                  <Link component={RouterLink} to="/terms" underline="hover">
                    قوانین و مقررات
                  </Link>{' '}
                  و{' '}
                  <Link
                    component={RouterLink}
                    to="/privacy-policy"
                    underline="hover"
                  >
                    سیاست حریم خصوصی
                  </Link>{' '}
                  موافقم
                </Typography>
              }
            />
            {formErrors.terms && (
              <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                {formErrors.terms}
              </Typography>
            )}
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
              'ایجاد حساب کاربری'
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ direction: 'rtl' }}>
            قبلاً حساب کاربری دارید؟{' '}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              ورود
            </Link>
          </Typography>
        </form>
      </Paper>
      </Box>
    </Box>
  );
};

export default Register;
