import BalanceInput from '../components/BalanceInput';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideUp, FadeIn } from '../components/AnimatedWrapper';
import { Palmtree, Pencil, Plus, Trash2, Zap, TrendingDown, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { financeService } from '../services/financeService';
import { formatCurrency } from '../utils/formatCurrency';

// ─── Theme ────────────────────────────────────────────────────────────────────

const pageBgStyle = {
  background:
    'radial-gradient(circle at 15% 25%, rgba(236,72,153,0.08), transparent 40%), radial-gradient(circle at 85% 75%, rgba(168,85,247,0.1), transparent 40%), #19251f',
};

const glassCard =
  'bg-[#25332c]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-[32px] border border-purple-500/20 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(167,139,250,0.15)] transition-all duration-300 ease-out';

// status → colour config
const getColorConfig = (status) => {
  const s = status?.toLowerCase() || '';
  if (s === 'safe')      return { stroke: '#22c55e', glow: 'rgba(74,222,128,0.5)',  text: 'text-green-400',  label: 'YOU ARE SAFE',     badgeBg: 'bg-green-400/10 border-green-400/30'   };
  if (s === 'moderate')  return { stroke: '#eab308', glow: 'rgba(250,204,21,0.4)',  text: 'text-yellow-400', label: 'MANAGEABLE', badgeBg: 'bg-yellow-400/10 border-yellow-400/30' };
  if (s === 'risky')     return { stroke: '#f97316', glow: 'rgba(249,115,22,0.4)',  text: 'text-orange-400', label: 'RISKY',      badgeBg: 'bg-orange-400/10 border-orange-400/30'   };
  if (s === 'dangerous') return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.5)',   text: 'text-red-400',    label: 'NOT RECOMMENDED',  badgeBg: 'bg-red-400/10 border-red-400/30'       };
  return                        { stroke: 'rgba(255,255,255,0.1)', glow: 'rgba(255,255,255,0)', text: 'text-white/40', label: 'INSUFFICIENT DATA', badgeBg: 'bg-white/5 border-white/10' };
};

// ─── SVG Ring ─────────────────────────────────────────────────────────────────

const Ring = ({ pct, remaining, weeks, color }) => {
  const r    = 88;
  const circ = 2 * Math.PI * r;
  const safePct    = Math.max(Math.min(pct, 100), 0);
  const freeOffset = circ - (safePct / 100) * circ;
  const usedOffset = circ - ((100 - safePct) / 100) * circ;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: 220, height: 220 }}>
      <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
        {/* Track */}
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
        {/* Used arc — dim */}
        <motion.circle
          cx="110" cy="110" r={r} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="18" strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: usedOffset }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        />
        {/* Remaining arc — coloured */}
        <motion.circle
          cx="110" cy="110" r={r} fill="none"
          stroke={color.stroke} strokeWidth="18" strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: freeOffset }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 10px ${color.glow})` }}
        />
      </svg>

      {/* Centre text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
        <motion.p
          key={Math.round(remaining)}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className={`text-2xl font-black leading-none ${remaining < 0 ? 'text-red-400' : 'text-white'}`}
        >
          {remaining < 0 ? '-' : ''}₹{Math.abs(Math.round(remaining)).toLocaleString()}
        </motion.p>
        <p className="text-[11px] text-white/40 font-medium mt-1.5">
          after {weeks} wk{weeks !== 1 ? 's' : ''}
        </p>
        <motion.p
          key={Math.round(pct)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-[10px] font-black mt-1 uppercase tracking-widest ${color.text}`}
        >
          {Math.max(Math.round(pct), 0)}% left
        </motion.p>
      </div>
    </div>
  );
};

// ─── Editable Expense Row ────────────────────────────────────────────────────

