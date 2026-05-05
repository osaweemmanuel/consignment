import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  MapPin, 
  History, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Gavel, 
  CreditCard,
  Download,
  ShieldCheck,
  User,
  Navigation,
  Loader2,
  Banknote as BanknoteIcon,
  Bitcoin as BitcoinIcon,
  Activity,
  Globe,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Shield,
  Zap,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Camera,
  Mail,
  Scale,
  X,
  Info,
  Lock,
  PhoneCall
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../Reveal';
import MapComponent from '../MapComponent';
import TrackingBanner from '../TrackingBanner';
import AdjustableProgressBar from '../AdjustableProgressBar';
import WaybillSnapshot from '../WaybillSnapshot';
import ClearanceCertificate from '../ClearanceCertificate';
import CommercialInvoice from '../CommercialInvoice';
import { useGetParcelQuery } from '../../features/parcel/parcelApiSlice';
import TrackingManifest from '../TrackingManifest';
import TawkMessenger from '../TawkMessenger';

const ParcelDetail = () => {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetParcelQuery(trackingNumber);
  const [showWaybill, setShowWaybill] = useState(false);
  const [showClearance, setShowClearance] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const manifestRef = useRef();
  const waybillRef = useRef();
  const invoiceRef = useRef();
  const certRef = useRef();

  const cryptoRates = {
    usdt: 1,
    btc: 64500,
    eth: 3450
  };

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
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl border-2 border-slate-900/5 animate-spin-slow" />
        <Loader2 className="w-8 h-8 text-slate-950 animate-spin absolute inset-0 m-auto" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing Telemetry...</p>
    </div>
  );

  if (error || !data || !data.result) return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center bg-[#F8FAFC] min-h-screen">
      <div className="inline-flex p-8 bg-white rounded-3xl text-rose-500 mb-8 border border-slate-100 shadow-2xl">
          <ShieldAlert size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4">Node Fault</h2>
      <p className="text-slate-400 font-black mb-10 uppercase tracking-[0.2em] text-[10px]">Verification failed for ID: {trackingNumber}</p>
      <button onClick={() => window.location.reload()} className="bg-slate-950 hover:bg-primary-main text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-slate-950/20 transition-all flex items-center gap-4 mx-auto">
        Retry Handshake <Zap size={16} />
      </button>
    </div>
  );

  const result = data.result;
  const parcelHistory = data.parcelHistory || [];
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  
  const freight = Number(result.freight_charge) || 0;
  const insurance = Number(result.insurance_fee) || 0;
  const tax = Number(result.tax_due) || 0;
  const totalUSD = freight + insurance + tax;
  const holdKeywords = ['held', 'hold', 'impounded', 'restriction', 'seized', 'blocked', 'interdicted', 'security', 'audit'];
  const isHeld = holdKeywords.some(keyword => result.status?.toLowerCase().includes(keyword));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-slate-950 selection:text-white">
      <TawkMessenger />

      {/* 🛡️ HARD BLOCK: LOCKDOWN OVERRIDE */}
      {isHeld ? (
         <div className="fixed inset-0 z-[1000] bg-slate-50 flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-4xl w-full">
               {/* 🏷️ SYSTEM ALERT BANNER */}
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.08)] overflow-hidden">
                  <div className="bg-slate-900 px-10 py-5 flex items-center justify-between">
                     <div className="flex items-center gap-4 text-white">
                        <ShieldAlert size={20} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Transit Registry Lock</span>
                     </div>
                     <span className="text-slate-400 text-[10px] font-mono">NODE_ACTIVE: {trackingNumber.slice(0, 8)}</span>
                  </div>

                  <div className="p-10 md:p-20 text-center">
                     <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-900 mx-auto mb-10 shadow-inner">
                        <Lock size={40} />
                     </div>

                     <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6">
                        Administrative <span className="text-amber-600">Transit Interdiction</span>
                     </h3>
                     
                     <p className="text-slate-500 font-bold text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                        This consignment has been flagged for mandatory administrative review. All real-time telemetry and manifest access has been restricted by the global security protocol pending resolution.
                     </p>

                     {/* 📝 OFFICIAL REASON CARD */}
                     <div className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-10 mb-12 text-left relative group">
                        <div className="flex items-center gap-4 mb-6">
                           <Gavel size={20} className="text-slate-400" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Interdiction Reason Registry:</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight leading-normal pl-2 border-l-4 border-amber-500 ml-1">
                           "{result.hold_reason || 'PENDING ADMINISTRATIVE RECONCILIATION & AUDIT PROGRAM.'}"
                        </div>
                     </div>

                     {/* 📞 ACTION HANDLER */}
                     <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                        <Link 
                           to="/contact"
                           className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                           <Mail size={18} /> Contact Resolution Terminal
                        </Link>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-[240px]">
                           Please quote tracking ID <span className="text-slate-900">{trackingNumber}</span> when contacting support.
                        </p>
                     </div>
                  </div>

                  <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 text-center flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Status: Interdicted</span>
                     </div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] leading-none">
                        © 2026 TUNSHPRESH GLOBAL GROUP
                     </p>
                  </div>
               </div>
               
               <div className="mt-10 text-center opacity-40">
                   <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest underline underline-offset-4">Legal Notice & Privacy Shield</button>
               </div>
            </div>
         </div>
      ) : (
      <>
      <TrackingBanner />

      {/* 🏙️ ELITE CARRIER HEADER: Tracking ID Beacon */}
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-8 text-center md:text-left">
            <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-primary-light shadow-2xl relative group overflow-hidden">
               <div className="absolute inset-0 bg-primary-main/20 animate-pulse" />
               <Globe size={28} className="relative z-10 animate-spin-slow" />
            </div>
            <div>
               <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Global Transit Registry</h1>
               <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 leading-none">{trackingNumber}</span>
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Live Transit</span>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
            <button 
               onClick={handleDownloadPDF}
               className="flex items-center gap-4 bg-white border border-slate-200 hover:border-slate-950 text-slate-700 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-slate-200/20 active:scale-95 group"
            >
               <Download size={18} className="text-slate-300 group-hover:text-slate-950 transition-colors" /> Save Manifest
            </button>
            <div className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 border ${
               ['held', 'impounded', 'on hold', 'on-hold'].includes(result.status?.toLowerCase()) ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/10' :
               result.status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-950 text-white border-slate-900 shadow-slate-900/10'
            }`}>
               {result.status}
            </div>
         </div>
      </div>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-10 mb-20 relative z-10">
         
         {/* DIGITAL STAGING FOR PDFS (Hidden) */}
         <div style={{ position: 'absolute', top: '0', left: '0', width: '1200px', visibility: 'hidden', pointerEvents: 'none', zIndex: -9999 }}>
             <div id="manifest-node-terminal">
                <TrackingManifest ref={manifestRef} data={result} history={parcelHistory} trackingNumber={trackingNumber} />
             </div>
             <WaybillSnapshot ref={waybillRef} data={result} trackingNumber={trackingNumber} />
             <CommercialInvoice ref={invoiceRef} data={result} trackingNumber={trackingNumber} />
          </div>

          {/* 🛡️ SECURITY HOLD OVERRIDE TERMINAL */}
          {isHeld ? (
             <div className="space-y-12 py-10">
                <div className="overflow-hidden rounded-[4rem] border-4 border-rose-100 shadow-2xl bg-white relative">
                    <div className="h-3 w-full bg-slate-950 border-b-2 border-rose-500/20" />
                    <div className="p-10 md:p-20 flex flex-col items-center text-center">
                       <div className="w-32 h-32 rounded-[3.5rem] bg-rose-50 flex items-center justify-center text-rose-600 shadow-inner mb-12 relative">
                           <div className="absolute inset-0 bg-rose-500/10 animate-ping rounded-[3.5rem]" />
                           <ShieldAlert size={56} className="relative z-10" />
                       </div>
                       
                       <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] mb-8 shadow-2xl shadow-rose-500/30">
                           <Lock size={16} /> Asset Protocol: Interdicted
                       </div>

                       <h3 className="text-4xl md:text-6xl font-black text-slate-950 uppercase tracking-tighter mb-6 leading-none max-w-4xl">
                            Consignment <span className="text-rose-600">Transit Suspended.</span>
                       </h3>
                       
                       <p className="font-bold text-slate-400 mb-12 leading-loose text-lg max-w-3xl">
                           Notice: Real-time telemetry tracking has been electronically locked by Global Logistics Command. This asset is currently held at a secure terminal pending regulatory reconciliation or administrative review.
                       </p>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
                          <div className="bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl text-left relative border border-white/5 group overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 w-3 bg-rose-600" />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 block mb-6">Internal Hold Declaration:</span>
                             <div className="text-xl font-bold text-white tracking-tight leading-relaxed italic">
                                "{result.hold_reason || 'PENDING ADMINISTRATIVE RECONCILIATION & TARIFF EVALUATION.'}"
                             </div>
                             <div className="mt-10 flex items-center gap-4 pt-8 border-t border-white/10">
                                <Info size={20} className="text-rose-500" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol ID: SYS-HLD-{trackingNumber.slice(-4)}</span>
                             </div>
                          </div>

                          <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-200 text-left flex flex-col justify-between group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 transition-all">
                             <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 block mb-6 px-1">Required Action:</span>
                                <p className="text-[15px] font-bold text-slate-500 leading-relaxed px-1">
                                   To authorize the resumption of transit operations, the consignee or sender must establish immediate contact with our Global Support Terminal for asset reconciliation instructions.
                                </p>
                             </div>
                             
                             <div className="mt-10">
                                <a 
                                   href="mailto:support@tunshpreshgloballtd.com"
                                   className="inline-flex items-center gap-4 bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all w-full justify-center shadow-xl shadow-slate-950/20"
                                >
                                   <MessageSquare size={18} /> Establish Nexus Contact
                                </a>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>

                {/* Secure Information Grid (Status details still accessible but map/history locked) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Induction Point', value: result.origin, color: 'text-slate-400' },
                        { label: 'Designated Node', value: result.destination, color: 'text-slate-400' },
                        { label: 'Operational Ledger', value: result.service_type, color: 'text-slate-900' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col justify-between gap-4">
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                           <span className={`text-sm font-black tracking-tight ${item.color}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
             </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* 📍 PRIMARY INTELLIGENCE COLUMN (Left) */}
            <div className="lg:col-span-8 space-y-10">
               
               {/* 🗺️ INTERACTIVE RADIUS MAP */}
               <section className="bg-white rounded-[3rem] p-2 shadow-2xl shadow-slate-200/60 border border-slate-100 relative group overflow-hidden">
                  <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-2xl">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-primary-light">
                           <MapPin size={18} />
                        </div>
                        <div>
                           <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Node Position</span>
                           <span className="block text-sm font-black text-slate-950 tracking-tight">{result.currentLocation || "Satellite synchronization active..."}</span>
                        </div>
                     </div>
                  </div>
                  <div className="h-[550px] rounded-[2.5rem] overflow-hidden">
                    <MapComponent 
                      originLat={result.originLatitude}
                      originLng={result.originLongitude}
                      currentLat={result.currentLatitude}
                      currentLng={result.currentLongitude}
                      destLat={result.destinationLatitude} 
                      destLng={result.destinationLongitude} 
                      parcelDestination={result.currentLocation}
                      history={parcelHistory} 
                    />
                  </div>
               </section>

               {/* ⏱️ TRANSPORT JOURNEY HUB */}
               <section className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/60 border border-slate-100">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-8">
                     <div>
                        <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase leading-none mb-1">Transit Narrative</h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Complete Temporal History Manifest</span>
                     </div>
                     <History size={24} className="text-slate-100" />
                  </div>
                  
                  <div className="mb-12 border-b border-slate-50 pb-12">
                     <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-8">
                         <div className="flex justify-between items-center">
                             <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Operational Load Index</span>
                             <span className="text-3xl font-black text-primary-main">{result.progressStatus || 0}%</span>
                         </div>
                         <div className="relative w-full h-2 bg-slate-200 rounded-full">
                             <div className="absolute top-0 left-0 h-full bg-primary-main rounded-full transition-all duration-1000" style={{ width: `${result.progressStatus || 0}%` }} />
                             <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-main rounded-full shadow border-2 border-white transition-all duration-1000" style={{ left: `calc(${result.progressStatus || 0}% - 8px)` }} />
                         </div>
                         <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-50">
                             <span>Origin Terminal</span>
                             <span>Mid-Point Transit</span>
                             <span>Final Resolution</span>
                         </div>
                     </div>
                  </div>

                  <div className="space-y-0 relative">
                     <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-slate-50" />
                     {parcelHistory && parcelHistory.length > 0 ? (
                        [...parcelHistory].reverse().map((history, index) => (
                           <motion.div 
                             initial={{ opacity: 0, x: -20 }}
                             whileInView={{ opacity: 1, x: 0 }}
                             viewport={{ once: true }}
                             transition={{ delay: index * 0.1 }}
                             key={index} 
                             className="relative flex items-start gap-12 pb-14 last:pb-0 group"
                           >
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 border-8 border-white shadow-xl ${
                                 index === 0 ? 'bg-slate-950 text-primary-light scale-110 shadow-slate-950/20' : 'bg-slate-100 text-slate-400'
                              }`}>
                                 {index === 0 ? <Activity size={24} className="animate-pulse" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />}
                              </div>
                              <div className="pt-2">
                                 <div className="flex items-center gap-4 mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(history.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{new Date(history.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                 </div>
                                 <h4 className="text-xl font-black text-slate-950 tracking-tight mb-1">{history.currentLocation}</h4>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{history.status}</p>
                              </div>
                           </motion.div>
                        ))
                     ) : (
                        <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                           <p className="text-slate-400 font-black tracking-widest uppercase text-[10px]">Awaiting primary transit initiation nodes</p>
                        </div>
                     )}
                  </div>
               </section>

               {/* 📦 CARGO ASSETS: The Manifest Gallery */}
               <section className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8 mb-10">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                           <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none">Cargo Assets</h3>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-4">Verified manifest itemization & visual registry</p>
                     </div>
                     <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Unit Count</span>
                           <span className="text-xl font-black text-slate-900 font-mono leading-none tracking-tighter">{result.quantity || 1} <span className="text-[10px] text-slate-300">UNITS</span></span>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
                           <Package size={20} />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {(result.images && result.images.length > 0 ? result.images : []).map((item, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-10 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all group/asset">
                           {/* Visual Documentation */}
                           <div className="w-full md:w-64 aspect-square rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-100 relative cursor-pointer shadow-xl" onClick={() => setSelectedImage(item)}>
                              <img src={item.url} className="w-full h-full object-cover grayscale-[0.2] group-hover/asset:grayscale-0 transition-all duration-700 group-hover/asset:scale-110" />
                              <div className="absolute inset-0 bg-slate-900/10 group-hover/asset:bg-transparent transition-colors" />
                              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black text-slate-950 uppercase tracking-widest shadow-xl">
                                 Asset {i+1}
                              </div>
                           </div>

                           {/* Registry Intelligence */}
                           <div className="flex-1 space-y-6 pt-4">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-primary-main" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Electronic Registry Node</span>
                                 </div>
                                 <div className="bg-slate-950 text-primary-light px-6 py-2 rounded-xl shadow-xl flex items-center gap-3 border border-white/5">
                                    <Package size={14} />
                                    <span className="text-[11px] font-black uppercase tracking-tighter italic">{item.quantity} UNITS</span>
                                 </div>
                              </div>
                              
                              <div className="space-y-3">
                                 <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest">Itemized Description Archive</span>
                                 <h4 className="text-xl font-black text-slate-950 tracking-tight leading-tight lg:max-w-2xl">
                                    {item.description || "The consignor has documented this cargo as part of a secured transit manifest without additional itemization nodes."}
                                 </h4>
                              </div>

                              <div className="pt-4 border-t border-slate-100 flex items-center gap-6">
                                 <div className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-emerald-500" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visual Verified</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Shield size={14} className="text-blue-500" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Insured Index</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </div>

            {/* 📑 ELITE LOGISTICS SIDEBAR (Right) */}
            <aside className="lg:col-span-4 space-y-10">
               
               {/* 💼 IDENTITY REGISTRY: Consignor & Consignee */}
               <section className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/60 border border-slate-100">
                  <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-10 border-b border-slate-50 pb-6">Identity Registry</h3>
                  <div className="space-y-10">
                     <SidebarDetail label="Consignor" value={result.senderName} icon={User} color="text-slate-950" />
                     <SidebarDetail label="Verified Comm Link" value={result.senderPhone} icon={Mail} color="text-slate-400" />
                     <SidebarDetail label="Consignee Index" value={result.receiverName} icon={User} color="text-primary-main" />
                     <div className="h-px bg-slate-50" />
                     <SidebarDetail label="Cargo Mass Index" value={`${result.weight} KG`} icon={Scale} color="text-blue-600" />
                     <SidebarDetail label="Induction Terminal" value={result.origin} icon={MapPin} color="text-indigo-600" />
                     <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                           <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Inbound Induction</span>
                           <span className="text-xs font-black text-slate-950 tracking-tighter">{result.dispatchDate || "Awaiting Data..."}</span>
                        </div>
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                           <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Final Fulfillment</span>
                           <span className="text-xs font-black text-slate-950 tracking-tighter">{result.deliveryDate || "Awaiting Data..."}</span>
                        </div>
                     </div>
                  </div>
               </section>

               {/* 💳 FINANCIAL RECONCILIATION HUB */}
               <section className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl shadow-slate-950/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                     <CreditCard size={250} />
                  </div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-5 mb-12">
                        <div className="w-14 h-14 bg-white/10 rounded-[1.5rem] flex items-center justify-center text-primary-light shadow-2xl border border-white/5">
                           <CreditCard size={24} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tighter italic">Ledger Balance</h4>
                     </div>
                     <div className="space-y-6 mb-12">
                        <FinancialRow label="Freight Reconciliation" value={result.freight_charge} />
                        <FinancialRow label="National Tariff Node" value={result.tax_due} />
                        <FinancialRow label="Asset Insurance Index" value={result.insurance_fee} />
                        <div className="h-px bg-white/10 my-6" />
                        <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner group/pay">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/pay:text-slate-300 transition-colors">Balance Due</span>
                              <span className="text-4xl font-black text-white tracking-tighter leading-none">{formatCurrency(totalUSD)}</span>
                           </div>
                           <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-[0.2em] shadow-2xl ${
                              result.payment_status?.toLowerCase() === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                           }`}>{result.payment_status}</span>
                        </div>
                     </div>
                     
                     {result.hold_reason && (
                        <div className="bg-rose-500/10 border border-rose-500/10 p-8 rounded-[2rem] mb-10 relative overflow-hidden group/alert">
                           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/alert:scale-125 transition-transform duration-700"><ShieldAlert size={100} /></div>
                           <div className="flex items-center gap-3 mb-4 text-rose-400 relative z-10">
                              <ShieldAlert size={18} className="animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Alert: Transit Obstruction</span>
                           </div>
                           <p className="text-xs font-bold leading-relaxed text-rose-100/60 mb-8 italic relative z-10">{result.hold_reason}</p>
                           {result.release_fee > 0 && (
                              <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                                 <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest italic">Clearing Index</span>
                                 <span className="text-2xl font-black text-white leading-none tracking-tighter">${parseFloat(result.release_fee).toLocaleString()}</span>
                              </div>
                           )}
                        </div>
                     )}
                     
                     <button 
                       onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                       className="w-full bg-white text-slate-950 font-black text-[12px] uppercase tracking-[0.4em] py-6 rounded-[1.5rem] shadow-2xl hover:bg-primary-light transition-all transform active:scale-95 group-hover:shadow-primary-light/10"
                     >
                        Authorize Settlement
                     </button>

                     <AnimatePresence>
                        {showPaymentInfo && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-6 mt-6 p-8 bg-white/5 rounded-[2rem] border border-white/10 shadow-inner">
                              <div className="space-y-4">
                                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 group/wallet transition-all">
                                      <span className="text-[10px] uppercase text-white/30 block font-black tracking-[0.3em] mb-4 flex items-center justify-between">WIRE (SWIFT) <BanknoteIcon size={16} /></span>
                                      <div className="text-[12px] font-black text-white uppercase italic tracking-tighter">TUNSHPRESH GLOBAL LTD</div>
                                      <div className="text-[11px] text-primary-light font-mono bg-black p-4 rounded-xl border border-white/5 mt-4 shadow-inner">GB99 NWBK 1234 5678 90</div>
                                  </div>
                                  
                                  <div className="bg-black p-6 rounded-2xl border border-white/10 group/crypto shadow-2xl">
                                      <span className="text-[10px] uppercase text-white/30 block font-black tracking-[0.3em] mb-4 flex items-center justify-between">USDT (ERC-20) <BitcoinIcon size={18} className="text-primary-light" /></span>
                                      <div className="text-2xl font-black text-white tracking-widest mb-3 font-mono">
                                          {formatCurrency(totalUSD)} <span className="text-[11px] text-primary-light italic ml-1 uppercase">EQUIVALENT</span>
                                      </div>
                                      <div className="text-[10px] text-white/30 font-mono break-all bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner">0x918804A92948239048aab1...</div>
                                  </div>
                              </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </section>

               {/* 📂 OFFICIAL DOCUMENTARY VAULT */}
               <section className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/60 border border-slate-100">
                  <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-10">Documentation Vault</h3>
                  <div className="space-y-5">
                     <DocumentTrigger label="Carrier Waybill Master" icon={FileText} color="bg-orange-50 text-orange-600 border-orange-100" onClick={() => setShowWaybill(true)} />
                     <DocumentTrigger label="Clearance Manifest Hub" icon={ShieldCheck} color="bg-emerald-50 text-emerald-600 border-emerald-100" onClick={() => setShowClearance(true)} />
                     <DocumentTrigger label="Industrial Invoice Index" icon={Terminal} color="bg-blue-50 text-blue-600 border-blue-100" onClick={() => setShowInvoice(true)} />
                  </div>
               </section>
            </aside>
          </div>
          )}
       </main>
      </>
    )}

      {/* FOOTER: Global Identity Bar */}
      <footer className="max-w-[1400px] mx-auto p-12 mt-10 border-t border-slate-200/60">
         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-primary-light italic font-black text-xs shadow-2xl shadow-slate-950/10">TG</div>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">Premium Global Carrier Registry © 2024</span>
            </div>
            <div className="flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
               <a href="#" className="hover:text-primary-main transition-colors">Transit Nodes</a>
               <a href="#" className="hover:text-primary-main transition-colors">Identity Privacy</a>
               <a href="#" className="hover:text-primary-main transition-colors">Support Terminal</a>
            </div>
         </div>
      </footer>

      {/* 🔮 MODULAR MODAL TERMINALS */}
      <AnimatePresence>
        {showWaybill && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto pt-28" onClick={() => setShowWaybill(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-4xl"><WaybillSnapshot parcel={result} onClose={() => setShowWaybill(false)} /></div></div>}
        {showClearance && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto pt-28" onClick={() => setShowClearance(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-4xl"><ClearanceCertificate parcel={result} onClose={() => setShowClearance(false)} /></div></div>}
        {showInvoice && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto pt-28" onClick={() => setShowInvoice(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-4xl"><CommercialInvoice parcel={result} onClose={() => setShowInvoice(false)} /></div></div>}

        {/* 🔍 ASSET INTELLIGENCE VIEWER */}
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/20" onClick={e => e.stopPropagation()}>
                {/* Left: Image Visualization */}
                <div className="md:w-3/5 aspect-square md:aspect-auto md:h-[600px] bg-slate-100 relative group overflow-hidden">
                  <img src={selectedImage.url} className="w-full h-full object-contain md:object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                  <button onClick={() => setSelectedImage(null)} className="absolute top-8 left-8 w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group/close border border-white/10 shadow-2xl">
                    <X size={24} className="group-hover/close:rotate-90 transition-transform duration-500" />
                  </button>
                  <div className="absolute bottom-8 left-8 text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2 block">Visual Registry Archive</span>
                    <h4 className="text-2xl font-black tracking-tighter uppercase leading-none">Authenticated Cargo Asset</h4>
                  </div>
                </div>
                {/* Right: Asset Intelligence Details */}
                <div className="md:w-2/5 p-10 pt-16 md:p-16 flex flex-col justify-center bg-white">
                  <div className="mb-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-950 text-primary-light rounded-xl font-black text-[9px] uppercase tracking-[0.3em] mb-6 shadow-2xl shadow-slate-950/20">
                      <Shield size={14} /> Global Asset Verification
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tighter uppercase mb-6 leading-none">Cargo <br/><span className="text-primary-main">Verification.</span></h3>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner group/info hover:bg-white transition-all">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Itemized Description Index</span>
                      <p className="text-xs font-bold text-slate-600 leading-relaxed italic">{selectedImage.description || "The consignor has documented this cargo as part of a secured transit manifest without additional itemization nodes."}</p>
                    </div>
                    <div className="flex items-center gap-8 p-8 bg-slate-950 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden group/units">
                      <div className="absolute right-0 bottom-0 p-8 text-white/5 -rotate-12 group-hover/units:scale-125 transition-transform duration-[2s]">
                        <Package size={100} />
                      </div>
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary-light border border-white/10 shrink-0 shadow-inner">
                        <Package size={24} />
                      </div>
                      <div className="relative z-10">
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Quantity Reconciliation</span>
                        <span className="text-3xl font-black text-white tracking-tighter leading-none">{selectedImage.quantity || 1} <span className="text-[10px] text-slate-400 uppercase ml-1 italic tracking-widest">ISO Units</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => setSelectedImage(null)} className="mt-12 w-full py-6 bg-slate-100 hover:bg-slate-200 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 transition-all shadow-xl shadow-slate-200/20 active:scale-95 border border-slate-200 group/exit">
                    Exit Manifest Mode <X size={14} className="inline ml-2 group-hover/exit:rotate-90 transition-transform" />
                  </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="pdf-content" className="hidden"><WaybillSnapshot parcel={result} /></div>
    </div>
  );
};

