import BalanceInput from '../components/BalanceInput';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideUp } from '../components/AnimatedWrapper';
import { AlertCircle, Target, ShieldCheck, Activity, TrendingDown, Info } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatCurrency';

const Planner = () => {
  const { dashboard, fetchDashboard } = useFinanceStore();
  const [tripCostStr, setTripCostStr] = useState('50000');

  useEffect(() => {
    if (!dashboard) fetchDashboard();
  }, [dashboard, fetchDashboard]);

  // 1. DATA INTEGRATION (ZERO HARDCODING)
  const balance = useFinanceStore((state) => state.cashBalance);
  const currentSavings = balance ?? 0;
  const predictedIncome    = dashboard?.prediction?.expected || 0;
  const monthlyExpenses    = dashboard?.forecast_expense || 0;
  
  const tripCost = parseFloat(tripCostStr) || 0;

  // 2. CORE CALCULATIONS
  const monthlySurplus  = predictedIncome - monthlyExpenses;
  const currentBuffer   = monthlyExpenses > 0 ? (currentSavings / monthlyExpenses) : 0;
  const remainingFund   = currentSavings - tripCost;
  const newBuffer       = monthlyExpenses > 0 ? (Math.max(0, remainingFund) / monthlyExpenses) : 0;
  const safetyDrop      = currentBuffer - newBuffer;
  const recoveryTime    = monthlySurplus > 0 ? (tripCost / monthlySurplus) : (tripCost > 0 ? Infinity : 0);

  // 3. DECISION ENGINE (STRICT AFFORDABILITY)
  const isAffordable = currentSavings >= tripCost;
  const decisionTagStr = isAffordable ? 'RECOMMENDED' : 'NOT RECOMMENDED';
  const riskColor = isAffordable ? 'text-green-400' : 'text-red-400';
  const riskBgColor = isAffordable ? 'bg-green-400/10 border-green-400/20' : 'bg-red-400/10 border-red-400/20';
  const decisionText = isAffordable 
    ? "You have enough available savings to afford this planned expense."
    : "Your current available savings are insufficient to cover this amount.";

  // 4. EDGE CASES
  const isOverspending  = tripCost > currentSavings;
  const noRecovery      = monthlySurplus <= 0;
  const hasInsufficientData = !dashboard || !dashboard.has_data;

  // Background style
  const pageBgStyle = {
    background: 'radial-gradient(circle at 20% 30%, rgba(236,72,153,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.08), transparent 40%), #19251f'
  };

  const glassCardClass = "bg-[#25332c]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-[32px] p-8 border border-purple-500/20 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(167,139,250,0.2)] hover:border-purple-500/40 transition-all duration-300 ease-out";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block";

  if (balance == null) return <div className="p-8 text-white space-y-4"><h1>Spending Planner</h1><p>Enter available savings to calculate affordability.</p><BalanceInput /></div>;

  return (
    <div className="min-h-screen p-6 lg:p-10 pb-24 font-body text-white selection:bg-[#8fb697] selection:text-white" style={pageBgStyle}>
      <div className="max-w-[1200px] mx-auto space-y-12">
        <header className="flex justify-between items-end">
          <SlideUp>
            <p className="text-[#8fb697] text-[10px] uppercase tracking-[0.4em] font-bold mb-2 flex items-center gap-2">
              <Target size={14} /> Smart Simulator
            </p>
            <h1 className="text-5xl font-black display-font">Spending Planner</h1>
          </SlideUp>
          {hasInsufficientData && (
             <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                <Info size={14} /> Awaiting CSV Sync
             </div>
          )}
        </header>

        <BalanceInput />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ROW 1: Plan Budget (Left) */}
          <div className="lg:col-span-4 order-1 lg:order-1">
            <SlideUp delay={0.1} className="h-full">
              <div className={`${glassCardClass} h-full flex flex-col`}>
                <label className={labelClass}>Planned Expense Amount</label>
                <div className="relative mb-8 mt-2 flex-grow flex items-center">
                  <span className="absolute left-6 text-2xl font-bold text-white/40">₹</span>
                  <input
                    type="number"
                    value={tripCostStr}
                    onChange={(e) => setTripCostStr(e.target.value)}
                    className={`w-full h-20 bg-black/40 border ${isOverspending ? 'border-red-500/50' : 'border-white/10'} rounded-[20px] pl-16 pr-6 text-4xl font-black text-white focus:border-[#8fb697]/60 focus:ring-1 focus:ring-[#8fb697]/30 outline-none transition-all placeholder:text-white/10`}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                   {isOverspending && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-2">
                        <p className="text-[10px] text-red-400 font-black uppercase flex items-center gap-2">
                          <AlertCircle size={12} /> Low Balance Alert
                        </p>
                        <p className="text-[11px] text-red-400/80 mt-1">Cost exceeds available liquid cash (₹{currentSavings.toLocaleString()}).</p>
                      </div>
                   )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/50 font-medium">Available Savings</span>
                    <span className="font-bold">{formatCurrency(currentSavings)}</span>
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* ROW 1: Output Cards (Right) */}
          <div className="lg:col-span-8 order-3 lg:order-2">
            <SlideUp delay={0.15} className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                {/* Financial Impact Card */}
                <div className={`bg-[#25332c]/60 backdrop-blur-xl rounded-[32px] border ${isAffordable ? 'border-green-500/20 shadow-[0_10px_30px_rgba(74,222,128,0.15)] hover:border-green-500/50 hover:shadow-[0_15px_40px_rgba(74,222,128,0.3)]' : 'border-red-500/20 shadow-[0_10px_30px_rgba(248,113,113,0.15)] hover:border-red-500/50 hover:shadow-[0_15px_40px_rgba(248,113,113,0.3)]'} p-8 hover:-translate-y-1.5 transition-all duration-300 ease-out h-full flex flex-col justify-center`}>
                  <ShieldCheck size={28} className={isAffordable ? 'text-green-400' : 'text-red-400'} />
                  <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-2 mt-6">Remaining Savings</p>
                  <motion.h3
                    key={remainingFund}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="text-2xl font-black text-white"
                  >
                    {formatCurrency(remainingFund)}
                  </motion.h3>
                  <p className="text-[10px] text-white/30 font-medium mt-1">Post-spending liquidity</p>
                </div>

                {/* Recovery Time Card */}
                <div className="bg-[#25332c]/60 backdrop-blur-xl rounded-[32px] border border-[#8fb697]/20 p-8 shadow-[0_10px_30px_rgba(167,139,250,0.15)] hover:shadow-[0_15px_40px_rgba(167,139,250,0.3)] hover:border-[#8fb697]/50 hover:-translate-y-1.5 transition-all duration-300 ease-out h-full flex flex-col justify-center">
                  <TrendingDown size={28} className="text-[#8fb697] mb-6" />
                  <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-2">Recovery Time</p>
                  <motion.h3
                    key={`${recoveryTime}-${noRecovery}`}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-black text-white"
                  >
                    <span className="text-[#8fb697]">
                      {noRecovery ? '∞' : (recoveryTime > 12 ? '>12' : recoveryTime.toFixed(1))}
                    </span> months
                  </motion.h3>
                </div>

                {/* Decision Tag Card */}
                <div className={`bg-[#25332c]/60 backdrop-blur-xl rounded-[32px] border ${riskBgColor.split(' ')[1]} flex flex-col justify-center items-center text-center p-8 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(255,255,255,0.08)] hover:border-white/30 transition-all duration-300 ease-out h-full`}>
                  <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-4">Final Verdict</p>
                  <div className={`inline-flex items-center justify-center px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest ${riskBgColor} ${riskColor} w-full whitespace-normal break-words leading-relaxed`}>
                    {decisionTagStr}
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* ROW 2: Smart Suggestions (Full Width) */}
          <div className="lg:col-span-12 order-2 lg:order-3">
            <SlideUp delay={0.2} className="h-full">
              <div className="bg-[#25332c]/40 backdrop-blur-md rounded-[32px] border border-white/5 p-8 h-full flex flex-col hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-300 ease-out">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2 mb-6">
                  <Activity size={14} /> Intelligence Feed
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                  {noRecovery ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col justify-center">
                      <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
                        <AlertCircle size={14} /> No Recovery Possible
                      </p>
                      <p className="text-xs text-red-400/80 mt-2 font-medium leading-relaxed">
                        Your monthly expenses (₹{monthlyExpenses.toLocaleString()}) are currently exceeding your predicted income.
                      </p>
                    </div>
                  ) : isAffordable ? (
                    <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 flex flex-col justify-center">
                      <p className="text-sm font-semibold text-green-400 flex items-center gap-2">
                         <ShieldCheck size={14} /> Amount Affordable
                      </p>
                      <p className="text-xs text-green-400/80 mt-2 font-medium leading-relaxed">
                         You can cover this expense from your current available funds without depleting your reserves.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex flex-col justify-center">
                      <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
                         <AlertCircle size={14} /> Savings Shortfall
                      </p>
                      <p className="text-xs text-red-400/80 mt-2 font-medium leading-relaxed">
                         You need an additional {formatCurrency(tripCost - currentSavings)} to afford this purchase.
                      </p>
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-colors flex flex-col justify-center">
                    <p className="text-sm font-semibold text-white/90">Buffer Strategy</p>
                    <p className="text-xs text-white/50 mt-2 font-medium leading-relaxed">
                      Maintaining at least 3 months of buffer is critical for freelancer stability.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-colors flex flex-col justify-center">
                    <p className="text-sm font-semibold text-white/90 flex items-center gap-2">
                       <TrendingDown size={14} className="text-[#8fb697]" /> Recovery Outlook
                    </p>
                    <p className="text-xs text-white/50 mt-2 font-medium leading-relaxed">
                       {noRecovery ? 'Recovery is impossible with current cashflow.' : `Predicted recovery window is ${recoveryTime.toFixed(1)} months.`}
                    </p>
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Planner;
