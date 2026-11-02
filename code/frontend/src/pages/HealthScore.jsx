import BalanceInput from '../components/BalanceInput';
import React, { useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { SlideUp, FadeIn, KineticScale } from '../components/AnimatedWrapper';
import { ShieldCheck, Crosshair, AlertTriangle, Info } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const HealthScore = () => {
  const { dashboard, fetchDashboard } = useFinanceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // 1. Data Retrieval
  const balance = useFinanceStore((state) => state.cashBalance);
  const moneyYouCanSpend = balance ?? 0;
  const monthlyExpenses =
    (Number(user?.rent || 0) + Number(user?.groceries || 0) + Number(user?.utilities || 0) + Number(user?.internet || 0) + Number(user?.transport || 0) + Number(user?.otherExpenses || 0)) ||
    Number(user?.monthlyExpenses || 0) ||
    Number(user?.totalMonthlyExpense || 0) ||
    0;

  // 2. Helper: Clamp values between 0 and 100
  const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));

  // 3. Core Logic Implementation
  let healthScore = 0;
  let liquidityScore = 0;
  let stabilityScore = 0;

  if (monthlyExpenses <= 0) {
    // Fail-safe: If no expenses are defined, user is technically in a perfect safety state
    healthScore = 100;
    liquidityScore = 100;
    stabilityScore = 100;
  } else {
    const coverageRatio = moneyYouCanSpend / monthlyExpenses;

    // A. Health Score (Scale 0-100 between 2 and 12 months)
    const minCoverage = 2;
    const maxCoverage = 12;
    if (coverageRatio <= minCoverage) healthScore = 0;
    else if (coverageRatio >= maxCoverage) healthScore = 100;
    else healthScore = Math.round(((coverageRatio - minCoverage) / (maxCoverage - minCoverage)) * 100);

    // B. Liquidity Score (Scale 0-100 between 1 and 6 months)
    const minLiquidity = 1;
    const maxLiquidity = 6;
    if (coverageRatio <= minLiquidity) liquidityScore = 0;
    else if (coverageRatio >= maxLiquidity) liquidityScore = 100;
    else liquidityScore = Math.round(((coverageRatio - minLiquidity) / (maxLiquidity - minLiquidity)) * 100);

    // C. Stability Score (Scale 0-100 between 3 and 9 months)
    const minStability = 3;
    const maxStability = 9;
    if (coverageRatio <= minStability) stabilityScore = 0;
    else if (coverageRatio >= maxStability) stabilityScore = 100;
    else stabilityScore = Math.round(((coverageRatio - minStability) / (maxStability - minStability)) * 100);
  }

  // Ensure strict clamping
  healthScore = clamp(healthScore);
  liquidityScore = clamp(liquidityScore);
  stabilityScore = clamp(stabilityScore);

  // 4. Risk Level Mapping
  const getRiskDetails = (score) => {
    if (score === 100) return { label: 'LOW', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.3)]' };
    if (score >= 71)   return { label: 'LOW', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' };
    if (score >= 46)   return { label: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' };
    return { label: 'HIGH', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.2)]' };
  };

  const risk = getRiskDetails(healthScore);

  // Status mapping for central pill
  const getStatus = (s) => {
    if (s === 100) return { label: 'STRONG COVERAGE', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' };
    if (s >= 71)   return { label: 'STABLE', color: 'text-[#A78BFA]', bg: 'bg-[#A78BFA]/10 border-[#A78BFA]/20' };
    if (s >= 46)   return { label: 'NEEDS ATTENTION', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' };
    return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' };
  };

  const status = getStatus(healthScore);

  const pageBgStyle = {
    background: 'radial-gradient(circle at 20% 30%, rgba(236,72,153,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.08), transparent 40%), #0b0b12'
  };

  const glassCardBase = "bg-[#1A1625]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out flex flex-col justify-between";

  if (balance == null || monthlyExpenses <= 0) return <div className="p-8 text-white space-y-4"><h1>Financial Health</h1><p>Enter savings and add monthly expenses to your profile to estimate coverage.</p><BalanceInput /></div>;

  return (
    <div className="min-h-screen p-6 lg:p-10 pb-24 text-white font-body selection:bg-[#A78BFA] selection:text-white" style={pageBgStyle}>
      <div className="max-w-[1200px] mx-auto space-y-16 flex flex-col items-center justify-center min-h-[80vh]">
        
        <SlideUp className="space-y-4 text-center">
          <p className="text-[#A78BFA] text-[10px] uppercase tracking-[0.4em] font-bold flex justify-center items-center gap-2">
             Composite System Score
          </p>
          <h1 className="text-5xl font-black display-font">Financial Health</h1>
        </SlideUp>

        <BalanceInput />
        <p className="text-white/60 text-sm">A simple coverage estimate, not a guarantee of financial safety.</p>
        {/* Main Score Circular Element */}
        <KineticScale delay={0.2} className="relative w-80 h-80 flex items-center justify-center p-2 rounded-full border border-purple-500/20 bg-[#1A1625]/60 backdrop-blur-xl shadow-[0_0_60px_rgba(167,139,250,0.15)] hover:shadow-[0_0_80px_rgba(167,139,250,0.3)] transition-all duration-500 group">
          <div className="absolute inset-x-0 inset-y-0 rounded-full border-4 border-[#A78BFA]/30 group-hover:border-[#A78BFA]/50 group-hover:rotate-180 transition-all duration-1000 ease-in-out border-dashed opacity-50" />
          
          <div className="flex flex-col items-center justify-center relative z-10 w-full h-full bg-black/40 rounded-full border border-white/5">
             <span className="text-[7rem] font-black display-font leading-none tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-2">
                <CountUp end={healthScore} duration={2} />
             </span>
             <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${status.bg} text-[11px] font-bold uppercase tracking-widest ${status.color}`}>
                <div className={`w-2 h-2 rounded-full bg-current shadow-[0_0_10px_currentColor]`} />
                {status.label}
             </div>
          </div>
        </KineticScale>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          
          {/* Card 1: Stability */}
          <FadeIn delay={0.4} className={`${glassCardBase} hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(167,139,250,0.2)] hover:border-[#A78BFA]/40`}>
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center text-[#A78BFA]">
                  <ShieldCheck size={28} />
                </div>
                <span className="text-4xl font-black text-white">{stabilityScore}<span className="text-[#A78BFA] text-2xl font-bold ml-1">%</span></span>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3">Stability</h3>
              <p className="text-xs text-white/50 leading-relaxed font-medium mb-10">Calculated based on a 3-9 month expense coverage buffer.</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stabilityScore}%` }}
                className="h-full bg-gradient-to-r from-purple-600 to-[#A78BFA] rounded-full shadow-[0_0_15px_rgba(167,139,250,0.5)]" 
              />
            </div>
          </FadeIn>

          {/* Card 2: Liquidity */}
          <FadeIn delay={0.5} className={`${glassCardBase} hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(96,165,250,0.2)] hover:border-blue-400/40`}>
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
                  <Crosshair size={28} />
                </div>
                <span className="text-4xl font-black text-white">{liquidityScore}<span className="text-blue-400 text-2xl font-bold ml-1">%</span></span>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3">Liquidity</h3>
              <p className="text-xs text-white/50 leading-relaxed font-medium mb-10">Measures short-term comfort based on 1-6 month runway.</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${liquidityScore}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.5)]" 
              />
            </div>
          </FadeIn>

          {/* Card 3: Risk Level */}
          <FadeIn delay={0.6} className={`${glassCardBase} hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(248,113,113,0.2)] hover:border-red-400/40`}>
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center text-red-400">
                  <AlertTriangle size={28} />
                </div>
                <span className={`text-sm font-black uppercase tracking-widest mt-2 px-4 py-2 rounded-xl border ${risk.bg} ${risk.color}`}>
                   {risk.label}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3">Risk Level</h3>
              <p className="text-xs text-white/50 leading-relaxed font-medium mb-10">Calculated directly from your composite health score mapping.</p>
            </div>
            {/* Progress Bar Alternative (for Risk) */}
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden flex">
               <div className={`h-full transition-all duration-1000 ${healthScore >= 10 ? 'bg-green-400' : 'bg-transparent'} w-1/3`} />
               <div className={`h-full transition-all duration-1000 ${healthScore > 45 ? 'bg-yellow-400' : 'bg-transparent'} w-1/3 shadow-[0_0_15px_rgba(250,204,21,0.6)] z-10`} />
               <div className={`h-full transition-all duration-1000 ${healthScore > 70 ? 'bg-red-400' : 'bg-transparent'} w-1/3`} />
            </div>
          </FadeIn>

        </div>

        {/* Info Banner */}
        <FadeIn delay={0.8} className="w-full max-w-5xl">
          <div className="p-8 bg-[#1A1625]/40 backdrop-blur-md border border-white/5 rounded-[32px] flex items-center gap-6 text-left shadow-lg hover:border-white/10 transition-all">
             <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
               <Info className="text-white/40" size={24} />
             </div>
             <p className="text-sm font-medium leading-relaxed text-white/60">
                The Financial Health Score is an algorithmic aggregate of stability, savings behavior, and buffer integrity. Aim for a score of 80+ to ensure optimal survival in highly volatile freelance markets.
             </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default HealthScore;
