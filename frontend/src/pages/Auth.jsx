import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { apiBaseUrl } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Mail, User, Loader2, Globe, Cpu, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const setToken = useAuthStore((s) => s.setToken);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const error = useAuthStore(s => s.error);
  const setError = useAuthStore(s => s.setError);

  // Sanitize technical messages for a clean UI
  const displayError = React.useMemo(() => {
    if (!error) return null;
    const errStr = String(error); // Safety guard against non-string errors
    if (errStr.includes('Unique index') || errStr.includes('duplicate') || errStr.includes('CONSTRAINT')) {
       return "This email is already registered. Try logging in instead!";
    }
    if (errStr.includes('could not execute statement') || errStr.includes('SQL')) {
       return "A calculation error occurred. Please check your inputs.";
    }
    return errStr;
  }, [error]);
  
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    const mode = searchParams.get('mode');
    
    if (token) {
      setToken(token);
      navigate('/onboarding', { replace: true });
    }
    
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [searchParams, setToken, navigate]);

  // Clear error when switching modes
  const clearError = useAuthStore(s => s.logout); // logout clears error, but I should add a specific one
  React.useEffect(() => {
    // We use a dedicated clearError or reuse the setter if available
    useAuthStore.setState({ error: null });
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user;
    if (isLogin) {
      user = await login(email, password);
    } else {
      user = await register(name, email, password);
    }
    
    if (user) {
      if (user.onboarded) navigate('/dashboard');
      else navigate('/onboarding');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiBaseUrl.replace(/\/api\/?$/, '')}/oauth2/authorization/google`;
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden font-body relative"
         style={{ background: 'radial-gradient(circle at 20% 30%, rgba(236,72,153,0.12), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.12), transparent 40%), #0b0b12' }}>
      {/* LEFT COLUMN: AUTH FORM */}
      <div className="w-full h-full md:w-[45%] lg:w-[40%] bg-transparent p-8 md:p-16 flex flex-col relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] border-r border-white/5 overflow-y-auto">
        {/* Top Branding / Language Row */}
        <div className="flex justify-between items-center mb-16 md:mb-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)' }}>
              <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45" />
            </div>
            <div className="text-xl font-black display-font tracking-tighter text-white uppercase">
              RupeeRakshak
            </div>
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/5 px-4 py-2 rounded-full cursor-pointer hover:bg-white/5 transition-all flex items-center gap-2">
            <Globe size={10} />
            EN-US
          </div>
        </div>

        {/* Auth Form Container */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
                {isLogin ? 'Welcome back ! ' : 'Start taking control   '}
              </h1>
              <p className="text-[15px] sm:text-base text-white/50 mb-10 font-medium leading-relaxed">
                {isLogin 
                   ? 'Your financial control system is ready.' 
                   : 'Let’s set up your income system — built for women with unpredictable earnings.'}
              </p>

              {/* Error Display */}
              <AnimatePresence>
                {displayError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 transition-all"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-red-400 leading-relaxed">
                      {displayError}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Login System */}
              <div className="space-y-3 mb-10">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/[0.06] transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    />
                  </svg>
                  <span className="text-white text-[11px] font-bold uppercase tracking-[0.1em] relative z-10">Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] flex-1 bg-white/[0.05]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">Or use email</span>
                <div className="h-[1px] flex-1 bg-white/[0.05]" />
              </div>

              {/* Primary Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-white/60 mb-2 ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-pink-400 transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl pl-13 pr-6 text-white text-[15px] outline-none transition-all placeholder:text-white/20 font-medium"
                        style={{ paddingLeft: '48px', transition: 'all 0.3s ease' }}
                        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(236,72,153,0.4)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(236,72,153,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-white/60 mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-pink-400 transition-colors" />
                    <input 
                      type="email" 
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl pl-13 pr-6 text-white text-[15px] outline-none transition-all placeholder:text-white/20 font-medium"
                      style={{ paddingLeft: '48px', transition: 'all 0.3s ease' }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(236,72,153,0.4)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(236,72,153,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 ml-1 pr-1">
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">
                      Password
                    </label>
                    {isLogin && (
                      <a href="#" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-pink-400 transition-colors" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl pl-13 pr-6 text-white text-[15px] outline-none transition-all placeholder:text-white/20 font-medium"
                      style={{ paddingLeft: '48px', transition: 'all 0.3s ease' }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(236,72,153,0.4)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(236,72,153,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-white rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group shadow-xl hover:shadow-2xl disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)', boxShadow: '0 8px 24px rgba(168,85,247,0.2)' }}
                    onMouseEnter={e => { if(!isLoading) e.currentTarget.style.background = 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)' }}
                    onMouseLeave={e => { if(!isLoading) e.currentTarget.style.background = 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)' }}
                  >
                    {isLoading ? (
                       <span className="text-[12px] font-black tracking-[0.1em] text-white relative z-10 w-full text-center flex items-center justify-center gap-2">
                         <Loader2 className="animate-spin text-white" size={16} /> Setting up your financial system...
                       </span>
                    ) : (
                      <span className="text-[13px] font-black uppercase tracking-[0.1em] relative z-10 w-full text-center">
                        {isLogin ? 'Continue to Dashboard' : 'Start My Journey'}
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {/* Trust Layer */}
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-white/50 text-sm font-medium"><span className="">🔒</span> Your financial data stays private</div>
                <div className="flex items-center gap-3 text-white/50 text-sm font-medium"><span className="">💜</span> Designed for independent women</div>
                <div className="flex items-center gap-3 text-white/50 text-sm font-medium"><span className="">🛡️</span> No hidden fees, ever</div>
              </div>

              {/* Mode Toggle Link */}
              <div className="mt-12 text-center pb-8 border-b border-white/[0.03]">
                <span className="text-[11px] font-bold text-white/30 mr-2">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[11px] font-bold uppercase tracking-[0.1em] text-pink-400 hover:text-pink-300 transition-colors"
                >
                  {isLogin ? 'Create My Account' : 'Return to Login'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: GRAPHIC PANEL */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-transparent">
        {/* THE GENERATED GRAPHIC - Keep original subtle dashboard background but softer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/auth_panel_graphic.png" 
            alt="RupeeRakshak Architecture" 
            className="w-full h-full object-cover opacity-30 scale-105 pointer-events-none grayscale sepia-[20%] hue-rotate-[260deg]" 
          />
        </div>
        
        {/* Visual Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/80 to-transparent opacity-100 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b12] via-transparent to-transparent opacity-100 z-0" />
        
        {/* Textual Overlay Content */}
        <div className="relative z-10 flex flex-col justify-center p-8 lg:p-24 h-full w-full max-w-4xl mx-auto items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="space-y-4 flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 mb-4 px-4 py-2 rounded-full border border-pink-500/20 bg-pink-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-400 blur-[1px]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-300">Smart Income System</span>
              </div>
              <h2 className="text-[3rem] lg:text-[4.5rem] font-black leading-[1.1] display-font tracking-tighter text-white">
                Your stability <br /><span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">dashboard</span>
              </h2>
            </div>
            
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-xl font-medium">
              We smooth your income, <span className="text-white">so you don’t have to worry.</span>
            </p>

            <div className="pt-8">
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                <div className="flex -space-x-3">
                  {[
                    { icon: <ShieldCheck size={14} />, color: "text-pink-400" },
                    { icon: <Cpu size={14} />, color: "text-purple-400" }
                  ].map((node, i) => (
                    <div key={i} className="w-10 h-10 border-2 border-[#0b0b12] rounded-full bg-white/5 flex items-center justify-center">
                      <div className={node.color}>{node.icon}</div>
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-white/40">Secure & automated</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
