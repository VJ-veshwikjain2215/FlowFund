import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldCheck, 
  History, 
  LineChart, 
  HeartPulse, 
  Target,
  Palmtree,
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', label: 'Dashboard',       icon: <LayoutDashboard size={18} /> },
  { path: '/transactions', label: 'Ledger',       icon: <History size={18} /> },
  { path: '/health', label: 'Health Score',       icon: <HeartPulse size={18} /> },
  { path: '/planner', label: 'Smart Planner',     icon: <Target size={18} /> },
  { path: '/vacation', label: 'Break Planner', icon: <Palmtree size={18} /> },
];

const Sidebar = () => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-64 h-screen bg-black/40 border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 transition-all duration-500 overflow-hidden backdrop-blur-3xl">
      {/* Brand Identity */}
      <div className="p-8 mb-6">
        <div className="text-xl font-bold tracking-tight display-font text-white flex items-center gap-2">
          RupeeRakshak
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-4 px-5 py-3.5 rounded-xl text-[17px] tracking-[0.3px] transition-all relative group",
              isActive 
                ? "bg-primary/10 text-white font-semibold border-l-4 border-primary rounded-l-none" 
                : "text-white/40 font-medium hover:text-white/80 hover:translate-x-2"
            )}
          >
            {({ isActive }) => (
              <>
                <div className={clsx(
                  "transition-all duration-500",
                  isActive ? "text-primary scale-110" : "text-white/20 group-hover:text-primary/70"
                )}>
                  {item.icon}
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer System Exit */}
      <div className="p-6 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-4 w-full px-5 py-3.5 rounded-xl text-[12px] font-semibold text-red-500/30 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={18} className="transition-transform group-hover:rotate-12" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
