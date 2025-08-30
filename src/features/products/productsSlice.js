import { createSlice } from '@reduxjs/toolkit';
import { useGetProductsQuery } from '../../app/api/apiSlice';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
  filters: {
    category: 'all',
    sortBy: 'featured',
    searchQuery: '',
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        useGetProductsQuery.matchPending,
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        useGetProductsQuery.fulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.products = action.payload;
        }
      )
      .addMatcher(
        useGetProductsQuery.rejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );
  },
});

export const { setCategoryFilter, setSortBy, setSearchQuery } = productsSlice.actions;

export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectProductById = (state, productId) =>
  state.products.products.find(product => product.id === productId);
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;

export const selectFilteredProducts = (state) => {
  const { products } = state.products;
  const { category, sortBy, searchQuery } = state.products.filters;

  let filteredProducts = [...products];

  // Filter by category
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    default: // 'featured' or any other
      // Keep original order or implement featured logic
      break;
  }

  return filteredProducts;
};
