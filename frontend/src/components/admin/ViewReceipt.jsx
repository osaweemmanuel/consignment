import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Receipt, 
  Globe, 
  ShieldCheck, 
  CreditCard,
  User,
  Mail,
  Calendar,
  Hash,
  Loader2,
  FileText,
  Building,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useGetReceiptQuery } from "../../features/receipty/receiptApiSlice";
import html2pdf from "html2pdf.js";
import LogoImage from '../../assets/images/tunshpresh-logo.png';

const ViewReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const { data, isLoading, isError } = useGetReceiptQuery(id);
  const receiptRef = useRef();

  const handleDownloadPDF = () => {
    const element = receiptRef.current;
    const opt = {
      margin: 10,
      filename: `Receipt_${data?.data?.referenceId || id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-primary-main animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Billing Data...</span>
    </div>
  );

  if (isError || !data) return (
    <div className="text-center py-24">
        <h3 className="text-2xl font-black text-red-500 uppercase tracking-tighter">Record Not Found</h3>
        <p className="text-slate-500">The requested billing record could not be retrieved from the database.</p>
        <button onClick={() => navigate(-1)} className="mt-8 text-primary-main font-black uppercase text-xs tracking-widest underline italic">Return to Archive</button>
    </div>
  );

  const receipt = data.data;

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 space-y-10 animate-fade-in relative">
      {/* NAVIGATION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-3 text-slate-500 hover:text-primary-main font-black text-[11px] uppercase tracking-[0.2em] transition-all group px-5 py-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md active:scale-95"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Billing Console
        </button>

        <div className="flex gap-4">
            <button 
                onClick={handlePrint}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-slate-800 hover:text-slate-800 transition-all flex items-center gap-3 shadow-sm active:scale-95 group"
            >
                <Printer size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Print Document</span>
            </button>
            <button 
                onClick={handleDownloadPDF}
                className="bg-primary-main hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary-main/20 flex items-center gap-3 group active:scale-95"
            >
                <Download size={18} />
                Download PDF
            </button>
        </div>
      </div>

      {/* ENTERPRISE RECEIPT DOCUMENT */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none group/doc">
        
        <div ref={receiptRef} className="p-12 md:p-20 space-y-16 print:p-10 relative bg-white">
            {/* BRANDING & STATUS HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="space-y-6">
                  <img src={LogoImage} className="w-52" alt="Tunshpresh" />
                  <div className="flex items-center gap-4 text-slate-500">
                    <Building size={16} className="text-primary-main" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Logistics Division</span>
                  </div>
                </div>
                <div className="text-left md:text-right space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">
                      OFFICIAL<span className="text-primary-main">.</span>RECEIPT
                    </h1>
                    <div className="flex flex-wrap items-center md:justify-end gap-3 text-[11px] font-black text-slate-700 uppercase font-mono bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-100">
                      <Hash size={14} className="text-primary-main" /> {receipt.referenceId}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-100 pt-16">
                {/* BILLING ENTITY */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Billing Information</h4>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-light shadow-lg">
                            <User size={24} />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none mb-1.5">{receipt.fullName}</div>
                            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-2 font-mono">
                                <Mail size={13} className="text-primary-main" /> {receipt.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AUDIT CONTEXT */}
                <div className="space-y-6 md:text-right">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Audit Information</h4>
                    <div className="space-y-3">
                        <div className="flex items-center md:justify-end gap-3 text-slate-800">
                          <span className="text-sm font-black uppercase tracking-tighter font-mono bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                              {new Date(receipt.payment_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <Calendar size={18} className="text-primary-main" />
                        </div>
                        <div className="flex items-center md:justify-end gap-2 text-emerald-600">
                            <CheckCircle2 size={14} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Transaction Verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BILLING SUMMARY TERMINAL */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em]">Description</th>
                            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-center">Payment Method</th>
                            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white">
                            <td className="px-8 py-10 align-top">
                                <div className="space-y-3">
                                    <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Consignment Logistics Settlement</span>
                                    <p className="text-[11px] font-bold text-slate-500 max-w-xs leading-relaxed italic opacity-80">
                                        "{receipt.payment_description}"
                                    </p>
                                </div>
                            </td>
                            <td className="px-8 py-10 align-top text-center">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-700">
                                    <CreditCard size={12} className="text-primary-main" />
                                    {receipt.payment_method}
                                </span>
                            </td>
                            <td className="px-8 py-10 align-top text-right">
                                <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                                    <span className="text-sm mr-1.5 opacity-40">{receipt.currency}</span>
                                    {Number(receipt.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-100/50">
                            <td colSpan="2" className="px-8 py-8 text-right font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
                                Total Outstanding Balance
                            </td>
                            <td className="px-8 py-8 text-right">
                                <div className="text-4xl font-black text-primary-main tracking-tighter font-mono italic">
                                    <span className="text-base mr-2 opacity-30">{receipt.currency}</span>
                                    {receipt.total_payment ? Number(receipt.total_payment).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* AUTHORIZATION FOOTER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-12 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Authorization Verified</div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Encrypted Document Link #492-X82</p>
                    </div>
                </div>
                <div className="text-center md:text-right">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 px-4 py-1.5 rounded-full border border-slate-100 inline-block bg-white">
                        TUNSHPRESH LOGISTICS GLOBAL
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        @media print {
            body * { visibility: hidden; }
            #root { background: white !important; }
            .print-receipt, .print-receipt * { visibility: visible; }
            .print-receipt { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                margin: 0;
            }
            .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ViewReceipt;