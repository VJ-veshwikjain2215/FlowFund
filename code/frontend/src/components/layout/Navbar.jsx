import React from 'react';
import { Bell, Search, Settings, User, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFinanceStore } from '../../store/useFinanceStore';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const dashboard = useFinanceStore((s) => s.dashboard);

  return (
    <nav className="h-24 bg-black/40 backdrop-blur-2xl border-b border-white/5 fixed top-0 right-0 left-64 z-30 px-10 flex items-center justify-end transition-all duration-500">
      <div className="flex items-center gap-8">
        {/* Quick Metrics */}
        <div className="flex items-center text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mr-8">
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[#A78BFA] opacity-80 mb-0.5 tracking-widest font-black uppercase">SAFE SPEND</span>
            <span className="text-white monos-num font-black text-[24px] leading-none drop-shadow-[0_0_12px_rgba(167,139,250,0.8)]">
            {formatCurrency(dashboard?.safe_spend)}
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-6 border-l border-white/5 pl-8">
          <button className="text-white/20 hover:text-primary transition-all"><Search size={18} /></button>
          <button className="text-white/20 hover:text-primary transition-all relative">
            <Bell size={18} />
            <div className="absolute top-0 right-0 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#8b5cf6]" />
          </button>
          
          <div className="border-l border-white/5 pl-8 ml-2">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
