import axios from 'axios';  
import dotenv from 'dotenv';

// Create an Axios instance with the base URL of your backend
const api = axios.create({
  baseURL:  'http://localhost:5000', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication APIs
const loginWithGoogle = async () => {
  try {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `http://localhost:5000/auth/google`;
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
};

const setPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/set-password', { token, password });
    return response.data;
  } catch (error) {
    console.error('Failed to set password:', error);
    throw error;
  }
};

const fetchUserProfile = async () => {
  try {
    console.log('Making profile request with token:', localStorage.getItem('token'));
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error.response?.data || error.message);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

// Item APIs
const submitFoundItem = async (itemData) => {
  try {
    const response = await api.post('/api/items/found', itemData);
    return response.data;
  } catch (error) {
    console.error('Failed to submit found item:', error);
    throw error;
  }
};

const submitLostItem = async (itemData) => {
  try {
    const response = await api.post('/api/items/lost', itemData);
    return response.data;
  } catch (error) {
    console.error('Failed to submit lost item:', error);
    throw error;
  }
};

const fetchFoundItems = async () => {
  try {
    const response = await api.get('/api/items/found');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch found items:', error);
    throw error;
  }
};

const fetchLostItems = async () => {
  try {
    const response = await api.get('/api/items/lost');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch lost items:', error);
    throw error;
  }
};

export {
  loginWithGoogle,
  setPassword,
  fetchUserProfile,
  logout,
  submitFoundItem,
  submitLostItem,
  fetchFoundItems,
  fetchLostItems,
};