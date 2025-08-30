import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  TablePagination,
  Avatar,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  Link,
  Breadcrumbs,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
  LocalShipping as ShippingIcon,
  LocalOffer as DiscountIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { 
  addToCart, 
  removeFromCart, 
  deleteFromCart, 
  selectCartItems, 
  selectCartTotalAmount, 
  selectCartTotalQuantity 
} from '../features/cart/cartSlice';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get cart data from Redux store
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  
  // Local state
  const [hasMounted, setHasMounted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [giftMessage, setGiftMessage] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  
  // Calculate shipping cost
  const shippingCost = cartTotalAmount > 0 ? (cartTotalAmount > 50 ? 0 : 9.99) : 0;
  
  // Calculate tax (example: 8% tax rate)
  const tax = cartTotalAmount * 0.08;
  
  // Calculate order total
  const orderTotal = cartTotalAmount + shippingCost + tax;
  
  // Mock coupon codes (in a real app, these would be validated on the server)
  const validCoupons = [
    { code: 'WELCOME10', discount: 0.1, type: 'percentage', description: '10% off your first order' },
    { code: 'FREESHIP', discount: 9.99, type: 'fixed', description: 'Free shipping on any order' },
    { code: 'SAVE20', discount: 20, type: 'fixed', description: '$20 off orders over $100' },
  ];
  
  // Handle quantity changes
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return; // Limit max quantity to 10
    
    dispatch(
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: newQuantity - item.quantity, // Adjust the quantity
      })
    );
  };
  
  // Handle remove item (decrease quantity by 1)
  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item.id));
  };
  
  // Handle delete item (remove from cart completely)
  const handleDeleteItem = (itemId) => {
    dispatch(deleteFromCart(itemId));
  };
  
  // Handle apply coupon
  const handleApplyCoupon = () => {
    const coupon = validCoupons.find(c => c.code === couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      // Show error for invalid coupon
      // In a real app, you might want to show a snackbar or toast
      alert('Invalid coupon code');
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/products');
  };
  
  // Handle page change for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Set hasMounted to true after component mounts
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // Reset page when cart items change
  useEffect(() => {
    setPage(0);
  }, [cartItems.length]);
  
  // Don't render anything on the server
  if (!hasMounted) {
    return null;
  }
  
  // Calculate paginated items
  const paginatedItems = cartItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Calculate discount from coupon
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const { type, discount } = appliedCoupon;
    
    if (type === 'percentage') {
      return cartTotalAmount * discount;
    } else {
      return Math.min(discount, cartTotalAmount); // Don't discount more than the order total
    }
  };
  
  const discountAmount = calculateDiscount();
  const finalTotal = Math.max(0, orderTotal - discountAmount);
  
  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Shopping Cart</Typography>
        </Breadcrumbs>
        
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added any items to your cart yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleContinueShopping}
              sx={{ mt: 2, borderRadius: '50px', px: 4, py: 1.5 }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Shopping Cart</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={item.image} 
                            alt={item.title}
                            variant="rounded"
                            sx={{ width: 64, height: 64, mr: 2, cursor: 'pointer' }}
                            onClick={() => navigate(`/products/${item.id}`)}
                          />
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                              onClick={() => navigate(`/products/${item.id}`)}
                            >
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              SKU: {item.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 1, minWidth: 24, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteItem(item.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={cartItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: '1px solid', borderColor: 'divider' }}
            />
            
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider' }}>
              <Button 
                startIcon={<ArrowBackIcon />}
                onClick={handleContinueShopping}
                sx={{ textTransform: 'none' }}
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    dispatch({ type: 'cart/clearCart' });
                  }
                }}
              >
                Clear Cart
              </Button>
            </Box>
          </Paper>
          
          {/* Gift Options */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Gift Options
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={giftWrap} 
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  color="primary"
                />
              }
              label="Add gift wrap for $4.99"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <TextField
              fullWidth
              label="Add a gift message (optional)"
              multiline
              rows={3}
              variant="outlined"
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Write a personal message..."
            />
          </Paper>
          
          {/* Coupon Code */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Have a coupon code?
            </Typography>
            
            {appliedCoupon ? (
              <Alert 
                severity="success" 
                action={
                  <Button 
                    color="inherit" 
                    size="small"
                    onClick={() => setAppliedCoupon(null)}
                  >
                    Remove
                  </Button>
                }
                sx={{ mb: 2 }}
              >
                Coupon applied: {appliedCoupon.code} - {appliedCoupon.description}
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DiscountIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Apply Coupon
                </Button>
              </Box>
            )}
            
            <Typography variant="body2" color="text.secondary">
              Available coupons: WELCOME10, FREESHIP, SAVE20
            </Typography>
          </Paper>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal ({cartTotalQuantity} {cartTotalQuantity === 1 ? 'item' : 'items'})
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(cartTotalAmount)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2">
                  {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(tax)}
                </Typography>
              </Box>
              
              {appliedCoupon && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'success.main' }}>
                  <Typography variant="body2">
                    Discount ({appliedCoupon.code})
                  </Typography>
                  <Typography variant="body2">
                    -{formatCurrency(discountAmount)}
                  </Typography>
                </Box>
              )}
              
              {giftWrap && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Gift Wrap
                  </Typography>
                  <Typography variant="body2">
                    $4.99
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Order Total
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatCurrency(giftWrap ? finalTotal + 4.99 : finalTotal)}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                {shippingCost === 0 
                  ? 'Free shipping applied to your order!'
                  : `Spend $${(50 - cartTotalAmount).toFixed(2)} more for free shipping!`
                }
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCheckout}
                sx={{ 
                  py: 1.5, 
                  mb: 2,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Proceed to Checkout
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center">
                or{' '}
                <Link 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle PayPal checkout
                  }}
                  sx={{ textDecoration: 'none' }}
                >
                  Checkout with PayPal
                </Link>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
              <ShippingIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Free shipping on orders over $50
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <DiscountIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Discounts available at checkout
              </Typography>
            </Box>
          </Paper>
          
          {/* Security Info */}
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Secure Checkout
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your payment information is processed securely. We do not store credit card details.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {['visa', 'mastercard', 'amex', 'discover', 'paypal'].map((type) => (
                <Box 
                  key={type}
                  component="img"
                  src={`/payment-${type}.png`}
                  alt={type}
                  sx={{ height: 24, width: 'auto' }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
