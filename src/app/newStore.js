import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';

// Create a basic store with just the essential configuration
const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // Temporarily disable serializable check
  }),
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

// Subscribe to store changes
store.subscribe(persistCart);

export default store;
