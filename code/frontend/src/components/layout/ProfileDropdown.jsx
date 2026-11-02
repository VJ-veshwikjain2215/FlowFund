import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Moon, 
  Sun, 
  LogOut, 
  ChevronDown,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import SettingsModal from '../modals/SettingsModal';

const ProfileDropdown = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeLight, setIsThemeLight] = useState(localStorage.getItem('theme') === 'light');
  const [modalType, setModalType] = useState(null); // 'profile' | 'email' | null
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (isThemeLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [isThemeLight]);

  const toggleTheme = (e) => {
    e.stopPropagation();
    setIsThemeLight(!isThemeLight);
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20 border border-white/10 group-hover:shadow-primary/40 transition-all">
          {getInitials(user?.name)}
        </div>
        <div className="hidden md:flex flex-col items-start pr-2">
          <span className="text-[11px] font-black text-white display-font tracking-tight uppercase">{user?.name}</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{user?.role || 'Member'}</span>
            <ChevronDown size={10} className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-72 bg-[#1A1625]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[60]"
          >
            {/* Header Info */}
            <div className="p-6 bg-white/5 border-b border-white/5 mb-2">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm">
                    {getInitials(user?.name)}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-white display-font">{user?.name}</span>
                    <span className="text-[10px] font-bold text-white/30 truncate max-w-[150px]">{user?.email}</span>
                 </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                <ShieldCheck size={12} className="text-green-400" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-green-400">Verified Pilot</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              <button 
                onClick={() => { setModalType('profile'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors">
                  <User size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Edit Profile</span>
              </button>

              <button 
                onClick={() => { setModalType('email'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:text-secondary transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Change Email</span>
              </button>

              <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:text-yellow-400 transition-colors">
                    {isThemeLight ? <Sun size={16} /> : <Moon size={16} />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{isThemeLight ? 'Light Theme' : 'Dark Theme'}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isThemeLight ? 'bg-primary' : 'bg-white/10'}`}>
                   <motion.div 
                     animate={{ x: isThemeLight ? 22 : 2 }}
                     className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-md" 
                   />
                </div>
              </button>

              <div className="pt-2 border-t border-white/5 mt-2">
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all group font-bold"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-400/5 flex items-center justify-center">
                    <LogOut size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">End Session</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals Handling */}
      <SettingsModal 
        type={modalType} 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)} 
      />
    </div>
  );
};

export default ProfileDropdown;
