import React, { useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { SlideUp, FadeIn } from '../components/AnimatedWrapper';
import { formatCurrency } from '../utils/formatCurrency';
import { Activity, ShieldAlert, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';

const IncomeStability = () => {
  const { dashboard, fetchDashboard } = useFinanceStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const volatility = dashboard?.volatility || 0;
  const instability = dashboard?.isUnstable;

  return (
    <div className="space-y-12">
      <header>
        <SlideUp>
          <p className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold mb-2">Instability Metrics</p>
          <h1 className="text-5xl font-black display-font uppercase tracking-tighter italic">INCOME STABILITY</h1>
        </SlideUp>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <SlideUp delay={0.2} className="glass-card p-12 space-y-8 flex flex-col justify-between h-[450px]">
           <div className="flex justify-between items-start">
             <div className="flex flex-col">
               <h3 className="text-xl font-bold uppercase tracking-[0.3em]">Volatility Factor</h3>
               <p className="text-[10px] text-white/20 mt-1 uppercase font-bold tracking-widest italic">Normalized standard deviation analysis.</p>
             </div>
             <Activity className={instability ? 'text-red-400 animate-pulse' : 'text-secondary'} size={24} />
           </div>
           
           <div className="flex flex-col items-center">
             <span className="text-[10rem] font-black italic display-font leading-none tracking-tighter monos-num">{(volatility * 100).toFixed(0)}</span>
             <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border ${instability ? 'border-red-400 bg-red-400/5 text-red-300' : 'border-secondary/20 bg-secondary/10 text-secondary'}`}>
                {instability ? 'HIGH INSTABILITY' : 'LOW VOLATILITY'}
             </div>
           </div>

           <div className="flex justify-between items-end border-t border-white/5 pt-8">
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/40 tracking-widest">
               <ArrowUpRight size={14} /> System Risk Index
             </div>
             <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B4C5FF]">{(volatility * 100).toFixed(2)} Vol-Points</div>
           </div>
         </SlideUp>

         <SlideUp delay={0.3} className="glass-card p-12 space-y-10 flex flex-col justify-between h-[450px]">
            <div className="space-y-6">
               <h3 className="text-xl font-bold uppercase tracking-[0.3em] text-[#B4C5FF]">Anomaly Detection</h3>
               <div className="space-y-4">
                  {dashboard?.insights?.slice(0, 3).map((insight, idx) => (
                    <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group">
                       <p className="text-[10px] uppercase font-bold text-white/40 leading-relaxed tracking-widest group-hover:text-white transition-colors">
                         {insight}
                       </p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-red-400/10 p-10 rounded-3xl border border-red-400/20 space-y-4">
               <div className="flex gap-4 items-center">
                  <ShieldAlert className="text-red-400" size={24} />
                  <span className="text-xl font-black display-font uppercase tracking-tighter">System Alert</span>
               </div>
               <p className="text-sm leading-relaxed text-white/40 font-medium italic">
                 {instability ? 
                   "Instability threshold breached. Buffer allocation increased by 15% automatically to ensure survival during the next anticipated dip." : 
                   "Current income stream remains within the stability threshold. System maintains base buffer rates for optimal liquidity."}
               </p>
            </div>
         </SlideUp>
      </div>
    </div>
  );
};

export default IncomeStability;
