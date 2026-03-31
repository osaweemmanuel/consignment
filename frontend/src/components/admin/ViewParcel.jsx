import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetParcelQuery } from '../../features/parcel/parcelApiSlice';
import MapComponent from '../MapComponent';
import AdjustableProgressBar from '../AdjustableProgressBar';
import { 
  ArrowLeft, 
  PackageSearch, 
  MapPin, 
  User, 
  Tag, 
  Calendar,
  Loader2,
  AlertTriangle,
  Truck,
  ShieldCheck,
  Activity,
  Globe,
  CornerDownRight,
  Settings
} from 'lucide-react';

const ViewParcel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const trackingNumber = queryParams.get('trackingNumber')?.toUpperCase();

  useEffect(() => {
    if (!trackingNumber) {
        navigate('/admin/dashboard', { replace: true });
    }
  }, [trackingNumber, navigate]);

  const { data, error, isLoading } = useGetParcelQuery(trackingNumber, { 
    skip: !trackingNumber 
  });
  
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-main animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Transit Data...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-rose-50 text-rose-600 p-8 rounded-2xl border border-rose-100 flex flex-col items-center justify-center gap-4 text-center">
            <AlertTriangle className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-black uppercase tracking-widest">Protocol Identification Error</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                {error?.data?.message || error.message || 'Asset data induction failed'}
            </p>
            <button 
                onClick={() => navigate(-1)} 
                className="mt-6 px-8 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
                Return to Terminal
            </button>
        </div>
    </div>
  );

  const parcel = data?.result || data?.parcelResult || data;

  if (!parcel || (Object.keys(parcel).length === 0 && !data.success)) return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100">
            <PackageSearch className="w-10 h-10 text-slate-300" />
        </div>
        <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Consignment Not Manifested</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID Reference: {trackingNumber || 'NULL'}</p>
        </div>
        <button 
            onClick={() => navigate(-1)} 
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
        >
            Return to Command Center
        </button>
    </div>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-8 space-y-10 animate-fade-in relative">
        {/* TOP NAVIGATION & ID BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
            <div className="flex flex-col md:flex-row items-center gap-6 no-print">
               <button 
                  onClick={() => navigate(-1)} 
                  className="flex items-center gap-3 text-slate-500 hover:text-primary-main font-black text-[11px] uppercase tracking-[0.2em] transition-all group px-5 py-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md"
               >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1" />
                  Console
               </button>
               <button 
                  onClick={() => navigate(`/admin/parcel_update?trackingNumber=${trackingNumber}`)} 
                  className="flex items-center gap-3 bg-primary-main text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all group px-6 py-3 rounded-xl shadow-xl shadow-primary-main/20 hover:bg-slate-900 active:scale-95"
               >
                  <Settings size={16} className="animate-spin-slow" />
                  Reconfigure Asset
               </button>
            </div>
            
            <div className="flex items-center gap-6 bg-white border border-slate-200 px-8 py-4 rounded-2xl shadow-sm">
                <div className="p-3 bg-primary-main/5 text-primary-main rounded-xl">
                  <Truck size={22} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-0.5">Reference ID</span>
                  <span className="text-lg font-black uppercase tracking-tighter leading-none font-mono text-slate-800">{trackingNumber}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">Live Audit</span>
                  </div>
                </div>
            </div>
        </div>

        {/* MAIN DATA HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* LEFT COLUMN: TRANSIT PROGRESS */}
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
                       <div>
                          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-1">
                              Transit <span className="text-primary-main">Manifest</span> & Status
                          </h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational sequence active</p>
                       </div>
                       <div className="flex gap-3">
                          <div className="bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 text-center">
                             <span className="block text-[8px] font-black text-slate-300 uppercase mb-0.5">Network</span>
                             <span className="block text-[10px] font-black text-emerald-600 uppercase">STABLE</span>
                          </div>
                          <div className="bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 text-center">
                             <span className="block text-[8px] font-black text-slate-300 uppercase mb-0.5">Integrity</span>
                             <span className="block text-[10px] font-black text-primary-main uppercase">VERIFIED</span>
                          </div>
                       </div>
                    </div>

                    <div className="mb-12 px-4">
                      <AdjustableProgressBar progressStatus={parcel.progressStatus} />
                    </div>
                    
                    <div className="relative h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner group/map">
                        <MapComponent 
                          originLat={parcel.originLatitude}
                          originLng={parcel.originLongitude}
                          currentLat={parcel.currentLatitude}
                          currentLng={parcel.currentLongitude}
                          destLat={parcel.destinationLatitude} 
                          destLng={parcel.destinationLongitude} 
                          parcelDestination={parcel.currentLocation}
                        />
                        <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-200 shadow-xl flex items-center gap-4">
                            <div className="p-2 bg-primary-main text-white rounded-lg">
                              <MapPin size={16} />
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Last Checkpoint</span>
                                <span className="text-xs font-black text-slate-800 uppercase tracking-tight block">{parcel.currentLocation}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INFORMATION NODES */}
            <div className="space-y-8">
                {/* STATUS CARD */}
                <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-white/50">
                        <Activity size={100} />
                    </div>
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary-light border border-white/10">
                            <Tag size={24} />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Transit Lifecycle State</h5>
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-main text-white rounded-xl shadow-[0_10px_20px_rgba(124,58,237,0.3)]">
                              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                              <p className="text-[11px] font-black uppercase tracking-[0.2em]">{parcel.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONSIGNEE CARD */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
                            <User size={20} />
                        </div>
                        <div>
                          <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Consignee</h5>
                          <p className="text-base font-black text-slate-800 uppercase tracking-tight">{parcel.receiverName}</p>
                        </div>
                    </div>
                    <div className="h-px bg-slate-100 mb-6" />
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
                            <MapPin size={20} />
                        </div>
                        <div>
                          <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Final Destination Address</h5>
                          <p className="text-sm font-bold text-slate-600 leading-relaxed font-mono">{parcel.destination}</p>
                        </div>
                    </div>
                </div>

                {/* DELIVERY DATE CARD */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-slate-950 group-hover:scale-110 transition-transform duration-700">
                        <Calendar size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary-main/5 text-primary-main rounded-xl flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Projected Completion</h5>
                                <p className="text-lg font-black text-slate-800 tracking-tight">{formatDate(parcel.deliveryDate)}</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">On Schedule</span>
                        </div>
                    </div>
                </div>

                {/* DETAILED MANIFEST TEXT */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                         Detailed Item Manifest
                    </h5>
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 italic text-xs font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {parcel.description || "No detailed manifest notes documented for this consignment."}
                    </div>
                </div>

                {/* DIGITAL ASSETS SECTION */}
                {parcel.images && parcel.images.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                             Digital Manifest Assets ({parcel.images.length})
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                            {parcel.images.map((img, idx) => (
                                <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                                    <img src={img} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <PackageSearch size={20} className="text-white" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* FOOTER AUDIT CONTEXT */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50/50 p-8 rounded-3xl border border-slate-200 gap-6">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-primary-main">
                    <Activity size={24} />
                </div>
                <div>
                   <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
                       Security Matrix Protocol <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   </h5>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Verified by Enterprise Logistics Backbone</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="px-5 py-3 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                   <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5 text-left">Latent Vector</span>
                   <span className="block text-[10px] font-black text-slate-700 font-mono tracking-widest">99.98%</span>
                </div>
                <div className="px-5 py-3 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                   <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5 text-left">Sync Mode</span>
                   <span className="block text-[10px] font-black text-slate-700 font-mono tracking-widest">DUAL-NODE</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ViewParcel;
