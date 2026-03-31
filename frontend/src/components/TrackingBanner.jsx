import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Terminal, ArrowLeft, Globe } from 'lucide-react';

const TrackingBanner = () => {
  const { trackingNumber } = useParams();

  return (
    <section className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
        {/* Tactical Command Header (Top Navigation) */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-auto">
            <Link to="/" className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl px-5 py-3.5 rounded-xl border border-white/10 hover:border-primary-main/50 transition-all group shadow-2xl">
                <ArrowLeft size={16} className="text-primary-light group-hover:-translate-x-1 transition-transform" />
                <div className="h-5 w-px bg-white/10 mx-1" />
                <div>
                   <span className="block text-[7px] font-black text-white/40 uppercase tracking-[0.4em] mb-0.5 ml-1 leading-none">Global Hub</span>
                   <span className="block text-[10px] font-black text-white uppercase tracking-widest leading-none text-nowrap">RETURN TO COMMAND</span>
                </div>
            </Link>

            <div className="flex items-center gap-3 md:opacity-100 opacity-0 transition-opacity">
                <div className="text-right">
                    <h2 className="text-xs font-black text-white uppercase tracking-tighter leading-none mb-1 shadow-sm">TUNSPHRESH GLOBAL</h2>
                    <div className="flex items-center justify-end gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">Node Active</span>
                    </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl shadow-2xl">
                    <Globe size={20} className="text-slate-900" />
                </div>
            </div>
        </div>

        {/* Flagship Cargo Background */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-50 contrast-125 transition-transform duration-[20s] hover:scale-110"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop)' }}
        />
        
        {/* Tactical Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-50" />
        
        <div className="relative z-10 text-center animate-slide-up px-6 mt-8">
            <span className="text-primary-light font-black tracking-[0.5em] text-[9px] uppercase mb-4 block italic">
               SECURED TELEMETRY LINK
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl">
                Tracking
            </h1>
            <div className="inline-flex items-center gap-3 bg-slate-950/50 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 shadow-2xl">
                <Terminal size={12} className="text-primary-light" />
                <span className="text-white font-mono text-lg md:text-xl font-black tracking-widest leading-none">
                    {trackingNumber}
                </span>
            </div>
            <div className="mt-6 flex justify-center gap-2">
                <div className="w-10 h-1 bg-primary-main rounded-full" />
                <div className="w-3 h-1 bg-white/20 rounded-full" />
                <div className="w-3 h-1 bg-white/20 rounded-full" />
            </div>
        </div>
    </section>
  );
};

export default TrackingBanner;
