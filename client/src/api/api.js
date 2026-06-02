import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Pointing to our Express backend
});

// Automatically attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
