import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { selectCurrentUser } from '../features/auth/authSlice';

// Mock order data - in a real app, this would come from an API
const mockOrders = [
  {
    id: 'ORD-12345',
    date: '2023-06-15',
    status: 'Delivered',
    total: 145.99,
    items: 3,
    trackingNumber: '1Z999AA1234567890'
  },
  {
    id: 'ORD-12344',
    date: '2023-06-10',
    status: 'Shipped',
    total: 89.99,
    items: 2,
    trackingNumber: '1Z999BB1234567890'
  },
  {
    id: 'ORD-12343',
    date: '2023-05-28',
    status: 'Processing',
    total: 199.99,
    items: 1,
    trackingNumber: null
  },
];

const statusColors = {
  'Processing': 'warning',
  'Shipped': 'info',
  'Delivered': 'success',
  'Cancelled': 'error'
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // In a real app, you would fetch orders from your API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            View Your Orders
          </Typography>
          <Typography color="text.secondary" paragraph>
            Sign in to view your order history and track your purchases.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login', { state: { from: '/orders' } })}
              sx={{ mr: 2 }}
            >
              Sign In
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

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
          startIcon={<HomeIcon />} 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingBagIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          My Orders
        </Typography>
      </Box>
      
      {orders.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            You haven't placed any orders yet
          </Typography>
          <Typography color="text.secondary" paragraph>
            When you place an order, you'll be able to see its status and track it here.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.items} item{order.items !== 1 ? 's' : ''}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status}
                        color={statusColors[order.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Order Details">
                        <IconButton
                          component={RouterLink}
                          to={`/order/${order.id}`}
                          color="primary"
                          size="small"
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {orders.length} of {orders.length} orders
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<HomeIcon />} 
              onClick={() => navigate('/')}
              size="small"
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      )}
      
      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Need Help?</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          If you have any questions about your order, please contact our customer service team 
          at <Link href="mailto:support@example.com" color="primary">support@example.com</Link> 
          or call us at <Link href="tel:+1234567890" color="primary">(123) 456-7890</Link>.
        </Typography>
      </Box>
    </Container>
  );
}
