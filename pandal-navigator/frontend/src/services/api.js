import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk if available
    const getToken = async () => {
      try {
        // This will be injected by the component using the service
        if (window.getClerkToken) {
          return await window.getClerkToken();
        }
      } catch (error) {
        console.error('Error getting Clerk token:', error);
      }
      return null;
    };

    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Don't show toast for 401 errors (handled by auth)
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API Services
export const apiService = {
  // Pandals
  pandals: {
    getAll: (params = {}) => api.get('/pandals', { params }),
    getById: (id) => api.get(`/pandals/${id}`),
    getNearby: (lat, lng, radius = 5000) => 
      api.get(`/pandals/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    getByArea: (area) => api.get(`/pandals/area/${area}`),
  },

  // Eateries
  eateries: {
    getAll: (params = {}) => api.get('/eateries', { params }),
    getById: (id) => api.get(`/eateries/${id}`),
    getNearby: (lat, lng, radius = 2000) => 
      api.get(`/eateries/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    getByArea: (area) => api.get(`/eateries/area/${area}`),
  },

  // Routes
  routes: {
    getAll: () => api.get('/routes'),
    getById: (id) => api.get(`/routes/${id}`),
    create: (data) => api.post('/routes', data),
    update: (id, data) => api.put(`/routes/${id}`, data),
    delete: (id) => api.delete(`/routes/${id}`),
    optimize: (data) => api.post('/routes/optimize', data),
  },

  // Reviews
  reviews: {
    getByItem: (itemType, itemId) => api.get(`/reviews/${itemType}/${itemId}`),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
  },

  // Favorites
  favorites: {
    getAll: () => api.get('/favorites'),
    add: (itemId, itemType) => api.post('/favorites', { itemId, itemType }),
    remove: (itemId, itemType) => api.delete(`/favorites/${itemId}/${itemType}`),
  },

  // User Profile
  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    getStats: () => api.get('/user/stats'),
  },

  // Search
  search: {
    global: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
    pandals: (query) => api.get(`/pandals/search?q=${encodeURIComponent(query)}`),
    eateries: (query) => api.get(`/eateries/search?q=${encodeURIComponent(query)}`),
  },
};

// Helper function to setup auth token from Clerk
export const setupAuthToken = (getTokenFunction) => {
  window.getClerkToken = getTokenFunction;
};

export default api;