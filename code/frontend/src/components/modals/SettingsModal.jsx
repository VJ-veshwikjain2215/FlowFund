import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const SettingsModal = ({ isOpen, onClose, type }) => {
  const { user, updateProfile, updateEmail } = useAuthStore();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  // Reset state when modal opens or types change
  useEffect(() => {
    if (isOpen) {
      setValue(type === 'profile' ? user?.name : user?.email);
      setStatus({ type: null, message: '' });
    }
  }, [isOpen, type, user]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value || value.trim() === '') {
      setStatus({ type: 'error', message: `${type === 'profile' ? 'Name' : 'Email'} cannot be empty` });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const result = type === 'profile' 
        ? await updateProfile(value) 
        : await updateEmail(value);

      if (result.success) {
        setStatus({ type: 'success', message: `Successfully updated ${type === 'profile' ? 'name' : 'email'}!` });
        setTimeout(() => {
          onClose();
          setStatus({ type: null, message: '' });
        }, 1500);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-[#1A1625] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white display-font">
                    {type === 'profile' ? 'Edit Profile' : 'Change Email'}
                  </h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Update your account details
                  </p>
                </div>
                {/* HIGHLY VISIBLE CLOSE BUTTON */}
                <button 
                  onClick={onClose}
                  className="bg-white/5 hover:bg-red-500/20 p-2.5 rounded-2xl transition-all text-white/60 hover:text-red-400 group border border-white/5 hover:border-red-500/20"
                  aria-label="Close modal"
                >
                  <X size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                    {type === 'profile' ? 'Full Name' : 'New Email Address'}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                      {type === 'profile' ? <User size={18} /> : <Mail size={18} />}
                    </div>
                    <input
                      type={type === 'profile' ? 'text' : 'email'}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={type === 'profile' ? 'Enter your name' : 'Enter new email'}
                      className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-14 pr-5 text-white font-semibold focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-white/10"
                      autoFocus
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status.message && (
                    <motion.div
                      key={status.type}
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 10 }}
                      className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border ${
                        status.type === 'success' 
                          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}
                    >
                      {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      <span className="flex-1">{status.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading || (type === 'profile' ? value === user?.name : value === user?.email)}
                  className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
