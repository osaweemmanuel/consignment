import React from 'react';
import ReceiptFormModal from './ReceiptFormModal';
import ReceiptTable from './ReceiptTable';
import { Receipt, FileText, Building2, ShieldCheck, Activity } from 'lucide-react';

const ReceiptPage = () => {
  return (
    <div className="space-y-10 animate-fade-in relative py-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-main/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
        
        {/* EXECUTIVE BILLING HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 relative z-10">
            <div className="space-y-5">
                <div className="flex items-center gap-6">
                    <div className="p-4.5 bg-slate-900 text-primary-light rounded-2xl shadow-xl border border-white/5">
                        <Receipt size={36} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-main/5 text-primary-main rounded-lg font-black text-[9px] uppercase tracking-widest border border-primary-main/10 mb-2">
                            <ShieldCheck size={12} /> Financial Operations
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">
                            Billing <span className="text-primary-main">Management</span>
                        </h2>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 pl-2 relative border-l-2 border-slate-100">
                    <p className="text-slate-500 font-medium text-base max-w-lg leading-relaxed italic">
                        Comprehensive management of financial records, fiscal reconciliation, and payment audits for the Tunshpresh logistics network.
                    </p>
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Billing Active</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-shrink-0">
                <ReceiptFormModal />
            </div>
        </div>

        {/* LEDGER INFRASTRUCTURE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="px-10 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText size={18} className="text-primary-main" />
                    <span className="text-sm font-black uppercase tracking-widest text-slate-800">Financial Ledger Archive</span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System ID: TP-FIN-RECO-942</span>
                </div>
            </div>
            <div className="p-2 sm:p-4 lg:p-6 relative z-10">
                <ReceiptTable />
            </div>
        </div>
    </div>
  );
};

export default ReceiptPage;
