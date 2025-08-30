import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Divider,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  selectCartItems, 
  selectCartTotalAmount,
  selectShippingAddress,
  selectPaymentMethod,
  saveShippingAddress,
  savePaymentMethod
} from '../features/cart/cartSlice';

const steps = ['Shipping', 'Payment', 'Place Order'];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotalAmount);
  const shippingPrice = cartTotal > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * cartTotal).toFixed(2));
  const totalPrice = Number((cartTotal + shippingPrice + taxPrice).toFixed(2));

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate shipping form
      const { fullName, address, city, postalCode, country } = shippingAddress;
      if (!fullName || !address || !city || !postalCode || !country) {
        setError('Please fill in all shipping fields');
        return;
      }
      dispatch(saveShippingAddress(shippingAddress));
    }
    
    if (activeStep === 1) {
      if (!paymentMethod) {
        setError('Please select a payment method');
        return;
      }
      dispatch(savePaymentMethod(paymentMethod));
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      // Here you would typically send the order to your backend
      // const { data } = await createOrder({
      //   orderItems: cart,
      //   shippingAddress,
      //   paymentMethod,
      //   itemsPrice: cartTotal,
      //   shippingPrice,
      //   taxPrice,
      //   totalPrice,
      // }).unwrap();
      // 
      // navigate(`/order/${data._id}`);
      
      // For demo purposes, we'll just navigate to a success page
      navigate('/order/success');
    } catch (err) {
      setError(err.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  label="Country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                aria-label="payment method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel value="PayPal" control={<Radio />} label="PayPal or Credit Card" />
                <FormControlLabel value="Stripe" control={<Radio />} label="Stripe" />
                <FormControlLabel value="CashOnDelivery" control={<Radio />} label="Cash on Delivery" />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>Items:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>${cartTotal.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Shipping:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>${shippingPrice.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Tax:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>${taxPrice.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Total:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">${totalPrice.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Paper>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Payment Method</Typography>
            <Typography gutterBottom>{paymentMethod}</Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Shipping Address</Typography>
            <Typography gutterBottom>
              {shippingAddress.fullName}<br />
              {shippingAddress.address}<br />
              {shippingAddress.city}, {shippingAddress.postalCode}<br />
              {shippingAddress.country}
            </Typography>
          </Box>
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Checkout</Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {activeStep === steps.length ? (
          <Box textAlign="center" sx={{ py: 4 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  'Place Order'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}
