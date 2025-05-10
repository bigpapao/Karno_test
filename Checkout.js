import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
} from '@mui/material';

const steps = ['Shipping Address', 'Payment Details', 'Review Order'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { items, total } = useSelector((state) => state.cart);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      <Stepper activeStep={activeStep} sx={{ py: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="First Name"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Address"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Postal Code"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Card Number"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Expiry Date"
                      variant="outlined"
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="CVV"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              )}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  {items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography>
                        {item.name} x {item.quantity}
                      </Typography>
                      <Typography>${item.price * item.quantity}</Typography>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 2,
                      pt: 2,
                      borderTop: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${total}</Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
