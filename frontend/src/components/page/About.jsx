import React from 'react';
import { 
  Building2, Globe, Target, Users, MapPin, CheckCircle2, Award, Zap, ShieldAlert, ArrowRight,
  Shield, Activity, Database, BarChart3, Terminal, Server, ShieldCheck, Anchor
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../Reveal';
import { motion } from 'framer-motion';

const ValueCard = ({ icon, title, desc, num }) => (
  <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden h-full flex flex-col items-center text-center">
    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-primary-main/5 transition-colors duration-500" />
    <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center mb-6 shadow-xl group-hover:bg-primary-main transition-all duration-500 transform group-hover:rotate-6">
      {icon}
    </div>
    <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight uppercase italic leading-none">{title}</h3>
    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{desc}</p>
    <div className="mt-6 pt-5 bit border-t border-slate-50 w-full text-[8px] font-black text-primary-main uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
        Institutional Pillar #{num}
    </div>
  </div>
);

const ComplianceCard = ({ title, text, icon }) => (
  <div className="flex items-start gap-5 p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-primary-main transition-all duration-500 group shadow-sm hover:shadow-xl h-full">
    <div className="shrink-0 w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center group-hover:bg-primary-main transition-all shadow-xl">
        {icon || <Award size={20} />}
    </div>
    <div className="flex flex-col h-full">
      <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight italic leading-none">{title}</h4>
      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity flex-grow">{text}</p>
      <div className="mt-5 flex items-center gap-2 text-emerald-500 text-[7px] font-black uppercase tracking-[0.3em]">
          <CheckCircle2 size={8} /> Verified Compliant
      </div>
    </div>
  </div>
);

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary-main selection:text-white">
      {/* High-Fidelity Cinematic Hero */}
      <section className="relative pt-40 pb-32 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80')] opacity-20 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary-main/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white space-y-10">
          <Reveal>
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
                <span className="text-primary-light font-black uppercase tracking-[0.4em] text-[8px]">The Institutional Core</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic leading-none max-w-5xl mx-auto drop-shadow-2xl">
                Engineering The<br/>Next <span className="text-primary-main">Logistics Era.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-200/60 max-w-2xl mx-auto font-bold italic uppercase tracking-tight leading-relaxed">
                Tunshpresh Global acts as the trusted architectural layer for international trade, securing high-value assets with industrial-grade precision.
            </p>
            <div className="pt-10 flex flex-col sm:flex-row justify-center gap-5">
                 <button onClick={() => navigate('/service')} className="bg-primary-main text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center justify-center gap-3 group">
                    View Deployment Protocols <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                 </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Strategic Operational Split */}
      <section className="py-24 bg-white relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal delay={0.1}>
                <div className="p-12 md:p-14 bg-slate-50 rounded-[3.5rem] border border-slate-100 relative overflow-hidden group hover:border-primary-main/30 transition-all duration-700 h-full flex flex-col shadow-sm hover:shadow-xl">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-main transition-all duration-500 shadow-xl group-hover:rotate-3 group-hover:scale-110">
                        <Target size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic leading-none">Strategic Mission</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-[2.1] relative z-10 flex-grow">
                        To architect and deploy highly optimized supply chain protocols that eliminate operational opacity. We provide the infrastructure needed to ensure absolute asset integrity at every terminal.
                    </p>
                    <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-lg"><Globe size={14}/></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Reach: Active</span>
                    </div>
                </div>
            </Reveal>
            <Reveal delay={0.2}>
                <div className="p-12 md:p-14 bg-slate-50 rounded-[3.5rem] border border-slate-100 relative overflow-hidden group hover:border-primary-main/30 transition-all duration-700 h-full flex flex-col shadow-sm hover:shadow-xl">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-main transition-all duration-500 shadow-xl group-hover:-rotate-3 group-hover:scale-110">
                        <Globe size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic leading-none">Global Vision</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-[2.1] relative z-10 flex-grow">
                        To be the definitive technological backbone of international commerce. We envision a future where high-value asset migration across borders is handled by an automated logistics network.
                    </p>
                    <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-lg"><Activity size={14}/></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Load: Optimized</span>
                    </div>
                </div>
            </Reveal>
        </div>
      </section>

      {/* Institutional Narrative */}
      <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="space-y-10">
                <div>
                    <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[9px] mb-4 block">The Founding Vision</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-4">
                    A Legacy Of<br/>Certainty.
                    </h2>
                </div>
                <p className="text-base text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-xl">
                Founded in 2008, Tunshpresh was established by a consortium of global logistics architects to eradicate operational opacity.
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-[2.2]">
                Today, we execute complex supply chain protocols in over 150 nations. Our growth is powered by algorithmic investments and industrial-grade transparency and security.
                </p>
                <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-100">
                    <div>
                    <div className="text-3xl font-black text-slate-900 mb-1 italic leading-none">2008</div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-main">INCEPTION</div>
                    </div>
                    <div>
                    <div className="text-3xl font-black text-slate-900 mb-1 italic leading-none">154+</div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-main">NODES</div>
                    </div>
                    <div>
                    <div className="text-3xl font-black text-slate-900 mb-1 italic leading-none">5M+</div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-main">CAPACITY</div>
                    </div>
                </div>
            </div>
          </Reveal>
          
          <div className="relative">
            <Reveal delay={0.4}>
                <div className="p-3 bg-slate-50 rounded-[3.5rem] border border-slate-200 group relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Operations Logistics Hub" 
                      className="w-full h-[500px] object-cover rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute bottom-8 left-8 p-10 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border-2 border-slate-100 transform -rotate-2 group-hover:rotate-0 transition-all duration-500">
                        <Activity className="text-emerald-500 mb-4 w-10 h-10" />
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 leading-none">SYSTEM REACH</div>
                        <div className="text-xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">GLOBAL TERMINAL READY</div>
                    </div>
                </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Corporate Pillars Grid */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
              <Reveal>
                  <div className="text-center mb-16">
                      <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[9px] mb-4 block leading-none">Institutional Core</span>
                      <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-4">Our Core Pillars.</h2>
                      <p className="text-slate-400 font-bold uppercase text-[9px] max-w-xl mx-auto tracking-[0.3em]">Defining the standards of international asset migration since 2008.</p>
                  </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Reveal delay={0.1}>
                      <ValueCard num="01" icon={<ShieldCheck size={28}/>} title="Asset Security" desc="Immutable protection across every node."/>
                  </Reveal>
                  <Reveal delay={0.2}>
                      <ValueCard num="02" icon={<Globe size={28}/>} title="Global Nodes" desc="Seamless transitions in 150+ hubs."/>
                  </Reveal>
                  <Reveal delay={0.3}>
                      <ValueCard num="03" icon={<Zap size={28}/>} title="Speed Protocol" desc="AI-optimized zero-latency routing."/>
                  </Reveal>
                  <Reveal delay={0.4}>
                      <ValueCard num="04" icon={<Database size={28}/>} title="Data Integrity" desc="Transparent digital tracking ledgers."/>
                  </Reveal>
              </div>
          </div>
      </section>

      {/* Global Regulatory Infrastructure */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <Reveal>
                    <div className="space-y-10">
                        <div>
                            <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[9px] mb-4 block leading-none">Global Architecture</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-4">National Standards<br/>& Governance.</h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] leading-[2.2] tracking-widest max-w-xl italic">
                                Our network protocol adheres strictly to trade security laws (AEO), environmental guidelines (ISO 14001), and operational qualities (ISO 9001).
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ComplianceCard 
                                icon={<Award size={24} />}
                                title="ISO 9001 READY" 
                                text="Global quality management system (QMS) ensuring consistent service quality."
                            />
                            <ComplianceCard 
                                icon={<Shield size={24} />}
                                title="C-TPAT NODES" 
                                text="Customs-Trade Partnership verified hubs for accelerated border transitions."
                            />
                        </div>
                    </div>
                 </Reveal>
                 
                 <div className="relative">
                      <Reveal delay={0.3}>
                          <div className="grid grid-cols-2 gap-4">
                              {[
                                  { icon: <ShieldCheck size={32}/>, label: "STATE SECURE", bg: "bg-white", text: "text-slate-900" },
                                  { icon: <Globe size={32}/>, label: "AIR CORRIDORS", bg: "bg-slate-950", text: "text-white" },
                                  { icon: <Anchor size={32}/>, label: "MARITIME LOGS", bg: "bg-slate-50", text: "text-slate-900" },
                                  { icon: <Server size={32}/>, label: "TERMINAL DATA", bg: "bg-primary-main", text: "text-white" }
                              ].map((node, i) => (
                                  <div key={i} className={`p-8 rounded-[2rem] ${node.bg} ${node.text} border border-slate-100 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-all h-48 group hover:-translate-y-1`}>
                                      <div className={`mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>{node.icon}</div>
                                      <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100 transition-opacity">{node.label}</span>
                                  </div>
                              ))}
                          </div>
                      </Reveal>
                 </div>
             </div>
        </div>
      </section>

      {/* High-Fidelity Tactical CTA */}
      <section className="py-32 bg-slate-950 text-center px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-main/10 blur-[150px] rounded-full pointer-events-none" />
          
          <Reveal>
            <span className="text-primary-light font-black uppercase tracking-[0.6em] text-[9px] mb-8 block leading-none">Global Deployment Authority</span>
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none mb-10 drop-shadow-2xl">
                Deploy Your<br/>Asset Strategy.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={() => navigate('/contact')} className="bg-primary-main text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center justify-center gap-3 group">
                    Initialize Consultation <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <Link to="/service" className="bg-white/5 border border-white/10 backdrop-blur-xl text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-2xl">
                    Our Utility Protocols <Shield size={14} />
                </Link>
            </div>
            <p className="mt-12 text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">Tunshpresh Institutional Node v.4.0.2 // Established 2008</p>
            </Reveal>
      </section>
    </div>
  );
};

export default AboutPage;
