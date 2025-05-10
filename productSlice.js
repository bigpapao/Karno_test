import { createSlice } from '@reduxjs/toolkit';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Brake Pad Set',
    slug: 'brake-pad-set',
    brand: 'Kia',
    price: 89.99,
    discountPrice: 79.99,
    rating: 4.5,
    reviewCount: 128,
    image: '',
    category: 'Brakes',
    description: 'High-quality brake pads for optimal stopping power and safety.',
    inStock: true,
  },
  {
    id: 2,
    name: 'Oil Filter',
    slug: 'oil-filter',
    brand: 'Toyota',
    price: 12.99,
    discountPrice: null,
    rating: 4.8,
    reviewCount: 95,
    image: '',
    category: 'Engine',
    description: 'Genuine oil filter for clean and efficient engine operation.',
    inStock: true,
  },
  {
    id: 3,
    name: 'Spark Plug Set',
    slug: 'spark-plug-set',
    brand: 'BMW',
    price: 45.99,
    discountPrice: 39.99,
    rating: 4.7,
    reviewCount: 64,
    image: '',
    category: 'Engine',
    description: 'Premium spark plugs for improved performance and fuel efficiency.',
    inStock: true,
  },
  {
    id: 4,
    name: 'Air Filter',
    slug: 'air-filter',
    brand: 'Honda',
    price: 19.99,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 82,
    image: '',
    category: 'Engine',
    description: 'High-flow air filter for better engine breathing and performance.',
    inStock: true,
  },
  {
    id: 5,
    name: 'Shock Absorber',
    slug: 'shock-absorber',
    brand: 'Nissan',
    price: 129.99,
    discountPrice: 109.99,
    rating: 4.4,
    reviewCount: 56,
    image: '',
    category: 'Suspension',
    description: 'Heavy-duty shock absorbers for a smooth and controlled ride.',
    inStock: true,
  },
  {
    id: 6,
    name: 'Timing Belt Kit',
    slug: 'timing-belt-kit',
    brand: 'Hyundai',
    price: 149.99,
    discountPrice: 129.99,
    rating: 4.9,
    reviewCount: 42,
    image: '',
    category: 'Engine',
    description: 'Complete timing belt kit with all necessary components for a proper replacement.',
    inStock: false,
  },
];

const initialState = {
  products: mockProducts,
  product: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    brand: null,
    priceRange: [0, 1000000],
    sortBy: 'newest',
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    fetchProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
  updateFilters,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;
