import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Mail
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../MapComponent';
import TrackingBanner from '../TrackingBanner';
import AdjustableProgressBar from '../AdjustableProgressBar';
import WaybillSnapshot from '../WaybillSnapshot';
import ClearanceCertificate from '../ClearanceCertificate';
import CommercialInvoice from '../CommercialInvoice';
import TrackingManifest from '../TrackingManifest';
import TawkMessenger from '../TawkMessenger';
import Reveal from '../Reveal';
import Footer from './Footer'; 
import { useGetParcelQuery } from '../../features/parcel/parcelApiSlice';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (s) => {
    switch (s?.toLowerCase()) {
      case 'delivered': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', text: 'DELIVERED', icon: <CheckCircle size={10} /> };
      case 'impounded': return { color: 'bg-rose-50 text-rose-600 border-rose-100', text: 'IMPOUNDED', icon: <ShieldAlert size={10} /> };
      case 'in transit': return { color: 'bg-slate-900 text-white border-slate-800', text: 'IN TRANSIT', icon: <Truck size={10} /> };
      case 'on hold': return { color: 'bg-amber-50 text-amber-600 border-amber-100', text: 'ON HOLD', icon: <History size={10} /> };
      default: return { color: 'bg-slate-50 text-slate-500 border-slate-100', text: 'PROCESSING', icon: <Loader2 size={10} className="animate-spin" /> };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`${config.color} px-4 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-1.5 shadow-sm tracking-[0.2em] border`}>
      {config.icon}
      {config.text}
    </div>
  );
};

