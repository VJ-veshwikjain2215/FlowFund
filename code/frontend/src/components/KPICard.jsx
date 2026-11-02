import React from 'react';
import { SlideUp } from './AnimatedWrapper';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import CountUp from 'react-countup';

const KPICard = ({ title, value, trend, suffix = "", delay = 0, className = "" }) => {
  const isPositive = trend >= 0;

  return (
    <SlideUp delay={delay} className={clsx("premium-card p-6 flex flex-col justify-between h-48", className)}>
      <div className="flex justify-between items-start relative z-10">
        <p className="text-[11px] uppercase font-semibold tracking-wider text-white/40">
          {title}
        </p>
        
        {trend !== undefined && (
          <div className={clsx("flex items-center text-[10px] font-bold px-2 py-1 rounded-md", 
            isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="flex flex-col relative z-10">
        <h1 className="display-font text-3xl font-bold tracking-tight text-white mb-1">
          <CountUp end={Number(value) || 0} duration={1.5} separator="," />
          <span className="text-lg ml-1.5 font-medium text-white/50">{suffix}</span>
        </h1>
        <span className="text-[10px] font-medium tracking-tight text-white/20">
          Real-time System Projection
        </span>
      </div>
    </SlideUp>
  );
};

export default KPICard;
