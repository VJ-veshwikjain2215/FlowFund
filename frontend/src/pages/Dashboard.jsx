import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import BalanceInput from '../components/BalanceInput';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Loader2, UploadCloud, Bell, ShieldCheck, AlertCircle, TrendingDown, Wallet, Target, ChevronRight } from 'lucide-react';

const pieColors = ['#8fb697', '#d5ae73', '#FDBA74'];

const CircularProgress = ({ percentage }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
        <circle
          cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className="text-[#8fb697] transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-xl font-bold text-white">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { dashboard, transactions, fetchDashboard, isLoading, uploadSync, error, successMsg } = useFinanceStore();
  const moneyYouCanUse = dashboard?.safe_spend || 0;
  const user = useAuthStore(s => s.user);

  // 1. Fetch data on load
  useEffect(() => { 
    fetchDashboard(); 
  }, [fetchDashboard]);

  // 2. CSV Sync Handler
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📂 [SYNC] Initiating full financial re-sync...");
      await uploadSync(file);
      e.target.value = null; // reset input
    }
  };

  // 3. Unified Metrics Mapping (Atomic Synchronization)
  const hasRealData = dashboard?.has_data === true;
  const balance = useFinanceStore((state) => state.cashBalance);
  const currentSavings = balance ?? 0;
  const savedAmount = currentSavings; // alias
  
  // 3a. Static Emergency Buffer Logic based ONLY on User's Onboarding Data
  // Safety guard for potential missing fields/variables in older session states
  const onboardingData = user; // alias for logic below
  const profile = user; // alias for logic below

  const monthlyExpense =
    (Number(user?.rent || 0) + Number(user?.groceries || 0) + Number(user?.utilities || 0) + Number(user?.internet || 0) + Number(user?.transport || 0) + Number(user?.otherExpenses || 0)) ||
    user?.monthlyExpenses ||
    user?.totalMonthlyExpense ||
    0;

  const emergencyTarget = Number(monthlyExpense) > 0 ? Number(monthlyExpense) * 6 : 0;
  const targetAmount = emergencyTarget; 
  
  const emergencyBuffer = emergencyTarget > 0 ? Math.min((currentSavings / emergencyTarget) * 100, 100) : 0;
  const hasOnboardingExpense = emergencyTarget > 0;


  const safeMonths = monthlyExpense > 0 ? (currentSavings / monthlyExpense).toFixed(1) : "0.0";

  const volatility = dashboard?.volatility || 0;
  const predictionMin = dashboard?.prediction?.min || 0;
  const predictionMax = dashboard?.prediction?.max || 0;
  const predictionExpected = dashboard?.prediction?.expected || 0;
  const stabilityText = dashboard?.stability || "Not available";
  const dynamicInsights = dashboard?.insights || ["Awaiting patterns"];
  const reliability = dashboard?.reliability || 0;
  
  const isOverspending = (predictionExpected) < monthlyExpense;
  const isInsufficientData = (dashboard?.data_points || 0) < 3;

  // 4. Chart Mapping (Simple monthly rollup)
  const chartData = React.useMemo(() => {
    if (!transactions?.length) return [];
    const months = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const m = isNaN(d.getTime()) ? 'Unknown' : `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} '${d.getFullYear().toString().slice(-2)}`;
      if (!months[m]) months[m] = { name: m, income: 0, expense: 0 };
      if (tx.type === 'INCOME') months[m].income += tx.amount;
      else months[m].expense += tx.amount;
    });
    return Object.values(months);
  }, [transactions]);

  const pieData = [
    { name: 'Estimated surplus', value: dashboard?.safe_spend || 0 },
    { name: 'Tax Buffer', value: dashboard?.tax_buffer || 0 },
    { name: 'Estimated expenses', value: dashboard?.forecast_expense || 0 }
  ];

  const isNewUser = !isLoading && !hasRealData && (!transactions || transactions.length === 0);

  // Background style
  const pageBgStyle = {
    background: 'var(--bg-main)'
  };

  const glassCardClass = "bg-[#25332c]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-[20px] p-8 border border-purple-500/20";
  const glassHoverClass = "hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-[#25332c]/80 hover:border-purple-500/40 transition-all duration-300";

  // 1. Entry State (Loading)
  if (isLoading && !hasRealData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-body relative" style={pageBgStyle}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-8 flex-1 content-center">
          {[1, 2, 3].map(i => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
              className={`${glassCardClass} flex flex-col gap-4 overflow-hidden relative`}>
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="w-10 h-10 bg-white/10 rounded-full" />
              <div className="w-1/2 h-4 bg-white/10 rounded-full" />
              <div className="w-3/4 h-8 bg-white/10 rounded-full mt-auto" />
            </motion.div>
          ))}
        </div>
        <p className="mt-12 text-white/50 font-medium animate-pulse tracking-wide pb-20">Analyzing your financial pattern...</p>
      </div>
    );
  }

  // 2. Entry State (Empty - First Time)
  if (isNewUser) {
    return (
      <section className="first-statement">
        <small>YOUR LEDGER / FIRST IMPORT</small>
        <h1>Open the books.</h1>
        <p>Upload a transaction CSV to see your income, spending and monthly estimates.</p>
        <label className="import-file">Transaction file
          <input type="file" accept=".csv" onChange={handleUpload} disabled={isLoading} />
        </label>
        {error && <p role="alert">{error}</p>}
        {successMsg && <p role="status">{successMsg}</p>}
      </section>
    );
  }
  // 3. Active Dashboard
  return (
    <div className="min-h-screen font-body p-6 lg:p-10 pb-24 text-white selection:bg-[#d5ae73] selection:text-white" style={pageBgStyle}>
      <div className="max-w-[1400px] mx-auto space-y-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

          {(error || (successMsg && !isLoading)) && (
            <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold shadow-sm backdrop-blur-md z-50 border transition-all duration-500 ${
              error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
              {error ? <AlertCircle size={16} /> : <ShieldCheck size={16} />}
              {error || successMsg}
            </div>
          )}

          {/* SEC 1: HERO INSIGHT */}
          <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-r from-[#8fb697] to-[#d5ae73] rounded-[32px] p-8 lg:p-10 shadow-[0_15px_40px_rgba(167,139,250,0.2)] flex flex-col justify-center hover:shadow-[0_20px_50px_rgba(167,139,250,0.35)] transition-all duration-500 border border-white/10 h-full min-h-[220px]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <h2 className="text-white/90 font-semibold text-base lg:text-lg uppercase tracking-widest flex items-center gap-2 text-shadow-sm">
                <Wallet size={18} />
                Estimated Monthly Surplus
              </h2>
              <div className="text-5xl lg:text-7xl font-black text-white tracking-tighter flex items-center gap-2 drop-shadow-md">
                ₹{hasRealData ? <CountUp end={moneyYouCanUse} duration={2} separator="," /> : "--"}
              </div>
              <p className="text-white text-sm font-medium inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-sm mt-2">
                <ShieldCheck size={16} /> {hasRealData ? "Estimate from imported activity, not your bank balance." : "No data available."}
              </p>
            </div>
          </div>

          {/* SEC 1b: QUICK ACTION */}
          <div className={`lg:col-span-1 bg-[#25332c]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-[32px] p-8 border border-purple-500/20 hover:border-purple-500/40 hover:bg-[#25332c]/80 transition-all duration-300 flex flex-col items-center justify-center text-center h-full min-h-[220px]`}>
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <UploadCloud size={24} className="text-[#8fb697]" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Sync Financial Data</h3>
            <p className="text-white/50 text-xs font-medium mb-6 px-4">
              Upload your latest income data to refresh insights
            </p>
            <label className="w-full max-w-[200px] bg-gradient-to-r from-[#8fb697] to-[#d5ae73] hover:shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:-translate-y-0.5 text-white transition-all cursor-pointer font-bold py-3 px-6 rounded-2xl flex justify-center items-center gap-2 text-sm">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Upload CSV"}
              <input type="file" className="hidden" onChange={handleUpload} accept=".csv" disabled={isLoading} />
            </label>
          </div>
        </motion.div>

        <BalanceInput />

        {/* SEC 2: 3 CORE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`${glassCardClass} ${glassHoverClass} flex items-center gap-6 ${!hasRealData ? 'opacity-50 pointer-events-none' : ''}`}>
            <CircularProgress percentage={emergencyBuffer} />
            <div>
              <p className="text-white/40 text-sm font-bold uppercase tracking-wider mb-1">Savings Coverage Estimate</p>

              <h3 className="text-white text-lg font-bold leading-tight">
                {balance != null && hasOnboardingExpense ? `You entered ₹${Math.round(savedAmount).toLocaleString()} saved` : "Enter savings to calculate coverage"}
              </h3>

              <p className="text-purple-300 text-xs mt-2 font-medium">
                {hasOnboardingExpense ? `Target: ₹${Math.round(targetAmount).toLocaleString()}` : "Target: Not set"}
              </p>

              {balance != null && hasOnboardingExpense ? (
                isOverspending ? (
                  <p className="text-red-400 text-xs mt-1 font-bold">🚨 Estimated income is below your entered monthly expenses.</p>
                ) : (
                  <p className="text-green-400 text-xs mt-1 font-bold">
                    Estimated coverage: {safeMonths} months 🎉
                  </p>
                )
              ) : (
                <p className="text-yellow-400 text-xs mt-1 font-bold">
                   ⚠️ Enter savings and monthly expenses to estimate coverage.
                </p>
              )}
            </div>
          </motion.div>

          {/* Income Stability */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`${glassCardClass} ${glassHoverClass} ${!hasRealData ? 'opacity-50 pointer-events-none' : ''}`}>
            <p className="text-white/40 text-sm font-bold uppercase tracking-wider mb-4">Income Stability</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${hasRealData ? (volatility > 40 ? 'bg-red-400' : 'bg-yellow-400') : 'bg-white/10'} ${hasRealData ? 'shadow-[0_0_10px_rgba(250,204,21,0.5)]' : ''}`} />
                  <span className="text-white font-bold">{hasRealData ? stabilityText : "Not available"}</span>
                </div>
                <p className="text-white/60 text-xs font-medium">Volatility: {hasRealData ? `${volatility}%` : "--"}</p>
              </div>
              <div className="w-16 h-10 border-b-2 border-white/10 flex items-end justify-between px-1 pb-1 gap-1">
                <div className={`w-1.5 h-1/2 rounded-full ${hasRealData ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'bg-white/5'}`} />
                <div className={`w-1.5 h-full rounded-full ${hasRealData ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'bg-white/5'}`} />
                <div className={`w-1.5 h-2/3 rounded-full ${hasRealData ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'bg-white/5'}`} />
                <div className={`w-1.5 h-3/4 rounded-full ${hasRealData ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'bg-white/5'}`} />
              </div>
            </div>
          </motion.div>

          {/* Prediction */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`${glassCardClass} ${glassHoverClass} relative overflow-hidden group ${!hasRealData ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#d5ae73]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#d5ae73]/20 transition-colors" />
            <p className="text-white/40 text-sm font-bold uppercase tracking-wider mb-2">Next Month Prediction</p>
            
            <div className="flex flex-col gap-0.5 mb-3">
              <h3 className="text-white text-3xl font-black tracking-tighter text-shadow-sm flex items-center flex-wrap">
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {hasRealData ? <>₹<CountUp end={predictionMin} duration={2} separator="," /></> : "₹--"}
                </span>
                <span className="mx-2 text-white/20 text-xl font-medium">–</span>
                <span className="bg-gradient-to-r from-[#d5ae73] to-[#d5ae73]/70 bg-clip-text text-transparent">
                  {hasRealData ? <>₹<CountUp end={predictionMax} duration={2} separator="," /></> : "₹--"}
                </span>
              </h3>
            </div>

            <div className="inline-flex flex-col gap-1 px-3 py-2 bg-[#d5ae73]/10 text-[#d5ae73] border border-[#d5ae73]/20 rounded-lg text-xs font-bold drop-shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5"><Target size={12} /> {hasRealData ? (dashboard?.model_used || "Rule-Based Estimate") : "No AI data"}</div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${reliability}%` }}
                  className="h-full bg-gradient-to-r from-[#8fb697] to-[#d5ae73]"
                />
              </div>
              <div className="flex justify-between items-center text-[9px] mt-0.5">
                <span className="text-white/40 uppercase">Data and stability indicator</span>
                <span className="text-white/80">{reliability}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SEC 3 & 4: GRAPHS + INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className={`${glassCardClass} h-[400px] flex flex-col`}>
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-bold text-white">Income Over Time</h3>
                  <p className="text-white/50 text-sm font-medium">Historical fluctuation pattern</p>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                {hasRealData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8fb697" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#8fb697" stopOpacity={0} />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: 'rgba(26,22,37,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(167,139,250,0.2)', color: 'white' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`₹${value}`, "Income"]}
                        cursor={{ stroke: 'rgba(167,139,250,0.5)', strokeWidth: 1, strokeDasharray: '5 5' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#8fb697" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" animationDuration={2000} filter="url(#glow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-4">
                    <TrendingDown size={48} strokeWidth={1} />
                    <p className="text-sm font-bold uppercase tracking-widest">Awaiting Financial History</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className={`${glassCardClass} h-[300px] flex flex-col p-6`}>
                <h3 className="text-base font-bold text-white mb-4">Income vs Expense</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hasRealData ? chartData : []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
                      <defs>
                        <filter id="glowPurple"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                        <filter id="glowPink"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickFormatter={(val) => `${val / 1000}k`} />
                      <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: 'rgba(26,22,37,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(167,139,250,0.2)' }} itemStyle={{ color: '#fff' }} />
                      <Bar dataKey="income" fill="#8fb697" radius={[10, 10, 0, 0]} animationDuration={1500} filter="url(#glowPurple)" />
                      <Bar dataKey="expense" fill="#d5ae73" radius={[10, 10, 0, 0]} animationDuration={1500} filter="url(#glowPink)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className={`${glassCardClass} h-[300px] flex flex-col items-center justify-between p-6`}>
                <h3 className="text-base font-bold text-white w-full text-left">Estimated Monthly Breakdown</h3>
                <div className="w-full flex-1 relative flex items-center justify-center -mt-6">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={hasRealData ? pieData : []} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none" animationDuration={1500}>
                        {(hasRealData ? pieData : []).map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} style={{ filter: 'drop-shadow(0px 0px 4px rgba(167,139,250,0.4))' }} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(26,22,37,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(167,139,250,0.2)' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full pt-4 flex justify-between gap-2 border-t border-white/5 text-[11px] font-bold text-white/50">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#8fb697] shadow-[0_0_8px_rgba(167,139,250,0.5)]" /> Usable</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#d5ae73] shadow-[0_0_8px_rgba(244,114,182,0.5)]" /> Illustrative tax</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#FDBA74] shadow-[0_0_8px_rgba(253,186,116,0.5)]" /> Expenses</div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
              className={`${glassCardClass} flex-1 flex flex-col`}>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <Bell size={20} className="text-[#FDBA74]" /> Smart Insights
              </h3>

              <div className="space-y-4 flex-1">
                {(hasRealData ? dynamicInsights : ["No insights available", "Awaiting financial patterns"]).map((insightText, idx) => {
                  let Icon = hasRealData ? Bell : Loader2;
                  let colorClass = hasRealData ? "text-[#8fb697]" : "text-white/20";
                  let bgClass = hasRealData ? "bg-[#8fb697]/10 border-[#8fb697]/20" : "bg-white/5 border-white/10";

                  if (hasRealData) {
                    if (insightText.toLowerCase().includes('warning') || insightText.toLowerCase().includes('add more data') || insightText.toLowerCase().includes('alert')) {
                      Icon = AlertCircle;
                      colorClass = "text-[#FDBA74]";
                      bgClass = "bg-[#FDBA74]/10 border-[#FDBA74]/20";
                    } else if (insightText.toLowerCase().includes('stability')) {
                      Icon = ShieldCheck;
                      colorClass = "text-[#d5ae73]";
                      bgClass = "bg-[#d5ae73]/10 border-[#d5ae73]/20";
                    }
                  }

                  return (
                    <motion.div key={idx} whileHover={hasRealData ? { scale: 1.02 } : {}} className={`p-4 rounded-[16px] border border-white/5 flex gap-4 transition-all bg-white/[0.02] ${!hasRealData ? 'opacity-50' : 'cursor-pointer hover:bg-white/5 hover:border-purple-500/20'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${bgClass} ${colorClass}`}>
                        <Icon size={18} className={!hasRealData ? '' : ''} />
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-semibold text-white/90 capitalize">{insightText}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 text-white/80 border border-purple-500/20 rounded-[14px] text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(167,139,250,0.1)]">
                View Full Analysis <ChevronRight size={14} />
              </button>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