const TimelineItem = ({ record, isLast, index }) => {
  const date = new Date(record.updatedAt);
  const time = date.toLocaleString(undefined, { timeStyle: 'short' });
  const day = date.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex gap-4 relative group">
      {!isLast && (
        <div className="absolute left-[73px] top-[24px] bottom-[-4px] w-px bg-slate-100 group-hover:bg-primary-main/20 transition-colors" />
      )}
      
      <div className="w-16 text-right shrink-0 pt-0.5">
          <div className="text-[10px] font-black text-slate-900">{time}</div>
          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{day}</div>
      </div>
      
      <div className={`w-2 h-2 rounded-full border-2 z-10 shrink-0 mt-1.5 transition-all shadow-sm ${
        record.status?.toLowerCase() === 'impounded' ? 'border-rose-500 bg-white' 
        : record.status?.toLowerCase() === 'delivered' ? 'border-emerald-500 bg-white'
        : 'border-slate-900 bg-white group-hover:bg-slate-900'
      }`} />
      
      <div className="pb-8 pl-1 text-left flex-1 min-w-0">
        <h4 className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
            record.status?.toLowerCase() === 'impounded' ? 'text-rose-600' : 'text-slate-800'
        }`}>
          {record.status?.toUpperCase() || 'UPDATE'}
        </h4>
        <div className="flex items-center gap-2 overflow-hidden opacity-100">
            <MapPin size={10} className="text-slate-400 shrink-0" />
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight italic truncate">
              {record.currentLocation}
            </p>
        </div>
      </div>
    </motion.div>
  );
};

const DetailRow = ({ label, value, icon: Icon, colorClass = "text-primary-main" }) => (
  <div className="mb-2 flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-primary-main/30 hover:shadow-xl hover:shadow-primary-main/5 transition-all group cursor-default">
    <div className={`p-2.5 bg-slate-50 shadow-inner border border-slate-100 rounded-lg transition-all group-hover:bg-primary-main group-hover:text-white ${colorClass}`}>
        {Icon && <Icon size={14} />}
    </div>
    <div className="min-w-0">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-0.5 opacity-80 group-hover:text-primary-main transition-colors">{label}</span>
      <span className="text-[11px] font-black text-slate-950 uppercase tracking-tight italic truncate block">{value || 'UNSPECIFIED'}</span>
    </div>
  </div>
);

const ParcelDetail = () => {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetParcelQuery(trackingNumber, {
        pollingInterval: 10000, // 🛰️ Neural Sync Pulse: Update data every 10 seconds
    });
  const waybillRef = useRef(null);
  const certRef = useRef(null);
  const invoiceRef = useRef(null);
  const manifestRef = useRef(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [cryptoRates, setCryptoRates] = useState({ btc: 65000, usdt: 1 });

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd')
     .then(res => res.json())
     .then(rateData => {
         if (rateData.bitcoin && rateData.tether) {
             setCryptoRates({ btc: rateData.bitcoin.usd, usdt: rateData.tether.usd });
         }
     }).catch(() => {});
  }, []);

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

  const handleDownloadInvoice = () => {
    const element = invoiceRef.current;
    if (!element) return;
    const opt = { 
        margin: [0,0], 
        filename: `INVOICE-${trackingNumber}.pdf`, 
        image: { type: 'jpeg', quality: 0.98 }, 
        html2canvas: { scale: 2, useCORS: true, allowTaint: true }, 
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' } 
    };
    html2pdf().from(element).set(opt).save();
  };

  const handleDownloadManifest = async (e) => {
    e?.preventDefault();
    const element = document.getElementById('manifest-node-terminal') || manifestRef.current;
    
    if (!element) {
        alert("Node synchronization pending... Please retry in a second.");
        return;
    }

    const opt = {
      margin: [10, 10], 
      filename: `MANIFEST-${trackingNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
          scale: 1.5, 
          useCORS: true, 
          allowTaint: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
        await html2pdf().from(element).set(opt).save();
    } catch (err) {
        console.error("CRITICAL MANIFEST EXPORT FAULT:", err);
        alert("The manifest node encountered a rendering fault. Please try again.");
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded-xl border-2 border-primary-main/10 animate-spin-slow" />
        <Loader2 className="w-6 h-6 text-primary-main animate-spin absolute inset-0 m-auto" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-800 animate-pulse">Syncing Telemetry...</p>
    </div>
  );

  if (error || !data || !data.result) return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center animate-fade-in bg-white min-h-screen">
      <div className="inline-flex p-6 bg-rose-50 rounded-2xl text-rose-500 mb-8 border border-rose-100 shadow-xl shadow-rose-500/5">
          <ShieldAlert size={32} />
      </div>
      <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic">Node Fault</h2>
      <p className="text-slate-600 font-black mb-10 uppercase tracking-[0.2em] text-[10px] leading-relaxed">Verification failed for ID: <br/><span className="text-rose-600 border-b border-rose-600/20 pb-0.5 mt-2 inline-block">{trackingNumber}</span></p>
      <button onClick={() => window.location.reload()} className="bg-slate-900 hover:bg-primary-main text-white px-10 py-4 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl transition-all flex items-center gap-3 mx-auto">
        Retry Handshake <Zap size={14} />
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

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-primary-main selection:text-white">
      <TawkMessenger />
      <TrackingBanner />

      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-24 relative z-10">
        <div className="mb-6 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-primary-main hover:bg-white hover:border-primary-main/30 hover:shadow-2xl hover:shadow-primary-main/10 transition-all active:scale-95"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return to Terminal
            </button>
            <div className="flex items-center gap-4 text-slate-400 font-bold text-[9px] uppercase tracking-widest bg-slate-100/50 px-4 py-2 rounded-xl border border-slate-200/50 italic">
               <Globe size={12} className="text-primary-main" /> Satellite Link: TRK-NODE-772
            </div>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          {/* DIGITAL STAGING BUFFER FOR PDF GENERATION */}
          <div style={{ 
            position: 'absolute', 
            top: '0', 
            left: '0', 
            width: '1200px', 
            visibility: 'hidden',
            pointerEvents: 'none', 
            zIndex: -9999 
          }}>
             <div id="manifest-node-terminal">
                <TrackingManifest ref={manifestRef} data={result} history={parcelHistory} trackingNumber={trackingNumber} />
             </div>
             <WaybillSnapshot ref={waybillRef} data={result} trackingNumber={trackingNumber} />
             <CommercialInvoice ref={invoiceRef} data={result} trackingNumber={trackingNumber} />
             {result.payment_status?.toLowerCase() === 'paid' && (
                 <ClearanceCertificate ref={certRef} data={result} trackingNumber={trackingNumber} />
             )}
          </div>

          {/* DYNAMIC HUB ALERTS (IMPOUNDED) */}
          {result.status?.toLowerCase() === 'impounded' && (
             <div className="mb-8 overflow-hidden rounded-[2.5rem] border border-rose-100 shadow-2xl bg-white relative">
                 <div className="h-1.5 w-full bg-slate-950 flex">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className={`h-full flex-1 ${i % 2 === 0 ? 'bg-rose-600' : 'bg-slate-950'} -skew-x-12`} />
                    ))}
                 </div>
                 <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10 items-center bg-gradient-to-br from-rose-50/20 to-white">
                    <div className="shrink-0 relative">
                        <div className="w-24 h-24 rounded-2xl border-4 border-rose-600/30 border-dashed flex items-center justify-center p-2 animate-spin-slow">
                            <div className="w-full h-full rounded-xl border-4 border-rose-600 flex items-center justify-center" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-rose-600 bg-white shadow-xl p-3 scale-90 border-2 border-rose-600 rounded-xl">
                           <ShieldAlert size={28} />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-rose-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.3em] mb-5 shadow-xl shadow-rose-500/20">
                            <Gavel size={14} /> Border Interdiction Active
                        </div>
                        <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-3 italic leading-none">
                             Consignment <span className="text-rose-600">Sequestered.</span>
                        </h3>
                        <p className="font-bold text-slate-600 mb-8 leading-relaxed text-[14px] italic max-w-3xl">
                            Consignment identified by Global Regulatory Authorities for immediate tariff reconciliation. Assets held in secure customs terminal.
                        </p>
                        <div className="bg-slate-950 p-6 rounded-[1.5rem] shadow-2xl inline-block text-left w-full max-w-2xl relative border border-white/5 group overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-600" />
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-rose-500 block mb-4 flex items-center gap-3">
                                <Activity size={12} className="animate-pulse" /> HOLD REASON:
                            </span>
                            <div className="text-[14px] font-black text-white tracking-widest italic bg-white/5 p-5 rounded-xl border border-white/10 shadow-inner uppercase">
                                {result.hold_reason || 'PENDING REGULATORY TARIFF EVALUATION.'}
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
          )}

          {/* MASTER HEADER CONTROL HUB */}
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col lg:flex-row gap-8 md:gap-10 items-center justify-between mb-8 relative overflow-hidden group shadow-primary-main/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-main/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary-main/10 transition-colors" />
            
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left relative z-10 w-full lg:w-auto">
              <Reveal>
              <div className="p-6 bg-white shadow-2xl rounded-2xl border border-slate-100 shrink-0 transition-transform hover:scale-105 duration-700 cursor-pointer ring-8 ring-slate-50">
                 <QRCodeSVG value={`https://tunshpreshgloballtd.com/parcels/${trackingNumber}`} size={90} level="M" />
              </div>
              </Reveal>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-950 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.4em] shadow-xl">
                    <Terminal size={14} className="text-primary-light" /> CONSIGNMENT NODE
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-950 uppercase tracking-tighter italic leading-none font-mono drop-shadow-sm">
                    {trackingNumber}
                </h1>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Satellite Uplink Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-8 items-center justify-center relative z-10">
              <StatusBadge status={result.status} />
              <div className="h-12 w-px bg-slate-100 hidden lg:block" />
              <div className="flex gap-4">
                <button 
                  onClick={handleDownloadPDF} 
                  className="p-5 bg-white hover:bg-slate-900 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 shadow-xl group/dl ring-2 ring-slate-50"
                  title="Waybill"
                >
                  <Download size={22} className="group-hover/dl:-translate-y-1 transition-transform" />
                </button>
                <button 
                  onClick={handleDownloadInvoice}
                  className="bg-gradient-to-br from-primary-main to-primary-dark hover:-translate-y-1 text-white px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-primary-main/20 flex items-center gap-3 md:gap-4 group/inv border-b-4 border-primary-dark active:border-b-0 active:translate-y-1"
                >
                  <FileText size={18} /> Financial Ledger
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* TRANSIT CORE */}
              <Reveal>
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden group shadow-primary-main/5">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-main via-primary-dark to-slate-950" />
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-950 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/5"><Activity size={28} className="text-primary-light animate-pulse" /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950 leading-none mb-1 italic">Transit Trajectory</h3>
                            <span className="text-[9px] font-black text-primary-main uppercase tracking-[0.4em] block italic">Global Synchronization</span>
                        </div>
                    </div>
                </div>
                <div className="px-1">
                    <AdjustableProgressBar progressStatus={result.progressStatus} />
                </div>
              </div>
              </Reveal>

              <Reveal delay={0.1}>
              <div className="rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group bg-white relative">
                <div className="p-8 bg-white text-slate-950 border-b border-slate-100 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                        <Globe size={18} className="text-primary-main" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic text-slate-950">Spatial Telemetry Array</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
                            {parseFloat(result.currentLatitude || 0).toFixed(1)}°N | {parseFloat(result.currentLongitude || 0).toFixed(1)}°E LOCK
                        </span>
                    </div>
                </div>
                <div className="h-[450px] w-full transform group-hover:scale-[1.01] transition-transform duration-1000 shadow-inner">
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
              </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Reveal delay={0.2}>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl group hover:shadow-primary-main/5 transition-all">
                  <div className="p-8 bg-slate-950 text-white flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/10 rounded-full blur-3xl" />
                    <span className="font-black text-[11px] tracking-[0.4em] uppercase italic relative z-10">Consignee Hub</span>
                    <User size={18} className="text-primary-light relative z-10" />
                  </div>
                  <div className="p-8 space-y-2">
                    <DetailRow label="Asset Master" value={result.receiverName} icon={User} colorClass="text-slate-950" />
                    <DetailRow label="Comm Uplink" value={result.receiverPhone} icon={Navigation} colorClass="text-emerald-500" />
                    <DetailRow label="Neural Email" value={result.receiverEmail} icon={Mail} colorClass="text-blue-500" />
                    <DetailRow label="Target Destination" value={result.destination} icon={MapPin} colorClass="text-rose-600" />
                  </div>
                </div>
                </Reveal>
                
                <Reveal delay={0.3}>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl group hover:shadow-primary-main/5 transition-all">
                  <div className="p-8 bg-gradient-to-br from-primary-main to-primary-dark text-white flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                    <span className="font-black text-[11px] tracking-[0.4em] uppercase italic relative z-10">Industrial Specs</span>
                    <Package size={18} className="text-white relative z-10" />
                  </div>
                  <div className="p-8 space-y-2">
                    <DetailRow label="Consignor/Shipper" value={result.senderName} icon={User} colorClass="text-primary-main" />
                    <DetailRow label="Shipper Email" value={result.senderEmail} icon={Mail} colorClass="text-primary-main" />
                    <DetailRow label="Catalog Class" value={result.description} icon={Package} colorClass="text-slate-950" />
                    <DetailRow label="Mass Index" value={`${result.weight} KG`} icon={Navigation} colorClass="text-blue-600" />
                    <DetailRow label="Induction Terminal" value={result.origin} icon={MapPin} colorClass="text-indigo-600" />
                    <DetailRow label="Dispatch Node" value={result.dispatchDate} icon={Calendar} colorClass="text-orange-600" />
                    <DetailRow label="Arrival Projection" value={result.deliveryDate} icon={Calendar} colorClass="text-emerald-600" />
                  </div>
                </div>
                </Reveal>
              {/* ASSET TRAY: Manifest Visualization & Description */}
              <Reveal delay={0.4}>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl group hover:shadow-primary-main/5 transition-all">
                <div className="p-8 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/10 rounded-full blur-3xl" />
                  <span className="font-black text-[11px] tracking-[0.4em] uppercase italic relative z-10">Cargo Visualization Manifest</span>
                  <Package size={18} className="text-primary-light relative z-10" />
                </div>
                <div className="p-8 space-y-8">
                  {/* Integrated Manifest Description */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Itemized Manifest Details</span>
                        <div className="flex items-center gap-2 bg-slate-200/50 px-3 py-1 rounded-lg">
                           <Package size={10} className="text-slate-400" />
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{result.quantity || 1} UNIT(S)</span>
                        </div>
                      </div>
                      <div className="text-[12px] font-bold text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                          {result.description || "The consignor has documented this cargo as part of a secured transit manifest without additional itemization nodes."}
                      </div>
                  </div>

                  {result.images && result.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {result.images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all group/asset cursor-pointer ring-offset-2 hover:ring-2 hover:ring-primary-main">
                          <img 
                            src={img} 
                            alt={`Cargo Asset ${i+1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/asset:scale-110" 
                            onClick={() => window.open(img, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              </Reveal>
            </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              {/* SETTLEMENT CENTER */}
              <Reveal delay={0.4}>
              <div className="bg-white rounded-[3rem] p-10 text-slate-950 shadow-2xl relative overflow-hidden group border border-slate-100 ring-8 ring-white">
                <div className="absolute bottom-0 right-0 p-12 opacity-[0.025] group-hover:scale-110 transition-transform duration-1000"><CreditCard size={250} /></div>
                
                <div className="flex items-center gap-6 mb-10 relative z-10">
                    <div className="w-14 h-14 bg-slate-950 rounded-2xl text-primary-light border border-white/5 flex items-center justify-center shadow-2xl group-hover:bg-primary-main group-hover:text-white transition-all transform group-hover:rotate-6">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1 italic text-slate-950">Financials</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] block italic">Audit Locked</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                        </div>
                    </div>
                </div>

                <div className="space-y-5 mb-10 relative z-10 font-bold border-y border-slate-50 py-10">
                    {[
                        { label: "Transit Protocol", val: freight, icon: <Truck size={12} className="text-slate-400" /> },
                        { label: "Security Indemnity", val: insurance, icon: <Shield size={12} className="text-slate-400" /> },
                        { label: "Governmental VAT", val: tax, icon: <Globe size={12} className="text-slate-400" /> }
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group/row">
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-slate-600 font-black uppercase tracking-[0.2em] text-[9px]">{item.label}</span>
                            </div>
                            <span className="font-mono text-lg font-black text-slate-900">{formatCurrency(item.val)}</span>
                        </div>
                    ))}
                    
                    <div className="mt-10 p-8 rounded-[2rem] bg-slate-950 text-white relative overflow-hidden group/total shadow-2xl ring-8 ring-slate-50">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/20 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex flex-col relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary-light mb-2 italic">Net Liquidation</span>
                            <span className="text-4xl font-black text-white tracking-tighter italic font-mono drop-shadow-xl">
                                {formatCurrency(totalUSD)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    {result.payment_status?.toLowerCase() === 'paid' ? (
                      <div className="space-y-4">
                          <div className="p-8 bg-emerald-50 text-emerald-600 border-2 border-emerald-100 rounded-[2rem] flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] shadow-inner font-mono">
                            <ShieldCheck size={24} className="animate-pulse" />
                            SETTLED
                          </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5">
                          <button 
                            onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                            className="w-full py-8 bg-gradient-to-br from-primary-main to-primary-dark hover:-translate-y-1 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.5em] transition-all shadow-2xl shadow-primary-main/30 active:translate-y-0 relative overflow-hidden group/pay ring-4 ring-white"
                          >
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/pay:opacity-100 transition-opacity" />
                             <span className="relative z-10 italic flex items-center justify-center gap-4">Initialize Settlement <ArrowRight size={18} /></span>
                          </button>

                          <AnimatePresence>
                              {showPaymentInfo && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-6 mt-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4 text-center italic">Verified Nodes</h4>
                                    <div className="space-y-4">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-main transition-all group/wallet shadow-sm">
                                            <span className="text-[10px] uppercase text-slate-500 block font-black tracking-[0.3em] mb-3 flex items-center justify-between">WIRE (SWIFT) <BanknoteIcon size={16} /></span>
                                            <div className="text-[12px] font-black text-slate-950 uppercase italic tracking-tighter">TUNSHPRESH GLOBAL LTD</div>
                                            <div className="text-[11px] text-primary-main font-mono bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4 shadow-inner">GB99 NWBK 1234 5678 90</div>
                                        </div>
                                        
                                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-primary-main transition-all group/crypto shadow-2xl">
                                            <span className="text-[10px] uppercase text-white/30 block font-black tracking-[0.3em] mb-3 flex items-center justify-between">USDT <BitcoinIcon size={18} className="text-primary-light" /></span>
                                            <div className="text-3xl font-black text-white tracking-widest mb-3 font-mono">
                                                {(totalUSD / cryptoRates.usdt).toFixed(2)} <span className="text-[11px] text-primary-light italic ml-1 uppercase">USDT</span>
                                            </div>
                                            <div className="text-[10px] text-white/40 font-mono break-all bg-black p-4 rounded-xl border border-white/5 shadow-inner">0x918804A92948239048aab1...</div>
                                        </div>
                                    </div>
                                </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                    )}
                </div>
              </div>
              </Reveal>

              {/* REGISTRY LOG */}
              <Reveal delay={0.5}>
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden group hover:shadow-primary-main/5 transition-all ring-8 ring-white">
                <div className="flex items-center gap-6 mb-14 border-b border-slate-50 pb-8">
                    <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all transform group-hover:rotate-12">
                        <History size={26} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950 mb-1 italic">Registry Log</h3>
                        <span className="text-[9px] font-black text-primary-main uppercase tracking-[0.4em] block italic">Immutable Chain Record</span>
                    </div>
                </div>
                
                <div className="space-y-4">
                  {parcelHistory && parcelHistory.length > 0 ? (
                    [...parcelHistory].reverse().map((record, index) => (
                      <TimelineItem key={index} record={record} isLast={index === (parcelHistory.length - 1)} index={index} />
                    ))
                  ) : (
                    <div className="py-16 text-center flex flex-col items-center opacity-40">
                        <Activity size={32} className="text-primary-main animate-pulse mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-950">Synchronizing...</p>
                    </div>
                  )}
                </div>

                <div className="mt-14 pt-10 border-t border-slate-100">
                    <button onClick={handleDownloadManifest} className="w-full py-6 bg-slate-50 hover:bg-slate-950 text-slate-600 hover:text-white rounded-2xl transition-all font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 px-10 shadow-inner border border-slate-200">
                        <Download size={20} /> Manifest Node
                    </button>
                    <p className="text-center mt-8 text-[8px] font-black text-slate-200 uppercase tracking-[0.8em] italic">V4.01 TERMINAL VALIDATED</p>
                </div>
              </div>
              </Reveal>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer /> 
    </div>
  );
};

export default ParcelDetail;