const ExpenseRow = ({ item, onUpdate, onDelete, canDelete }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(item.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group"
    >
      <div className="flex-1 min-w-0">
        {editing ? (
          <input autoFocus value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => { onUpdate({ ...item, category: draft }); setEditing(false); }}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            className="w-full bg-transparent border-b border-[#8fb697] text-sm font-semibold text-white outline-none pb-0.5"
          />
        ) : (
          <button onClick={() => setEditing(true)}
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-1.5 group/edit"
          >
            {item.category}
            <Pencil size={11} className="opacity-0 group-hover/edit:opacity-50 transition-opacity" />
          </button>
        )}
      </div>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-white/30 text-sm font-bold">₹</span>
        <input
          type="number" value={item.amount === 0 ? '' : item.amount}
          onChange={e => onUpdate({ ...item, amount: parseFloat(e.target.value) || 0 })}
          className="w-28 pl-7 pr-3 py-1.5 bg-black/30 border border-white/10 rounded-xl text-sm font-bold text-white text-right focus:border-[#8fb697]/50 outline-none transition-all"
          placeholder="0"
        />
      </div>
      {canDelete && (
        <button onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      )}
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const VacationPlanner = () => {
  const { dashboard, transactions, fetchDashboard, isLoading: dashboardLoading } = useFinanceStore();
  const user = useAuthStore(s => s.user);

  // ── Calculation Source: Real App Data ──
  // 1. Current Monthly Income (Latest Actual)
  const actualMonthlyIncome = React.useMemo(() => {
    if (!transactions?.length) return 0;
    const months = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      if (isNaN(d.getTime())) return;
      const m = `${d.getMonth()}-${d.getFullYear()}`;
      if (!months[m]) months[m] = 0;
      if (tx.type === 'INCOME') months[m] += tx.amount;
    });
    const sorted = Object.values(months);
    return sorted[sorted.length - 1] || 0;
  }, [transactions]);

  // 2. Projected Next Month Income (AI Prediction)
  const projectedIncome = dashboard?.prediction?.expected || 0;

  // 3. Current Savings / Available Balance
  const balance = useFinanceStore((state) => state.cashBalance);
  const availableSavings = balance ?? 0;

  // ── Sync with Dashboard on Load ──
  useEffect(() => {
    if (!dashboard) fetchDashboard();
  }, [dashboard, fetchDashboard]);

  // ── Single Source of Truth: Dashboard Safe Fund ──
  // ── Single Source of Truth ──
  const safeFund = availableSavings;

  // ── Seed expenses ──
  const seedExpenses = () => {
    const rows = [];
    const push = (cat, val) => { if (parseFloat(val) > 0) rows.push({ id: cat, category: cat, amount: parseFloat(val) }); };
    push('Rent', user?.rent);
    push('Groceries', user?.groceries);
    push('Utilities', user?.utilities);
    push('Internet', user?.internet);
    push('Transport', user?.transport);
    push('Other expenses', user?.otherExpenses);
    return rows;
  };

  const [expenses,      setExpenses]      = useState(seedExpenses);
  const [result,        setResult]        = useState(null);
  const [validationErr, setValidationErr] = useState('');
  const [loading,       setLoading]       = useState(false);
  const [nextId,        setNextId]        = useState(100);
  const [selectedWeeks, setSelectedWeeks] = useState(1);

  // ── Calculate (passes current slider) ──
  const calculate = useCallback(async (bal, expList, weeks) => {
    const cleaned = expList.map(e => ({ category: e.category, amount: parseFloat(e.amount) || 0 }));
    const total   = cleaned.reduce((s, e) => s + e.amount, 0);
    
    if (bal <= 0 || total <= 0) { setResult(null); setValidationErr(''); return; }
    
    setLoading(true);
    try {
      const data = await financeService.vacationPlanner({ 
        totalBalance: bal, 
        expenses: cleaned, 
        selectedWeeks: weeks,
        predictedIncome: dashboard?.prediction?.expected || 0
      });
      if (data?.error) {
        setValidationErr(data.errorMessage || 'Calculation error.');
        setResult(null);
      } else {
        setValidationErr('');
        setResult(data);
        setSelectedWeeks(w => Math.min(w, Math.max(data.maxWeeks || data.survivalWeeks, 1)));
      }
    } catch (err) {
      setResult(null);
      setValidationErr(err.message || 'Unable to calculate the break plan.');
    } finally {
      setLoading(false);
    }
  }, [dashboard?.prediction?.expected]);

  // Debounced recalc on safeFund or expense change
  useEffect(() => {
    const t = setTimeout(() => calculate(safeFund, expenses, selectedWeeks), 350);
    return () => clearTimeout(t);
  }, [safeFund, expenses, selectedWeeks, calculate]);

  // ── Core Logic & Calculations (Requested Implementation) ──
  /*
    DATA SOURCE DOCUMENTATION:
    1. currentMonthlyIncome: Derived from latest 'INCOME' transactions
    2. projectedIncome: Derived from AI forecasting (dashboard.prediction.expected)
    3. monthlyExpenses: Sum of user-editable expense list (defaulted to profile data)
    4. availableSavings: Entered by the user for this session
    
    FORMULAS:
    - weeklyExpense = monthlyExpenses / 4
    - breakCost = selectedWeeks * weeklyExpense
    - remainingSavings = availableSavings - breakCost
  */
  const totalBalance    = safeFund;
  const monthlyTotal    = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const weeklyTotal     = monthlyTotal / 4;
  const selectedIncome  = projectedIncome;

  const selectedWeeksRaw = selectedWeeks;
  const required        = weeklyTotal * selectedWeeks;
  const remaining       = totalBalance - required;
  const availableSpend  = totalBalance - monthlyTotal;
  const remainingPct    = totalBalance > 0 ? (remaining / totalBalance) * 100 : 0;
  
  // Use server-returned status if available, else derive simple fallback
  const currentStatus   = result?.status || (remainingPct > 50 ? 'safe' : remainingPct > 20 ? 'moderate' : (remaining < 0 ? 'dangerous' : 'risky'));
  const color           = getColorConfig(currentStatus);
  const maxAffordable   = weeklyTotal > 0 ? Math.floor(totalBalance / weeklyTotal) : 0;
  const maxSliderWeeks  = result ? Math.max(result.maxWeeks || result.survivalWeeks, 1) : Math.max(maxAffordable, 20);

  // Stepper handlers
  const handleIncrement = () => setSelectedWeeks(prev => Math.min(prev + 1, Math.max(maxSliderWeeks, 1)));
  const handleDecrement = () => setSelectedWeeks(prev => Math.max(prev - 1, 1));

  // Expense CRUD
  const updateExpense = (id, u) => setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...u } : e));
  const deleteExpense = (id)    => setExpenses(prev => prev.filter(e => e.id !== id));
  const addExpense    = () => {
    const id = `custom_${nextId}`;
    setNextId(n => n + 1);
    setExpenses(prev => [...prev, { id, category: 'New Category', amount: 0 }]);
  };

  // Use server-returned message if slider matches API's selectedWeeks, else derive locally
  const smartMessage = result?.message || (color.label === 'SAFE'
    ? '✅ You can comfortably take this break.'
    : color.label === 'MODERATE'
    ? '⚖️ This is manageable but plan carefully.'
    : '⚠️ Your balance may run out soon.');

  if (balance == null) return <div className="p-8 text-white space-y-4"><h1>Break Planner</h1><p>Enter available savings to estimate your runway.</p><BalanceInput /></div>;

  return (
    <div className="min-h-screen p-6 lg:p-10 pb-28 font-body text-white" style={pageBgStyle}>
      <div className="max-w-[1200px] mx-auto space-y-10">

        {/* ── HEADER ── */}
        <SlideUp>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <p className="text-[#8fb697] text-[10px] uppercase tracking-[0.4em] font-bold mb-2 flex items-center gap-2">
                <Palmtree size={13} /> Break Planner
              </p>
              <h1 className="text-5xl font-black display-font leading-none">Break Runway</h1>
              <p className="text-white/40 text-sm font-medium mt-2">
                Kitne weeks tak break le sakta hoon bina paise khatam hue?
              </p>
            </div>
          </div>
        </SlideUp>

        {/* ── FINANCIAL SUMMARY BAR ── */}
        <BalanceInput />
        {monthlyTotal > 0 && (
          <SlideUp delay={0.05}>
            <div className={`${glassCard} px-6 py-4`}>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-8 flex-wrap">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Monthly Expenses</p>
                    <p className="text-xl font-black text-white">{formatCurrency(monthlyTotal)}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Max Affordable Break</p>
                    <p className={`text-xl font-black ${maxAffordable <= 0 ? 'text-red-400' : 'text-[#8fb697]'}`}>
                      {maxAffordable} week{maxAffordable !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Target Income</p>
                    <p className="text-xl font-black text-white">{formatCurrency(selectedIncome)}</p>
                  </div>
                </div>
                {/* Insight line */}
                <p className="text-xs text-white/30 font-medium italic max-w-xs text-right hidden md:block">
                  Your monthly expenses should not exceed your total balance
                </p>
              </div>

              {/* Balance vs Expense ratio bar */}
              <div className="mt-4">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min((monthlyTotal / Math.max(totalBalance, 1)) * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${monthlyTotal > totalBalance ? 'bg-red-400' : monthlyTotal / totalBalance > 0.5 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  />
                </div>
                <p className="text-[10px] text-white/20 mt-1 font-medium">
                  Monthly expenses = {Math.round((monthlyTotal / Math.max(totalBalance, 1)) * 100)}% of your balance
                </p>
              </div>
            </div>
          </SlideUp>
        )}

        {/* ── VALIDATION ERROR BANNER ── */}
        <AnimatePresence>
          {validationErr && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4"
            >
              <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">{validationErr}</p>
                <p className="text-xs text-red-400/60 mt-0.5 font-medium">
                  Reduce your monthly expenses or increase your balance to continue.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT: EXPENSE EDITOR ── */}
          <div className="lg:col-span-4 space-y-6">
            <SlideUp delay={0.1}>
              <div className={`${glassCard} p-7 flex flex-col gap-5`}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">Monthly Expenses</p>
                  <button onClick={addExpense}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[#8fb697] uppercase tracking-widest hover:text-white transition-colors"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                <AnimatePresence>
                  {expenses.map(item => (
                    <ExpenseRow key={item.id} item={item}
                      onUpdate={u => updateExpense(item.id, u)}
                      onDelete={() => deleteExpense(item.id)}
                      canDelete={expenses.length > 1}
                    />
                  ))}
                </AnimatePresence>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 font-medium">Monthly Total</span>
                    <span className={`font-black ${monthlyTotal > totalBalance ? 'text-red-400' : 'text-white'}`}>
                      {formatCurrency(monthlyTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/30 font-medium">Weekly Cost</span>
                    <span className="font-bold text-white/60">{formatCurrency(weeklyTotal)}</span>
                  </div>
                  {monthlyTotal > totalBalance && (
                    <p className="text-[11px] text-red-400/80 font-medium pt-1">
                      ⚠️ Expenses exceed your balance
                    </p>
                  )}
                </div>
              </div>
            </SlideUp>
          </div>

          {/* ── RIGHT: SIMULATOR ── */}
          <div className="lg:col-span-8 space-y-6">

            {loading && (
              <SlideUp delay={0.15}>
                <div className={`${glassCard} p-12 flex items-center justify-center`}>
                  <div className="w-8 h-8 border-2 border-[#8fb697] border-t-transparent rounded-full animate-spin" />
                </div>
              </SlideUp>
            )}

            {!loading && !result && !validationErr && (
              <SlideUp delay={0.15}>
                <div className={`${glassCard} p-12 flex flex-col items-center justify-center text-center gap-4`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Palmtree size={28} className="text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm font-medium">Enter balance and expenses<br/>to start the break simulator</p>
                </div>
              </SlideUp>
            )}

            {!loading && result && !validationErr && (
              <>
                {/* ── RING + SLIDER CARD ── */}
                <SlideUp delay={0.15}>
                  <div className={`${glassCard} p-8`}>
                    <div className="flex flex-col md:flex-row items-center gap-10">

                      {/* Ring */}
                      <div className="flex flex-col items-center gap-4 shrink-0">
                        <Ring pct={remainingPct} remaining={remaining} weeks={selectedWeeks} color={color} />
                        <motion.div
                          key={color.label}
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${color.badgeBg} ${color.text}`}
                        >
                          {color.label}
                        </motion.div>
                      </div>

                      {/* Right column */}
                      <div className="flex-1 w-full space-y-7">

                        {/* SLIDER */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                              Simulation Duration
                            </p>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={handleDecrement}
                                disabled={selectedWeeks <= 1}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <span className="text-lg font-bold mt-[-2px]">-</span>
                              </button>
                              <motion.span
                                key={selectedWeeks}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-2xl font-black min-w-[3rem] text-center ${color.text}`}
                              >
                                {selectedWeeks}
                              </motion.span>
                              <button 
                                onClick={handleIncrement}
                                disabled={selectedWeeks >= maxSliderWeeks}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <span className="text-lg font-bold mt-[-2px]">+</span>
                              </button>
                              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest ml-1">Weeks</span>
                            </div>
                          </div>
                          <input
                            type="range" min={1} max={maxSliderWeeks} value={selectedWeeks}
                            onChange={e => setSelectedWeeks(Number(e.target.value))}
                            className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, ${color.stroke} 0%, ${color.stroke} ${((selectedWeeks - 1) / Math.max(maxSliderWeeks - 1, 1)) * 100}%, rgba(255,255,255,0.1) ${((selectedWeeks - 1) / Math.max(maxSliderWeeks - 1, 1)) * 100}%, rgba(255,255,255,0.1) 100%)`,
                            }}
                          />
                          <div className="flex justify-between text-[10px] text-white/20 font-bold mt-1.5">
                            <span>1 wk</span>
                            <span className={result.maxWeeks > 0 ? color.text : ''}>{maxSliderWeeks} wks max</span>
                          </div>
                        </div>

                        {/* 7-METRIC COMPREHENSIVE SUMMARY */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                          {/* 1. Current Monthly Income */}
                          <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-wider mb-0.5">Current Income</p>
                            <p className="text-sm font-black text-white">{formatCurrency(actualMonthlyIncome)}</p>
                          </div>
                          {/* 2. Projected Next Month Income */}
                          <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                            <p className="text-[8px] text-[#8fb697]/50 font-bold uppercase tracking-wider mb-0.5">Projected Income</p>
                            <p className="text-sm font-black text-[#8fb697]">{formatCurrency(projectedIncome)}</p>
                          </div>
                          {/* 3. Monthly Expenses */}
                          <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-wider mb-0.5">Monthly Burn</p>
                            <p className="text-sm font-black text-white">{formatCurrency(monthlyTotal)}</p>
                          </div>
                          {/* 4. Weekly Expense */}
                          <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-wider mb-0.5">Weekly Rate</p>
                            <p className="text-sm font-black text-white">{formatCurrency(weeklyTotal)}</p>
                          </div>
                          {/* 5. Break Cost */}
                          <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-wider mb-0.5">Total Break Cost</p>
                            <p className="text-sm font-black text-[#d5ae73]">{formatCurrency(required)}</p>
                          </div>
                          {/* 6. Remaining Savings */}
                          <div className={`rounded-xl px-4 py-3 border ${remaining < 0 ? 'bg-red-400/10 border-red-400/30' : 'bg-white/5 border-white/5'}`}>
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-wider mb-0.5">Post-Break Balance</p>
                            <p className={`text-sm font-black ${remaining < 0 ? 'text-red-400' : 'text-white'}`}>{formatCurrency(remaining)}</p>
                          </div>
                        </div>

                        {/* SMART TEXT */}
                        <motion.div
                          key={color.label}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className={`text-sm font-semibold leading-relaxed ${color.text}`}>
                            {result?.message || smartMessage}
                          </p>
                          {result?.maxWeeks > 0 && (
                            <p className="text-xs text-white/30 font-medium mt-1">
                              At this rate, your funds will last for{' '}
                              <span className="text-white font-bold">{result.maxWeeks} total weeks</span>
                              {' '}({Math.floor(result.maxWeeks / 4)} months {result.maxWeeks % 4} wks)
                            </p>
                          )}
                        </motion.div>

                      </div>
                    </div>
                  </div>
                </SlideUp>

                {/* ── INSIGHTS + SUGGESTIONS REMOVED ── */}
              </>
            )}
          </div>
        </div>

        {/* Slider thumb override */}
        <style>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 22px; height: 22px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 0 12px rgba(167,139,250,0.6), 0 2px 6px rgba(0,0,0,0.5);
            cursor: pointer;
            transition: transform 0.15s ease;
          }
          input[type='range']::-webkit-slider-thumb:active { transform: scale(1.3); }
          input[type='range']::-moz-range-thumb {
            width: 22px; height: 22px;
            border-radius: 50%; background: white; border: none;
            box-shadow: 0 0 12px rgba(167,139,250,0.6); cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
};

export default VacationPlanner;
