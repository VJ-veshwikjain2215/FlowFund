import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Briefcase, ArrowRight, CheckCircle2, Globe, Cpu, Lock, AlertCircle, Plus, X } from 'lucide-react';
import { authService } from '../services/authService';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState('');
  const [age, setAge] = useState('');
  
  // Mandatory Overheads
  const [rent, setRent] = useState('');
  const [groceries, setGroceries] = useState('');
  const [utilities, setUtilities] = useState('');
  const [internet, setInternet] = useState('');
  const [transport, setTransport] = useState('');
  
  const [error, setError] = useState('');
  const [isEstimate, setIsEstimate] = useState(true);
  const [others, setOthers] = useState([]);
  
  const completeOnboarding = useAuthStore(s => s.completeOnboarding);
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const navigate = useNavigate();

  const validateStep1 = () => {
    if (!profession.trim()) return "Specify your job designation.";
    if (!age || Number(age) < 18) return "You must be at least 18 years old to continue.";
    if (Number(age) > 100) return "Please enter a valid age.";
    return null;
  };

  const handleProfessionChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setProfession(value);
  };

  const validateStep2 = () => {
    if (Number(rent) < 0 || Number(groceries) < 0 || Number(utilities) < 0 || Number(internet) < 0 || Number(transport) < 0 || others.some(item => Number(item.value) < 0)) {
      return "Expenses cannot be negative.";
    }
    return null;
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await authService.getMe();
        setUser(profile);
        if (profile.onboarded) navigate('/dashboard');
      } catch (err) {
        navigate('/auth');
      }
    };
    if (localStorage.getItem('token') && !user) fetchUser();
    else if (user?.onboarded) navigate('/dashboard');
  }, [user, navigate, setUser]);

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    try {
      const success = await completeOnboarding({
        profession,
        incomeType: 'FREELANCE', // default
        baseIncome: '0',
        rent: String(rent || 0),
        groceries: String(groceries || 0),
        utilities: String(utilities || 0),
        internet: String(internet || 0),
        transport: String(transport || 0),
        age: Number(age),
        dependents: 0,
        otherExpenses: String(others.reduce((sum, item) => sum + (Number(item.value) || 0), 0))
      });
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError("Deployment failed. Please check your connectivity.");
      }
    } catch (err) {
      console.error(err);
      setError("A critical error occurred. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-body"
         style={{ background: 'radial-gradient(circle at 20% 30%, rgba(236,72,153,0.12), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.12), transparent 40%), #19251f' }}>
      
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
        {[1, 2].map(i => (
          <div key={i} className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${step >= i ? 'border-[#8fb697] bg-[#8fb697]/20 text-[#8fb697]' : 'border-white/10 bg-white/5 text-white/30'}`}>
                <span className="text-xs font-black">{i}</span>
             </div>
             {i === 1 && <div className={`w-16 h-[2px] rounded-full transition-colors duration-500 ${step > i ? 'bg-[#8fb697]' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-2xl bg-[#25332c]/60 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 md:p-14 relative z-20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8fb697]/80 to-transparent" />
          
          {error && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle size={18} className="text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-500/90">{error}</span>
            </motion.div>
          )}

          {step === 1 ? (
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="h-[2px] w-8 bg-[#8fb697]/60" />
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-[#8fb697]">Step 1 of 2</span>
                   </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">TELL US ABOUT <br /> HOW YOU EARN.</h1>
                <p className="text-white/60 text-base font-medium leading-relaxed max-w-md">
                  This helps us personalize your financial plan and build your initial safety buffer seamlessly.
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3 group">
                  <label className="block text-sm font-bold uppercase tracking-wider text-white/60 ml-2">Job Designation / Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#8fb697] transition-colors" />
                    <input 
                      type="text"
                      placeholder="e.g. Graphic Designer, Freelance Writer"
                      value={profession}
                      onChange={handleProfessionChange}
                      className="w-full h-16 bg-white/[0.02] border border-white/10 rounded-2xl pl-16 pr-6 text-white text-base outline-none focus:bg-white/[0.04] focus:border-[#8fb697]/50 focus:ring-1 focus:ring-[#8fb697]/30 transition-all font-medium placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="block text-sm font-bold uppercase tracking-wider text-white/60 ml-2">Age</label>
                  <div className="relative">
                    <input 
                      type="number"
                      min="18"
                      max="100"
                      placeholder="e.g. 24"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      onWheel={(e) => e.target.blur()} 
                      className="w-full h-16 bg-white/[0.02] border border-white/10 rounded-2xl px-6 text-white text-base outline-none focus:bg-white/[0.04] focus:border-[#8fb697]/50 focus:ring-1 focus:ring-[#8fb697]/30 transition-all font-medium placeholder:text-white/20"
                    />
                  </div>
                  <p className="text-xs text-white/40 ml-2 mt-2 font-medium">You must be at least 18 years old to continue.</p>
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <motion.button 
                  whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(167, 139, 250, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full h-16 bg-gradient-to-r from-purple-500 to-[#8fb697] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-lg"
                >
                  <span className="relative z-10">Build My Plan</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="h-[2px] w-8 bg-[#8fb697]/60" />
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-[#8fb697]">Step 2 of 2</span>
                   </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">ESSENTIAL <br /> MONTHLY EXPENSES.</h1>
                <div className="flex items-center justify-between">
                  <p className="text-white/60 text-base font-medium leading-relaxed max-w-sm">
                    What are your non-negotiable monthly spends?
                  </p>
                  
                  {/* ESTIMATE TOGGLE SWITCH */}
                  <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10 hidden sm:flex">
                    <button 
                      onClick={() => setIsEstimate(false)}
                      className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${!isEstimate ? 'bg-white text-black' : 'text-white/40 hover:text-white/70'}`}
                    >
                      Exact
                    </button>
                    <button 
                      onClick={() => setIsEstimate(true)}
                      className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${isEstimate ? 'bg-[#8fb697] text-black' : 'text-white/40 hover:text-white/70'}`}
                    >
                      Estimate
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { label: 'Rent / Housing', value: rent, setter: setRent, id: 'rent', max: 50000, icon: '🏠' },
                  { label: 'Groceries / Food', value: groceries, setter: setGroceries, id: 'food', max: 20000, icon: '🛒' },
                  { label: 'Utilities (Light/Water)', value: utilities, setter: setUtilities, id: 'elec', max: 10000, icon: '⚡' },
                  { label: 'Internet / WiFi', value: internet, setter: setInternet, id: 'wifi', max: 5000, icon: '🌐' },
                  { label: 'Transport / Commute', value: transport, setter: setTransport, id: 'car', full: true, max: 15000, icon: '🚗' }
                ].map((item) => (
                  <div key={item.id} className={`space-y-4 group ${item.full ? 'md:col-span-2' : ''}`}>
                    <div className="flex justify-between items-center ml-2">
                       <label className="text-sm font-bold text-white/80 tracking-wide flex items-center gap-2">
                          <span>{item.icon}</span> {item.label}
                       </label>
                       <span className="text-lg font-black text-[#8fb697]">₹{item.value ? Number(item.value).toLocaleString('en-IN') : '0'}</span>
                    </div>

                    <div className="relative">
                      {isEstimate ? (
                        <div className="px-2 pt-2">
                          <input 
                            type="range"
                            min="0"
                            max={item.max}
                            step="500"
                            value={item.value || 0}
                            onChange={e => item.setter(e.target.value)}
                            className="w-full h-2.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#8fb697] hover:accent-purple-300 transition-all"
                          />
                          <div className="flex justify-between mt-3 text-xs font-bold text-white/30">
                             <span>₹0</span>
                             <span>Max ₹{item.max.toLocaleString()}</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-white/30 group-focus-within:text-[#8fb697]">₹</div>
                          <input 
                            type="number"
                            placeholder="0"
                            value={item.value}
                            onChange={e => item.setter(e.target.value)}
                            className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 text-white text-base outline-none focus:bg-white/[0.04] focus:border-[#8fb697]/50 focus:ring-1 focus:ring-[#8fb697]/30 transition-all font-medium"
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-6 mt-6 border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">Additional Expenses</h3>
                  <p className="text-xs text-white/40">Add any extra monthly costs like subscriptions, EMIs, or personal expenses</p>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {others.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        className="group flex flex-col md:flex-row gap-4 items-start md:items-center bg-[#25332c]/40 border border-white/5 p-4 rounded-2xl relative"
                      >
                        <button 
                           onClick={() => setOthers(others.filter(o => o.id !== item.id))}
                           className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all z-10"
                        >
                           <X className="w-3 h-3" />
                        </button>

                        <div className="w-full md:w-1/3 flex items-center gap-3">
                          <span className="text-white/30"><Plus className="w-4 h-4" /></span>
                          <input 
                            type="text"
                            placeholder="e.g. Netflix, EMI"
                            value={item.label}
                            onChange={(e) => {
                               const newOthers = [...others];
                               newOthers[index].label = e.target.value;
                               setOthers(newOthers);
                            }}
                            className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white text-base outline-none focus:border-[#8fb697]/50 transition-colors placeholder:text-white/20 font-medium"
                          />
                        </div>

                        <div className="w-full md:flex-1 relative mt-2 md:mt-0">
                          {isEstimate ? (
                            <div className="px-2 pt-2">
                              <input 
                                type="range"
                                min="0"
                                max="20000"
                                step="500"
                                value={item.value || 0}
                                onChange={(e) => {
                                   const newOthers = [...others];
                                   newOthers[index].value = e.target.value;
                                   setOthers(newOthers);
                                }}
                                className="w-full h-2.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#8fb697] hover:accent-purple-300 transition-all"
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-black">₹</span>
                              <input 
                                type="number"
                                placeholder="0"
                                value={item.value}
                                onChange={(e) => {
                                   const newOthers = [...others];
                                   newOthers[index].value = e.target.value;
                                   setOthers(newOthers);
                                }}
                                className="w-full h-10 bg-white/[0.02] border border-white/10 rounded-xl pl-8 pr-4 text-white text-sm font-medium outline-none focus:border-[#8fb697]/50"
                              />
                            </div>
                          )}
                        </div>

                        <div className="w-full md:w-24 text-right">
                           <span className="text-lg font-black text-[#8fb697]">₹{item.value ? Number(item.value).toLocaleString('en-IN') : '0'}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setOthers([...others, { id: Date.now(), label: '', value: '' }])}
                  className="flex items-center gap-2 text-sm font-bold text-[#8fb697] hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Expense
                </button>
              </div>

              <div className="flex flex-col gap-6 pt-8 border-t border-white/5">
                <div className="flex gap-4">
                  <button 
                    onClick={handleBack}
                    className="w-1/3 h-16 bg-white/[0.02] text-white/50 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:text-white hover:bg-white/5 transition-all border border-white/10"
                  >
                    PREVIOUS
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(167, 139, 250, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 h-16 bg-gradient-to-r from-purple-500 to-[#8fb697] text-white rounded-2xl font-black uppercase tracking-[0.1em] text-xs md:text-sm flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl"
                  >
                    <span className="relative z-10">Deploy My Safety Buffer</span>
                    <CheckCircle2 size={18} className="relative z-10 group-hover:scale-125 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                </div>
                
                <div className="flex justify-center items-center gap-6 opacity-30 mt-4">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Lock size={12} />
                      Your data is secure
                   </div>
                   <div className="h-1 w-1 rounded-full bg-white/50" />
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white">
                      We don’t store bank details
                   </div>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-10 flex items-center gap-6 text-[10px] font-black tracking-[0.4em] text-white/20 hidden md:flex">
        <div className="flex items-center gap-2">
           <Globe size={12} />
           SECURE_ONBOARDING
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
