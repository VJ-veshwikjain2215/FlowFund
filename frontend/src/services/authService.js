import axios from 'axios';
import { apiBaseUrl } from '../config';

const API_URL = apiBaseUrl;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; // Expecting { user, token }
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data; // Expecting { user, token }
  },

  onboard: async (data) => {
    const response = await axios.post(`${API_URL}/users/onboard`, data, getAuthHeader());
    return response.data; // Returns updated user
  },

  getMe: async () => {
    const response = await axios.get(`${API_URL}/users/me`, getAuthHeader());
    return response.data;
  },

  updateProfile: async (name) => {
    const response = await axios.put(`${API_URL}/users/profile`, { name }, getAuthHeader());
    return response.data;
  },

  updateEmail: async (email) => {
    const response = await axios.put(`${API_URL}/users/email`, { email }, getAuthHeader());
    return response.data;
  }
};

export default authService;
