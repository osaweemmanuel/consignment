import React, { useState } from "react";
import { 
  Lock, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  Key,
  KeyRound,
  ShieldAlert,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useChangePasswordMutation } from "../../features/auth/userApiSlice";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(false);

  const [changePassword] = useChangePasswordMutation();

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
        showNotification("All security fields are required", "error");
        return;
    }
    setLoading(true);

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      showNotification("Security credentials successfully updated.");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      showNotification(error?.data?.message || "Failed to update credentials. Please verify current password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* PRIVACY & SECURITY HEADER */}
        <div className="p-10 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-slate-200 shadow-sm">
                    <Shield size={14} className="text-primary-main" /> Restricted Access Node
                </div>
                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">
                    Security <span className="text-primary-main">Credential</span> Update
                </h2>
                <p className="text-slate-500 font-medium text-base leading-relaxed">
                    Update your administrative account credentials. Maintaining strong security protocols is essential for global logistics integrity.
                </p>
            </div>
        </div>

        <div className="p-10 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-8">
                    <div className="space-y-3 group/input">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 flex items-center gap-2">
                            <Lock size={12} className="text-slate-300" />
                            Current Password
                        </label>
                        <div className="relative">
                            <input 
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full h-14 bg-slate-50 border border-slate-200 focus:border-primary-main rounded-2xl px-8 font-bold text-slate-700 outline-none transition-all text-xl focus:ring-4 focus:ring-primary-main/5 placeholder:text-slate-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3 group/input">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 flex items-center gap-2">
                            <KeyRound size={12} className="text-primary-main" />
                            New Administrative Password
                        </label>
                        <div className="relative">
                            <input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="w-full h-14 bg-slate-50 border border-slate-200 focus:border-primary-main rounded-2xl px-8 font-bold text-slate-700 outline-none transition-all text-xl focus:ring-4 focus:ring-primary-main/5 placeholder:text-slate-200"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
                    <ShieldAlert size={20} className="text-amber-500 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight italic">
                        Warning: Updating your password will terminate all active administrative session clones across secondary network nodes.
                    </p>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                        {loading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            <span>Update Security Node</span>
                            <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-primary-main transition-colors">
                                <ArrowRight size={16} />
                            </div>
                          </>
                        )}
                    </button>
                    <p className="text-center mt-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">Verified Infrastructure Protection Active</p>
                </div>
            </form>
        </div>
      </div>

      {notification.show && (
        <div className={`fixed bottom-10 right-10 z-[100] p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up border ${
            notification.type === "success" ? "bg-slate-900 text-white border-white/10" : "bg-red-600 text-white border-red-500"
        }`}>
            {notification.type === "success" ? <CheckCircle className="text-primary-light" size={18} /> : <AlertCircle size={18} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification({ show: false })} className="ml-4 opacity-50 hover:opacity-100"><X size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
