import { create } from 'zustand';
import { financeService } from '../services/financeService';

export const useFinanceStore = create((set) => ({
  dashboard: null,
  cashBalance: null,
  setCashBalance: (cashBalance) => set({ cashBalance }),
  transactions: [],
  isLoading: false,
  error: null,
  rowErrors: [],
  successMsg: null,
  
  // 🛡️ [INTEGRITY] Normalization Adapter Layer
  normalizeDashboardData: (data) => {
    if (!data) return null;
    
    // Bridge between Backend v3 (CamelCase) and Backend v4 (snake_case + specific requirements)
    const normalized = {
      has_data: data.has_data ?? (data.safeToSpend > 0 || data.safe_spend > 0),
      safe_spend: data.safe_spend ?? data.safeToSpend ?? 0,
      emergency_buffer: data.emergency_buffer ?? data.score ?? 0,
      stability: data.stability ?? (data.reliability > 70 ? "Stable" : (data.reliability > 40 ? "Evolving" : "Volatile")),
      volatility: data.volatility ?? (data.volatility_score ? Math.round(data.volatility_score * 100) : 0),
      prediction: data.prediction ?? {
        expected: data.forecast ?? 0,
        min: data.forecast_min ?? 0,
        max: data.forecast_max ?? 0
      },
      insights: data.insights ?? ["No patterns detected yet."],
      reliability: data.reliability ?? 0,
      forecast_expense: data.forecast_expense ?? 0,
      data_points: data.data_points ?? 0,
      tax_buffer: data.tax_buffer ?? 0,
      model_used: data.model_used ?? null,
      forecast_series: data.forecast_series ?? data.forecastSeries ?? []
    };

    return normalized;
  },

  fetchDashboard: async () => {
    const sessionToken = localStorage.getItem('token');
    const { normalizeDashboardData } = useFinanceStore.getState();
    set({ isLoading: true });
    try {
      const [rawDashboard, transactions] = await Promise.all([
        financeService.getBuffer(),
        financeService.getTransactions()
      ]);
      if (sessionToken !== localStorage.getItem('token')) return;
      const dashboard = normalizeDashboardData(rawDashboard);
      set({ dashboard, transactions, error: null, isLoading: false });
    } catch (err) {
      if (sessionToken !== localStorage.getItem('token')) return;
      console.error("❌ [INTEGRITY] Sync failed:", err);
      set({ error: 'System Fetch Failed', isLoading: false });
    }
  },

  uploadSync: async (file) => {
    const sessionToken = localStorage.getItem('token');
    const { normalizeDashboardData } = useFinanceStore.getState();
    set({ isLoading: true, error: null, rowErrors: [], successMsg: null });
    try {
      console.log("📂 [INTEGRITY] Uploading CSV for full engine re-sync...");
      const response = await financeService.calculate(file);
      if (sessionToken !== localStorage.getItem('token')) return false;
      const [rawDashboard, transactions] = await Promise.all([
        financeService.getBuffer(),
        financeService.getTransactions()
      ]);
      
      const dashboard = normalizeDashboardData(rawDashboard);

      if (sessionToken !== localStorage.getItem('token')) return false;
      if (response && response.errors && response.errors.length > 0) {
         set({ rowErrors: response.errors, error: 'Some rows contained errors.', dashboard, transactions, isLoading: false });
      } else {
         set({ dashboard, transactions, isLoading: false, successMsg: "Data updated successfully" });
         // ⏳ Auto-clear success message
         setTimeout(() => set({ successMsg: null }), 5000);
      }
      return true;
    } catch (err) {
      if (sessionToken !== localStorage.getItem('token')) return false;
      console.error("🏁 [INTEGRITY] Upload failed:", err);
      set({ error: err.message || 'Sync System Offline', rowErrors: [], isLoading: false });
      return false;
    }
  },

  addTransaction: async (tx) => {
    const { normalizeDashboardData } = useFinanceStore.getState();
    set({ isLoading: true, error: null });
    try {
      await financeService.addTransaction(tx);
      const [rawDashboard, transactions] = await Promise.all([
        financeService.getBuffer(),
        financeService.getTransactions()
      ]);
      const dashboard = normalizeDashboardData(rawDashboard);
      set({ dashboard, transactions, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.message || 'Manual Entry Failed', isLoading: false });
      return false;
    }
  }
}));

export default useFinanceStore;
