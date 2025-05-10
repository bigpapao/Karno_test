import api from './api';

export const categoryService = {
  getCategories: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getFeaturedCategories: async (limit = 6) => {
    const response = await api.get('/categories/featured', { params: { limit } });
    return response.data;
  },

  // Admin functions
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;
