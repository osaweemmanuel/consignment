import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  History,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  CreditCard,
  FileText,
  Clock
} from 'lucide-react';
import { useUpdateReceiptMutation } from "../../features/receipty/receiptApiSlice";

const UpdateReceiptModal = ({ ReceiptToUpdate, onReceiptUPdated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [receiptData, setReceiptData] = useState({
    total_payment: "",
    date_payment: ""
  });

  const [updateReceipt, { isLoading: updateLoading }] = useUpdateReceiptMutation();
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (ReceiptToUpdate) {
      setReceiptData(ReceiptToUpdate);
    }
  }, [ReceiptToUpdate]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceiptData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateReceipt({ id, data: receiptData }).unwrap();
      if (onReceiptUPdated) onReceiptUPdated();
      showNotification("Ledger balance synchronized.");
      setTimeout(() => navigate('/admin/receipt'), 2000);
    } catch (error) {
      showNotification(error?.data?.message || "Structural failure in ledger update.", "error");
    }
  };

  const inputClass = "w-full h-12 bg-white border border-slate-300 rounded-xl px-12 text-sm font-bold text-slate-700 outline-none transition-all focus:border-primary-main focus:ring-4 focus:ring-primary-main/5 placeholder:text-slate-300";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1";

  if (updateLoading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4 bg-slate-50/50 min-h-screen">
        <Loader2 className="w-12 h-12 text-primary-main animate-spin" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Processing Financial Update...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12 px-6">
      <div className="max-w-3xl mx-auto mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 hover:text-primary-main font-black text-[10px] uppercase tracking-widest transition-all group"
          >
            <ArrowLeft size={16} />
            Back to Financial Archive
          </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-200 animate-slide-up">
        {/* Professional Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <FileText size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">Update Fiscal Ledger</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Reference ID: #{id || "0000"}
                    </p>
                </div>
            </div>
            <div className="hidden md:block">
                <span className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg font-black text-[9px] uppercase tracking-widest border border-slate-100">
                    Audit Status: Active
                </span>
            </div>
        </div>

        <div className="p-10 md:p-14">
            <form onSubmit={handleUpdate} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className={labelClass}>Total Payment Final ($)</label>
                        <div className="relative flex items-center">
                            <DollarSign className="absolute left-4 text-slate-300" size={18} />
                            <input 
                                name="total_payment" 
                                type="number" 
                                value={receiptData.total_payment} 
                                onChange={handleInputChange} 
                                placeholder="0.00"
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className={labelClass}>Transaction Cleared On</label>
                        <div className="relative flex items-center">
                            <Clock className="absolute left-4 text-slate-300" size={18} />
                            <input 
                                name="date_payment" 
                                type="date" 
                                value={receiptData.date_payment} 
                                onChange={handleInputChange} 
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Audit Context Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary-main shrink-0 shadow-sm">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight mb-1">Batch Reconciliation Protocol</h4>
                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                            All financial adjustments are cross-referenced with the global asset manifest. 
                            Unauthorized discrepancies will trigger a system-wide audit.
                        </p>
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={updateLoading}
                    className="px-10 py-3 bg-primary-main hover:bg-primary-dark text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary-main/20 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Save size={16} />
                        Update Ledger Entry
                      </>
                    )}
                  </button>
                </div>
            </form>
        </div>
      </div>

      {/* Modern Professional Notification */}
      {notification.show && (
        <div className={`fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up border ${
            notification.type === 'success' ? 'bg-slate-900 text-white border-white/5' : 'bg-red-600 text-white border-red-500'
        }`}>
            {notification.type === 'success' ? <CheckCircle className="text-emerald-400" size={18} /> : <AlertCircle size={18} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification({ show: false })} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default UpdateReceiptModal;
