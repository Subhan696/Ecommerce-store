import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  Chip,
  Rating,
  Tabs,
  Tab,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  AddShoppingCart as AddShoppingCartIcon,
  FavoriteBorder as FavoriteIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { addToCart } from '../features/cart/cartSlice';
import { useGetProductQuery } from '../app/api/apiSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `product-tab-${index}`,
    'aria-controls': `product-tabpanel-${index}`,
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get product data
  const { data: product, isLoading, isError, error } = useGetProductQuery(id);
  
  // Local state
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return; // Limit max quantity to 10
    setQuantity(newQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    );
    
    // Show success message or open cart drawer
    // You can implement a notification system here
  };
  
  // Simulate related products (in a real app, this would come from an API)
  useEffect(() => {
    if (product) {
      // This is a simplified example - in a real app, you'd fetch related products
      // based on the current product's category or other criteria
      const mockRelated = Array(4).fill(null).map((_, i) => ({
        id: `related-${i}`,
        title: `Related Product ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 10,
        image: `https://picsum.photos/300/200?random=${i}`,
        rating: {
          rate: (Math.random() * 3 + 2).toFixed(1),
          count: Math.floor(Math.random() * 1000)
        }
      }));
      
      setRelatedProducts(mockRelated);
    }
  }, [product]);
  
  // Loading and error states
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error?.data?.message || 'Error loading product. Please try again later.'}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Product not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }
  
  // Create an array of images (in a real app, this would come from the product data)
  const productImages = [
    product.image,
    `https://picsum.photos/800/600?random=${product.id}-1`,
    `https://picsum.photos/800/600?random=${product.id}-2`,
    `https://picsum.photos/800/600?random=${product.id}-3`,
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/products">
          Products
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>
      
      {/* Back button for mobile */}
      {isMobile && (
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
      )}
      
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, mb: 6 }}>
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Main Image */}
              <Box 
                component="img"
                src={productImages[selectedImage]}
                alt={product.title}
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  objectFit: 'contain',
                  mb: 2,
                  borderRadius: 1,
                  cursor: 'zoom-in',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />
              
              {/* Thumbnails */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', width: '100%', py: 1 }}>
                {productImages.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    alt={`${product.title} - ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      cursor: 'pointer',
                      opacity: selectedImage === index ? 1 : 0.7,
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
          
          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={product.category}
                color="primary"
                size="small"
                sx={{ mb: 1, textTransform: 'capitalize' }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                {product.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={product.rating.rate} 
                  precision={0.5} 
                  readOnly 
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {product.rating.rate} ({product.rating.count} reviews)
                </Typography>
              </Box>
              
              <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Quantity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    sx={{ minWidth: 40, height: 40 }}
                  >
                    -
                  </Button>
                  <Typography variant="body1" sx={{ mx: 3, minWidth: 20, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    sx={{ minWidth: 40, height: 40 }}
                  >
                    +
                  </Button>
                </Box>
              </Box>
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={handleAddToCart}
                  sx={{ 
                    flex: isMobile ? '1 1 100%' : '0 1 auto',
                    py: 1.5,
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Add to Cart
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<FavoriteIcon />}
                  sx={{ 
                    flex: isMobile ? '1 1 100%' : '0 1 auto',
                    py: 1.5,
                    borderRadius: '50px',
                    textTransform: 'none'
                  }}
                >
                  Wishlist
                </Button>
                
                <IconButton
                  color="primary"
                  aria-label="share"
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '50%',
                    ml: 'auto'
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
              
              {/* Additional Info */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Category:</strong> {product.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Availability:</strong> In Stock
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>SKU:</strong> {product.id}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        {/* Product Tabs */}
        <Box sx={{ width: '100%', mt: 6 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product tabs"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Description" {...a11yProps(0)} />
            <Tab label="Specifications" {...a11yProps(1)} />
            <Tab label="Reviews" {...a11yProps(2)} />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
              Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
              rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna 
              non est bibendum non venenatis nisl tempor.
            </Typography>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Product Specifications</Typography>
            <Box component="dl" sx={{ '& div': { display: 'flex', mb: 1 } }}>
              <div>
                <Typography component="dt" fontWeight="bold" sx={{ minWidth: 150 }}>Brand</Typography>
                <Typography component="dd">Brand Name</Typography>
              </div>
              <div>
                <Typography component="dt" fontWeight="bold" sx={{ minWidth: 150 }}>Model</Typography>
                <Typography component="dd">Model XYZ-{product.id}</Typography>
              </div>
              <div>
                <Typography component="dt" fontWeight="bold" sx={{ minWidth: 150 }}>Color</Typography>
                <Typography component="dd">Black</Typography>
              </div>
              <div>
                <Typography component="dt" fontWeight="bold" sx={{ minWidth: 150 }}>Material</Typography>
                <Typography component="dd">High-quality material</Typography>
              </div>
              <div>
                <Typography component="dt" fontWeight="bold" sx={{ minWidth: 150 }}>Dimensions</Typography>
                <Typography component="dd">10 x 10 x 5 cm</Typography>
              </div>
              <div>
                <Typography component="dt" fontWeight="bold" sx={{ minWidth: 150 }}>Weight</Typography>
                <Typography component="dd">0.5 kg</Typography>
              </div>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating.rate} precision={0.5} readOnly size="large" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {product.rating.rate} out of 5
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.rating.count} global ratings
              </Typography>
            </Box>
            
            {/* Review Form (for logged-in users) */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" gutterBottom>Write a Review</Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/login')}
              >
                Sign in to write a review
              </Button>
            </Paper>
            
            {/* Reviews List */}
            <Box>
              {[1, 2, 3].map((review) => (
                <Box key={review} sx={{ mb: 3, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mr: 1 }}>
                      Customer {review}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Rating value={5 - (review - 1) * 0.5} readOnly size="small" />
                  <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                    {review === 1 
                      ? 'Great product! Highly recommend.' 
                      : review === 2 
                        ? 'Good quality for the price.' 
                        : 'Not what I expected, but okay.'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Verified Purchase
                  </Typography>
                </Box>
              ))}
            </Box>
          </TabPanel>
        </Box>
      </Paper>
      
      {/* Related Products */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          You may also like
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {relatedProducts.map((item) => (
            <Grid item key={item.id} xs={6} sm={4} md={3}>
              <Paper elevation={0} sx={{ p: 2, '&:hover': { boxShadow: 3 }, height: '100%' }}>
                <Box 
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'contain',
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => navigate(`/products/${item.id}`)}
                />
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={parseFloat(item.rating.rate)} size="small" readOnly />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({item.rating.count})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${item.price.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
