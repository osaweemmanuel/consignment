import React from 'react';
import { 
  Plane, Ship, Truck, PackageCheck, AlertCircle, ArrowRight, Shield, Activity, SearchCheck, Handshake, Box, CheckCircle2,
  Globe, Zap, Terminal, Database, BarChart3, ShieldCheck, MapPin, Anchor, Server
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../Reveal';
import { motion } from 'framer-motion';

const ServiceCard = ({ icon, title, desc, features, num, sub }) => (
  <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden h-full flex flex-col">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-primary-main/5 transition-colors duration-700" />
    <div className="relative z-10 font-black text-slate-100 text-3xl mb-4 group-hover:text-primary-main/20 transition-colors uppercase italic leading-none">{num}</div>
    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-xl group-hover:bg-primary-main transition-all duration-700 transform group-hover:rotate-6">
      {icon}
    </div>
    <div className="mb-2">
        <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[8px] mb-2 block leading-none">{sub}</span>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{title}</h3>
    </div>
    <p className="text-slate-500 font-bold uppercase text-[9px] mb-8 leading-[1.8] tracking-widest flex-grow">{desc}</p>
    
    <div className="space-y-4 mb-8 pt-6 border-t border-slate-50">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-3 text-slate-400 group-hover:text-slate-900 transition-colors">
          <div className="w-1 h-1 rounded-full bg-primary-main/30 group-hover:bg-primary-main transition-all" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{f}</span>
        </div>
      ))}
    </div>
    
    <button className="w-full py-4 bg-slate-50 group-hover:bg-slate-950 text-slate-400 group-hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3">
        DEPLOY PROTOCOL <ArrowRight size={12} className="group-hover:translate-x-1" />
    </button>
  </div>
);

const ServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary-main selection:text-white">
      {/* High-Fidelity Cinematic Header */}
      <section className="relative pt-40 pb-32 bg-slate-950 overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=2000&q=80')] opacity-20 object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary-main/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-10">
          <Reveal>
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
                <span className="text-primary-light font-black uppercase tracking-[0.4em] text-[8px]">The Logistics Utility Matrix</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                Precision Asset<br/>Movement <span className="text-primary-main">Protocols.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-200/60 max-w-3xl mx-auto font-bold italic uppercase tracking-tight leading-relaxed">
                Deploying high-velocity multi-modal logistics frameworks across every maritime, air, and terrestrial node in our global network.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Services Architecture Grid */}
      <section className="py-24 bg-white relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <Reveal delay={0.1}>
                 <ServiceCard 
                    num="01"
                    sub="AIR SUPERIORITY"
                    icon={<Plane size={32} />}
                    title="Aero-Express Node"
                    desc="Accelerated air freight protocols for time-critical assets. We leverage priority landing windows at 150+ international air terminals."
                    features={['Priority Customs Clearance', 'Sub-24h Global Transit', 'Real-Time Flight Telemetry']}
                 />
             </Reveal>
             <Reveal delay={0.2}>
                 <ServiceCard 
                    num="02"
                    sub="MARITIME COMMAND"
                    icon={<Ship size={32} />}
                    title="Oceanic-Core Sync"
                    desc="Massive scale cargo movement through optimized maritime corridors. Integrated vessel telematics ensure deep-sea asset integrity."
                    features={['FCL/LCL Aggregation', 'Port-to-Door Connectivity', 'Automated Vessel Sync']}
                 />
             </Reveal>
             <Reveal delay={0.3}>
                 <ServiceCard 
                    num="03"
                    sub="TERRESTRIAL NETWORK"
                    icon={<Truck size={32} />}
                    title="Continental Uplink"
                    desc="Final-node precision delivery systems. Our terrestrial fleet utilizes AI-routing to bypass metropolitan congestion nodes."
                    features={['Smart Routed Fleet', 'Last-Terminal Accuracy', 'Cold-Chain Capable']}
                 />
             </Reveal>
          </div>
        </div>
      </section>

      {/* Specialty Framework Matrix */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary-main/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6">
              <Reveal>
                  <div className="mb-16">
                      <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[9px] mb-4 block leading-none">Industrial Specialization</span>
                      <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-6">Specialized Asset Matrix</h2>
                      <p className="text-slate-400 font-bold uppercase text-[9px] max-w-xl tracking-[0.3em] leading-relaxed italic">Protocols designed for hazardous, fragile, and high-value industrial cargo requiring specific sensory oversight.</p>
                  </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                      { title: "High-Value Security Sync", icon: <ShieldCheck size={28}/>, desc: "Armored transit protocols for precious metals, currency, and high-tech hardware with dual-node verification." },
                      { title: "Cold-Chain Integrity", icon: <Activity size={28}/>, desc: "Ultra-precise temperature maintenance for bioscience and perishable assets with literal zero-thermal-drift." },
                      { title: "Hazardous Material Node", icon: <AlertCircle size={28}/>, desc: "Compliant transport for industrial chemicals and sensitive fuels across 150+ regulatory zones." },
                      { title: "White-Glove Tech Hub", icon: <SearchCheck size={28}/>, desc: "Vibration-shielded transport for sensitive server clusters and laboratory equipment with installation support." }
                  ].map((item, idx) => (
                      <Reveal key={idx} delay={idx * 0.1}>
                          <div className="flex items-center gap-8 p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-primary-main transition-all duration-500 group shadow-sm hover:shadow-xl group">
                              <div className="shrink-0 w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center group-hover:bg-primary-main transition-all shadow-xl">
                                  {item.icon}
                              </div>
                              <div>
                                  <h4 className="text-base font-black text-slate-900 mb-2 uppercase tracking-tight italic leading-none">{item.title}</h4>
                                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                              </div>
                          </div>
                      </Reveal>
                  ))}
              </div>
          </div>
      </section>

      {/* Infrastructure Capabilities Matrix */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="relative">
                      <Reveal>
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-[3rem] shadow-inner overflow-hidden relative group">
                              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80" alt="Logistics Infrastructure" className="w-full h-[550px] object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-1000" />
                              <div className="absolute top-10 right-10 p-10 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border-2 border-slate-100">
                                  <div className="text-3xl font-black text-slate-950 italic leading-none mb-1">99.9%</div>
                                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TRANSACTION ACCURACY</div>
                              </div>
                          </div>
                      </Reveal>
                  </div>
                  <div className="space-y-12">
                      <Reveal>
                          <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[9px] mb-4 block leading-none">Enterprise Value Matrix</span>
                          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-8">Systemic Efficiency.</h2>
                          <p className="text-base text-slate-500 font-bold uppercase leading-relaxed tracking-tight max-w-xl">
                              Our architectural layer eliminates the complexities of global trade, providing 100% transparency of your industrial assets.
                          </p>
                      </Reveal>
                      
                      <div className="space-y-6">
                          {[
                              { label: 'IMMUTABLE LEDGER', sub: 'Blockchain-based tracking protocols' },
                              { label: 'SMART ROUTING', sub: 'AI-optimized transit paths' },
                              { label: 'CLIENT TERMINAL', sub: 'High-fidelity enterprise portal' }
                          ].map((cap, i) => (
                              <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary-main transition-colors">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-main group-hover:animate-ping" />
                                  <div>
                                      <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{cap.label}</div>
                                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{cap.sub}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* High-Fidelity Tactical CTA */}
      <section className="py-32 bg-slate-950 text-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-900" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-main/10 blur-[130px] rounded-full pointer-events-none" />
          
          <Reveal>
            <span className="text-primary-light font-black uppercase tracking-[0.6em] text-[10px] mb-10 block leading-none">Global Outreach Authority</span>
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none mb-12 drop-shadow-2xl">
                Initialize Asset<br/>Synchronization.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={() => navigate('/contact')} className="bg-primary-main text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center justify-center gap-3 group">
                    Command Consulting HUB <ArrowRight size={14} className="group-hover:translate-x-1" />
                </button>
                <Link to="/" className="bg-white/5 border border-white/10 backdrop-blur-xl text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all shadow-2xl flex items-center justify-center gap-2">
                    Back to Terminal <Terminal size={14} />
                </Link>
            </div>
          </Reveal>
      </section>
    </div>
  );
};

export default ServicePage;
