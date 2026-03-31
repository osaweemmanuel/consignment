import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X, Shield, Globe, Terminal, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'GLOBAL HUB', path: '/', sub: 'Operations Command' },
    { name: 'OUR HERITAGE', path: '/about', sub: 'Institutional Legacy' },
    { name: 'LOGISTICS UTILITY', path: '/service', sub: 'Movement Protocols' },
    { name: 'OUTREACH CENTER', path: '/contact', sub: 'Support Terminal' }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 font-sans ${
      scrolled 
        ? 'h-20 bg-white/80 backdrop-blur-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border-b border-slate-100 text-slate-900' 
        : 'h-28 bg-transparent text-white'
    }`}>
      {/* Top Utility Segment */}
      <div className={`hidden lg:flex transition-all duration-700 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100 border-b border-white/10'}`}>
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center h-full">
              <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Connectivity: Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                       <Globe size={10} className="text-white/30" />
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Global Nodes: Active</span>
                  </div>
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
                  EST. 2008 // SYSTEM VERSION 4.0.2-ALPHA
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Brand Identity Node */}
        <Link to="/" className="flex items-center group relative">
          <Logo 
              size="md" 
              textClass={scrolled ? 'text-slate-950 font-black' : 'text-white font-black'} 
              iconColor={scrolled ? '#4D148C' : '#ffffff'} 
              className={`transition-all duration-500 ${scrolled ? 'scale-90' : 'scale-105 group-hover:scale-110'}`} 
          />
        </Link>

        {/* Global Desktop Navigation Terminal */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isHovered = hoveredLink === link.name;
            return (
              <Link
                key={link.name}
                to={link.path}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative px-2 py-1 transition-all duration-500 flex flex-col items-center group ${
                  isActive 
                    ? scrolled ? 'text-primary-main' : 'text-white'
                    : scrolled ? 'text-slate-500 hover:text-primary-main' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-black tracking-[0.3em] uppercase leading-none mb-1">
                    {link.name}
                </span>
                <span className={`text-[7px] font-bold tracking-[0.1em] uppercase transition-all duration-500 ${
                    isActive || isHovered ? 'opacity-40 animate-pulse' : 'opacity-0 translate-y-2'
                }`}>
                    {link.sub}
                </span>
                {/* Active Indicator */}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent-main transition-all duration-500 rounded-full ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-30'}`} />
              </Link>
            );
          })}
          
          <Link 
            to="/login" 
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-2xl ${
              scrolled 
                ? 'bg-accent-main hover:bg-accent-hover text-white shadow-accent-main/20'
                : 'bg-white hover:bg-primary-light text-primary-main hover:text-white'
            }`}
          >
            <Shield size={14} /> PORTAL ACCESS
          </Link>
        </div>

        {/* Mobile Terminal Indicator */}
        <button 
          className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            scrolled ? 'bg-slate-100 text-slate-950 shadow-sm' : 'bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-2xl'
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Terminal size={20} />}
        </button>
      </div>

      {/* High-Fidelity Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-b border-slate-100 flex flex-col p-8 z-[60]"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group relative py-5 px-8 rounded-2xl transition-all flex flex-col ${
                      isActive ? 'bg-primary-main text-white shadow-2xl scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{link.name}</span>
                        <ArrowRight size={14} className={`transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                    </div>
                    <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${isActive ? 'text-white/40' : 'text-slate-400'}`}>
                        {link.sub}
                    </span>
                  </Link>
                );
              })}
              <div className="pt-6 border-t border-slate-100 mt-4">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full bg-accent-main text-white text-center px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-accent-hover transition-all"
                  >
                    <Terminal size={16} /> INITIALIZE PORTAL
                  </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
