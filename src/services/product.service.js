import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    const response = await api.get(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  getProductsByBrand: async (brandId, params = {}) => {
    const response = await api.get(`/products/brand/${brandId}`, { params });
    return response.data;
  },

  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Admin functions
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Reviews
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  }
};

export default productService;
