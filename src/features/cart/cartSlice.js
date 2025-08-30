import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  shippingAddress: {},
  paymentMethod: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCart: (state, action) => {
      const { items, totalQuantity, totalAmount } = action.payload;
      state.items = items;
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }
      
      state.totalQuantity += newItem.quantity || 1;
      state.totalAmount = calculateTotal(state.items);
      
      // Save cart to localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalAmount: state.totalAmount,
      }));
    },
    
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
      }
      
      state.totalQuantity--;
      state.totalAmount = calculateTotal(state.items);
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalAmount: state.totalAmount,
      }));
    },
    
    deleteItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.items = state.items.filter(item => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount = calculateTotal(state.items);
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          totalQuantity: state.totalQuantity,
          totalAmount: state.totalAmount,
        }));
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      // Clear cart from localStorage
      localStorage.removeItem('cart');
    },
    
    loadCartFromStorage: (state) => {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const { items, totalQuantity, totalAmount } = JSON.parse(cartData);
        state.items = items;
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      }
    },
    
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },
});

// Helper function to calculate total amount
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

export const {
  addItemToCart,
  removeItemFromCart,
  deleteItemFromCart,
  clearCart,
  loadCart,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectShippingAddress = (state) => state.cart.shippingAddress;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;
