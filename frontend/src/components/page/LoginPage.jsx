import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  Terminal,
  Activity,
  Globe,
  Database,
  BarChart3,
  Shield
} from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/auth/userApiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import Logo from '../Logo';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const userInfo = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        if (userInfo) navigate("/admin/dashboard");
    }, [navigate, userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");
        try {
            const resp = await login({ email, password }).unwrap();
            dispatch(setCredentials({ 
               userInfo: resp.userInfo || resp.user,
               token: resp.token,
               refreshToken: resp.refreshToken
            }));
            navigate("/admin/dashboard");
        } catch (err) {
            const message = err?.data?.message || "Invalid authentication credentials.";
            setGeneralError(message);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-primary-main selection:text-white">
            {/* Visual Command Side (Flagship Terminal Visual) */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary-main relative flex-col justify-center p-20 overflow-hidden border-r border-white/10">
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
                        Universal<br/>Ops <span className="text-accent-main">Terminal.</span>
                    </h1>
                    <p className="text-base text-white/70 font-bold leading-relaxed max-w-lg mb-12 uppercase tracking-tight italic">
                        Manage international freight, settlements, and customs corridors with absolute industrial precision.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-10 items-center max-w-md mb-16">
                        <div className="space-y-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">SYSTEM LINK</p>
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                <span className="text-base font-black text-white italic tracking-tighter uppercase">ESTABLISHED</span>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">CURRENT LOAD</p>
                            <div className="flex items-center gap-2.5">
                                <BarChart3 className="text-accent-main" size={18} />
                                <span className="text-base font-black text-white italic tracking-tighter uppercase">98.2% EFF</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-10 items-center py-6 border-t border-white/10">
                        <div className="flex items-center gap-3.5 group">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10 group-hover:bg-accent-main transition-colors">
                                <Globe size={16} />
                            </div>
                            <div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-white/40">Global Radius</h4>
                                <p className="text-[13px] font-black tracking-tight italic text-white uppercase">154 NODES</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5 group">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10 group-hover:bg-accent-main transition-colors">
                                <Shield size={16} />
                            </div>
                            <div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-white/40">Security Layer</h4>
                                <p className="text-[13px] font-black tracking-tight italic text-white uppercase">AES-256 BIT</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Industrial Base Metadata */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-white/10 font-black text-[8px] tracking-[0.6em] uppercase italic">
                    <span className="flex items-center gap-3"><Terminal size={10} /> ARCHITECTURE V4.0.2</span>
                    <span>ACTIVE CORRIDOR ACCESS REQUEST</span>
                </div>
            </div>

            {/* Auth Component Side */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-blue-50 md:bg-white relative">
                
                {/* Back Link Terminal */}
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2.5 text-slate-400 hover:text-primary-main transition-all font-black text-[9px] uppercase tracking-[0.3em] group bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" /> TERMINAL EXIT
                </Link>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full py-20 lg:py-0"
                >
                    <div className="bg-white p-8 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-xl lg:shadow-none border border-slate-100 lg:border-0 relative">
                        {/* Mobile Brand Identifier */}
                        <div className="lg:hidden flex justify-center mb-10">
                            <Link to="/">
                                <Logo size="md" className="hover:scale-110 transition-transform duration-500" />
                            </Link>
                        </div>

                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-main text-white rounded-[1.75rem] mb-6 shadow-2xl relative group overflow-hidden">
                                <div className="absolute inset-0 bg-accent-main opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <ShieldCheck className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h2 className="text-3xl font-black text-primary-main uppercase tracking-tighter italic mb-3">Agent Login</h2>
                            <p className="text-slate-400 text-[9px] uppercase tracking-[0.3em] font-black">Secure node authentication required.</p>
                        </div>

                        {generalError && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[9px] font-black uppercase tracking-widest text-center shadow-sm"
                            >
                                {generalError}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-slate-300 group-focus-within:bg-primary-main group-focus-within:text-white transition-all duration-500">
                                        <Mail size={16} />
                                    </div>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="AGENT@TUNSHPRESH.CORP"
                                        className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main focus:bg-white rounded-2xl pl-16 pr-6 font-black text-slate-950 text-[11px] uppercase tracking-[0.1em] outline-none transition-all placeholder:text-slate-300 placeholder:italic placeholder:font-bold focus:ring-4 focus:ring-primary-main/5 group-hover:border-slate-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">Account Password</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-slate-300 group-focus-within:bg-primary-main group-focus-within:text-white transition-all duration-500">
                                        <Lock size={16} />
                                    </div>
                                    <input 
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full h-14 bg-blue-50 border border-slate-100 focus:border-primary-main focus:bg-white rounded-2xl pl-16 pr-14 font-black text-slate-950 text-xs tracking-[0.3em] outline-none transition-all placeholder:text-slate-300 focus:ring-4 focus:ring-primary-main/5 group-hover:border-slate-300"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-primary-main transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 bg-accent-main hover:bg-accent-hover text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="relative z-10 italic">Login to Terminal</span>
                                            <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-2" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                                    New Network Agent? <Link to="/register" className="text-primary-main border-b-2 border-accent-main/30 hover:border-accent-main transition-all ml-1.5 pb-0.5">Request Credentials</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="mt-16 text-center lg:absolute lg:bottom-10 lg:left-0 lg:right-0">
                        <div className="inline-flex items-center gap-6 px-6 py-2.5 bg-blue-50 rounded-full border border-slate-100">
                            <div className="flex items-center gap-2">
                                <Activity size={10} className="text-primary-main" />
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Link Active</span>
                            </div>
                            <div className="w-px h-2.5 bg-slate-300" />
                            <div className="flex items-center gap-2">
                                <Database size={10} className="text-primary-main" />
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Node 12-B Sync</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
