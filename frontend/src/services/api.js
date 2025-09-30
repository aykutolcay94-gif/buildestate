// frontend/src/services/api.js
import axios from 'axios';

// Auto-detect backend URL based on environment
const getBackendUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on current domain
  const currentDomain = window.location.hostname;
  
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
    return 'http://localhost:4000';
  } else {
    // For production, try to find the backend URL
    // You should replace this with your actual backend domain
    return 'https://buildestate-backend.vercel.app';
  }
};

const API_URL = getBackendUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const searchProperties = async (searchParams) => {
  try {
    const response = await api.post('/api/properties/search', searchParams);
    return response.data;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};

export const getLocationTrends = async (city) => {
  try {
    const response = await api.get(`/api/locations/${encodeURIComponent(city)}/trends`);
    return response.data;
  } catch (error) {
    console.error('Error fetching location trends:', error);
    throw error;
  }
};

export default api;