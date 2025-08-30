import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fakestoreapi.com/auth';

// Async thunks for authentication
// Note: The fake store API doesn't support real authentication,
// so we'll simulate it with localStorage
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // In a real app, you would make an API call here
      // const response = await axios.post(`${API_URL}/login`, { username, password });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any non-empty username/password
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      // Create a mock user object
      const user = {
        id: 1,
        username,
        email: `${username}@example.com`,
        firstName: username,
        lastName: 'User',
        token: 'demo-jwt-token',
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Please fill in all required fields');
      }
      
      // Create a mock user object
      const user = {
        id: Math.floor(Math.random() * 1000),
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || userData.username,
        lastName: userData.lastName || 'User',
        token: 'demo-jwt-token',
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Check for existing user in localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  isAuthenticated: !!localStorage.getItem('user'),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = 'Login successful';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Login failed';
        state.user = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = 'Registration successful';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Registration failed';
        state.user = null;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to update profile';
      });
  },
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an API call here
      // const response = await axios.put(`${API_URL}/users/${auth.user.id}`, userData);
      
      // For demo purposes, just update the local user data
      const updatedUser = {
        ...auth.user,
        ...userData,
        // Preserve fields that shouldn't be updated
        id: auth.user.id,
        token: auth.user.token
      };
      
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectAuthStatus = (state) => ({
  isLoading: state.auth.isLoading,
  isSuccess: state.auth.isSuccess,
  isError: state.auth.isError,
  message: state.auth.message,
});