// 🏛️ ELITE CARRIER UI SUB-COMPONENTS
const SidebarDetail = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center gap-6 group">
    <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-primary-main/20 ${color}`}>
       <Icon size={20} />
    </div>
    <div>
       <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{label}</span>
       <span className="block text-[15px] font-black text-slate-950 tracking-tighter leading-none">{value || "Unregistered"}</span>
    </div>
  </div>
);

const FinancialRow = ({ label, value }) => (
  <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-base font-black text-white leading-none tracking-tighter">${parseFloat(value || 0).toLocaleString()}</span>
  </div>
);

const DocumentTrigger = ({ label, icon: Icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 transition-all hover:scale-[1.02] active:scale-95 group shadow-sm hover:shadow-2xl hover:shadow-slate-200/50"
  >
     <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${color}`}>
           <Icon size={18} />
        </div>
        <span className="text-xs font-black text-slate-950 tracking-tight uppercase tracking-widest">{label}</span>
     </div>
     <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-main group-hover:translate-x-1 transition-all" />
  </button>
);

const DocumentButton = ({ label, icon: Icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] border border-slate-100 transition-all hover:scale-[1.02] active:scale-95 group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-main group-hover:bg-primary-main group-hover:text-white transition-colors">
        <Icon size={16} />
      </div>
      <span className="text-xs font-black text-slate-950 uppercase tracking-widest italic">{label}</span>
    </div>
    <ArrowRight size={14} className="text-slate-300 group-hover:text-primary-main transition-colors" />
  </button>
);

