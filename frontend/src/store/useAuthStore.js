import { create } from 'zustand';
import { authService } from '../services/authService';
import { useFinanceStore } from './useFinanceStore';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(email, password);
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication Failed';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    useFinanceStore.setState({ dashboard: null, cashBalance: null, transactions: [], isLoading: false, error: null, successMsg: null, rowErrors: [] });
    set({ token: null, user: null, error: null });
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({ name, email, password });
      const { user, token } = response;
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'System error: Registration service is currently busy. Please wait 5 seconds and try again.';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  setUser: (user) => {
    set({ user });
  },

  completeOnboarding: async (data) => {
    set({ isLoading: true });
    try {
      const updatedUser = await authService.onboard(data);
      set({ user: updatedUser, isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Onboarding Failed', isLoading: false });
      return false;
    }
  },

  updateProfile: async (name) => {
    set({ isLoading: true });
    try {
      const updatedUser = await authService.updateProfile(name);
      set({ user: updatedUser, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  updateEmail: async (email) => {
    set({ isLoading: true });
    try {
      const updatedUser = await authService.updateEmail(email);
      set({ user: updatedUser, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update email';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    set({ isLoading: true });
    try {
      const user = await authService.getMe();
      set({ user, isLoading: false });
      return user;
    } catch (err) {
      localStorage.removeItem('token');
      useFinanceStore.setState({ dashboard: null, cashBalance: null, transactions: [], isLoading: false, error: null, successMsg: null, rowErrors: [] });
      set({ user: null, token: null, isLoading: false });
      return null;
    }
  }
}));

export default useAuthStore;
