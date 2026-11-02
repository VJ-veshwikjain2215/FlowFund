import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  dashboard: null,
  isLoading: false,
  error: null,
  theme: 'dark',

  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data;
      localStorage.setItem('token', token);
      set({ token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Invalid credentials', isLoading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', userData);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, dashboard: null });
  },

  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/buffer');
      set({ dashboard: response.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load dashboard', isLoading: false });
    }
  },

  uploadCSV: async (file) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/buffer/calculate', formData);
      set({ dashboard: response.data, isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Upload failed', isLoading: false });
      return false;
    }
  }
}));

export default useStore;
