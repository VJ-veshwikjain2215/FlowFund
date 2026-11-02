import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { SlideUp, FadeIn } from '../components/AnimatedWrapper';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { RefreshCw, Download, FileText, UploadCloud, Search, Trash2, Plus, AlertCircle, X, CheckCircle2 } from 'lucide-react';

const Transactions = () => {
  const { transactions, fetchDashboard, uploadSync, addTransaction, isLoading, error, dashboard, rowErrors, successMsg } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTx, setNewTx] = useState({ date: new Date().toISOString().split('T')[0], description: '', amount: '' });
  
  // 🔍 Calculate Dynamic Totals
  const totalIncome = transactions?.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0) || 0;

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
       await uploadSync(file);
    }
    // Ensures same file can be uploaded consecutively
    e.target.value = null; 
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    const success = await addTransaction({
      ...newTx,
      amount: parseFloat(newTx.amount)
    });
    if (success) {
      setShowAddForm(false);
      setNewTx({ date: new Date().toISOString().split('T')[0], description: '', amount: '' });
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <SlideUp>
          <p className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold mb-2">System Ledger</p>
          <h1 className="text-5xl font-black display-font">Historical Record</h1>
        </SlideUp>
        
        <div className="flex items-center gap-4">
           {isLoading && <div className="text-xs font-bold text-[#A78BFA] animate-pulse">Syncing...</div>}
           <input 
              type="file" 
              accept=".csv" 
              id="csv-upload" 
              className="hidden" 
              onChange={handleFileChange} 
           />
           <label htmlFor="csv-upload" className="bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/30 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-[#A78BFA]/20 cursor-pointer flex items-center gap-2 transition-all">
              <UploadCloud size={16} /> Data Sync (CSV)
           </label>
        </div>
      </header>

      {successMsg && !isLoading && (
        <FadeIn className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="text-green-500" size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">System Verified</p>
            <p className="text-sm font-medium text-green-500/80">{successMsg}</p>
          </div>
        </FadeIn>
      )}

      {error && !isLoading && (
        <FadeIn className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
               <AlertCircle className="text-red-500" size={20} />
             </div>
             <div>
               <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">System Error: Sync Interrupted</p>
               <p className="text-sm font-medium text-red-500/80">{error}</p>
             </div>
          </div>
          
          {rowErrors && rowErrors.length > 0 && (
             <div className="ml-14 bg-black/40 border border-red-500/10 rounded-2xl p-4">
                <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3 border-b border-red-500/10 pb-2">Row Output Exceptions</p>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                   {rowErrors.map((re, idx) => (
                      <div key={idx} className="flex gap-4 text-xs">
                         <span className="text-white/40 font-bold shrink-0">Row {re.row}</span>
                         <span className="text-red-400/80 font-medium">{re.error}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </FadeIn>
      )}

      {showAddForm && (
        <SlideUp className="bg-[#1A1625]/80 backdrop-blur-2xl border border-purple-500/30 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
            <X size={20} />
          </button>

          <form onSubmit={handleManualAdd} className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-[2px] w-8 bg-[#A78BFA]/40" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#A78BFA]">Manual Protocol Entry</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Transaction Date</label>
                <input 
                  type="date" 
                  required
                  value={newTx.date}
                  onChange={e => setNewTx({...newTx, date: e.target.value})}
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-sm text-white/90 focus:border-[#A78BFA]/50 focus:ring-1 focus:ring-[#A78BFA]/20 outline-none transition-all" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Identity / Label</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Stripe Payout, Coffee"
                  value={newTx.description}
                  onChange={e => setNewTx({...newTx, description: e.target.value})}
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-sm text-white/90 focus:border-[#A78BFA]/50 focus:ring-1 focus:ring-[#A78BFA]/20 outline-none transition-all placeholder:text-white/10" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Magnitude (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="25000"
                  value={newTx.amount}
                  onChange={e => setNewTx({...newTx, amount: e.target.value})}
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-sm text-white/90 focus:border-[#A78BFA]/50 focus:ring-1 focus:ring-[#A78BFA]/20 outline-none transition-all placeholder:text-white/10" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-[#A78BFA] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:shadow-[0_0_30px_rgba(167,139,250,0.4)] transition-all"
              >
                Authenticate Record
              </button>
            </div>
          </form>
        </SlideUp>
      )}

      {/* Ledger Table (Zero-Divider Layout) */}
      {/* Ledger Table */}
      <SlideUp delay={0.2} className="bg-[#1A1625]/60 backdrop-blur-xl border border-purple-500/20 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="p-10 border-b border-purple-500/20 flex justify-between items-center">
           <div className="flex items-center gap-6 bg-black/40 border border-purple-500/20 px-6 py-3 rounded-full w-96 group focus-within:border-purple-500/50 transition-colors shrink-0">
             <Search className="text-white/20 group-focus-within:text-[#A78BFA] transition-colors" size={18} />
             <input 
               placeholder="Search protocol history..." 
               className="bg-transparent border-none focus:outline-none text-[11px] uppercase tracking-widest font-black w-full text-white/90 placeholder:text-white/20"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>

           {/* 🚀 Dynamic Metric Badges */}
           <div className="flex items-center gap-4 flex-1 justify-start ml-8">
              <div className="bg-[#A78BFA]/5 border border-[#A78BFA]/20 px-5 py-2.5 rounded-2xl flex flex-col items-start min-w-[140px] shadow-[0_0_15px_rgba(167,139,250,0.05)]">
                 <span className="text-[9px] font-black text-[#A78BFA] opacity-60 tracking-[0.2em] mb-0.5 uppercase">Total Income</span>
                 <span className="text-white font-black text-lg monos-num tracking-tight leading-none truncate w-full">
                    {formatCurrency(totalIncome)}
                 </span>
              </div>
              <div className="bg-[#F472B6]/5 border border-[#F472B6]/20 px-5 py-2.5 rounded-2xl flex flex-col items-start min-w-[140px] shadow-[0_0_15px_rgba(244,114,182,0.05)]">
                 <span className="text-[9px] font-black text-[#F472B6] opacity-60 tracking-[0.2em] mb-0.5 uppercase">Total Expense</span>
                 <span className="text-white font-black text-lg monos-num tracking-tight leading-none truncate w-full">
                    {formatCurrency(totalExpense)}
                 </span>
              </div>
           </div>
           <div className="flex gap-4 text-[9px] uppercase font-bold tracking-[0.2em] text-white/20">
             <span>Record ID</span>
             <span>Checksum</span>
           </div>
        </div>

        <div className="overflow-x-auto min-h-[600px]">
          <table className="w-full text-left">
            <thead className="text-[12px] uppercase font-semibold tracking-[0.3em] text-white/30 border-b border-purple-500/20 bg-black/20">
              <tr>
                <th className="px-10 py-6">Date</th>
                <th className="px-10 py-6">Identity / Label</th>
                <th className="px-10 py-8 text-right">Magnitude</th>
                <th className="px-10 py-8 text-right">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {(transactions || []).filter(t => t.description?.toLowerCase().includes(searchTerm.toLowerCase())).map((tx, idx) => (
                <tr key={idx} className="hover:bg-purple-500/5 transition-all duration-200 ease-in-out group">
                  <td className="px-10 py-10 monos-num text-sm text-white/40 tracking-tighter">{tx.date}</td>
                  <td className="px-10 py-10 font-display text-base font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">{tx.description}</td>
                  <td className={`px-10 py-10 text-right font-black text-lg tracking-tight monos-num ${tx.type === 'INCOME' ? 'text-[#A78BFA]' : 'text-[#F472B6]'}`}>
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-10 py-10 text-right">
                    <span className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-transparent ${tx.type === 'INCOME' ? 'bg-[#A78BFA]/10 text-[#A78BFA] group-hover:border-[#A78BFA]/20' : 'bg-[#F472B6]/10 text-[#F472B6] group-hover:border-[#F472B6]/20'} transition-colors`}>
                      {tx.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!transactions || transactions.length === 0) && (
            <div className="p-20 text-center opacity-20 italic">No financial artifacts found in current session.</div>
          )}
        </div>
      </SlideUp>
    </div>
  );
};

export default Transactions;
