import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Receipt, 
  Search, 
  Eye, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  Loader2,
  CheckCircle,
  X,
  CreditCard,
  Hash,
  User,
  Mail,
  DollarSign,
  Download,
  Filter,
  MoreVertical,
  Check,
  AlertCircle,
  Copy,
  Printer,
  Table as TableIcon,
  FileText
} from 'lucide-react';
import { useGetAllReceiptsQuery, useDeleteReceiptMutation } from '../../features/receipty/receiptApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const ReceiptTable = ({ onRefetch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [activeAction, setActiveAction] = useState(null);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    ref: true,
    payer: true,
    gateway: true,
    status: true,
    amount: true,
    protocol: true
  });
  
  const navigate = useNavigate();
  const [deleteReceipt, { isLoading: isDeleting }] = useDeleteReceiptMutation();
  const tableRef = useRef(null);

  const { data, isLoading, error, refetch } = useGetAllReceiptsQuery({
    refetchOnWindowFocus: true,
    pollingInterval: 30000,
  });

  useEffect(() => {
    if (onRefetch) refetch();
  }, [onRefetch, refetch]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteReceipt(id).unwrap();
      showNotification("Financial node successfully decommissioned.");
      setActiveAction(null);
    } catch (error) {
      showNotification("Authorization failure in decommissioning.", "error");
    }
  };

  // --- EXPORT LOGIC ---
  const filteredReceipts = data?.results?.filter(receipt => {
    const term = searchTerm.toLowerCase();
    return (
      receipt.fullName?.toLowerCase().includes(term) ||
      receipt.email?.toLowerCase().includes(term) ||
      receipt.referenceId?.toString().toLowerCase().includes(term)
    );
  }) || [];

  const copyToClipboard = () => {
    const headers = ['Ref ID', 'Payer', 'Email', 'Method', 'Balance Due', 'Amount'];
    const rows = filteredReceipts.map(r => [
        r.referenceId,
        r.fullName,
        r.email,
        r.payment_method,
        parseFloat(r.total_payment) > 0 ? `$${r.total_payment}` : 'Cleared',
        `$${r.amount}`
    ]);
    const content = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(content);
    showNotification("Financial Ledger copied to clipboard.");
  };

  const exportToCSV = (type = 'csv') => {
    const headers = ['Ref ID', 'Payer', 'Email', 'Method', 'Balance Due', 'Amount'];
    const rows = filteredReceipts.map(r => [
        r.referenceId,
        r.fullName,
        r.email,
        r.payment_method,
        r.total_payment,
        r.amount
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `FINANCIAL_MANIFEST_${new Date().getTime()}.${type === 'excel' ? 'xls' : 'csv'}`;
    link.click();
  };

  const exportToPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 10,
      filename: `FINANCIAL_MANIFEST_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white/50 rounded-3xl">
        <Loader2 className="w-10 h-10 text-primary-main animate-spin" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Ledger...</span>
    </div>
  );

  const totalPages = Math.ceil(filteredReceipts.length / rowsPerPage);
  const displayedReceipts = filteredReceipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="space-y-6">
      {/* PROFESSIONAL FILTER CONSOLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-main" />
          <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
              <div className="w-full lg:w-1/3 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                      <Filter size={12} className="text-primary-main" /> Target Search
                  </label>
                  <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-main transition-colors" />
                      <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Reference, Payer, or Email..."
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-primary-main rounded-lg pl-12 pr-4 text-xs font-bold text-slate-700 outline-none transition-all focus:ring-4 focus:ring-primary-main/5"
                      />
                  </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Batch Range</label>
                      <select 
                        value={rowsPerPage} 
                        onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                        className="h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-primary-main transition-all"
                      >
                          {[10, 25, 50, 100].map(v => <option key={v} value={v}>{v} Entries</option>)}
                      </select>
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Export Node</label>
                      <button onClick={() => exportToCSV('csv')} className="h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-6 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all">
                        <Download size={16} /> Asset Manifest.csv
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* INDUSTRIAL LEDGER TERMINAL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary-main/5 rounded-lg text-primary-main">
                    <Receipt size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Financial Manifest Terminal</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Transaction Ledger v2.4.0</p>
                </div>
            </div>
            {/* Table Export Actions Bar (Sync with user image) */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                <button onClick={copyToClipboard} title="Copy" className="p-2.5 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><Copy size={14} /></button>
                <button onClick={() => exportToCSV('csv')} title="CSV" className="p-2.5 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><FileText size={14} /></button>
                <button onClick={() => exportToCSV('excel')} title="Excel" className="p-2.5 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><FileText size={14} /></button>
                <button onClick={exportToPDF} title="PDF" className="p-2.5 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><Download size={14} /></button>
                <button onClick={() => window.print()} title="Print" className="p-2.5 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><Printer size={14} /></button>
                <div className="relative">
                    <button 
                      onClick={() => setColumnMenuOpen(!columnMenuOpen)}
                      className="p-2.5 text-slate-500 hover:bg-slate-50 transition-colors"
                      title="Columns"
                    >
                        <TableIcon size={14} />
                    </button>
                    <AnimatePresence>
                      {columnMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50"
                        >
                            {Object.keys(visibleColumns).map(col => (
                                <button 
                                  key={col}
                                  onClick={() => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))}
                                  className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                                >
                                    {col} {visibleColumns[col] && <Check size={12} className="text-emerald-500" />}
                                </button>
                            ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                {visibleColumns.ref && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">Ref ID</th>}
                {visibleColumns.payer && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Payer Information</th>}
                {visibleColumns.gateway && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Gateway</th>}
                {visibleColumns.status && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status Node</th>}
                {visibleColumns.amount && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount ($)</th>}
                {visibleColumns.protocol && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Protocol Select</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedReceipts.map((receipt, idx) => {
                const receiptId = receipt._id || receipt.id || idx;
                return (
                <tr key={receiptId} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-primary-main/5 transition-all group`}>
                  {visibleColumns.ref && (
                    <td className="px-8 py-5 border-r border-slate-100/50">
                        <div className="flex items-center gap-2">
                            <Hash size={12} className="text-primary-main/40" />
                            <span className="text-[11px] font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {receipt.referenceId || "RE-000"}
                            </span>
                        </div>
                    </td>
                  )}
                  {visibleColumns.payer && (
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white ${idx % 3 === 0 ? 'bg-slate-900' : idx % 3 === 1 ? 'bg-primary-main' : 'bg-emerald-600'}`}>
                                {receipt.fullName?.[0]}
                            </div>
                            <div>
                                <div className="text-[12px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{receipt.fullName}</div>
                                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <Mail size={10} /> {receipt.email}
                                </div>
                            </div>
                        </div>
                    </td>
                  )}
                  {visibleColumns.gateway && (
                    <td className="px-8 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                            <CreditCard size={12} className="text-primary-main" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{receipt.payment_method}</span>
                        </div>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${parseFloat(receipt.total_payment) > 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                            {parseFloat(receipt.total_payment) > 0 ? (
                              <>
                                <AlertCircle size={10} /> Balance Due: ${parseFloat(receipt.total_payment).toLocaleString()}
                              </>
                            ) : (
                              <>
                                <Check size={10} /> Cleared
                              </>
                            )}
                        </div>
                    </td>
                  )}
                  {visibleColumns.amount && (
                    <td className="px-8 py-5 text-right font-mono">
                        <div className="text-[13px] font-black text-slate-900">${parseFloat(receipt.amount).toLocaleString()}</div>
                    </td>
                  )}
                  {visibleColumns.protocol && (
                    <td className="px-8 py-5">
                        <div className="relative flex justify-center">
                            <button 
                              onClick={() => setActiveAction(activeAction === receiptId ? null : receiptId)}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-primary-main transition-all group-hover:scale-110 shadow-sm"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeAction === receiptId && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveAction(null)} />
                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-20 py-2 animate-scale-in">
                                  <button 
                                    onClick={() => navigate(`/admin/review_receipt?id=${receipt.id}`)}
                                    className="w-full px-5 py-2.5 flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-primary-main transition-all text-left"
                                  >
                                    <Eye size={16} className="text-slate-400" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Inspect Archive</span>
                                  </button>
                                  <button 
                                    onClick={() => navigate(`/admin/receipt_update?id=${receipt.id}`)}
                                    className="w-full px-5 py-2.5 flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-primary-main transition-all text-left"
                                  >
                                    <Edit3 size={16} className="text-slate-400" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Sync Ledger</span>
                                  </button>
                                  <div className="h-px bg-slate-100 mx-2 my-1" />
                                  <button 
                                    onClick={() => {
                                      if(window.confirm("Authorize permanent decommissioning of financial node?")) {
                                        handleConfirmDelete(receipt.id);
                                      }
                                    }}
                                    className="w-full px-5 py-2.5 flex items-center gap-3 text-rose-500 hover:bg-rose-50 transition-all text-left"
                                  >
                                    <Trash2 size={16} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Purge Entity</span>
                                  </button>
                                </div>
                              </>
                            )}
                        </div>
                    </td>
                  )}
                </tr>
                );
              })}
            </tbody>
          </table>
          
          {displayedReceipts.length === 0 && (
            <div className="py-32 text-center bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <Receipt size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-2 italic">Null Ledger Intercepted</h4>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No financial assets matched your filter nexus</p>
            </div>
          )}
        </div>
      </div>

      {/* REFINED PAGINATION CONSOLE */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-slate-800" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            MANIFEST SEQUENCE: {page * rowsPerPage + 1} TO {Math.min((page + 1) * rowsPerPage, filteredReceipts.length)} / {filteredReceipts.length} GLOBAL RECORDS
        </span>
        <div className="flex gap-2">
            <button 
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-400 hover:text-primary-main hover:bg-primary-main/5 disabled:opacity-30 disabled:pointer-events-none transition-all border border-slate-200 shadow-sm"
            >
                <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1 items-center px-4">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${page === i ? 'bg-primary-main text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button 
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-400 hover:text-primary-main hover:bg-primary-main/5 disabled:opacity-30 disabled:pointer-events-none transition-all border border-slate-200 shadow-sm"
            >
                <ChevronRight size={18} />
            </button>
        </div>
      </div>

      {/* PROFESSIONAL NOTIFICATION HUB */}
      {notification.show && (
        <div className={`fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up border ${
            notification.type === 'success' ? 'bg-slate-900 text-white border-white/5' : 'bg-red-600 text-white border-red-500'
        }`}>
            {notification.type === 'success' ? <CheckCircle className="text-emerald-400" size={18} /> : <AlertCircle size={18} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification({ show: false })} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={14} />
            </button>
        </div>
      )}
    </div>
  );
};

export default ReceiptTable;