const TimelineItem = ({ record, isLast, index }) => (
  <div className="relative flex items-start gap-8 pb-10 last:pb-0 group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-all border-4 border-white shadow-lg ${
      index === 0 ? 'bg-slate-950 text-white scale-110 shadow-slate-950/10' : 'bg-slate-100 text-slate-400'
    }`}>
       {index === 0 ? <Activity size={20} className="animate-pulse" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
    </div>
    <div className="pt-1 flex-1">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
          <span className="text-[12px] font-black text-slate-950 tracking-tight">{record.currentLocation}</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{new Date(record.updatedAt).toLocaleString()}</span>
       </div>
       <p className="text-[10px] font-black text-primary-main uppercase tracking-[0.2em]">{record.status}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shadow-xl font-black text-[10px] uppercase tracking-widest ${
    status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' :
    status?.toLowerCase() === 'impounded' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/5' :
    'bg-slate-50 text-slate-600 border-slate-100 shadow-slate-200/50'
  }`}>
    <div className={`w-2 h-2 rounded-full animate-pulse ${
      status?.toLowerCase() === 'delivered' ? 'bg-emerald-500' :
      status?.toLowerCase() === 'impounded' ? 'bg-rose-500' : 'bg-slate-400'
    }`} />
    {status || 'In Transit'}
  </div>
);

export default ParcelDetail;
