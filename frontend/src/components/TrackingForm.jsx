import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2, AlertCircle, ShieldCheck, ArrowRight, Activity, Globe } from 'lucide-react';
import { useGetParcelQuery } from '../features/parcel/parcelApiSlice';

const TrackingForm = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useGetParcelQuery(trackingNumber, {
    skip: !isSubmitting || !trackingNumber, 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!trackingNumber) {
      setErrorMessage("Please enter a valid Electronic Parcel ID (EPID)");
      return;
    }

    setIsSubmitting(true);
  };

  useEffect(() => {
    if (data) {
      if (data.status === "impounded") {
        setErrorMessage("🚫 Protocol Alert: This consignment has been restricted for customs VAT clearance and duty reconciliation.");
        setIsSubmitting(false);
      } else {
        navigate(`/parcels/${trackingNumber}`);
      }
    } else if (!isLoading && isSubmitting && !data) {
      setErrorMessage("⚠️ Consignment Node Not Found. Please verify your Electronic Parcel ID.");
      setIsSubmitting(false);
    }
  }, [data, isLoading, isSubmitting, trackingNumber, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-6 relative z-10 -mt-24 py-12 animate-fade-in font-sans">
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-slate-200 relative overflow-hidden group">
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100">
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-primary-main/5 text-primary-main rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-primary-main/10">
                    <ShieldCheck size={14} /> Global Transit Protocol
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">
                    Trace <span className="text-primary-main">Shipment</span>
                </h2>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none mb-1">Tracking Status</span>
                <span className="text-slate-700 font-bold text-[11px] uppercase tracking-tighter">Live Core Active</span>
              </div>
            </div>
        </div>

        <p className="text-slate-500 font-medium mb-10 max-w-2xl text-lg leading-relaxed">
            Initialize a real-time deep-scan of our global logistics network. Enter your **Electronic Parcel ID (EPID)** to visualize your asset's current transit trajectory.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 relative group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-100 rounded-2xl text-slate-400 group-focus-within/input:bg-slate-900 group-focus-within/input:text-white transition-all shadow-sm">
                  <Globe size={20} className={isLoading ? "animate-spin-slow" : ""} />
                </div>
                <input 
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  placeholder="EX: TPS-A8JK-904"
                  disabled={isLoading}
                  className="w-full h-18 bg-slate-50 border-2 border-slate-50 focus:border-primary-main rounded-2xl pl-20 pr-8 font-mono font-bold text-xl text-slate-800 outline-none transition-all placeholder:text-slate-200 focus:ring-8 focus:ring-primary-main/5 shadow-inner"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-18 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden group/btn"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary-light" />
                ) : (
                  <>
                    <span>Initialize Trace</span>
                    <div className="p-1.5 bg-white/10 rounded-lg group-hover/btn:bg-primary-main transition-colors">
                        <ArrowRight size={18} />
                    </div>
                  </>
                )}
              </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-10 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 animate-slide-up relative overflow-hidden group/err">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500/50 group-hover/err:bg-rose-500 transition-all" />
            <AlertCircle size={22} className="text-rose-500 shrink-0 mt-0.5" />
            <p className="text-rose-900 font-bold leading-relaxed text-sm italic">{errorMessage}</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-3">
                 <ShieldCheck size={14} className="text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Secure Protocol</span>
             </div>
             <div className="flex items-center gap-3">
                 <Activity size={14} className="text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Telematics</span>
             </div>
             <div className="flex items-center gap-3">
                 <MapPin size={14} className="text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Global Geofence</span>
             </div>
             <div className="flex items-center gap-3">
                 <Search size={14} className="text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Deep-Scan Node</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingForm;
