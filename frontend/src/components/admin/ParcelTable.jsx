import React, { useEffect, useState, useRef } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  CheckCircle,
  X,
  ChevronDown,
  Printer,
  FileText,
  Copy,
  Table as TableIcon,
  Download,
  Check
} from 'lucide-react';
import { useGetAllParcelsQuery, useDeleteParcelMutation } from "../../features/parcel/parcelApiSlice";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const ParcelTable = ({ onRefetch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeAction, setActiveAction] = useState(null);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    no: true,
    tracking: true,
    shipper: true,
    recipient: true,
    destination: true,
    dispatchDate: true,
    deliveryDate: true,
    status: true,
    action: true
  });
  
  const navigate = useNavigate();
  const [deleteParcel] = useDeleteParcelMutation();
  const tableRef = useRef(null);

  const { data, isLoading, refetch } = useGetAllParcelsQuery({
    refetchOnWindowFocus: true,
    pollingInterval: 10000,
  });

  useEffect(() => {
    refetch();
  }, [onRefetch, refetch]);

  const parcelData = data?.parcelResult || data?.results || (Array.isArray(data) ? data : []);
  
  const filteredParcels = (parcelData || []).filter(parcel => {
    const term = searchTerm.toLowerCase();
    return (
        parcel.receiverName?.toLowerCase().includes(term) ||
        parcel.trackingNumber?.toLowerCase().includes(term) ||
        parcel.status?.toLowerCase().includes(term) ||
        parcel.destination?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredParcels.length / rowsPerPage);
  const displayedParcels = filteredParcels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusStyle = (status) => {
    const s = status.toLowerCase();
    if (s === 'impounded' || s === 'pending') return 'bg-[#dc3545] text-white';
    if (s === 'delivered') return 'bg-[#28a745] text-white';
    return 'bg-[#ffc107] text-white';
  };

  // --- EXPORT LOGIC ---
  const copyToClipboard = () => {
    const headers = ['No', 'Tracking No', 'Shipper', 'Shipper Email', 'Recipient', 'Recipient Email', 'Destination', 'Dispatch Date', 'Est. Delivery', 'Status'];
    const rows = filteredParcels.map((p, i) => [
        i + 1,
        p.trackingNumber,
        p.senderName,
        p.senderEmail || 'N/A',
        p.receiverName,
        p.receiverEmail || 'N/A',
        p.destination,
        p.dispatchDate || 'N/A',
        p.deliveryDate || 'N/A',
        p.status
    ]);
    const content = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(content);
    alert("Asset Manifest copied to terminal clipboard.");
  };

  const exportToCSV = (type = 'csv') => {
    const headers = ['No', 'Tracking No', 'Shipper', 'Shipper Email', 'Recipient', 'Recipient Email', 'Destination', 'Dispatch Date', 'Est. Delivery', 'Status'];
    const rows = filteredParcels.map((p, i) => [
        i + 1,
        p.trackingNumber,
        p.senderName,
        p.senderEmail || 'N/A',
        p.receiverName,
        p.receiverEmail || 'N/A',
        p.destination,
        p.dispatchDate || 'N/A',
        p.deliveryDate || 'N/A',
        p.status
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `TUNSHPRESH_MANIFEST_${new Date().getTime()}.${type === 'excel' ? 'xls' : 'csv'}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 10,
      filename: `TUNSHPRESH_MANIFEST_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading Matrix...</div>;

  return (
    <div className="bg-white relative">
      {/* Table Export Actions Bar */}
      <div className="px-8 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 bg-slate-50/30">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredParcels.length)} of {filteredParcels.length} entries
        </div>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <button onClick={copyToClipboard} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2 border-r border-slate-200">
                <Copy size={13} /> Copy
            </button>
            <button onClick={() => exportToCSV('csv')} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2 border-r border-slate-200">
                <FileText size={13} /> CSV
            </button>
            <button onClick={() => exportToCSV('excel')} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2 border-r border-slate-200">
                <FileText size={13} /> Excel
            </button>
            <button onClick={exportToPDF} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2 border-r border-slate-200">
                <Download size={13} /> PDF
            </button>
            <button onClick={handlePrint} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2 border-r border-slate-200">
                <Printer size={13} /> Print
            </button>
            <div className="relative">
                <button 
                  onClick={() => setColumnMenuOpen(!columnMenuOpen)}
                  className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                    <TableIcon size={13} /> Columns
                </button>
                <AnimatePresence>
                  {columnMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl py-3 z-50 overflow-hidden"
                    >
                        <div className="px-4 py-2 border-b border-slate-50 mb-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility Link</span>
                        </div>
                        {Object.keys(visibleColumns).map((col) => (
                           <button 
                             key={col}
                             onClick={() => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))}
                             className="w-full text-left px-5 py-2 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
                           >
                             {col}
                             {visibleColumns[col] && <Check size={12} className="text-emerald-500" />}
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
            <tr className="bg-[#F8F9FA] border-b border-slate-200">
              {visibleColumns.no && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight w-20">No</th>}
              {visibleColumns.tracking && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight">Tracking No</th>}
              {visibleColumns.shipper && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight">Shipper</th>}
              {visibleColumns.recipient && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight">Recipient</th>}
              {visibleColumns.destination && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight">Destination</th>}
              {visibleColumns.dispatchDate && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight">Dispatch</th>}
              {visibleColumns.deliveryDate && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight">Est. Delivery</th>}
              {visibleColumns.status && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight">Status</th>}
              {visibleColumns.action && <th className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedParcels.map((parcel, idx) => {
              const parcelId = parcel._id || parcel.id || idx;
              return (
              <tr key={parcelId} className="hover:bg-slate-50/50 transition-colors group">
                {visibleColumns.no && <td className="px-6 py-5 text-xs font-medium text-slate-500">{page * rowsPerPage + idx + 1}</td>}
                {visibleColumns.tracking && (
                  <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-900">{parcel.trackingNumber}</span>
                  </td>
                )}
                {visibleColumns.shipper && (
                  <td className="px-6 py-5">
                      <div className="text-xs font-bold text-slate-800 uppercase">{parcel.senderName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{parcel.senderEmail || 'N/A'}</div>
                  </td>
                )}
                {visibleColumns.recipient && (
                  <td className="px-6 py-5">
                      <div className="text-xs font-bold text-slate-800 uppercase">{parcel.receiverName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{parcel.receiverEmail || 'N/A'}</div>
                  </td>
                )}
                {visibleColumns.destination && <td className="px-6 py-5 text-xs text-slate-600 font-medium">{parcel.destination}</td>}
                {visibleColumns.dispatchDate && (
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                      {parcel.dispatchDate || 'N/A'}
                  </td>
                )}
                {visibleColumns.deliveryDate && (
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                      {parcel.deliveryDate || 'N/A'}
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="px-6 py-5">
                      <span className={`inline-block px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest min-w-[120px] text-center shadow-sm ${getStatusStyle(parcel.status)}`}>
                          {parcel.status}
                      </span>
                  </td>
                )}
                {visibleColumns.action && (
                  <td className="px-6 py-5">
                      <div className="flex justify-center relative">
                          <button 
                              onClick={() => setActiveAction(activeAction === parcelId ? null : parcelId)}
                              className={`flex items-center gap-2 px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeAction === parcelId ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'text-slate-600 bg-white border-slate-300 hover:bg-slate-50'}`}
                          >
                              SELECT <ChevronDown size={14} className={`transition-transform duration-300 ${activeAction === parcelId ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                              {activeAction === parcelId && (
                                  <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2 z-[100] overflow-hidden"
                                  >
                                      <button 
                                          onClick={() => navigate(`/admin/parcel_view?trackingNumber=${parcel.trackingNumber}`)}
                                          className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-primary-main hover:text-white flex items-center gap-3 transition-colors"
                                      >
                                          <Eye size={14} /> View Details
                                      </button>
                                      <button 
                                          onClick={() => navigate(`/admin/parcel_update?trackingNumber=${parcel.trackingNumber}`)}
                                          className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-primary-main hover:text-white flex items-center gap-3 transition-colors"
                                      >
                                          <Edit3 size={14} /> Reconfigure
                                      </button>
                                      <div className="h-px bg-slate-100 my-1" />
                                      <button 
                                          onClick={async () => {
                                              if(window.confirm("Purge asset from ledger?")) {
                                                  await deleteParcel(parcel.trackingNumber);
                                                  refetch();
                                              }
                                              setActiveAction(null);
                                          }}
                                          className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                                      >
                                          <Trash2 size={14} /> Purge Record
                                      </button>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                  </td>
                )}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modern Professional Pagination */}
      <div className="px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-[#F8F9FA]/30">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Showing Page {page + 1} of {totalPages || 1}
        </div>
        <div className="flex items-center gap-1">
            <button 
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-2 text-slate-400 hover:text-primary-main disabled:opacity-30 transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${page === i ? 'bg-primary-main text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button 
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2 text-slate-400 hover:text-primary-main disabled:opacity-30 transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ParcelTable;
