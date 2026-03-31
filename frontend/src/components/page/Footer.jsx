import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Shield, Globe, Terminal, Activity, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Footer = () => {
  return (
    <footer className="bg-primary-main text-white/50 py-24 font-sans relative overflow-hidden border-t border-white/10">
      {/* Aesthetic Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-main/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Identity Segment */}
          <div className="space-y-10">
            <Logo size="md" textClass="text-white font-black" iconColor="#ffffff" accentColor="#FF6600" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] leading-[2.2] text-white/40 max-w-xs">
              Providing critical infrastructure for global trade since 2008. We secure the worlds most sensitive supply chains with industrial-grade logistics and cryptographic tracking protocols.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-12 h-12 bg-white/5 hover:bg-accent-main hover:text-white rounded-[1.25rem] flex items-center justify-center transition-all duration-500 border border-white/10 group">
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
            <div className="pt-6 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Node Established: 2008</span>
            </div>
          </div>

          {/* Quick Links / Navigation Hub */}
          <div className="space-y-10">
            <h3 className="text-[10px] font-black uppercase text-white tracking-[0.4em] italic flex items-center gap-3">
               <Terminal size={14} className="text-accent-main" /> Navigation Hub
            </h3>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.3em]">
              <li><Link to="/" className="hover:text-accent-main transition-all flex items-center gap-4 group"><div className="w-1.5 h-1.5 rounded-full bg-accent-main/0 group-hover:bg-accent-main transition-all" /> Global Hub</Link></li>
              <li><Link to="/about" className="hover:text-accent-main transition-all flex items-center gap-4 group"><div className="w-1.5 h-1.5 rounded-full bg-accent-main/0 group-hover:bg-accent-main transition-all" /> Our Heritage</Link></li>
              <li><Link to="/service" className="hover:text-accent-main transition-all flex items-center gap-4 group"><div className="w-1.5 h-1.5 rounded-full bg-accent-main/0 group-hover:bg-accent-main transition-all" /> Logistics Utility</Link></li>
              <li><Link to="/contact" className="hover:text-accent-main transition-all flex items-center gap-4 group"><div className="w-1.5 h-1.5 rounded-full bg-accent-main/0 group-hover:bg-accent-main transition-all" /> Outreach Center</Link></li>
              <li><Link to="/login" className="hover:text-accent-main transition-all flex items-center gap-4 group"><div className="w-1.5 h-1.5 rounded-full bg-accent-main/0 group-hover:bg-accent-main transition-all" /> Secure Portal</Link></li>
            </ul>
          </div>

          {/* Service Protocols / Tiers */}
          <div className="space-y-10">
            <h3 className="text-[10px] font-black uppercase text-white tracking-[0.4em] italic flex items-center gap-3">
               <Globe size={14} className="text-accent-main" /> Global Utility
            </h3>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.3em]">
              <li className="flex items-center gap-4 text-white/40"><div className="w-1 h-3 bg-accent-main/20" /> Air Induction Link</li>
              <li className="flex items-center gap-4 text-white/40"><div className="w-1 h-3 bg-accent-main/20" /> Maritime Logistics Terminal</li>
              <li className="flex items-center gap-4 text-white/40"><div className="w-1 h-3 bg-accent-main/20" /> Terrestrial Routing Hub</li>
              <li className="flex items-center gap-4 text-white/40"><div className="w-1 h-3 bg-accent-main/20" /> Asset Indemnity Protocols</li>
              <li className="flex items-center gap-4 text-white/40"><div className="w-1 h-3 bg-accent-main/20" /> Customs Interception Node</li>
            </ul>
          </div>

          {/* Operational Support Terminal */}
          <div className="space-y-10">
            <h3 className="text-[10px] font-black uppercase text-white tracking-[0.4em] italic flex items-center gap-3">
               <Shield size={14} className="text-accent-main" /> System Support
            </h3>
            <ul className="space-y-7 text-[10px] font-black uppercase tracking-[0.3em]">
              <li className="flex items-start gap-4 group">
                <MapPin size={18} className="text-white mt-1 shrink-0 group-hover:text-accent-main transition-colors" />
                <span className="leading-relaxed text-white/40 group-hover:text-white transition-colors">Canary Wharf, 25 Bank Street<br/>London E14 5JP, UK</span>
              </li>
              <li className="flex items-center gap-4 group">
                <Phone size={18} className="text-white shrink-0 group-hover:text-accent-main transition-colors" />
                <span className="text-white/40 group-hover:text-white transition-colors">+44 (0) 20 7946 0958</span>
              </li>
              <li className="flex items-center gap-4 group">
                <Mail size={18} className="text-white shrink-0 group-hover:text-accent-main transition-colors" />
                <span className="normal-case text-white/40 group-hover:text-white transition-colors">support@tunsphresh.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Global System Integration Status Matrix */}
        <div className="py-12 border-y border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col gap-3">
                <p className="text-[9px] font-black text-white/30 tracking-[0.4em] mb-1 leading-none">NETWORK UPTIME</p>
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                    <p className="text-xs font-black text-white italic tracking-tighter">99.98% / OPTIMAL</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <p className="text-[9px] font-black text-white/30 tracking-[0.4em] mb-1 leading-none">GLOBAL NODES</p>
                <div className="flex items-center gap-3 text-white">
                    <Globe size={16} className="text-accent-main" />
                    <p className="text-xs font-black italic tracking-tighter">154 TERMINALS ACTIVE</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <p className="text-[9px] font-black text-white/30 tracking-[0.4em] mb-1 leading-none">ENCRYPTION LEVEL</p>
                <div className="flex items-center gap-3 text-white">
                    <Shield size={16} className="text-accent-main" />
                    <p className="text-xs font-black italic tracking-tighter">AES-256 BIT READ-ONLY</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <p className="text-[9px] font-black text-white/30 tracking-[0.4em] mb-1 leading-none">NODE LATENCY</p>
                <div className="flex items-center gap-3">
                    <Activity size={16} className="text-accent-main" />
                    <p className="text-xs font-black text-white italic tracking-tighter">&lt; 38MS / INSTITUTIONAL</p>
                </div>
            </div>
        </div>

        {/* Footer Base Metadata Hub */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.5em] text-white/30 gap-8">
          <div className="text-center md:text-left">&copy; {new Date().getFullYear()} TUNSHPRESH GLOBAL ARCHITECTURE. SYSTEM v4.0.2 // ALL DATA IMMUTABLE.</div>
          <div className="flex gap-10">
            <button className="hover:text-white transition-all">Privacy Protocol</button>
            <button className="hover:text-white transition-all">Usage Terms</button>
            <button className="hover:text-white transition-all flex items-center gap-2 italic"><Server size={10} /> Node Audit</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
