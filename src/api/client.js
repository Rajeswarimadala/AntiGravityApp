import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

// Request interceptor: attach JWT token from localStorage to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: on 401 error, clear token and redirect to /login
client.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const loginUser = async (email, password) => {
  const response = await client.post('/api/login', { email, password });
  return response.data;
};

export const registerUser = async (data) => {
  const response = await client.post('/api/register', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/api/users/me');
  return response.data;
};

export const createItem = async (payload) => {
  const response = await client.post('/api/items', payload);
  return response.data;
};

export const getItems = async () => {
  const response = await client.get('/api/items');
  return response.data;
};

export default client;
