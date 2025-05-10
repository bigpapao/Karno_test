import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import axios from 'axios';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Special admin login for development (bypasses backend)
      if (credentials.email === 'admin@karno.com' && credentials.password === 'admin123456') {
        const adminData = {
          status: 'success',
          token: 'admin-dev-token',
          user: {
            _id: 'admin-dev-id',
            firstName: 'Admin',
            lastName: 'Karno',
            email: 'admin@karno.com',
            phone: '+989362782272',
            role: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
        
        // Store token in localStorage
        localStorage.setItem('token', adminData.token);
        localStorage.setItem('user', JSON.stringify(adminData.user));
        
        return adminData;
      }
      
      // Regular user login - Direct API call without service layer
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          // Adding these options to help with CORS issues
          credentials: 'include',
          mode: 'cors'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData.message || 'خطا در ورود. لطفا دوباره تلاش کنید');
        }
        
        const data = await response.json();
        // Store token in localStorage for persistence
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      } catch (fetchError) {
        console.error('Network error during login:', fetchError);
        return rejectWithValue('خطا در اتصال به سرور. لطفا از اتصال اینترنت خود اطمینان حاصل کنید');
      }
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(
        error.message || 'خطا در ورود. لطفا دوباره تلاش کنید'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Registering user with data:', { ...userData, password: '***' });
      
      // Ensure we're sending the right format of data to the backend
      // Our backend expects either firstName/lastName or a single name field
      const formattedUserData = { ...userData };
      
      // Direct API call to the backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedUserData),
        credentials: 'include',
        mode: 'cors'
      });
      
      // Even if response is not OK, try to parse the JSON for error details
      const data = await response.json().catch(() => ({
        status: 'error',
        message: 'خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.'
      }));
      
      if (!response.ok) {
        console.error('Backend registration failed:', data);
        return rejectWithValue(data.message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.');
      }
      
      // Store token and user in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (data.data && data.data.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(
        error.message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      console.log('Requesting password reset for email:', email);
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include', // Important for cookies/sessions if used
        mode: 'cors', // Ensure CORS is handled
      });

      const data = await response.json(); // Try to parse JSON regardless of response.ok

      if (!response.ok) {
        // Use message from backend response if available, otherwise a generic one
        return rejectWithValue(data.message || 'درخواست بازنشانی رمز عبور با خطا مواجه شد.');
      }

      // If successful, the backend should have sent the email.
      // The frontend will typically show a success message based on this thunk's fulfillment.
      return data; // Contains success message from backend, e.g., { status: 'success', message: 'Email sent' }
    } catch (error) {
      console.error('Forgot password error:', error);
      // Handle network errors or other unexpected issues
      return rejectWithValue('خطا در اتصال به سرور. لطفا اتصال اینترنت خود را بررسی کنید.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    // resetData should be an object like { token, password }
    try {
      console.log('Attempting to reset password with token:', resetData.token ? '******' : 'MISSING TOKEN', 'and new password length:', resetData.password ? resetData.password.length : 'MISSING PASSWORD');
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: resetData.token, password: resetData.password }),
        credentials: 'include',
        mode: 'cors'
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'خطا در بازنشانی گذرواژه. لطفا دوباره تلاش کنید');
      }

      const data = await response.json();
      // Backend returns new token and user data upon successful password reset
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data; // Contains new token and user object
    } catch (error) {
      console.error('Reset password error:', error);
      return rejectWithValue(
        error.message || 'خطا در بازنشانی گذرواژه. لطفا دوباره تلاش کنید'
      );
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      // Special handling for admin dev token
      if (token === 'admin-dev-token') {
        // Get admin user from localStorage
        const adminUser = JSON.parse(localStorage.getItem('user'));
        if (adminUser && adminUser.role === 'admin') {
          return adminUser;
        }
      }
      
      // Direct API call without service layer for regular users
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      return data.user || data.data; // Handle different API response formats
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to fetch profile.'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      // Direct API call without service layer
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      return data.data; // Assuming the API returns { status, data }
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to update profile.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth); // Sign out from Firebase
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true; // Indicate successful logout
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || '/api';
      const response = await axios.post(`${API_URL}/auth/google-login`, { idToken });
      if (response.data && response.data.token && response.data.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data; // Contains token and user data { token, data: { user } }
      } else {
        return rejectWithValue('Invalid response from Google login endpoint');
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'), // More robust check for initial auth state
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFromFirebase: (state, action) => {
      if (action.payload && action.payload.user) {
        const firebaseUser = action.payload.user;
        state.user = firebaseUser;
        state.token = action.payload.token;
        state.isAuthenticated = !!(firebaseUser && !firebaseUser.isAnonymous);

        if (state.isAuthenticated) { 
          localStorage.setItem('user', JSON.stringify(firebaseUser));
          localStorage.setItem('token', action.payload.token);
        } else { 
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; 
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMessage = action.payload.message || 'ورود با موفقیت انجام شد';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'خطا در ورود';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Google Login
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // User is now authenticated with our backend
        state.error = null;
        state.successMessage = 'Logged in successfully with Google!';
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Google login failed';
      });

    // Registration
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; 
        state.successMessage = action.payload.message || 'ثبت نام با موفقیت انجام شد. اکنون میتوانید وارد شوید.';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'خطا در ثبت نام';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'ایمیل بازنشانی رمز عبور ارسال شد. لطفا صندوق ورودی خود را بررسی کنید.';
        state.isAuthenticated = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'خطا در ارسال ایمیل بازنشانی رمز عبور.';
        state.successMessage = null;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = 'گذرواژه شما با موفقیت بازنشانی شد.'; 
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password.';
        state.successMessage = null;
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload === 'Token expired') {
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('token');
        }
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const { clearError, setAuthFromFirebase } = authSlice.actions;

export default authSlice.reducer;
