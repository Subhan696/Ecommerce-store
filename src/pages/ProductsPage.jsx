import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Slider,
  Pagination,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { addToCart } from '../features/cart/cartSlice';
import { useGetProductsQuery, useGetCategoriesQuery } from '../app/api/apiSlice';
import { setCategoryFilter, setSortBy, setSearchQuery } from '../features/products/productsSlice';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get products and categories from API
  const { data: allProducts = [], isLoading, isError } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  
  // Get filters from Redux store
  const filters = useSelector((state) => state.products.filters);
  const filteredProducts = useSelector((state) => {
    const { products } = state.products;
    const { category, sortBy, searchQuery } = state.products.filters;
    
    let result = [...products];
    
    // Filter by category
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default: // 'featured'
        // Keep original order
        break;
    }
    
    return result;
  });
  
  // Local state
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  // Handle URL parameters on component mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      dispatch(setCategoryFilter(categoryFromUrl));
      setSelectedCategories([categoryFromUrl]);
    }
    
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      dispatch(setSearchQuery(searchQuery));
      setSearchInput(searchQuery);
    }
  }, [dispatch, searchParams]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Update URL with search query
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
    
    // Update Redux store
    dispatch(setSearchQuery(value));
  };
  
  // Handle category filter change
  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    
    // For simplicity, we'll just use the first selected category
    const selectedCategory = newCategories.length > 0 ? newCategories[0] : 'all';
    dispatch(setCategoryFilter(selectedCategory));
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };
  
  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  // Handle add to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Pagination
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );
  
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
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading products. Please try again later.</Alert>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Products</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Search */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            </Box>
            
            {/* Categories */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          size="small"
                        />
                      }
                      label={category.charAt(0).toUpperCase() + category.slice(1)}
                      sx={{ display: 'block', ml: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
            
            {/* Price Range */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Price Range
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelFormat={(value) => `$${value}`}
                  sx={{ mt: 2, mb: 3 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">${priceRange[0]}</Typography>
                  <Typography variant="body2">${priceRange[1]}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        
        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Toolbar */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: 2
          }}>
            <Typography variant="h5" component="h1">
              {filters.category === 'all' ? 'All Products' : filters.category}
              {searchInput && `: Search results for "${searchInput}"`}
              <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
              </Typography>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="sort-by-label">Sort by</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  label="Sort by"
                  startAdornment={
                    <SortIcon sx={{ color: 'action.active', mr: 1 }} />
                  }
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <IconButton 
                  onClick={() => setViewMode('grid')} 
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  aria-label="grid view"
                >
                  <ViewModuleIcon />
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <IconButton 
                  onClick={() => setViewMode('list')} 
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  aria-label="list view"
                >
                  <ViewListIcon />
                </IconButton>
              </Box>
              
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                sx={{ display: { md: 'none' } }}
              >
                Filters
              </Button>
            </Box>
          </Box>
          
          {/* Mobile Filters */}
          {mobileFiltersOpen && (
            <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      clickable
                      variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                      color={selectedCategories.includes(category) ? 'primary' : 'default'}
                      onClick={() => handleCategoryChange(category)}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Price Range
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelFormat={(value) => `$${value}`}
                  sx={{ mt: 2, mb: 3 }}
                />
              </Box>
            </Box>
          )}
          
          {/* Products Grid */}
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200,
                        objectFit: 'contain',
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer'
                      }}
                      image={product.image}
                      alt={product.title}
                      onClick={() => navigate(`/products/${product.id}`)}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography 
                        gutterBottom 
                        variant="subtitle1" 
                        component="h3" 
                        noWrap
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          {[...Array(5)].map((_, i) => (
                            <Box 
                              key={i} 
                              component="span" 
                              sx={{
                                color: i < Math.round(product.rating.rate) ? '#ffc107' : '#e0e0e0',
                                    fontSize: '1.2rem',
                                    lineHeight: 1
                                  }}
                                >
                                  ★
                                </Box>
                              ))}
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                ({product.rating.count})
                              </Typography>
                            </Box>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              ${product.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {product.category}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button 
                            size="small" 
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={() => handleAddToCart(product)}
                            sx={{ 
                              borderRadius: '50px',
                              py: 0.8,
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
              ) : (
                <Box>
                  {paginatedProducts.map((product) => (
                    <Card key={product.id} sx={{ display: 'flex', mb: 2, height: 200 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain', p: 2, backgroundColor: '#f5f5f5' }}
                        image={product.image}
                        alt={product.title}
                        onClick={() => navigate(`/products/${product.id}`)}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            component="h3" 
                            gutterBottom
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            {product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {product.description.length > 150 
                              ? `${product.description.substring(0, 150)}...` 
                              : product.description}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${product.price.toFixed(2)}
                          </Typography>
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="small"
                            onClick={() => handleAddToCart(product)}
                            sx={{ 
                              borderRadius: '50px',
                              px: 2,
                              py: 0.8,
                              textTransform: 'none',
                              fontWeight: 'bold'
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    showFirstButton 
                    showLastButton
                  />
                </Box>
              )}
              
              {filteredProducts.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8, width: '100%' }}>
                  <Typography variant="h6" color="text.secondary">
                    No products found. Try adjusting your filters.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      );
    }
