import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, MapPin, History, CheckCircle, 
  CreditCard, Download, ShieldCheck, User,
  Globe, ArrowRight, ShieldAlert, Terminal,
  Scale, X, Lock, FileText, ChevronRight,
  Navigation, CalendarDays, Activity
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../MapComponent';
import WaybillSnapshot from '../WaybillSnapshot';
import ClearanceCertificate from '../ClearanceCertificate';
import CommercialInvoice from '../CommercialInvoice';
import { useGetParcelQuery } from '../../features/parcel/parcelApiSlice';
import TrackingManifest from '../TrackingManifest';
import TawkMessenger from '../TawkMessenger';

const ParcelDetail = () => {
  const { trackingNumber } = useParams();
  const { data, isLoading, error } = useGetParcelQuery(trackingNumber);
  const [showWaybill, setShowWaybill] = useState(false);
  const [showClearance, setShowClearance] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const manifestRef = useRef();
  const waybillRef = useRef();
  const invoiceRef = useRef();

  const handleDownloadPDF = () => {
    const element = waybillRef.current;
    if (!element) return;
    const opt = { 
        margin: [0,0], 
        filename: `WAYBILL-${trackingNumber}.pdf`, 
        image: { type: 'jpeg', quality: 0.98 }, 
        html2canvas: { scale: 2, useCORS: true, allowTaint: true }, 
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' } 
    };
    html2pdf().from(element).set(opt).save();
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-6" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Consignment Data...</p>
    </div>
  );

  if (error || !data || !data.result) return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center bg-slate-50 min-h-screen flex flex-col justify-center items-center">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-rose-500 mb-8 shadow-xl">
          <ShieldAlert size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Record Not Found</h2>
      <p className="text-slate-500 mb-10">We could not locate any tracking data for <span className="font-bold text-slate-900">{trackingNumber}</span>.</p>
      <button onClick={() => window.location.reload()} className="bg-primary-main text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary-main/30">
        Retry Search
      </button>
    </div>
  );

  const result = data.result;
  // Make sure history is sorted newest-first for the timeline
  const parcelHistory = data.parcelHistory ? [...data.parcelHistory].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) : [];
  
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  const totalUSD = (Number(result.freight_charge) || 0) + (Number(result.insurance_fee) || 0) + (Number(result.tax_due) || 0);
  const isHeld = ['held', 'hold', 'impounded', 'restriction', 'seized', 'blocked', 'interdicted', 'security', 'audit'].some(keyword => result.status?.toLowerCase().includes(keyword));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <TawkMessenger />

      {isHeld ? (
         <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-3xl w-full bg-slate-50 rounded-[2rem] border border-slate-200 overflow-hidden shadow-2xl">
                <div className="bg-rose-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <ShieldAlert size={24} />
                        <span className="font-black uppercase tracking-widest text-sm">Security Interdiction</span>
                    </div>
                    <span className="font-mono text-sm opacity-80">{trackingNumber}</span>
                </div>
                <div className="p-10 md:p-16 text-center">
                    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Transit Suspended</h3>
                    <p className="text-slate-600 text-lg mb-10 leading-relaxed">This consignment has been flagged for administrative review. Tracking telemetry has been locked pending resolution.</p>
                    
                    <div className="bg-white border-l-4 border-amber-500 p-6 text-left rounded-r-xl shadow-sm mb-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Hold</p>
                        <p className="text-lg font-bold text-slate-800">{result.hold_reason || "Pending Administrative Reconciliation"}</p>
                    </div>

                    <Link to="/contact" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                        Contact Support for Resolution <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
         </div>
      ) : (
      <>
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 pt-8 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Package size={16} /> Consignment Tracking
                </p>
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{trackingNumber}</h1>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${result.status?.toLowerCase() === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-main/10 text-primary-main'}`}>
                        {result.status || 'In Transit'}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all text-sm">
                    <Download size={18} /> Download Waybill
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        
        {/* HIDDEN PDF TEMPLATES */}
        <div className="hidden">
            <div id="manifest-node-terminal"><TrackingManifest ref={manifestRef} data={result} history={parcelHistory} trackingNumber={trackingNumber} /></div>
            <WaybillSnapshot ref={waybillRef} data={result} trackingNumber={trackingNumber} />
            <CommercialInvoice ref={invoiceRef} data={result} trackingNumber={trackingNumber} />
        </div>

        {/* PROGRESS BAR (Operational Load Index) */}
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm mb-10">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Transit Progress</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Operational Load Index</p>
                </div>
                <span className="text-4xl font-black text-primary-main">{result.progressStatus || 0}%</span>
            </div>
            <div className="relative w-full h-3 bg-slate-100 rounded-full mb-4">
                <div className="absolute top-0 left-0 h-full bg-primary-main rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${result.progressStatus || 0}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-4 border-primary-main transition-all duration-1000" style={{ left: `calc(${result.progressStatus || 0}% - 12px)` }} />
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Origin</span>
                <span className="hidden md:inline">In Transit</span>
                <span>Destination</span>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            
            {/* LEFT COLUMN: Map & Timeline */}
            <div className="xl:col-span-2 space-y-10">
                
                {/* MAP */}
                <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-main/10 text-primary-main rounded-full flex items-center justify-center">
                            <Navigation size={16} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Current Location</p>
                            <p className="text-sm font-bold text-slate-900">{result.currentLocation || "Updating..."}</p>
                        </div>
                    </div>
                    <div className="h-[400px] rounded-2xl overflow-hidden bg-slate-100">
                        <MapComponent 
                            originLat={result.originLatitude} originLng={result.originLongitude}
                            currentLat={result.currentLatitude} currentLng={result.currentLongitude}
                            destLat={result.destinationLatitude} destLng={result.destinationLongitude} 
                            parcelDestination={result.currentLocation} history={parcelHistory} 
                        />
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <History className="text-primary-main" size={24} />
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tracking History</h3>
                    </div>
                    
                    <div className="relative pl-4 md:pl-8">
                        {/* Continuous Line */}
                        <div className="absolute left-[27px] md:left-[43px] top-4 bottom-4 w-0.5 bg-slate-100" />
                        
                        {parcelHistory && parcelHistory.length > 0 ? (
                            parcelHistory.map((history, index) => {
                                const isLatest = index === 0;
                                const dateObj = new Date(history.updatedAt);
                                return (
                                <div key={index} className="relative flex items-start gap-6 md:gap-8 mb-12 last:mb-0 group">
                                    {/* Timeline Node */}
                                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all ${isLatest ? 'bg-primary-main scale-125 shadow-primary-main/30' : 'bg-slate-300'}`}>
                                        {isLatest && <div className="absolute inset-0 rounded-full border border-primary-main animate-ping opacity-50" />}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className={`text-xs font-black uppercase tracking-widest ${isLatest ? 'text-primary-main' : 'text-slate-500'}`}>
                                                {history.status}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                                <CalendarDays size={14} />
                                                {dateObj.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })} at {dateObj.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">{history.currentLocation}</h4>
                                    </div>
                                </div>
                            )})
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400 font-bold">No tracking history available yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* CARGO ASSETS */}
                {((result.images && result.images.length > 0) || result.imageUrl) && (
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Cargo Assets</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {(result.images && result.images.length > 0 ? result.images : [{ url: result.imageUrl, description: result.description, quantity: result.quantity }]).map((item, i) => (
                                <div key={i} className="group rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-pointer" onClick={() => setSelectedImage(item)}>
                                    <div className="aspect-video overflow-hidden">
                                        <img src={item.url} alt={`Asset ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset {i+1}</span>
                                            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">{item.quantity || 1} Units</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 line-clamp-2">{item.description || "Verified package asset."}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Info Cards */}
            <div className="space-y-6">
                
                {/* Route Details */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Route Details</h4>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0"><MapPin size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                                <p className="text-sm font-bold text-slate-900">{result.origin}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-main/10 flex items-center justify-center text-primary-main shrink-0"><MapPin size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                                <p className="text-sm font-bold text-slate-900">{result.destination}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipment Info */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Shipment Info</h4>
                    <div className="space-y-5">
                        <InfoRow label="Parcel Item" value={result.description} />
                        <InfoRow label="Quantity" value={`${result.quantity || 1} Units`} />
                        <InfoRow label="Consignor" value={result.senderName} />
                        <InfoRow label="Consignee" value={result.receiverName} />
                        <InfoRow label="Weight" value={`${result.weight} KG`} />
                        <InfoRow label="Service Type" value={result.service_type} />
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch</span>
                                <span className="text-xs font-bold text-slate-900">{result.dispatchDate || "Pending"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Delivery</span>
                                <span className="text-xs font-bold text-slate-900">{result.deliveryDate || "Pending"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="text-slate-400" size={20} />
                        <h4 className="text-xs font-black uppercase tracking-widest">Financial Summary</h4>
                    </div>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Freight</span><span className="font-bold">${parseFloat(result.freight_charge||0).toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Insurance</span><span className="font-bold">${parseFloat(result.insurance_fee||0).toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Tax/Duties</span><span className="font-bold">${parseFloat(result.tax_due||0).toFixed(2)}</span></div>
                    </div>
                    <div className="pt-4 border-t border-slate-700 flex justify-between items-center mb-6">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total</span>
                        <span className="text-2xl font-black">{formatCurrency(totalUSD)}</span>
                    </div>
                    <div className={`text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${result.payment_status?.toLowerCase() === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        Status: {result.payment_status}
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <button onClick={() => setShowWaybill(true)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-primary-main/5 rounded-xl transition-colors group border border-slate-100">
                        <div className="flex items-center gap-3"><FileText size={18} className="text-slate-400 group-hover:text-primary-main" /><span className="text-sm font-bold text-slate-700">Carrier Waybill</span></div>
                        <ChevronRight size={16} className="text-slate-300" />
                    </button>
                    <button onClick={() => setShowClearance(true)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-primary-main/5 rounded-xl transition-colors group border border-slate-100">
                        <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-slate-400 group-hover:text-primary-main" /><span className="text-sm font-bold text-slate-700">Clearance Cert</span></div>
                        <ChevronRight size={16} className="text-slate-300" />
                    </button>
                    <button onClick={() => setShowInvoice(true)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-primary-main/5 rounded-xl transition-colors group border border-slate-100">
                        <div className="flex items-center gap-3"><Terminal size={18} className="text-slate-400 group-hover:text-primary-main" /><span className="text-sm font-bold text-slate-700">Commercial Invoice</span></div>
                        <ChevronRight size={16} className="text-slate-300" />
                    </button>
                </div>
            </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-6 border-t border-slate-200 mt-10">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-bold text-slate-400">© 2026 Global Transit Logistics. All rights reserved.</p>
            <div className="flex gap-6 text-xs font-bold text-slate-500">
                <a href="#" className="hover:text-primary-main">Privacy</a>
                <a href="#" className="hover:text-primary-main">Terms</a>
                <a href="#" className="hover:text-primary-main">Support</a>
            </div>
         </div>
      </footer>
      </>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {showWaybill && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-20" onClick={() => setShowWaybill(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-4xl"><WaybillSnapshot parcel={result} onClose={() => setShowWaybill(false)} /></div></div>}
        {showClearance && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-20" onClick={() => setShowClearance(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-4xl"><ClearanceCertificate parcel={result} onClose={() => setShowClearance(false)} /></div></div>}
        {showInvoice && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-20" onClick={() => setShowInvoice(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-4xl"><CommercialInvoice parcel={result} onClose={() => setShowInvoice(false)} /></div></div>}

        {/* IMAGE VIEWER MODAL */}
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-1/2 bg-slate-100 flex items-center justify-center p-6">
                    <img src={selectedImage.url} className="max-h-[60vh] object-contain" alt="Asset" />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"><X size={20} /></button>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Cargo Asset Detail</h3>
                    <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                        <p className="text-sm font-bold text-slate-700">{selectedImage.description || "Verified asset recorded in manifest."}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-primary-main/5 p-6 rounded-2xl border border-primary-main/10">
                        <Package size={24} className="text-primary-main" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-main mb-1">Quantity Verified</p>
                            <p className="text-2xl font-black text-slate-900 leading-none">{selectedImage.quantity || 1} Units</p>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// HELPER COMPONENTS
const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-slate-900 text-right max-w-[60%] truncate" title={value}>{value || "N/A"}</span>
    </div>
);

export default ParcelDetail;
