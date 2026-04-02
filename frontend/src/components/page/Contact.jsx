import React from 'react';
import { 
  Phone, Mail, MapPin, Send, Globe, Shield, Terminal, ArrowRight, Activity, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../Reveal';

const ContactInfo = ({ icon, title, details, sub }) => (
  <div className="flex items-start gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-primary-main/50 transition-all group">
    <div className="w-12 h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-xl group-hover:bg-primary-main group-hover:text-white transition-all transform group-hover:rotate-6">
      {icon}
    </div>
    <div>
      <span className="text-primary-light text-[8px] font-black uppercase tracking-[0.4em] mb-1 block leading-none">{sub}</span>
      <h3 className="text-base font-black text-white mb-1.5 uppercase tracking-tighter italic leading-none">{title}</h3>
      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-relaxed whitespace-pre-line opacity-70 group-hover:opacity-100 transition-opacity">{details}</p>
    </div>
  </div>
);

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
     firstName: '',
     lastName: '',
     email: '',
     inquiryType: 'General Information',
     message: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [status, setStatus] = React.useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://plankton-app-tr2ek.ondigitalocean.app'}/api/v1/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            setStatus({ type: 'success', message: 'TRANSMISSION VERIFIED. AGENT WILL CONTACT YOU SHORTLY.' });
            setFormData({ firstName: '', lastName: '', email: '', inquiryType: 'General Information', message: '' });
        } else {
            setStatus({ type: 'error', message: data.message || 'HANDSHAKE FAILED.' });
        }
    } catch (err) {
        setStatus({ type: 'error', message: 'NETWORK NODE DISCONNECT.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* High-Fidelity Cinematic Header */}
      <section className="relative pt-40 pb-32 bg-slate-950 overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=2000&q=80')] opacity-20 object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-10">
          <Reveal>
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse shadow-lg shadow-primary-light/50" />
                <span className="text-primary-light font-black uppercase tracking-[0.4em] text-[8px]">Communication Terminal Active</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                Global Outreach<br/><span className="text-primary-main">Command.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-200/60 max-w-2xl mx-auto font-bold italic uppercase tracking-tight leading-relaxed">
                Connect with our specialists for rapid logistics advisory, customs navigation, and strategic asset security consultation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Global Command Infrastructure Matrix */}
      <section className="py-24 bg-white relative z-20 -mt-16">
          <div className="max-w-7xl mx-auto px-6">
              <Reveal>
                  <div className="text-center mb-16">
                      <span className="text-primary-main font-black uppercase tracking-[0.4em] text-[10px] mb-4 block leading-none">Global Infrastructure Hubs</span>
                      <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-6">Regional Command Centers</h2>
                      <p className="text-slate-500 font-bold uppercase text-[9px] max-w-xl mx-auto tracking-[0.3em] leading-relaxed italic opacity-70">Physical operational headquarters facilitating rapid routing and customs oversight across all major continents.</p>
                  </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                      { region: "North America", hq: "New York Hub", address: "1 World Trade Center\nNew York, NY 10007, USA", phone: "+1 (800) 555-0199", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80" },
                      { region: "Europe Hub", hq: "London Terminal", address: "Canary Wharf, 25 Bank Street\nLondon E14 5JP, UK", phone: "+44 20 7946 0958", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=80" },
                      { region: "Asia Pacific", hq: "Tokyo Core", address: "Roppongi Hills Mori Tower\nTokyo 106-6108, Japan", phone: "+81 3-5555-0199", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80" },
                      { region: "Middle East", hq: "Dubai Transit", address: "Emirates Towers, Sheikh Zayed Rd\nDubai, United Arab Emirates", phone: "+971 4 555 0199", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=500&q=80" }
                  ].map((node, idx) => (
                      <div key={idx} className="group rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2">
                          <div className="h-48 overflow-hidden relative">
                              <img src={node.img} alt={node.hq} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-all" />
                              <div className="absolute bottom-4 left-6 text-white">
                                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary-light mb-1">{node.region}</div>
                                  <div className="text-xl font-black uppercase tracking-tighter italic leading-none">{node.hq}</div>
                              </div>
                          </div>
                          <div className="p-8 space-y-4">
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest whitespace-pre-line leading-[1.8]">{node.address}</p>
                              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{node.phone}</span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Main Communication Interface */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
            
            {/* Information Side Panel */}
            <div className="lg:w-2/5 p-12 md:p-14 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-10">
                <div>
                   <span className="text-primary-light font-black uppercase tracking-[0.4em] text-[9px] mb-3 block leading-none">Outreach Interface</span>
                   <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-8">Initialize<br/>Direct Uplink.</h2>
                </div>
                
                <div className="space-y-4">
                  <ContactInfo 
                    sub="ESTABLISHED HEADQUARTERS"
                    icon={<MapPin className="w-5 h-5" />}
                    title="London Command"
                    details={`Canary Wharf, 25 Bank Street\nLondon E14 5JP, UK`}
                  />
                  <ContactInfo 
                    sub="VOICE ENCRYPTION"
                    icon={<Phone className="w-5 h-5" />}
                    title="Priority Support"
                    details={`+44 (0) 20 7946 0958\nMonitoring Hours: 24/7`}
                  />
                  <ContactInfo 
                    sub="DIGITAL LEDGER"
                    icon={<Mail className="w-5 h-5" />}
                    title="Encrypted Inquiry"
                    details={`support@tunsphresh.com\nResponse Latency: < 2h`}
                  />
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-4 py-3 px-6 bg-white/5 rounded-xl border border-white/10 group hover:border-primary-main/50 transition-all cursor-pointer">
                    <Activity className="text-emerald-500 animate-pulse" size={16} />
                    <div>
                        <span className="block text-[7px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">NETWORK STATUS</span>
                        <span className="block text-[10px] font-black text-white uppercase tracking-widest leading-none">100% OPERATIONAL NODE</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Tactical Form Panel */}
            <div className="lg:w-3/5 p-12 md:p-16 bg-white">
               <Reveal>
                 <div className="mb-10">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-3">Transmission Sequence</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] leading-relaxed">Please authenticate your inquiry via the secure terminal below.</p>
                 </div>
                 
                 {status.message && (
                    <div className={`mb-8 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border ${
                      status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        {status.message}
                    </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 leading-none">First Identity</label>
                            <input 
                              type="text" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="e.g. MARCUS"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-primary-main rounded-xl px-5 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all uppercase placeholder:opacity-30"
                              required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 leading-none">Last Identity</label>
                            <input 
                              type="text" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="e.g. VANCE"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-primary-main rounded-xl px-5 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all uppercase placeholder:opacity-30"
                              required
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 leading-none">Digital Gateway (Email)</label>
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="VANCE@GXP-LOGISTICS.COM"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-primary-main rounded-xl px-5 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all uppercase placeholder:opacity-30"
                              required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 leading-none">Inquiry Protocol</label>
                            <select 
                              name="inquiryType"
                              value={formData.inquiryType}
                              onChange={handleChange}
                              className="w-full bg-slate-50 border border-slate-100 focus:border-primary-main rounded-xl px-5 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all uppercase"
                            >
                                <option>General Information</option>
                                <option>Logistics Strategy</option>
                                <option>Asset Insurance Hub</option>
                                <option>Customs Navigation</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 leading-none">Cryptographic Message Body</label>
                        <textarea 
                          rows="4"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="INITIALIZING MESSAGE BUFFER..."
                          className="w-full bg-slate-50 border border-slate-100 focus:border-primary-main rounded-2xl p-6 text-xs font-bold text-slate-800 outline-none transition-all resize-none uppercase placeholder:opacity-30"
                          required
                        ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-slate-950 text-white w-full px-10 py-5 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 mt-6 shadow-xl hover:bg-primary-main hover:-translate-y-1 active:scale-95 group disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <Activity className="animate-spin" size={14} /> INITIALIZING...
                            </div>
                        ) : (
                            <>
                                <span>Initialize Transmission</span> <Send size={14} className="group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 opacity-30 pt-4">
                        <Shield size={10} />
                        <span className="text-[7px] font-black uppercase tracking-[0.5em]">256-Bit Socket Encryption Active</span>
                    </div>
                 </form>
               </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Outreach CTA */}
      <section className="py-32 bg-white text-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-100" />
          <Reveal>
            <span className="text-primary-main font-black uppercase tracking-[0.6em] text-[9px] mb-8 block leading-none">Operational Support Hub</span>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-12">
                Connected To<br/>Every Node.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={() => navigate('/')} className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-main transition-all shadow-xl flex items-center justify-center gap-3 group">
                    <Globe size={14} /> Global Hub Command
                </button>
            </div>
            </Reveal>
      </section>
    </div>
  );
};

export default ContactPage;
