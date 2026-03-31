import React, { useEffect, useState } from "react";
import { 
  Wallet as WalletIcon, 
  QrCode, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  Copy,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Settings,
  CreditCard,
  Building,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useCreateWalletMutation } from "../../features/wallet/walletApiSlice";
import { setWalletId } from "../../features/wallet/walletSlice";
import { useSelector, useDispatch } from "react-redux";

const Wallet = () => {
  const [walletUpdate, { isLoading }] = useCreateWalletMutation();
  const dispatch = useDispatch();
  const walletId = useSelector((state) => state.wallet.walletId); 

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const encodedWalletId = encodeURIComponent(walletId);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodedWalletId}&size=300x300`);
  }, [walletId]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  const handleWalletIdChange = (e) => {
    dispatch(setWalletId(e.target.value));
  };

  const handleUpdateWalletId = async () => {
    try {
      await walletUpdate({ walletId }).unwrap();
      showNotification("Payment gateway successfully reconfigured.");
    } catch (error) {
      showNotification(error.data?.message || "Reconfiguration failed. Please check network uplink.", "error");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletId);
    showNotification("Wallet address copied to clipboard.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in py-8">
        {/* EXECUTIVE SETTLEMENT HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-primary-main/5 text-primary-main rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-primary-main/10 shadow-sm">
                    <ShieldCheck size={14} /> Fiscal Security Protocol
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none">
                    Settlement <span className="text-primary-main">Gateway</span>
                </h2>
                <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                    Configure the global cryptocurrency settlement bridge. All shipping payments and administrative fees are routed through this high-security financial interface.
                </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none mb-1">Gateway Status</span>
                <span className="text-slate-700 font-bold text-xs uppercase tracking-tighter">Synchronized</span>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* GATEWAY QR VISUALIZATION */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-200 flex flex-col items-center space-y-10 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
                        <img 
                            src={qrCodeUrl} 
                            alt="Gateway QR" 
                            className="w-48 h-48 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                            <div className="px-4 py-1.5 bg-white rounded-full border border-slate-100 shadow-md flex items-center gap-2">
                                <QrCode size={12} className="text-primary-main" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Verification QR</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full space-y-4 relative z-10">
                        <div className="text-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Active Wallet Node</h4>
                            <div className="text-sm font-bold text-slate-700 break-all font-mono leading-relaxed px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                {walletId || "No Address Configured"}
                            </div>
                        </div>
                        
                        <button 
                          onClick={copyToClipboard}
                          className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 transition-all hover:shadow-md active:scale-[0.98] group"
                        >
                            <Copy size={14} className="group-hover:text-primary-main transition-colors" />
                            Copy Node Address
                        </button>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-start gap-4 shadow-sm shadow-emerald-500/5">
                    <ShieldCheck size={24} className="text-emerald-500 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                        This gateway uses 256-bit encryption for all financial handshakes across the logistics network.
                    </p>
                </div>
            </div>

            {/* GATEWAY CONFIGURATION NODE */}
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-slate-200 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-main/5 rounded-full blur-3xl group-hover:bg-primary-main/10 transition-colors pointer-events-none" />
                
                <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-slate-900 text-primary-light rounded-2xl shadow-lg border border-white/5">
                          <Settings size={26} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">Gateway Configuration</h4>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block opacity-70 italic">Infrastructure settings v8.4.1</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 flex items-center gap-2">
                            <CreditCard size={12} className="text-primary-main" />
                            Primary Settlement Address (BTC/USDT)
                        </label>
                        <div className="relative group/input">
                            <input 
                                value={walletId}
                                onChange={handleWalletIdChange}
                                placeholder="Enter public wallet address..."
                                className="w-full h-16 bg-slate-50 border border-slate-200 focus:border-primary-main rounded-2xl px-8 font-mono font-bold text-lg text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:ring-4 focus:ring-primary-main/5"
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 space-y-4 relative group/warning overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />
                        <div className="flex items-center gap-3 text-amber-700">
                            <ShieldAlert size={18} />
                            <span className="text-[11px] font-black uppercase tracking-widest leading-none">Critical Security Advisory</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-amber-800/70 italic">
                            Modifying the settlement gateway requires immediate synchronization across all regional dispatch hubs. Ensure the address is accurate to prevent protocol divergence or transaction loss.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-14">
                    <button 
                        onClick={handleUpdateWalletId}
                        disabled={isLoading}
                        className="w-full py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 group overflow-hidden"
                    >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            <span>Apply Changes</span>
                            <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-primary-main transition-colors">
                                <ArrowRight size={16} />
                            </div>
                          </>
                        )}
                    </button>
                    <p className="text-center mt-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-60">Authorized Personal Only • Enterprise Security Level 4</p>
                </div>
            </div>
        </div>

        {/* NOTIFICATION LAYER */}
        {notification.show && (
            <div className={`fixed bottom-10 right-10 z-[100] p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up border ${
                notification.type === 'success' ? 'bg-slate-900 text-white border-white/10' : 'bg-red-600 text-white border-red-500'
            }`}>
                {notification.type === 'success' ? <CheckCircle className="text-primary-light" size={18} /> : <AlertCircle size={18} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
                <button onClick={() => setNotification({ show: false })} className="ml-4 opacity-50 hover:opacity-100"><X size={14} /></button>
            </div>
        )}
    </div>
  );
}

export default Wallet;
