// frontend/src/services/api.js
import axios from 'axios';

// Backend URL configuration - automatically detects environment
const getBackendUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on current domain
  const currentDomain = window.location.hostname;
  
  // Development environment
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
    return 'http://localhost:4000';
  } 
  // Production environment (Vercel, custom domains, etc.)
  else {
    // Always use production backend for any non-localhost domain
    return 'https://real-estate-website-backend-zfu7.onrender.com';
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