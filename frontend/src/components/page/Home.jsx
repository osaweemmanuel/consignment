import React, { useState, useEffect } from 'react';
import { 
  Globe, ShieldCheck, Truck, ArrowRight, Package, Clock, CheckCircle2,
  Stethoscope, ShoppingBag, Laptop, Car, Star, Quote, Activity, 
  MapPin, Shield, Zap, Database, BarChart3, Users, Anchor, Server
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomeSlider from '../HomeSlider';
import Reveal from '../Reveal';

const FeatureCard = ({ icon, title, desc, num }) => (
  <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-primary-main/5 transition-colors duration-500" />
    <div className="relative z-10 font-black text-slate-100 text-3xl mb-6 group-hover:text-primary-main/20 transition-colors uppercase italic">{num}</div>
    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-xl group-hover:bg-primary-main transition-all duration-500 transform group-hover:rotate-6">
      {icon}
    </div>
    <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight uppercase italic leading-none">{title}</h3>
    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6 flex-grow">{desc}</p>
    <div className="pt-5 border-t border-slate-50 flex items-center gap-2 text-primary-main font-black text-[9px] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        Review Protocol <ArrowRight size={10} />
    </div>
  </div>
);

const IndustryCard = ({ icon, title, desc }) => (
  <div className="relative flex flex-col p-8 bg-slate-900 border border-slate-800 rounded-[2rem] hover:border-primary-main transition-all duration-500 group h-full cursor-pointer hover:-translate-y-2">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="text-primary-light mb-6 p-3.5 bg-white/5 rounded-2xl w-fit group-hover:bg-primary-main/20 transition-all duration-500 group-hover:scale-110">
      {icon}
    </div>
    <h4 className="font-black text-white text-base tracking-tight uppercase italic mb-2">{title}</h4>
    <p className="text-slate-400 text-[11px] leading-relaxed font-medium mb-4">{desc}</p>
    <div className="mt-auto flex items-center gap-2 text-primary-light text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
        Operational Link <ArrowRight size={10} />
    </div>
  </div>
);

const testimonialsData = [
    {
        quote: "Tunshpresh Global completely revolutionized our European supply chain. Their API integration saved us hundreds of hours, and their delivery times are unmatched.",
        name: "SARAH JENKINS",
        company: "SUPPLY CHAIN DIRECTOR, TECHNOVA",
        avatar: "SJ"
    },
    {
        quote: "When dealing with medical supplies, there is zero room for error. The temperature-controlled shipping and real-time alerts ensure our cargo is always safe.",
        name: "DR. MICHAEL CHANG",
        company: "OPERATIONS, BIOHEALTH INC",
        avatar: "MC"
    },
    {
        quote: "Exceptional customer service. We had a massive customs hurdle in Southeast Asia and their local experts cleared our cargo within 24 hours. Phenomenal.",
        name: "ELENA ROSSI",
        company: "CEO, ROSSI FASHION GROUP",
        avatar: "ER"
    },
    {
        quote: "The transparency and precise logistics execution have fundamentally upgraded how we fulfill international orders. Absolute 10/10 service.",
        name: "JAMES ASHFORD",
        company: "HEAD OF LOGISTICS, GLOBAL RETAIL",
        avatar: "JA"
    }
];

const TestimonialSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-6xl mx-auto min-h-[480px] md:min-h-[400px] flex items-center justify-center overflow-hidden mb-12">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute w-full px-4"
                >
                    <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-16 text-center shadow-2xl relative max-w-4xl mx-auto overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-main to-primary-light" />
                        <Quote className="absolute top-8 left-8 w-16 h-16 text-slate-100/50" />
                        <Quote className="absolute bottom-8 right-8 w-16 h-16 text-slate-100/50 rotate-180" />
                        
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                        </div>
                        
                        <p className="text-lg md:text-2xl text-slate-900 italic leading-relaxed md:leading-snug mb-10 font-black tracking-tight uppercase">
                            "{testimonialsData[currentIndex].quote}"
                        </p>
                        
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-slate-950 text-white flex items-center justify-center rounded-xl font-black shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 text-xs">
                                {testimonialsData[currentIndex].avatar}
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 text-base italic tracking-tight uppercase leading-none">{testimonialsData[currentIndex].name}</h5>
                                <p className="text-primary-main text-[9px] uppercase font-black tracking-[0.3em] mt-1.5">{testimonialsData[currentIndex].company}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Premium Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {testimonialsData.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-700 rounded-full h-1.5 ${currentIndex === idx ? 'w-12 bg-primary-main' : 'w-3 bg-slate-200 hover:bg-slate-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const HomePage = () => {
    const [trackingNumber, setTrackingNumber] = useState("");
    const navigate = useNavigate();

    const handleTrack = () => {
        if (trackingNumber.trim()) navigate(`/parcels/${trackingNumber}`);
    };

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-primary-main selection:text-white">
            <HomeSlider 
                trackingNumber={trackingNumber}
                setTrackingNumber={setTrackingNumber}
                handleTrack={handleTrack}
            />

            {/* Tactical Vision / Core Strategy */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-end mb-20">
                  <div className="lg:w-2/3">
                    <Reveal>
                        <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[9px] mb-4 block leading-none">Global Infrastructure Layer</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                            Next-Generation<br/>Logistics Hub.
                        </h2>
                    </Reveal>
                  </div>
                  <div className="lg:w-1/3">
                    <Reveal delay={0.2}>
                      <p className="text-slate-500 font-bold leading-relaxed text-xs mb-6 uppercase tracking-tight">
                        Deploying advanced algorithmic routing and real-time sensor telematics to ensure your consignment remains secure across every global transition node.
                      </p>
                      <button onClick={() => navigate('/service')} className="group flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-widest border-b-2 border-slate-900 pb-2 hover:text-primary-main hover:border-primary-main transition-all">
                        Expore Framework <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                      </button>
                    </Reveal>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Reveal delay={0.1}>
                      <FeatureCard 
                          num="01"
                          icon={<Globe className="w-6 h-6" />} 
                          title="Global Hub Range" 
                          desc="Instant access to over 150+ international maritime and air terminals. We provide automated induction protocols and streamlined customs entry for every state border."
                      />
                    </Reveal>
                    <Reveal delay={0.2}>
                      <FeatureCard 
                          num="02"
                          icon={<ShieldCheck className="w-6 h-6" />} 
                          title="Asset Integrity" 
                          desc="Industrial-grade consignment shielding. Every asset is monitored by a multi-layered sensor matrix, providing absolute transparency from induction to final terminal handover."
                      />
                    </Reveal>
                    <Reveal delay={0.3}>
                      <FeatureCard 
                          num="03"
                          icon={<Clock className="w-6 h-6" />} 
                          title="Temporal Fidelity" 
                          desc="Synchronized express transit windows. Our AI engines optimize routing in real-time to avoid congestion nodes and ensure your mission-critical delivery arrives on schedule."
                      />
                    </Reveal>
                </div>
            </section>

            {/* Cinema Tech Infrastructure */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-main/10 blur-[130px] rounded-full pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                          <Reveal>
                              <span className="text-primary-light font-black uppercase tracking-[0.4em] text-[10px] mb-6 block leading-none">The Operational Edge</span>
                              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">
                                Real-Time<br/>Consignment<br/>Telematics.
                              </h2>
                              <p className="text-base text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-xl">
                                We don't just ship boxes; we move structured data. Every consignment is an active node in our global telemetry ecosystem, providing immutable proof of transit.
                              </p>
                              <div className="grid grid-cols-2 gap-5 my-10">
                                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-primary-main/50 transition-colors group">
                                      <Activity className="text-primary-light mb-3 w-8 h-8 group-hover:scale-110 transition-transform" />
                                      <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Live Telemetry</h4>
                                      <p className="text-slate-500 text-[9px] font-bold uppercase leading-relaxed">Continuous sensor synchronization across the entire transit journey.</p>
                                  </div>
                                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-primary-main/50 transition-colors group">
                                      <Database className="text-primary-light mb-3 w-8 h-8 group-hover:scale-110 transition-transform" />
                                      <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Immutability</h4>
                                      <p className="text-slate-500 text-[9px] font-bold uppercase leading-relaxed">Historical transition data stored on secured, cryptographic ledgers.</p>
                                  </div>
                              </div>
                              <button onClick={() => navigate('/about')} className="bg-white text-slate-950 px-10 py-4.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-light hover:text-white transition-all shadow-2xl flex items-center gap-3 group">
                                Discover Institutional Core <Zap size={14} className="group-hover:animate-pulse" />
                              </button>
                          </Reveal>
                        </div>
                        
                        <div className="relative">
                            <Reveal delay={0.4}>
                                <div className="p-3 bg-white/5 rounded-[3.5rem] border border-white/10 backdrop-blur-sm group hover:border-primary-main/50 transition-all duration-700 shadow-2xl">
                                    <div className="absolute inset-0 bg-primary-main/5 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <img 
                                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80" 
                                        alt="Secure Data Infrastructure" 
                                        className="rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-1000 w-full h-[520px] object-cover"
                                    />
                                    <div className="absolute -bottom-8 -left-8 p-10 bg-slate-900 border-4 border-slate-950 rounded-[2.5rem] shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 pointer-events-none">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-10 h-10 bg-primary-main/20 rounded-xl flex items-center justify-center">
                                                <Server size={20} className="text-primary-light" />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-black text-white leading-none">99.9%</div>
                                                <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Uptime Index</div>
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-main w-[99.9%]" />
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industrial Verticals Matrix */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <Reveal>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-5">
                      <div>
                        <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[9px] mb-4 block leading-none">Specialized Logistics Operations</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                            Industries<br/>We Empower.
                        </h2>
                      </div>
                      <div className="md:text-right">
                         <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic max-w-md ml-auto leading-relaxed">
                            We deploy dedicated protocols for sensitive industrial requirements, ensuring regulatory compliance and asset security in every sector.
                         </p>
                      </div>
                    </div>
                </Reveal>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Reveal delay={0.1}>
                      <IndustryCard 
                        icon={<Stethoscope size={24} />} 
                        title="Bioscience" 
                        desc="Advanced temperature-controlled transport for surgical equipment and sensitive biological assets."
                      />
                    </Reveal>
                    <Reveal delay={0.2}>
                      <IndustryCard 
                        icon={<ShoppingBag size={24} />} 
                        title="Tactical Retail" 
                        desc="Scalable high-velocity distribution models for international e-commerce and retail inventory."
                      />
                    </Reveal>
                    <Reveal delay={0.3}>
                      <IndustryCard 
                        icon={<Laptop size={24} />} 
                        title="Digital Hardware" 
                        desc="Electrostatic-protected and vibration-shielded transport for high-value server clusters."
                      />
                    </Reveal>
                    <Reveal delay={0.4}>
                      <IndustryCard 
                        icon={<Car size={24} />} 
                        title="Automotive Core" 
                        desc="Just-in-time logistics for manufacturing lines, ensuring zero-latency parts delivery."
                      />
                    </Reveal>
                </div>
            </section>

            {/* Institutional Authority Hub */}
            <section className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-main/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">
                        <div className="lg:col-span-1 space-y-8">
                            <Reveal>
                                <div className="p-4 bg-slate-900 rounded-2xl w-fit shadow-2xl">
                                    <Users className="text-white w-10 h-10" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mt-8">
                                    Authorized<br/>By Global<br/>Excellence.
                                </h3>
                                <p className="text-slate-500 font-bold text-xs uppercase leading-relaxed tracking-tight max-w-sm">
                                    Our platform acts as the trusted architectural layer for thousands of global entities, from medical labs to tech giants.
                                </p>
                                <div className="flex items-center gap-10 pt-4">
                                    <div>
                                        <div className="text-3xl font-black text-slate-900 mb-1 leading-none italic">5M+</div>
                                        <div className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] whitespace-nowrap">Assets Dispatched</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-200" />
                                    <div>
                                        <div className="text-3xl font-black text-slate-900 mb-1 leading-none italic">154+</div>
                                        <div className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] whitespace-nowrap">Active Nodes</div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                        <div className="lg:col-span-2">
                             <TestimonialSlider />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Operational Command */}
            <section className="py-32 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-5 pointer-events-none" />
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-main/20 blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-main/50 to-transparent" />
                
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <Reveal>
                        <span className="text-primary-light font-black uppercase tracking-[0.5em] text-[9px] mb-8 block leading-none">Security Protocol: Final Induction</span>
                        <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none mb-10 drop-shadow-2xl">
                            Secure Your<br/>Global Assets.
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button onClick={() => navigate('/contact')} className="bg-primary-main text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                Initialize Partnership <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                            </button>
                            <button onClick={() => navigate('/login')} className="bg-white/5 border border-white/10 backdrop-blur-xl text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-2xl">
                                Secure Terminal Login <Shield size={16} className="text-primary-light" />
                            </button>
                        </div>
                        <p className="mt-10 text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Integrated Logistics Environment v4.0.2 // Node: Active</p>
                    </Reveal>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
