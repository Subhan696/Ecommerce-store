import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  logout, 
  updateProfile, 
  selectCurrentUser, 
  selectAuthStatus 
} from '../features/auth/authSlice';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  ShoppingBag as OrderIcon,
  Favorite as WishlistIcon,
  Lock as PasswordIcon
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function ProfilePage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { isLoading, isSuccess, isError, message } = useSelector(selectAuthStatus);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (isError) {
      setError(message || 'An error occurred');
      setSuccess('');
    }
    if (isSuccess) {
      setSuccess(message || 'Operation completed successfully');
      setError('');
      setEditMode(false);
    }
  }, [isError, isSuccess, message]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
      // Success will be handled by the useEffect
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };
  
  const handleEditClick = () => {
    setEditMode(true);
  };
  
  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Please sign in to view your profile
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/login', { state: { from: '/profile' } })}
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="profile tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Orders" icon={<OrderIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Wishlist" icon={<WishlistIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="Change Password" icon={<PasswordIcon />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Box>
      
      <Paper elevation={3}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Personal Information</Typography>
            {!editMode && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          
          {editMode ? (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{ mr: 2 }}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setError('');
                      setSuccess('');
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={user.name || 'Not provided'} 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email} 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PhoneIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Phone" 
                    secondary={user.phone || 'Not provided'} 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <HomeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Address" 
                    secondary={user.address || 'Not provided'} 
                    secondaryTypographyProps={{
                      style: { whiteSpace: 'pre-line' }
                    }}
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ mr: 2 }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>Order History</Typography>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50', textAlign: 'center' }}>
            <Typography variant="body1">You haven't placed any orders yet.</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </Button>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>Wishlist</Typography>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50', textAlign: 'center' }}>
            <Typography variant="body1">Your wishlist is empty.</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>Change Password</Typography>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="body1" gutterBottom>
              To change your password, please enter your current password and your new password below.
            </Typography>
            <Box component="form" sx={{ maxWidth: 500, mt: 3 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Current Password"
                type="password"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirm New Password"
                type="password"
                required
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </Box>
          </Paper>
        </TabPanel>
      </Paper>
    </Container>
  );
}
