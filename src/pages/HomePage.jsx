import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../app/api/apiSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';

export default function HomePage() {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get featured products (first 4 products for demo)
  const featuredProducts = products.slice(0, 4);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
        <Typography color="error">Error loading products. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Welcome to E-Shop
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 4 }}>
            Discover amazing products at unbeatable prices
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/products')}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '50px',
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)'
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">Featured Products</Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </Box>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  sx={{
                    height: 200,
                    objectFit: 'contain',
                    p: 2,
                    backgroundColor: '#f5f5f5'
                  }}
                  image={product.image}
                  alt={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3" noWrap>
                    {product.title}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    fullWidth
                    variant="contained"
                    sx={{ 
                      borderRadius: '50px',
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8, my: 6, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
            Shop by Category
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Discover our wide range of products across different categories
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              { 
                name: 'Electronics', 
                image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                bgColor: '#e3f2fd',
                id: 'electronics'
              },
              { 
                name: 'Jewelry', 
                image: 'https://images.unsplash.com/photo-1611591437281-4608be1ad0db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                bgColor: '#fce4ec',
                id: 'jewelry'
              },
              { 
                name: "Men's Clothing", 
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                bgColor: '#e8f5e9',
                id: 'men-clothing'
              },
              { 
                name: "Women's Clothing", 
                image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                bgColor: '#f3e5f5',
                id: 'women-clothing'
              }
            ].map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.name}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    },
                    border: 'none',
                    boxShadow: 2,
                    overflow: 'hidden'
                  }}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                >
                  <Box 
                    sx={{ 
                      height: 150,
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.1)'
                      }
                    }}
                  />
                  <CardContent 
                    sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      backgroundColor: category.bgColor,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Typography variant="h6" component="h3" fontWeight="bold" color="text.primary">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Shop Now →
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ my: 10, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to shop?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse our wide selection of products and find exactly what you're looking for.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/products')}
          sx={{ 
            px: 4, 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '50px',
            mt: 2
          }}
        >
          Start Shopping
        </Button>
      </Container>
    </Box>
  );
}
