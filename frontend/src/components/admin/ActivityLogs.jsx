import React, { useEffect, useState, useRef } from 'react';
import { 
  History, 
  Search, 
  Info, 
  ShieldCheck, 
  User, 
  Terminal, 
  Clock, 
  Database,
  Loader2,
  ChevronRight,
  Globe,
  FileText,
  Activity,
  Filter,
  CheckCircle2,
  Lock,
  Copy,
  Download,
  Printer,
  Table as TableIcon,
  Check
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    timestamp: true,
    admin: true,
    action: true,
    details: true,
    ip: true
  });
  
  const { userInfo, token } = useSelector((state) => state.auth);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!token) return;
      
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';
        const { data } = await axios.get(`${apiUrl}api/v1/parcels/logs`, config);
        setLogs(data.logs);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [userInfo, token]);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.firstname + ' ' + log.lastname).toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionStyles = (action) => {
    if (action.includes('INITIALIZED')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (action.includes('UPDATED')) return 'bg-slate-50 text-slate-700 border-slate-100';
    if (action.includes('DELETED')) return 'bg-red-50 text-red-700 border-red-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  // --- EXPORT LOGIC ---
  const copyToClipboard = () => {
    const headers = ['Timestamp', 'Admin', 'Email', 'Action', 'Details', 'IP'];
    const rows = filteredLogs.map(l => [
        new Date(l.timestamp).toLocaleString(),
        `${l.firstname} ${l.lastname}`,
        l.email,
        l.action,
        l.details,
        l.ip_address
    ]);
    const content = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(content);
    alert("Audit Trail copied to clipboard.");
  };

  const exportToCSV = (type = 'csv') => {
    const headers = ['Timestamp', 'Admin', 'Email', 'Action', 'Details', 'IP'];
    const rows = filteredLogs.map(l => [
        new Date(l.timestamp).toLocaleString(),
        `${l.firstname} ${l.lastname}`,
        l.email,
        l.action,
        l.details,
        l.ip_address
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `SYSTEM_AUDIT_TRAIL_${new Date().getTime()}.${type === 'excel' ? 'xls' : 'csv'}`;
    link.click();
  };

  const exportToPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 10,
      filename: `SYSTEM_AUDIT_TRAIL_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-primary-main animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading System Audit...</span>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in py-8">
      {/* CORPORATE SURVEILLANCE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-10">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-primary-main/5 text-primary-main rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-primary-main/10 shadow-sm">
              <ShieldCheck size={14} /> System Activity surveillance
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-none">
              Administrative <span className="text-primary-main">Audit</span> Ledger
           </h2>
           <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
             Comprehensive visibility into all administrative operations. Every action is timestamped, verified, and mapped within our secure logistics infrastructure.
           </p>
        </div>
        
        <div className="relative w-full lg:w-[380px] group no-print">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-main transition-colors" />
            <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail..." 
                className="w-full h-14 bg-white border border-slate-200 focus:border-primary-main rounded-2xl pl-13 pr-6 text-sm font-bold text-slate-700 outline-none transition-all shadow-sm focus:shadow-md focus:ring-4 focus:ring-primary-main/5 placeholder:text-slate-300"
            />
        </div>
      </div>

      {/* AUDIT INFRASTRUCTURE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* LEDGER STATUS BAR */}
        <div className="px-10 py-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
                <div className="p-3 bg-white text-primary-main rounded-xl border border-slate-200 shadow-sm">
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Operational Integrity Hub</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Audit Monitoring v4.2</span>
                  </div>
                </div>
            </div>
            
            {/* Table Export Actions Bar */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white no-print">
                <button onClick={copyToClipboard} title="Copy" className="p-3 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><Copy size={15} /></button>
                <button onClick={() => exportToCSV('csv')} title="CSV" className="p-3 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><FileText size={15} /></button>
                <button onClick={() => exportToCSV('excel')} title="Excel" className="p-3 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><FileText size={15} /></button>
                <button onClick={exportToPDF} title="PDF" className="p-3 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><Download size={15} /></button>
                <button onClick={() => window.print()} title="Print" className="p-3 text-slate-500 hover:bg-slate-50 border-r border-slate-100 transition-colors"><Printer size={15} /></button>
                <div className="relative">
                    <button onClick={() => setColumnMenuOpen(!columnMenuOpen)} title="Columns" className="p-3 text-slate-500 hover:bg-slate-50 transition-colors"><TableIcon size={15} /></button>
                    <AnimatePresence>
                      {columnMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 animate-scale-in"
                        >
                          {Object.keys(visibleColumns).map(col => (
                            <button 
                              key={col}
                              onClick={() => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))}
                              className="w-full text-left px-5 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
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

        <div className="overflow-x-auto min-w-full" ref={tableRef}>
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/50 border-b border-slate-100">
                {visibleColumns.timestamp && <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>}
                {visibleColumns.admin && <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Administrator Entity</th>}
                {visibleColumns.action && <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action Type</th>}
                {visibleColumns.details && <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operation Details</th>}
                {visibleColumns.ip && <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Access Vector</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log, idx) => {
                const logId = log._id || log.id || idx;
                return (
                <tr key={logId} className="hover:bg-slate-50/50 transition-colors group/row">
                  {visibleColumns.timestamp && (
                    <td className="px-10 py-7 whitespace-nowrap">
                      <div className="flex items-center gap-3.5 text-slate-900">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover/row:text-primary-main transition-colors border border-slate-100 shadow-sm">
                            <Clock size={15} />
                          </div>
                          <span className="text-[13px] font-bold tracking-tight font-mono text-slate-500">
                              {new Date(log.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.admin && (
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-primary-light text-xs font-black shadow-md border border-white/5">
                              {log.firstname?.[0]}
                          </div>
                          <div>
                              <div className="text-[13px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{log.firstname} {log.lastname}</div>
                              <div className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter opacity-70">{log.email}</div>
                          </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-10 py-7 whitespace-nowrap">
                      <div className={`inline-flex px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getActionStyles(log.action)}`}>
                          {log.action}
                      </div>
                    </td>
                  )}
                  {visibleColumns.details && (
                    <td className="px-10 py-7 max-w-md">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden text-[11px] font-bold text-slate-600 leading-relaxed font-mono">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover/row:bg-primary-main transition-colors" />
                        {log.details || 'No extended metadata available'}
                      </div>
                    </td>
                  )}
                  {visibleColumns.ip && (
                    <td className="px-10 py-7 text-right">
                      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-lg text-[10px] font-black text-slate-500 font-mono tracking-widest border border-slate-200 shadow-sm">
                          <Globe size={12} className="text-primary-main opacity-50" />
                          {log.ip_address}
                      </div>
                    </td>
                  )}
                </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="py-24 text-center bg-slate-50/30">
                <div className="flex flex-col items-center gap-5">
                  <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100 relative">
                    <Terminal size={48} className="text-slate-200" />
                    <div className="absolute inset-x-0 bottom-0 top-0 border-2 border-dashed border-primary-main/10 rounded-3xl animate-pulse" />
                  </div>
                  <div>
                    <p className="text-lg font-black uppercase tracking-tighter text-slate-800">Zero Entries Found</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Refine your search parameters or check system uplink</p>
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
