import React, { useState, useEffect } from 'react';
import { Search, MapPin, Package, ArrowRight, Globe, ShieldCheck, Activity } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop',
    title: 'Precision Global Logistics',
    subtitle: 'Connecting industrial supply chains with unparalleled speed, security, and cryptographic tracking.',
    label: 'RELIABLE INDUCTION'
  },
  {
    image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=2070&auto=format&fit=crop',
    title: 'Integrated Freight Infrastructure',
    subtitle: 'From sub-zero storage to massive oceanic vessel transport, we handle the worlds most critical assets.',
    label: 'GLOBAL NETWORK'
  },
  {
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop',
    title: 'Total Asset Visibility',
    subtitle: 'Real-time satellite telematics for every consignment, from departure terminal to final destination hub.',
    label: 'SATELLITE TRACKING'
  }
];

const HomeSlider = ({ trackingNumber, setTrackingNumber, handleTrack }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[85vh] min-h-[650px] w-full overflow-hidden bg-slate-950 font-sans">
      {/* Cinematic Slide Backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.85)), url(${SLIDES[current].image})`,
            }}
          />
          {/* High-end Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Corporate Metadata Floating Bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center gap-10 px-8 py-3.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Nodes: Active</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2.5">
              <Globe size={12} className="text-primary-light" />
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Terminals: 154</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2.5">
              <ShieldCheck size={12} className="text-primary-light" />
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">AES-256 Protocol</span>
          </div>
      </div>

      {/* Main Content Viewport */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="max-w-4xl space-y-8">
          <motion.div
            key={`label-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-primary-main/20 backdrop-blur-md text-primary-light rounded-full text-[9px] font-black uppercase tracking-[0.4em] border border-primary-main/30"
          >
            <Activity size={12} /> {SLIDES[current].label}
          </motion.div>

          <motion.h1 
            key={`title-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black leading-none uppercase tracking-tighter italic text-white drop-shadow-2xl"
          >
            {SLIDES[current].title}
          </motion.h1>

          <motion.p 
            key={`subtitle-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-base md:text-lg text-slate-200/70 font-bold max-w-2xl mx-auto uppercase tracking-tight italic leading-relaxed"
          >
            {SLIDES[current].subtitle}
          </motion.p>

          {/* ULTRA-PREMIUM TRACKING INTERFACE */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-2xl mx-auto w-full group mt-12 p-1.5 bg-white/5 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl"
          >
            <div className="relative flex flex-col md:flex-row items-center bg-white rounded-[1.25rem] md:rounded-[1.75rem] p-1.5 overflow-hidden shadow-2xl gap-2 md:gap-0">
              <div className="hidden md:flex pl-6 text-slate-400">
                  <Package size={20} className="group-hover:text-primary-main transition-colors duration-500" />
              </div>
              <input 
                type="text"
                placeholder="CONSIGNMENT ID (E.G. TRK-8829...)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="w-full h-12 md:h-14 bg-transparent px-5 md:pl-5 md:pr-40 text-slate-900 text-xs md:text-sm font-black uppercase tracking-widest focus:outline-none placeholder:text-slate-300 placeholder:italic placeholder:font-bold text-center md:text-left"
              />
              <button 
                onClick={handleTrack}
                className="w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 bg-accent-main hover:bg-accent-hover text-white px-8 py-3.5 rounded-[1rem] md:rounded-[1.25rem] transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 group/btn"
              >
                Track Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Industrial Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6">
        {SLIDES.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative px-2 py-3"
          >
            <div className={`h-1 transition-all duration-500 rounded-full ${
              i === current ? 'w-16 bg-primary-main' : 'w-6 bg-white/20 group-hover:bg-white/40'
            }`} />
          </button>
        ))}
      </div>

      {/* Aesthetic Border Accents */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent z-10" />
    </div>
  );
};

export default HomeSlider;
