
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

export const getWorkshops = () => API.get('/workshops');
export const getWorkshopById = (id) => API.get(`/workshops/${id}`);
export const createWorkshop = (workshopData) => API.post('/workshops', workshopData);
export const updateWorkshop = (id, workshopData) => API.put(`/workshops/${id}`, workshopData);
export const deleteWorkshop = (id) => API.delete(`/workshops/${id}`);



export const getFeaturedWorkshops = async () => {
  try {
    console.log('API: Fetching featured workshops');
    const response = await API.get('/workshops/featured');
    return response.data;
  } catch (error) {
    console.error('API Error - getFeaturedWorkshops:', error.response?.data || error.message);
    throw error;
  }
};

export const getWorkshopsWithFilters = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/workshops?${queryString}` : '/workshops';
    
    console.log('API: Fetching workshops with filters:', filters);
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error('API Error - getWorkshopsWithFilters:', error.response?.data || error.message);
    throw error;
  }
};

export const getWorkshopsByCategory = async (category, filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const queryString = params.toString();
    const url = queryString 
      ? `/workshops/category/${category}?${queryString}` 
      : `/workshops/category/${category}`;
    
    console.log('API: Fetching workshops by category:', category);
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error('API Error - getWorkshopsByCategory:', error.response?.data || error.message);
    throw error;
  }
};

export const searchWorkshops = async (searchTerm, category = null, page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('search', searchTerm);
    params.append('page', page);
    params.append('limit', limit);
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    console.log('API: Searching workshops:', searchTerm);
    const response = await API.get(`/workshops?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('API Error - searchWorkshops:', error.response?.data || error.message);
    throw error;
  }
};


export const getCategories = async () => {
  try {
    console.log('API: Fetching categories');
    const response = await API.get('/categories');
    return response.data;
  } catch (error) {
    console.error('API Error - getCategories:', error.response?.data || error.message);
    throw error;
  }
};


export const getHomepageData = async () => {
  try {
    console.log('API: Fetching homepage data');
    
    const [featuredResponse, categoriesResponse] = await Promise.allSettled([
      getFeaturedWorkshops(),
      getCategories()
    ]);
    
    const result = {
      featuredWorkshops: featuredResponse.status === 'fulfilled' ? featuredResponse.value : null,
      categories: categoriesResponse.status === 'fulfilled' ? categoriesResponse.value : null,
      errors: []
    };
    
    if (featuredResponse.status === 'rejected') {
      result.errors.push('Failed to fetch featured workshops');
    }
    
    if (categoriesResponse.status === 'rejected') {
      result.errors.push('Failed to fetch categories');
    }
    
    return result;
  } catch (error) {
    console.error('API Error - getHomepageData:', error);
    throw error;
  }
};


export const enrollWorkshop = async (workshopId) => {
  try {
    console.log('API: Enrolling in workshop:', workshopId);
    const response = await API.post(`/enrollments/${workshopId}/enroll`);
    return response.data;
  } catch (error) {
    console.error('API Error - enrollWorkshop:', error.response?.data || error.message);
    throw error;
  }
};

export const getMyEnrollments = async () => {
  try {
    const response = await API.get('/enrollments/my-enrollments');
    return response.data;
  } catch (error) {
    console.error('API Error - getMyEnrollments:', error.response?.data || error.message);
    throw error;
  }
};

export const getEnrollmentByWorkshop = async (workshopId) => {
  try {
    const response = await API.get(`/enrollments/workshops/${workshopId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // not enrolled
    }
    console.error('API Error - getEnrollmentByWorkshop:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEnrollmentProgress = async (workshopId, progress, completed = false) => {
  try {
    const response = await API.patch(`/enrollments/${workshopId}/progress`, {
      progress,
      completed,
    });
    return response.data;
  } catch (error) {
    console.error('API Error - updateEnrollmentProgress:', error.response?.data || error.message);
    throw error;
  }
};

export const cancelEnrollment = async (workshopId) => {
  try {
    const response = await API.delete(`/enrollments/${workshopId}/enroll`);
    return response.data;
  } catch (error) {
    console.error('API Error - cancelEnrollment:', error.response?.data || error.message);
    throw error;
  }
};

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