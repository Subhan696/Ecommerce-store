import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import productsReducer from '../features/products/productsSlice';

// Create a basic store configuration
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Temporarily disable serializable check
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persist cart to localStorage
const persistCart = () => {
  try {
    const { cart } = store.getState();
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error persisting cart:', error);
  }
};

// Load initial cart state
const initializeCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      store.dispatch({ type: 'cart/loadCart', payload: parsedCart });
    }
  } catch (error) {
    console.error('Error initializing cart:', error);
  }
};

// Subscribe to store changes
store.subscribe(persistCart);

// Initialize cart on app start
initializeCart();

export default store;
