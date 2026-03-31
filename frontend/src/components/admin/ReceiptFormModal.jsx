import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  CreditCard, 
  User, 
  Mail, 
  DollarSign, 
  Calendar, 
  Globe, 
  FileText,
  ShieldCheck,
  Loader2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Layout,
  Terminal,
  Hash
} from 'lucide-react';
import { useCreateReceiptMutation, useGetAllReceiptsQuery } from '../../features/receipty/receiptApiSlice';

const paymentOptions = ['bitcoin payment', 'e-transfer', 'cheque deposit', 'cash mall', 'bank deposit'];
const currencyTypeOptions = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL', 'ARS', 'ZAR', 'KRW', 'RUB', 'MXN', 'TRY', 'SAR'];

const ReceiptFormModal = () => {
  const [open, setOpen] = useState(false);
  const [receiptData, setReceiptData] = useState({
    fullName: '',
    email: '',
    payment_description: '',
    amount: '',
    total_payment: '',
    payment_method: '',
    payment_date: '',
    currency: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const { refetch } = useGetAllReceiptsQuery();
  const [createReceipt, { isSuccess, isLoading, isError, error }] = useCreateReceiptMutation();

  useEffect(() => {
    if (isSuccess) {
      showNotification('Ledger entry generated successfully!');
      refetch();
      handleClose();
    }
    if (isError && error) {
      showNotification(error?.data?.message || 'Verification failure. Please audit entry data.', 'error');
    }
  }, [isSuccess, isError, error, refetch]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setReceiptData({
      fullName: '',
      email: '',
      payment_description: '',
      amount: '',
      total_payment: '',
      payment_method: '',
      payment_date: '',
      currency: '',
    });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceiptData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'payment_description', 'amount', 'total_payment', 'payment_method', 'payment_date'];
    let errors = {};

    requiredFields.forEach((field) => {
      if (!receiptData[field] || receiptData[field].toString().trim() === '') {
        errors[field] = `${field.replace('_', ' ')} required.`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReceiptSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createReceipt({
        ...receiptData,
        amount: parseFloat(receiptData.amount) || 0,
        total_payment: parseFloat(receiptData.total_payment) || 0,
      }).unwrap();
    } catch (error) {}
  };

  const inputClass = "w-full h-12 bg-white border border-slate-300 rounded-xl px-12 text-sm font-bold text-slate-700 outline-none transition-all focus:border-primary-main focus:ring-4 focus:ring-primary-main/5 placeholder:text-slate-300 shadow-sm";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1";

  return (
    <>
      <button 
        onClick={handleOpen}
        className="bg-primary-main hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary-main/20 hover:-translate-y-1 flex items-center gap-3 group active:scale-95"
      >
        <Plus className="w-5 h-5 transition-transform group-hover:rotate-180" />
        New Financial Entry
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F8FAFC] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 animate-scale-in flex flex-col relative">
            
            {/* Header Terminal */}
            <div className="sticky top-0 z-30 px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center overflow-hidden">
                <div className="flex items-center gap-6">
                    <div className="p-3.5 bg-primary-main/5 rounded-2xl text-primary-main shadow-inner">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1 text-slate-800">Generate Audit Receipt</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-main animate-pulse" /> Global Ledger Node active
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleClose} 
                    className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-main transition-all group"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            <form onSubmit={handleReceiptSubmit} className="p-10 md:p-14 space-y-14">
                {/* Section 1: Entity Info */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Entity Identification</h4>
                        <div className="h-px bg-slate-200 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1 group">
                            <label className={labelClass}>Legal Entity Full Name</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                <input 
                                    name="fullName" 
                                    value={receiptData.fullName} 
                                    onChange={handleChange} 
                                    placeholder="Enter full legal name..." 
                                    className={`${inputClass} ${formErrors.fullName ? 'border-red-500 ring-4 ring-red-500/5' : ''}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-1 group">
                            <label className={labelClass}>Digital Asset Uplink (Email)</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                <input 
                                    name="email" 
                                    type="email" 
                                    value={receiptData.email} 
                                    onChange={handleChange} 
                                    placeholder="entity@ledger.com" 
                                    className={`${inputClass} ${formErrors.email ? 'border-red-500 ring-4 ring-red-500/5' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Financial Details */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Fiscal Metrics</h4>
                        <div className="h-px bg-slate-200 w-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-1 group">
                            <label className={labelClass}>Initial Settlement ($)</label>
                            <div className="relative flex items-center">
                                <DollarSign className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                <input 
                                    name="amount" 
                                    type="number" 
                                    value={receiptData.amount} 
                                    onChange={handleChange} 
                                    placeholder="0.00"
                                    className={`${inputClass} ${formErrors.amount ? 'border-red-500 ring-4 ring-red-500/5' : ''}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-1 group">
                            <label className={labelClass}>Residual Overhead ($)</label>
                            <div className="relative flex items-center">
                                <Hash className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                <input 
                                    name="total_payment" 
                                    type="number" 
                                    value={receiptData.total_payment} 
                                    onChange={handleChange} 
                                    placeholder="0.00"
                                    className={`${inputClass} ${formErrors.total_payment ? 'border-red-500 ring-4 ring-red-500/5' : ''}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-1 group">
                            <label className={labelClass}>Operational Currency</label>
                            <div className="relative flex items-center">
                                <Globe className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                <select 
                                    name="currency" 
                                    value={receiptData.currency} 
                                    onChange={handleChange} 
                                    className={inputClass}
                                >
                                    <option value="">Select Asset Type</option>
                                    {currencyTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1 group">
                            <label className={labelClass}>Settlement Channel</label>
                            <div className="relative flex items-center">
                                <CreditCard className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                <select 
                                    name="payment_method" 
                                    value={receiptData.payment_method} 
                                    onChange={handleChange} 
                                    className={`${inputClass} ${formErrors.payment_method ? 'border-red-500 ring-4 ring-red-500/5' : ''}`}
                                >
                                    <option value="">Operational Gateway</option>
                                    {paymentOptions.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1 group">
                            <label className={labelClass}>Audit Timestamp</label>
                            <div className="relative flex items-center">
                                <Calendar className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                <input 
                                    name="payment_date" 
                                    type="date" 
                                    value={receiptData.payment_date} 
                                    onChange={handleChange} 
                                    className={`${inputClass} ${formErrors.payment_date ? 'border-red-500 ring-4 ring-red-500/5' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1 group">
                    <label className={labelClass}>Fiscal Transaction Narrative</label>
                    <textarea 
                        name="payment_description" 
                        value={receiptData.payment_description} 
                        onChange={handleChange} 
                        rows="3" 
                        placeholder="Detail the purpose of this financial asset generation..." 
                        className={`w-full bg-white border border-slate-300 rounded-xl p-6 text-sm font-bold text-slate-700 outline-none transition-all focus:border-primary-main focus:ring-4 focus:ring-primary-main/5 resize-none shadow-sm ${formErrors.payment_description ? 'border-red-500 ring-4 ring-red-500/5' : ''}`}
                    ></textarea>
                </div>

                {/* ACTION FOOTER */}
                <div className="pt-8 flex justify-end gap-4 border-t border-slate-100">
                    <button 
                        type="button"
                        onClick={handleClose}
                        className="px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        Abandon
                    </button>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="px-12 py-3 bg-primary-main hover:bg-primary-dark text-white rounded-xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-primary-main/20 flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={18} />}
                      Authorize Entry
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL NOTIFICATION NODE */}
      {notification.show && (
        <div className={`fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up border ${
            notification.type === 'success' ? 'bg-slate-900 text-white border-white/5' : 'bg-red-600 text-white border-red-500'
        }`}>
            {notification.type === 'success' ? <CheckCircle className="text-emerald-400" size={18} /> : <AlertCircle size={18} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification({ show: false })} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={14} /></button>
        </div>
      )}
    </>
  );
};

export default ReceiptFormModal;
