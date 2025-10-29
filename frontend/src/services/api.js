
import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 10000, 
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const logout = () => API.post('/auth/logout');
export const getProfile = () => API.get('/auth/profile');


export const handleApiResponse = (response) => {
  if (response.data && response.data.success !== false) {
    return response.data.data || response.data;
  }
  throw new Error(response.data?.message || 'API request failed');
};


export const handleApiError = (error) => {
  if (error.response) {

    const message = error.response.data?.message || error.response.statusText;
    throw new Error(message);
  } else if (error.request) {

    throw new Error('No response from server. Please check your connection.');
  } else {

    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export default API;