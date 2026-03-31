import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  Briefcase,
  Terminal,
  Activity,
  Globe,
  Database,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/userApiSlice";
import Logo from '../Logo';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!firstname || !lastname || !gender || !email || !password || !confirmPassword) {
            setErrorMessage("All operational fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Security key synchronization failed—Keys do not match.");
            return;
        }

        try {
            await register({ firstname, lastname, gender, email, password }).unwrap();
            setSuccessMessage("Operational credentials provisioned successfully.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setErrorMessage(err?.data?.message || "Credential provisioning failed.");
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-primary-main selection:text-white">
            {/* Visual Command Side (Institutional Identity) */}
            <div className="hidden lg:flex lg:w-5/12 bg-primary-main relative flex-col justify-center p-20 overflow-hidden border-r border-white/10">
                {/* High-End Background Effects */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-white/5 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-accent-main/10 rounded-full blur-[130px] pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <Link to="/" className="inline-block hover:scale-110 transition-transform duration-500 mb-12">
                        <Logo size="lg" textClass="text-white font-black" iconColor="#ffffff" accentColor="#FF6600" />
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8 italic drop-shadow-2xl">
                        Agent<br/>Provisioning<br/><span className="text-accent-main">Protocol.</span>
                    </h1>
                    <p className="text-base text-white/70 font-bold leading-relaxed max-w-sm mb-12 uppercase tracking-tight italic">
                        Initialize your secure agent identity within the Tunshpresh Global operational network. 
                    </p>
                    
                    <div className="space-y-6">
                        {[
                          { text: "Operational Ledger Access", icon: <Database size={13} /> },
                          { text: "Cross-Border Command", icon: <Globe size={13} /> },
                          { text: "Encrypted Transaction Logs", icon: <Terminal size={13} /> }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-5 group">
                             <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-accent-main border border-white/10 group-hover:bg-accent-main group-hover:text-white transition-all transform group-hover:rotate-6">
                                {item.icon}
                             </div>
                             <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] group-hover:text-white transition-colors">{item.text}</span>
                          </div>
                        ))}
                    </div>
                </motion.div>

                {/* Industrial Base Metadata */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-white/10 font-black text-[8px] tracking-[0.6em] uppercase italic">
                    <span className="flex items-center gap-3"><Activity size={10} /> ONBOARDING NODE 04</span>
                    <span>RESTRICTED ACCESS ONLY</span>
                </div>
            </div>

            {/* Registration Form Terminal */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 bg-white relative overflow-y-auto">
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2.5 text-slate-400 hover:text-primary-main transition-all font-black text-[9px] uppercase tracking-[0.3em] group bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg z-20">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" /> TERMINAL EXIT
                </Link>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full py-20 lg:py-0"
                >
                  <div className="bg-white p-8 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-xl lg:shadow-none border border-slate-100 lg:border-0 relative">
                     <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-main text-white rounded-[1.5rem] mb-6 shadow-2xl group overflow-hidden">
                             <div className="absolute inset-0 bg-accent-main opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <UserPlus className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h2 className="text-3xl font-black text-primary-main uppercase tracking-tighter italic mb-3">Agent Registration</h2>
                        <p className="text-slate-400 text-[9px] uppercase tracking-[0.3em] font-black">Create your secure agent identity within the network.</p>
                     </div>

                     <AnimatePresence>
                        {(successMessage || errorMessage) && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mb-8 p-5 rounded-2xl flex items-center gap-5 border shadow-sm ${
                                    successMessage ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${successMessage ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {successMessage ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                </div>
                                <p className="font-black text-[9px] uppercase tracking-widest leading-relaxed">{successMessage || errorMessage}</p>
                            </motion.div>
                        )}
                     </AnimatePresence>

                     <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2.5">
                              <label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic">First Name</label>
                              <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-slate-300 group-focus-within:bg-primary-main group-focus-within:text-white transition-all duration-500">
                                    <User size={16} />
                                </div>
                                <input 
                                  type="text" 
                                  value={firstname}
                                  onChange={(e) => setFirstname(e.target.value)}
                                  placeholder="IDENTIFIER"
                                  className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main focus:bg-white rounded-2xl pl-16 pr-6 font-black text-slate-950 text-xs uppercase tracking-[0.05em] outline-none transition-all placeholder:text-slate-300 placeholder:italic"
                                  required
                                />
                              </div>
                           </div>
                           <div className="space-y-2.5">
                              <label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic">Last Name</label>
                              <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-slate-300 group-focus-within:bg-primary-main group-focus-within:text-white transition-all duration-500">
                                    <Users size={16} />
                                </div>
                                <input 
                                  type="text" 
                                  value={lastname}
                                  onChange={(e) => setLastname(e.target.value)}
                                  placeholder="METADATA"
                                  className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main focus:bg-white rounded-2xl pl-16 pr-6 font-black text-slate-950 text-xs uppercase tracking-[0.05em] outline-none transition-all placeholder:text-slate-300 placeholder:italic"
                                  required
                                />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-slate-300 group-focus-within:bg-primary-main group-focus-within:text-white transition-all duration-500">
                                    <Mail size={16} />
                                </div>
                                <input 
                                  type="email" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="AGENT@TUNSHPRESH.CORP"
                                  className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main focus:bg-white rounded-2xl pl-16 pr-6 font-black text-slate-950 text-xs uppercase tracking-[0.05em] outline-none transition-all placeholder:text-slate-300 placeholder:italic"
                                  required
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                           <label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic">Gender Selection</label>
                           <div className="relative">
                               <select 
                                 value={gender} 
                                 onChange={(e) => setGender(e.target.value)}
                                 className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main rounded-2xl px-6 font-black text-slate-950 text-xs uppercase tracking-[0.2em] outline-none transition-all appearance-none cursor-pointer"
                                 required
                               >
                                  <option value="" disabled>SELECT GENDER</option>
                                  <option value="male">MALE</option>
                                  <option value="female">FEMALE</option>
                               </select>
                               <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <ArrowRight size={14} className="rotate-90" />
                                </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2.5">
                              <label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic">Account Password</label>
                              <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main focus:bg-white rounded-2xl px-6 font-black text-slate-950 text-xs tracking-[0.3em] outline-none transition-all placeholder:text-slate-300"
                                required
                              />
                           </div>
                           <div className="space-y-2.5">
                              <label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic">Confirm Passkey</label>
                              <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main focus:bg-white rounded-2xl px-6 font-black text-slate-950 text-xs tracking-[0.3em] outline-none transition-all placeholder:text-slate-300"
                                required
                              />
                           </div>
                        </div>

                        {/* Security Notice Removed */}

                        <button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full h-16 bg-accent-main hover:bg-accent-hover text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50 mt-8"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span>Create Agent Identity</span>
                              <CheckCircle size={18} className="transition-transform group-hover:scale-125" />
                            </>
                          )}
                        </button>

                        <div className="text-center pt-4">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                                Already Provisioned? <Link to="/login" className="text-primary-main hover:text-primary-dark transition-colors underline decoration-2 underline-offset-8 ml-1.5">Login Terminal</Link>
                           </p>
                        </div>
                     </form>
                  </div>
               </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
