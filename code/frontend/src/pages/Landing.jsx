import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlideUp, FadeIn, KineticScale } from '../components/AnimatedWrapper';
import { ArrowRight, Shield, Zap, Globe, Cpu, Heart, Star, Lock, User, Palette, Video, Ghost, BookOpen, Clock, AlertCircle, CheckCircle2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Problem', href: '#why' },
  { label: 'Designed For Her', href: '#built-for-her' },
  { label: 'Product', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
];

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#0B0B0F] text-white relative overflow-hidden font-body selection:bg-purple-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#A78BFA]/5 blur-[140px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#F472B6]/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-white/20 rounded-full blur-sm"></div>
        <div className="absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-purple-500/20 rounded-full blur-sm"></div>
      </div>

      {/* ★ HYBRID NAVBAR ★ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50"
        style={{ height: '88px' }}
      >
        {/* ── Desktop ── */}
        <div className="hidden md:flex items-center w-full h-full relative" style={{ paddingLeft: '44px', paddingRight: '44px' }}>

          {/* ―― LEFT: Logo ―― */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 z-10">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)',
                boxShadow: '0 4px 18px rgba(167,139,250,0.5)',
              }}
            >
              <div className="w-4 h-4 bg-white rounded-[3px] rotate-45" />
            </div>
            <span
              className="text-[16px] font-black text-white whitespace-nowrap tracking-tighter"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}
            >
              RupeeRakshak
            </span>
          </Link>

          {/* ―― CENTER: Pill Capsule (absolute, screen-centered) ―― */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <nav
              className="flex items-center gap-1 pointer-events-auto px-2 py-2"
              style={{
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '9999px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
              }}
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-5 py-2 rounded-full text-[10.5px] font-bold uppercase text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 whitespace-nowrap"
                  style={{ letterSpacing: '0.13em' }}
                >
                  {link.label}
                </a>
              ))}
              {/* Access Portal inside capsule */}
              <Link
                to="/auth"
                className="ml-1 px-6 py-2.5 rounded-full text-[10.5px] font-black uppercase text-white whitespace-nowrap"
                style={{
                  letterSpacing: '0.13em',
                  background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)',
                  boxShadow: '0 4px 16px rgba(167,139,250,0.45)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(167,139,250,0.7)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(167,139,250,0.45)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Access Portal
              </Link>
            </nav>
          </div>

          {/* ―― RIGHT: Auth buttons ―― */}
          <div className="ml-auto flex items-center gap-4 shrink-0 z-10">
            <Link
              to="/auth?mode=signup"
              className="text-[10.5px] font-bold uppercase text-white/40 hover:text-white transition-colors duration-200 whitespace-nowrap"
              style={{ letterSpacing: '0.16em' }}
            >
              Sign Up
            </Link>
            <Link
              to="/auth"
              className="px-5 py-2.5 rounded-full text-[10.5px] font-bold uppercase whitespace-nowrap"
              style={{
                letterSpacing: '0.13em',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Log In
            </Link>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="flex md:hidden items-center justify-between h-full" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)' }}
            >
              <div className="w-4 h-4 bg-white rounded-[3px] rotate-45" />
            </div>
            <span className="text-[14px] font-black text-white tracking-tighter">RupeeRakshak</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              to="/auth"
              className="px-4 py-2 rounded-full text-[10px] font-black uppercase text-white"
              style={{ letterSpacing: '0.12em', background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)' }}
            >
              Portal
            </Link>
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-[76px] left-4 right-4 rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(15,12,20,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-2xl text-[11px] font-bold uppercase text-white/45 hover:text-white hover:bg-white/[0.06] transition-all"
                    style={{ letterSpacing: '0.18em' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="px-4 pb-5 pt-1 border-t border-white/[0.06] flex flex-col gap-2">
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center px-5 py-3 rounded-full text-[10px] font-bold uppercase text-white/50 hover:text-white transition-all"
                  style={{ letterSpacing: '0.16em', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  Sign Up
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center px-5 py-3 rounded-full text-[10px] font-black uppercase text-white"
                  style={{ letterSpacing: '0.14em', background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)', boxShadow: '0 4px 16px rgba(167,139,250,0.35)' }}
                >
                  Access Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* 🌟 1. HERO SECTION (Asymmetric) */}
      <main className="relative z-10 pt-36 md:pt-52 px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
          <div className="lg:col-span-7 text-left">
            <FadeIn direction="up" delay={0.1}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                Empowering independent women
              </span>
            </FadeIn>

            <h1 className="text-[3.2rem] md:text-[6.5rem] leading-[0.95] font-black display-font tracking-tighter mb-8 max-w-4xl">
              Take Control of <br />
              Your Income — <br />
              <span className="female-gradient">Without the Stress</span>
            </h1>

            <p className="text-lg md:text-2xl max-w-2xl leading-relaxed mb-12 text-white/50 font-medium">
              You work hard, but your income isn’t consistent. <br />
              We help you <span className="text-white/90">predict, plan, and protect</span> your money — automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
              <Link to="/auth" className="px-14 py-6 button-primary text-[13px] uppercase tracking-[0.2em] w-full sm:w-auto text-center">
                Plan My Finances
              </Link>
              <a href="#how-it-works" className="px-14 py-6 button-secondary text-[13px] uppercase tracking-[0.2em] w-full sm:w-auto text-center">
                See How It Works
              </a>
            </div>

            <div className="flex items-center gap-4 text-white/30 text-[11px] font-black uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-white/10"></div>
              No spreadsheets. No guesswork. <span className="text-white/60">Just clarity.</span>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5 relative">
            {/* ── MAIN DASHBOARD CARD ── */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[36px] overflow-hidden p-6"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-1">Financial Dashboard</p>
                  <p className="text-[11px] font-bold text-white/50">April 2025 — Overview</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">Live</span>
                </div>
              </div>

              {/* 3 Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Available', value: '₹42,500', sub: '+12% vs last mo.', color: '#A78BFA' },
                  { label: 'Buffer', value: '₹8,200', sub: 'Auto-saved', color: '#F472B6' },
                  { label: 'Predicted', value: '₹38,000', sub: 'Next month', color: '#818CF8' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + i * 0.12 }}
                    className="rounded-2xl p-3 flex flex-col gap-1"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: stat.color + 'cc' }}>{stat.label}</span>
                    <span className="text-[15px] font-black text-white leading-none">{stat.value}</span>
                    <span className="text-[9px] text-white/25 font-medium">{stat.sub}</span>
                  </motion.div>
                ))}
              </div>

              {/* Income Bar Chart */}
              <div className="rounded-2xl p-4 mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-end justify-between gap-2 h-24">
                  {[55, 80, 45, 90, 60, 72, 38].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.9, delay: 0.9 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full rounded-t-lg"
                        style={{
                          background: i === 6
                            ? 'linear-gradient(180deg, rgba(244,114,182,0.2) 0%, rgba(167,139,250,0.05) 100%)'
                            : i === 3
                            ? 'linear-gradient(180deg, rgba(167,139,250,0.6) 0%, rgba(167,139,250,0.15) 100%)'
                            : 'linear-gradient(180deg, rgba(167,139,250,0.3) 0%, rgba(167,139,250,0.05) 100%)',
                          border: i === 3 ? '1px solid rgba(167,139,250,0.3)' : 'none',
                          boxShadow: i === 3 ? '0 0 8px rgba(167,139,250,0.15)' : 'none',
                        }}
                      />
                      <span className="text-[8px] text-white/20 font-medium">
                        {['Oct','Nov','Dec','Jan','Feb','Mar','Apr'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#A78BFA' }} />
                    <span className="text-[9px] text-white/30 font-medium">Income trend</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(244,114,182,0.5)' }} />
                    <span className="text-[9px] text-white/30 font-medium">Predicted dip</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── FLOATING CHIP 1: Payment received ── */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              transition={{ opacity: { duration: 0.5, delay: 1.3 }, x: { duration: 0.5, delay: 1.3 }, y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.3 } }}
              className="absolute -left-10 top-12 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(10,10,15,0.65)',
                border: '1px solid rgba(167,139,250,0.15)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 16px rgba(167,139,250,0.08)',
              }}
            >
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg, #A78BFA40, #A78BFA20)' }}>💰</div>
              <div>
                <p className="text-[11px] font-black text-white leading-none">+ ₹25,000 received</p>
                <p className="text-[9px] text-white/35 mt-0.5">Client payment · just now</p>
              </div>
            </motion.div>

            {/* ── FLOATING CHIP 2: Buffer saved ── */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
              transition={{ opacity: { duration: 0.5, delay: 1.6 }, x: { duration: 0.5, delay: 1.6 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.6 } }}
              className="absolute -right-8 top-1/3 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(10,10,15,0.65)',
                border: '1px solid rgba(244,114,182,0.15)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 16px rgba(244,114,182,0.06)',
              }}
            >
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg, #F472B640, #F472B620)' }}>🛡️</div>
              <div>
                <p className="text-[11px] font-black text-white leading-none">₹8,000 saved to buffer</p>
                <p className="text-[9px] text-white/35 mt-0.5">Auto-transferred · secure</p>
              </div>
            </motion.div>

            {/* ── FLOATING CHIP 3: Dip warning ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{ opacity: { duration: 0.5, delay: 2.0 }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2.0 } }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-3 rounded-2xl whitespace-nowrap"
              style={{
                background: 'rgba(10,10,15,0.65)',
                border: '1px solid rgba(251,191,36,0.15)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 16px rgba(251,191,36,0.05)',
              }}
            >
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm" style={{ background: 'rgba(251,191,36,0.1)' }}>📉</div>
              <div>
                <p className="text-[11px] font-black text-amber-500 leading-none">Next month dip predicted</p>
                <p className="text-[9px] text-white/30 mt-0.5">Buffer will cover it · don't worry</p>
              </div>
            </motion.div>
          </div>
        </div>

        <section className="mt-24 text-center">
          <p className="text-white/40 text-lg md:text-xl font-medium tracking-wide italic">
            “You didn’t choose freelancing to stress about money.”
          </p>
        </section>

        {/* 💔 2. PROBLEM SECTION */}
        <section id="why" className="mt-56 max-w-6xl mx-auto w-full text-left scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <SlideUp>
                <h2 className="text-4xl md:text-7xl font-black display-font tracking-tighter mb-8 leading-tight">
                  Irregular Income <br />Isn’t Freedom — <br />
                  <span className="opacity-20 italic">It’s Uncertainty.</span>
                </h2>
                <p className="text-xl text-white/40 mb-12">
                  Freelancing gives you flexibility, but it also brings <span className="text-white/80">constant financial stress.</span>
                </p>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 inline-flex items-center gap-4">
                  <div className="text-pink-400">“</div>
                  <p className="text-sm text-white/60 italic font-medium">“Some months are great. Some are scary.”</p>
                </div>
              </SlideUp>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { label: "No fixed income", icon: <Ghost className="text-pink-400" size={24} />, delay: 0.1 },
                { label: "Late payments", icon: <Clock className="text-purple-400" size={24} />, delay: 0.2, offset: "lg:mt-8" },
                { label: "Sudden expenses", icon: <AlertCircle className="text-pink-400" size={24} />, delay: 0.3 },
                { label: "No safety net", icon: <Lock className="text-purple-400" size={24} />, delay: 0.4, offset: "lg:mt-8" }
              ].map((item, i) => (
                <FadeIn key={i} delay={item.delay} direction="up">
                  <div className={`p-10 glass-card rounded-[40px] flex flex-col items-start gap-6 border-white/5 group hover:border-pink-500/20 transition-all duration-500 ${item.offset || ''}`}>
                    <div className="p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="text-white/80 text-[11px] font-black uppercase tracking-[0.3em]">{item.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 🧠 3. RELATABLE STORY SECTION (Timeline) */}
        <section className="mt-56 max-w-5xl mx-auto w-full relative">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-6xl font-black display-font tracking-tighter mb-4">A Month in Your Life</h2>
            <div className="w-12 h-1 female-bg-gradient mx-auto rounded-full"></div>
          </div>

          <div className="relative space-y-12 md:space-y-0 md:grid md:grid-cols-4 gap-8">
            {/* Desktop Timeline Line */}
            <div className="hidden md:block absolute top-[50%] left-0 w-full h-[1px] bg-white/5 z-0"></div>

            {[
              { week: "Week 01", state: "Payment arrives", feeling: "feels good", icon: "💎", color: "text-green-400" },
              { week: "Week 02", state: "Expenses hit", feeling: "stress begins", icon: "💸", color: "text-purple-400" },
              { week: "Week 03", state: "No income", feeling: "anxiety", icon: "⏳", color: "text-pink-400" },
              { week: "Week 04", state: "Savings gone", feeling: "panic", icon: "🌋", color: "text-red-400" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-[24px] glass-card border-white/10 flex items-center justify-center text-2xl mb-6 shadow-2xl">
                  {item.icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">{item.week}</div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{item.state}</h4>
                <p className={`text-[11px] font-medium italic ${item.color} uppercase tracking-widest`}>{item.feeling}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <p className="text-xl text-white/40 font-medium">
              This cycle repeats. <span className="text-white/90">Until you fix the system.</span>
            </p>
          </div>
        </section>

        {/* 💡 4. TRANSITION */}
        <section className="mt-56 text-center">
          <FadeIn>
            <p className="text-2xl md:text-4xl font-black display-font tracking-tight text-white/30">
              So how do you fix <br />
              <span className="text-white italic">unpredictable income?</span>
            </p>
            <div className="mt-12 h-16 w-[1px] bg-gradient-to-b from-purple-500 to-transparent mx-auto"></div>
          </FadeIn>
        </section>

        {/* ⚙️ 5. SOLUTION SECTION */}
        <section id="how-it-works" className="mt-48 max-w-6xl mx-auto w-full scroll-mt-32">
          <div className="text-left mb-24">
            <h2 className="text-4xl md:text-8xl font-black display-font tracking-tighter leading-none mb-8">
              We Turn Chaos <br />Into <span className="female-gradient">Control.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "We track your income", desc: "Automated monitoring of every invoice and payment.", icon: <Globe size={20} /> },
              { title: "We predict what’s coming", desc: "Our engine forecasts your next 30 days of cash flow.", icon: <Cpu size={20} /> },
              { title: "We automatically save", desc: "Smart buffers set aside money before you can spend it.", icon: <Zap size={20} /> },
              { title: "You stay stable", desc: "Continuous protection, no matter the season.", icon: <Shield size={20} /> }
            ].map((item, i) => (
              <div key={i} className={`p-10 glass-card rounded-[40px] border-white/5 space-y-6 hover:translate-y-[-8px] transition-transform duration-500 ${i % 2 !== 0 ? 'lg:mt-12' : ''}`}>
                <div className="w-12 h-12 rounded-2xl female-bg-gradient flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                <div className="pt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                  <CheckCircle2 size={12} className="text-green-500/40" />
                  You don’t have to think about it.
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🧠 6. SMART TECH SECTION */}
        <section className="mt-56 max-w-6xl mx-auto w-full">
          <div className="relative p-12 md:p-24 rounded-[64px] bg-gradient-to-br from-purple-500/[0.03] to-pink-500/[0.03] border border-white/5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-black display-font tracking-tight mb-8">Smart Predictions. <br /><span className="female-gradient italic">Real Results.</span></h2>
                <p className="text-lg text-white/50 leading-relaxed mb-10">
                  We analyze your past income patterns to estimate what you’ll earn next.
                  Then we automatically create a financial buffer — <span className="text-white/90">so you're always prepared.</span>
                </p>
                <div className="inline-flex px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                  Built using advanced forecasting models.
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-sm space-y-4">
                  {[70, 40, 90].map((w, i) => (
                    <div key={i} className="h-12 w-full glass-card rounded-2xl border-white/5 flex items-center px-4 gap-4 overflow-hidden group">
                      <div className="w-2 h-2 rounded-full female-bg-gradient"></div>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        className="h-1.5 bg-white/10 rounded-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 👩💻 7. BUILT FOR HER SECTION */}
        <section id="built-for-her" className="mt-56 max-w-7xl mx-auto w-full scroll-mt-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-4xl md:text-7xl font-black display-font tracking-tighter leading-none">
              Made for the <br />Way <span className="female-gradient">You Work.</span>
            </h2>
            <p className="text-sm text-white/30 max-w-[200px] mb-2 uppercase tracking-widest font-black leading-loose">
              Tailored logic for independent professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Freelance Designer", problem: "Late payments?", solution: "We smooth your cash flow.", icon: <Palette size={24} />, color: "border-purple-500/20" },
              { role: "Content Creator", problem: "Income fluctuates?", solution: "We bring stability.", icon: <Video size={24} />, color: "border-pink-500/20", offset: "lg:mt-12" },
              { role: "Makeup Artist", problem: "Seasonal work?", solution: "We help you plan ahead.", icon: <Star size={24} />, color: "border-purple-500/20" },
              { role: "Tutor / Coach", problem: "Irregular clients?", solution: "Stay consistent.", icon: <BookOpen size={24} />, color: "border-pink-500/20", offset: "lg:mt-12" }
            ].map((card, i) => (
              <div key={i} className={`p-12 glass-card rounded-[48px] text-left space-y-8 h-full border-white/5 hover:border-purple-500/40 relative overflow-hidden group transition-all duration-700 ${card.offset || ''}`}>
                <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-purple-400 group-hover:female-bg-gradient group-hover:text-white transition-all duration-500 shadow-xl">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{card.role}</h3>
                  <div className="space-y-2">
                    <p className="text-[11px] text-pink-400 font-black uppercase tracking-[0.2em]">{card.problem}</p>
                    <p className="text-sm text-white/50 leading-relaxed font-medium">{card.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 💎 8. BENEFITS SECTION */}
        <section className="mt-56 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "Know your income", desc: "No more guessing what's coming next month." },
                { title: "Automatic savings", desc: "Zero brain cycles spent on manually moving money." },
                { title: "A growing buffer", desc: "Your safety net builds itself in the background." },
                { title: "Less money anxiety", desc: "Focus on your work, we handle the rest." }
              ].map((item, i) => (
                <div key={i} className="space-y-4 p-8 glass-card border-white/5 rounded-[32px]">
                  <div className="w-2 h-2 rounded-full female-bg-gradient"></div>
                  <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 text-left">
              <h2 className="text-4xl font-black display-font tracking-tight mb-8">What You Actually Get</h2>
              <p className="text-lg text-white/40 italic mb-10 leading-relaxed">
                “You focus on work. <br />
                We handle the rest.”
              </p>
              <div className="flex flex-col gap-4">
                <div className="px-6 py-4 border border-white/5 rounded-2xl text-[10px] uppercase font-black tracking-widest text-white/30 italic">Direct Peace of Mind</div>
                <div className="px-6 py-4 border border-pink-500/10 rounded-2xl text-[10px] uppercase font-black tracking-widest text-pink-400/60">Automated protection</div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔐 9. TRUST & SECURITY */}
        <section id="security" className="mt-56 max-w-6xl mx-auto w-full text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-7xl font-black display-font tracking-tighter mb-8 leading-tight">
              Your Money. Your Control. <br /><span className="opacity-20">Always Safe.</span>
            </h2>
            <p className="text-lg text-white/40 mb-20 italic">“Your financial safety is not optional.”</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Bank-Level Encryption", icon: <Lock />, desc: "Your data is protected by the same standards as the world's leading banks." },
                { title: "Secure Login", icon: <User />, desc: "Multi-factor authentication ensures only you have access." },
                { title: "No Data Selling", icon: <Shield />, desc: "We never sell your personal or financial information. Ever." }
              ].map((item, i) => (
                <div key={i} className="p-12 glass-card rounded-[40px] space-y-6 text-left border-white/5 hover:border-purple-500/10 transition-all">
                  <div className="w-12 h-12 female-bg-gradient rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
                  <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>


        {/* 🎯 11. FINAL CTA (Emotional) */}
        <section className="my-64 max-w-6xl mx-auto w-full relative">
          <div className="relative p-12 md:p-32 rounded-[80px] overflow-hidden text-center bg-gradient-to-br from-purple-500/[0.05] to-pink-500/[0.05] border border-white/5 shadow-3xl">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-7xl font-black display-font tracking-tighter mb-12 leading-[1.1]">
                You Deserve Stability — <br /><span className="female-gradient italic text-5xl md:text-8xl">Even Without a Fixed Salary.</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/40 mb-16 font-medium leading-relaxed">
                Start building your safety net today. Automatically. <br />
                <span className="text-white/60">You didn’t choose freelancing to stress about money.</span>
              </p>
              <Link to="/auth" className="inline-flex px-16 py-8 button-primary text-[15px] shadow-2xl shadow-purple-500/30">
                 Plan My Finances
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 🧾 12. FOOTER */}
      <footer className="relative z-20 border-t border-white/5 bg-[#050505]/95 backdrop-blur-3xl py-24 px-6 md:px-16 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 md:gap-24 relative z-30">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black display-font tracking-tighter text-white">RupeeRakshak</div>
              <div className="w-9 h-9 female-bg-gradient rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <div className="w-5 h-5 bg-black rounded-sm rotate-45" />
              </div>
            </div>
            <p className="text-base text-white/30 leading-relaxed max-w-sm font-medium italic">
              Built for women who choose freedom over fixed salaries.
            </p>
          </div>

          <div className="space-y-8 pt-4">
            <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Product</h5>
            <ul className="space-y-5 text-[13px] font-bold text-white/40">
              <li><a href="#why" className="hover:text-purple-400 transition-all">Why Us</a></li>
              <li><a href="#built-for-her" className="hover:text-purple-400 transition-all">Built For Her</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-400 transition-all">Control System</a></li>
              <li><a href="#security" className="hover:text-purple-400 transition-all">Safety Node</a></li>
            </ul>
          </div>

          <div className="space-y-8 pt-4">
            <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Support</h5>
            <ul className="space-y-5 text-[13px] font-bold text-white/40">
              <li><a href="#" className="hover:text-purple-400 transition-all">Contact Us</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-all">Privacy Terms</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-all">Usage Mesh</a></li>
            </ul>
          </div>

          <div className="space-y-8 pt-4">
            <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Status</h5>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full female-bg-gradient animate-pulse"></div>
                <span className="text-[10px] uppercase font-black tracking-widest text-pink-400/80">Systems Online</span>
              </div>
              <p className="text-[13px] text-white/80 font-black leading-tight tracking-tight uppercase">
                Predict. Plan. Protect.<br />
                <span className="female-gradient italic text-[11px]">Your Financial Relief.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-30">
          <div className="text-[10px] tracking-[0.4em] font-black text-white/10 uppercase">
            © 2026 RupeeRakshak. Supporting the independent workforce.
          </div>
          <div className="flex gap-8 text-[10px] tracking-[0.4em] font-black text-white/10 uppercase">
            <a href="#" className="hover:text-white transition-colors">Legal Mesh</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
