import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  Divider,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { LocalShipping, Payment, Receipt, CheckCircle } from '@mui/icons-material';
import { clearCart } from '../redux/cartSlice';
import orderService from '../order.service';
import { RTL } from '../components/RTL';

// Persian steps for the checkout process
const steps = [
  { label: 'اطلاعات ارسال', icon: <LocalShipping /> },
  { label: 'اطلاعات پرداخت', icon: <Payment /> },
  { label: 'بررسی سفارش', icon: <Receipt /> },
  { label: 'تکمیل سفارش', icon: <CheckCircle /> }
];

// Iranian provinces for dropdown
const iranianProvinces = [
  'تهران',
  'اصفهان',
  'فارس',
  'خراسان رضوی',
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'گیلان',
  'مازندران',
  'کرمان',
  'خوزستان',
  'البرز',
  'قم',
  'کردستان',
  'همدان',
  'سیستان و بلوچستان',
  'کرمانشاه',
  'هرمزگان',
  'یزد',
  'لرستان',
  'مرکزی',
  'اردبیل',
  'گلستان',
  'قزوین',
  'سمنان',
  'زنجان',
  'چهارمحال و بختیاری',
  'ایلام',
  'کهگیلویه و بویراحمد',
  'بوشهر',
  'خراسان شمالی',
  'خراسان جنوبی'
];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: user?.phoneNumber || '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    paymentMethod: 'zarinpal',
    saveInfo: true
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Load user data if available
  useEffect(() => {
    if (user && user.shippingInfo) {
      setFormData(prev => ({
        ...prev,
        ...user.shippingInfo,
        phoneNumber: user.phoneNumber || prev.phoneNumber
      }));
    }
  }, [user]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form data based on current step
  const validateForm = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      // Shipping info validation
      if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
      if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'شماره تماس الزامی است';
      else if (!/^(\+98|0)?9\d{9}$/.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = 'شماره تماس معتبر نیست';
      }
      if (!formData.address.trim()) newErrors.address = 'آدرس الزامی است';
      if (!formData.city.trim()) newErrors.city = 'شهر الزامی است';
      if (!formData.province) newErrors.province = 'استان الزامی است';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'کد پستی الزامی است';
      else if (!/^\d{10}$/.test(formData.postalCode.trim())) {
        newErrors.postalCode = 'کد پستی باید ۱۰ رقم باشد';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      return; // Already at confirmation step
    }
    
    if (activeStep === 0 && !validateForm()) {
      return; // Stop if validation fails
    }
    
    if (activeStep === steps.length - 2) {
      // Submit order
      handlePlaceOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setAlert({
        open: true,
        message: 'سبد خرید شما خالی است',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod
      };

      // Send order to backend
      const response = await orderService.createOrder(orderData);
      
      // Save shipping info if requested
      if (formData.saveInfo && user) {
        // This would typically be handled by a user service
        // userService.updateShippingInfo(formData);
      }
      
      // Clear cart and move to confirmation step
      setOrderId(response.orderId || response._id);
      setOrderComplete(true);
      dispatch(clearCart());
      setActiveStep(steps.length - 1);
      
      setAlert({
        open: true,
        message: 'سفارش شما با موفقیت ثبت شد',
        severity: 'success'
      });
    } catch (error) {
      console.error('Order placement failed:', error);
      setAlert({
        open: true,
        message: 'خطا در ثبت سفارش. لطفا دوباره تلاش کنید',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  // Render shipping form
  const renderShippingForm = () => (
    <Grid container spacing={3} dir="rtl">
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          id="firstName"
          name="firstName"
          label="نام"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          variant="outlined"
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          id="lastName"
          name="lastName"
          label="نام خانوادگی"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          variant="outlined"
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          id="phoneNumber"
          name="phoneNumber"
          label="شماره موبایل"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          variant="outlined"
          placeholder="09123456789"
          dir="ltr"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="ایمیل (اختیاری)"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          variant="outlined"
          dir="ltr"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="address"
          name="address"
          label="آدرس کامل"
          value={formData.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
          variant="outlined"
          multiline
          rows={3}
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth required error={!!errors.province}>
          <InputLabel id="province-label">استان</InputLabel>
          <Select
            labelId="province-label"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            label="استان"
          >
            {iranianProvinces.map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </Select>
          {errors.province && <FormHelperText>{errors.province}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          fullWidth
          id="city"
          name="city"
          label="شهر"
          value={formData.city}
          onChange={handleChange}
          error={!!errors.city}
          helperText={errors.city}
          variant="outlined"
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          fullWidth
          id="postalCode"
          name="postalCode"
          label="کد پستی"
          value={formData.postalCode}
          onChange={handleChange}
          error={!!errors.postalCode}
          helperText={errors.postalCode}
          variant="outlined"
          dir="ltr"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.saveInfo}
              onChange={handleChange}
              name="saveInfo"
              color="primary"
            />
          }
          label="ذخیره اطلاعات برای خریدهای بعدی"
        />
      </Grid>
    </Grid>
  );

  // Render payment form
  const renderPaymentForm = () => (
    <Grid container spacing={3} dir="rtl">
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <Typography variant="h6" gutterBottom>
            روش پرداخت
          </Typography>
          <FormControlLabel
            value="zarinpal"
            control={
              <Checkbox
                checked={formData.paymentMethod === 'zarinpal'}
                onChange={() => setFormData({ ...formData, paymentMethod: 'zarinpal' })}
                name="paymentMethod"
                color="primary"
              />
            }
            label="پرداخت آنلاین (درگاه زرین پال)"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            شما پس از تایید سفارش به درگاه پرداخت منتقل خواهید شد.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  // Render order summary
  const renderOrderSummary = () => (
    <Grid container spacing={3} dir="rtl">
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          خلاصه سفارش
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            اطلاعات تماس و ارسال
          </Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2">
              {formData.firstName} {formData.lastName}
            </Typography>
            <Typography variant="body2">
              {formData.phoneNumber}
            </Typography>
            <Typography variant="body2">
              {formData.address}, {formData.city}, {formData.province}
            </Typography>
            <Typography variant="body2">
              کد پستی: {formData.postalCode}
            </Typography>
          </Paper>
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>
          اقلام سفارش
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
          {items.length > 0 ? (
            items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                  pb: 1,
                  borderBottom: items.indexOf(item) !== items.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {item.name} 
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                    x{item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {new Intl.NumberFormat('fa-IR').format(item.price * item.quantity)} تومان
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              سبد خرید شما خالی است
            </Typography>
          )}
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="h6">جمع کل</Typography>
          <Typography variant="h6">{new Intl.NumberFormat('fa-IR').format(total)} تومان</Typography>
        </Box>
      </Grid>
    </Grid>
  );

  // Render order confirmation
  const renderOrderConfirmation = () => (
    <Grid container spacing={3} dir="rtl" justifyContent="center" textAlign="center">
      <Grid item xs={12}>
        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          سپاس از خرید شما!
        </Typography>
        <Typography variant="body1" paragraph>
          سفارش شما با موفقیت ثبت شد.
        </Typography>
        {orderId && (
          <Typography variant="body1" paragraph>
            شماره سفارش: {orderId}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" paragraph>
          اطلاعات سفارش و کد پیگیری به شماره موبایل شما ارسال خواهد شد.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          بازگشت به صفحه اصلی
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <RTL>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
            تکمیل خرید
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel StepIconComponent={() => (
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                    color: activeStep >= index ? 'white' : 'text.secondary'
                  }}>
                    {step.icon}
                  </Box>
                )}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 3 }}>
                  {activeStep === 0 && renderShippingForm()}
                  {activeStep === 1 && renderPaymentForm()}
                  {activeStep === 2 && renderOrderSummary()}
                  {activeStep === 3 && renderOrderConfirmation()}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ borderRadius: 2, position: 'sticky', top: 20 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="right">
                    خلاصه سبد خرید
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {items.length > 0 ? (
                    <>
                      {items.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                            pb: 1,
                            borderBottom: '1px dashed',
                            borderColor: 'divider',
                          }}
                          dir="rtl"
                        >
                          <Typography variant="body2">
                            {item.name} ({item.quantity})
                          </Typography>
                          <Typography variant="body2">
                            {new Intl.NumberFormat('fa-IR').format(item.price * item.quantity)}
                          </Typography>
                        </Box>
                      ))}
                      
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          fontWeight: 'bold'
                        }}
                        dir="rtl"
                      >
                        <Typography variant="subtitle1" fontWeight="bold">مجموع</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {new Intl.NumberFormat('fa-IR').format(total)} تومان
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                      سبد خرید شما خالی است
                    </Typography>
                  )}
                </CardContent>
                
                {activeStep < 3 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'background.paper' }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ minWidth: 100 }}
                    >
                      بازگشت
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={loading}
                      sx={{ minWidth: 100 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : activeStep === 2 ? (
                        'ثبت سفارش'
                      ) : (
                        'ادامه'
                      )}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Paper>
        
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </RTL>
  );
};

export default Checkout;
