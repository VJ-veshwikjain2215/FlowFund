import api from './api';

const aiApi = api;

export const financeService = {
  getBuffer: async () => {
    try {
      const response = await aiApi.get('/finance/dashboard');
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Unable to load financial data');
    }
  },

  calculate: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await aiApi.post('/finance/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      console.error('❌ [UPLOAD] Error:', err);
      if (!err.response) {
        throw new Error('Upload service is unavailable. Please try again.');
      }
      if (err.response?.status === 400) {
        throw new Error(err.response?.data?.message || 'Invalid CSV format or missing columns');
      }
      if (err.response?.status >= 500) {
        throw new Error('Server failed to parse file. Check backend logs.');
      }
      throw new Error(err.response?.data?.detail || err.message || 'Sync System Offline');
    }
  },

  getTransactions: async () => {
    try {
      const response = await aiApi.get('/finance/transactions');
      return response.data || [];
    } catch (err) {
      throw err;
    }
  },

  // Minimal manual insert (optional if you still use spring boot for single inserts)
  addTransaction: async (tx) => {
    throw new Error('Manual entries are temporarily paused while CSV Sync manages state.');
  },

  vacationPlanner: async ({ totalBalance, expenses, selectedWeeks = 1, predictedIncome = 0 }) => {
    try {
      const response = await aiApi.post('/finance/vacation-planner', { totalBalance, expenses, selectedWeeks, predictedIncome });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Unable to calculate the break plan. Please try again.');
    }
  }
};

export default financeService;
