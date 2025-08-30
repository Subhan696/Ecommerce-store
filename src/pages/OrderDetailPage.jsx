import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { selectCurrentUser } from '../features/auth/authSlice';

// Mock order data - in a real app, this would come from an API
const mockOrder = {
  id: 'ORD-12345',
  date: '2023-06-15T14:30:00',
  status: 'Delivered',
  statusHistory: [
    { status: 'Order Placed', date: '2023-06-15T14:30:00' },
    { status: 'Processing', date: '2023-06-15T15:15:00' },
    { status: 'Shipped', date: '2023-06-16T09:30:00' },
    { status: 'Out for Delivery', date: '2023-06-18T08:15:00' },
    { status: 'Delivered', date: '2023-06-18T14:30:00' },
  ],
  items: [
    {
      id: 'prod-1',
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      quantity: 1,
      image: '/images/headphones.jpg',
      color: 'Black',
      size: 'One Size'
    },
    {
      id: 'prod-2',
      name: 'Smartphone Holder',
      price: 19.99,
      quantity: 2,
      image: '/images/phone-holder.jpg',
      color: 'Black',
      size: 'Universal'
    }
  ],
  subtotal: 139.97,
  shipping: 5.99,
  tax: 14.40,
  total: 160.36,
  shippingAddress: {
    fullName: 'John Doe',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    phone: '(555) 123-4567'
  },
  paymentMethod: 'Credit Card',
  paymentDetails: {
    cardType: 'Visa',
    last4: '4242',
    transactionId: 'ch_1J4XJp2eZvKYlo2C0X9X2XeZ'
  },
  trackingNumber: '1Z999AA1234567890',
  carrier: 'UPS',
  estimatedDelivery: '2023-06-18'
};

const statusColors = {
  'Processing': 'warning',
  'Shipped': 'info',
  'Delivered': 'success',
  'Cancelled': 'error',
  'Returned': 'default'
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // In a real app, you would fetch the order details from your API
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrder(mockOrder);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusIndex = (status) => {
    const statusOrder = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    return statusOrder.indexOf(status);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Order Not Found
        </Typography>
        <Typography color="text.secondary" paragraph>
          We couldn't find an order with ID: {orderId}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/orders')}
            sx={{ mr: 2 }}
          >
            View All Orders
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
          sx={{ textTransform: 'none' }}
        >
          Back to Orders
        </Button>
        <Box>
          <Tooltip title="Print Order">
            <IconButton 
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Order #{order.id}
          </Typography>
          <Typography color="text.secondary">
            Placed on {new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>
        <Chip 
          label={order.status}
          color={statusColors[order.status] || 'default'}
          size="medium"
          sx={{ 
            px: 2, 
            py: 1, 
            fontSize: '1rem',
            fontWeight: 'medium' 
          }}
        />
      </Box>

      {/* Order Status Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Status
          </Typography>
          <Box sx={{ mt: 3, mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={(getStatusIndex(order.status) + 1) * 25} 
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {order.statusHistory.map((statusItem, index) => (
                <Box key={index} sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: getStatusIndex(statusItem.status) <= getStatusIndex(order.status) 
                        ? 'primary.main' 
                        : 'grey.300',
                      mx: 'auto',
                      mb: 1,
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="caption" display="block" gutterBottom>
                    {statusItem.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(statusItem.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          {order.trackingNumber && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShippingIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  {order.status === 'Delivered' ? 'Delivered on' : 'Estimated Delivery'}: {order.estimatedDelivery}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  {order.carrier} Tracking #: {order.trackingNumber}
                </Typography>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => window.open(`https://www.ups.com/track?tracknum=${order.trackingNumber}`, '_blank')}
                >
                  Track Package
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              component="img"
                              src={item.image}
                              alt={item.name}
                              sx={{ 
                                width: 60, 
                                height: 60, 
                                objectFit: 'contain',
                                mr: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                              }}
                            />
                            <Box>
                              <Typography variant="body1">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.color}, {item.size}
                              </Typography>
                              <Button 
                                variant="text" 
                                size="small"
                                component={RouterLink}
                                to={`/product/${item.id}`}
                                sx={{ mt: 0.5 }}
                              >
                                View Product
                              </Button>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Need to return an item?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      If you're not completely satisfied, you can return eligible items within 30 days of delivery.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      disabled={order.status !== 'Delivered'}
                    >
                      Start a Return
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Leave a Review
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Share your thoughts with other customers by reviewing the products you've purchased.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      disabled={order.status !== 'Delivered'}
                    >
                      Write a Review
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${order.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax</Typography>
                  <Typography>${order.tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1">${order.total.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Method
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentIcon color="action" sx={{ mr: 1 }} />
                  <Typography>
                    {order.paymentMethod} •••• {order.paymentDetails.last4}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID: {order.paymentDetails.transactionId}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {order.shippingAddress.fullName}
                </Typography>
                <Typography>
                  {order.shippingAddress.address}
                </Typography>
                <Typography>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </Typography>
                <Typography>
                  {order.shippingAddress.country}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <PhoneIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  {order.shippingAddress.phone}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our customer service team is available to help with any questions about your order.
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<EmailIcon />}
                sx={{ mb: 1.5 }}
                onClick={() => window.location.href = 'mailto:support@example.com'}
              >
                Email Support
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<PhoneIcon />}
                onClick={() => window.location.href = 'tel:+1234567890'}
              >
                (123) 456-7890
              </Button>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                Mon-Fri, 9am-6pm EST
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #order-detail-print, #order-detail-print * {
            visibility: visible;
          }
          #order-detail-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </Container>
  );
}
