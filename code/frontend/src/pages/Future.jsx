import React, { useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { SlideUp, FadeIn } from '../components/AnimatedWrapper';
import ForecastChart from '../components/charts/ForecastChart';
import { formatCurrency } from '../utils/formatCurrency';
import { Calendar, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';

const Future = () => {
  const { dashboard, fetchDashboard } = useFinanceStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const currentMonthValue = dashboard?.forecastSeries?.[0] || 0;
  const lastMonthValue = dashboard?.forecastSeries?.[dashboard?.forecastSeries?.length - 1] || 0;
  const trendPct = ((lastMonthValue - currentMonthValue) / currentMonthValue * 100).toFixed(1);

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <SlideUp>
          <p className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold mb-2">Predictive Analysis</p>
          <h1 className="text-5xl font-black display-font">Future Outlook</h1>
        </SlideUp>

        <FadeIn delay={0.4} className="flex gap-4">
           <div className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all">
             <Clock className="text-secondary" size={16} />
             System Confidence: {(dashboard?.confidence * 100).toFixed(0)}%
           </div>
        </FadeIn>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <SlideUp delay={0.2} className="lg:col-span-8 glass-card p-12 h-[500px]">
           <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-black display-font uppercase tracking-tighter">6-Month Revenue Projection</h2>
              <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
                 <span>Baseline</span>
                 <div className="w-8 h-[2px] bg-white/10" />
                 <span className="text-secondary">AI Prediction</span>
              </div>
           </div>
           <ForecastChart data={dashboard?.forecastSeries} height={350} />
        </SlideUp>

        <div className="lg:col-span-4 space-y-8">
           <SlideUp delay={0.3} className="glass-card p-10 space-y-8 h-full flex flex-col justify-between">
              <div className="space-y-4">
                 <h3 className="text-xl font-bold uppercase tracking-[0.3em]">Projection Logic</h3>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group">
                    <span className="text-[10px] uppercase font-black text-white/20 tracking-widest group-hover:text-white transition-colors">Primary Model</span>
                    <span className="text-[10px] uppercase font-black text-secondary tracking-widest border border-secondary/20 px-3 py-1 rounded-full">{dashboard?.method}</span>
                 </div>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group">
                    <span className="text-[10px] uppercase font-black text-white/20 tracking-widest group-hover:text-white transition-colors">Projected Change</span>
                    <span className={`text-[10px] font-black tracking-widest ${trendPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                       {trendPct >= 0 ? '+' : ''}{trendPct}%
                    </span>
                 </div>
              </div>

              <div className="bg-secondary/10 p-10 rounded-3xl border border-secondary/20 space-y-6">
                 <div className="flex gap-4 items-center mb-2">
                    <Zap className="text-secondary" size={24} />
                    <span className="text-xl font-black display-font">AI Insight</span>
                 </div>
                 <p className="text-sm leading-relaxed text-white/60 font-medium italic">
                    "ARIMA analysis indicates a {trendPct >= 0 ? 'gradual growth' : 'potential dip'} in H2 receipts. System recommends adjusting safe spending by {Math.abs(trendPct) / 2}% to maintain buffer integrity."
                 </p>
              </div>
           </SlideUp>
        </div>
      </div>
    </div>
  );
};

export default Future;
