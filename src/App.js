import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './utils/theme';
import { fetchProfile, setAuthFromFirebase } from './store/slices/authSlice';
import { auth, signInAnonymously, onAuthStateChanged } from './firebase';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Orders from './pages/Orders';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminBrands from './pages/admin/Brands';

function App() {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch profile only if there's a token AND the user is authenticated and NOT anonymous
    // The `user` object in Redux state should have `isAnonymous` property from Firebase
    if (token && isAuthenticated && user && !user.isAnonymous) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, isAuthenticated, user]); // Added isAuthenticated and user to dependencies

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          console.log("Firebase user detected:", firebaseUser.uid, "Is Anonymous:", firebaseUser.isAnonymous);
          
          const mappedUser = {
            _id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAnonymous: firebaseUser.isAnonymous,
          };

          dispatch(setAuthFromFirebase({ user: mappedUser, token: idToken }));
        } catch (error) {
          console.error("Error getting ID token or dispatching auth state:", error);
          // If there's an error during auth state setup, treat as logged out
          dispatch(setAuthFromFirebase({ user: null, token: null })); 
        }
      } else {
        console.log("Firebase user is signed out. Setting auth state to null and attempting anonymous sign-in.");
        // dispatch(logout()); // DON'T dispatch logout() here, it causes cycles/issues
        dispatch(setAuthFromFirebase({ user: null, token: null })); // Correctly set state to logged out
        
        signInAnonymously(auth)
          .then((anonUserCredential) => {
            // onAuthStateChanged will fire again with the anonymous user
            // and the logic above will handle dispatching setAuthFromFirebase for the anon user.
            console.log("Anonymous sign-in successful after logout/initial load."); 
          })
          .catch((error) => {
            console.error("Anonymous sign-in error after logout:", error.code, error.message);
          });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/:brandSlug" element={<BrandDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:productSlug" element={<ProductDetails />} />
          <Route path="search" element={<Products />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="brands"
            element={
              <AdminRoute>
                <AdminBrands />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
