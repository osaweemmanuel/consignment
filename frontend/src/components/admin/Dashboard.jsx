import React, { useState } from 'react';
import { 
  Plus, 
  RotateCw, 
  ChevronRight, 
  Home, 
  Activity,
  Layout,
  Terminal,
  Clock,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Globe
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetAllParcelsQuery } from '../../features/parcel/parcelApiSlice';
import { useGetAllReceiptsQuery } from '../../features/receipty/receiptApiSlice';
import DashboardStats from './DashboardStats';
import ParcelFormModal from './ParcelFormModal';
import ParcelTable from './ParcelTable';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { data: parcelData, isLoading: parcelLoading, refetch: refetchParcels, isFetching: parcelFetching } = useGetAllParcelsQuery({
    pollingInterval: 30000,
  });

  const { data: receiptData, isLoading: receiptLoading, refetch: refetchReceipts, isFetching: receiptFetching } = useGetAllReceiptsQuery({
    pollingInterval: 30000,
  });

  const isLoading = parcelLoading || receiptLoading;
  const isFetching = parcelFetching || receiptFetching;
  const refetch = () => { refetchParcels(); refetchReceipts(); };
  
  const { userInfo } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 shadow-sm" />)}
        </div>
        <div className="h-96 bg-white rounded-xl border border-slate-200 shadow-sm" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10"
    >
      {/* Header & Breadcrumbs Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Operation Analytics</h1>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/admin/dashboard" className="hover:text-primary-main transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-slate-300">Operations</span>
            <ChevronRight size={12} />
            <span className="text-primary-main">Analytics Hub</span>
        </div>
      </div>

      {/* Select Criteria / Filter Master Card */}
      <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
            <Filter size={18} className="text-primary-main" />
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Target Selection Parameters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Category *</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-primary-main/10 focus:border-primary-main outline-none transition-all">
                    <option>Global Freight</option>
                    <option>Express Parcel</option>
                    <option>Sensitive Cargo</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporal Cycle</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-primary-main/10 focus:border-primary-main outline-none transition-all">
                    <option>February</option>
                    <option>March</option>
                    <option>Q1 2026</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Year</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-primary-main/10 focus:border-primary-main outline-none transition-all">
                    <option>2026</option>
                    <option>2025</option>
                </select>
            </div>
            <button className="bg-accent-main hover:bg-accent-hover text-white h-[46px] rounded-lg px-8 flex items-center justify-center gap-3 transition-all shadow-lg group active:scale-95">
                <Search size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Execute Scan</span>
            </button>
        </div>
      </div>

      {/* Core Intelligence Widgets */}
      <DashboardStats parcels={parcelData?.parcelResult} receipts={receiptData?.results} />

      {/* Primary Management Table Surface */}
      <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
        {/* Card Header with Quick Actions */}
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-main text-white rounded-lg">
                    <BarChart3 size={20} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Manifest Ledger Terminal</h3>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1 flex items-center gap-2">
                      <Globe size={10} className="text-emerald-500" /> Authorized System Access Only
                   </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-main transition-colors" size={14} />
                    <input 
                        placeholder="Search Records..." 
                        className="bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs font-bold text-slate-600 focus:bg-white focus:ring-2 focus:ring-primary-main/10 focus:border-primary-main outline-none transition-all w-64"
                    />
                </div>
                <button 
                  onClick={() => refetch()}
                  className={`p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:text-primary-main hover:bg-slate-50 transition-all ${isFetching ? 'animate-spin' : ''}`}
                >
                    <RotateCw size={18} />
                </button>
                <div className="h-6 w-px bg-slate-100" />
                <ParcelFormModal onParcelCreated={refetch} />
            </div>
        </div>

        {/* Manifest Table Container */}
        <div className="p-0">
            <ParcelTable />
        </div>

        {/* Footer Quick Reports */}
        <div className="px-8 py-6 bg-blue-50/50 border-t border-slate-100 flex flex-wrap gap-4">
            <button className="px-6 py-2.5 bg-primary-main hover:bg-primary-dark text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 group active:scale-95">
               <Activity size={14} /> Generate Excel Manifest
            </button>
            <button className="px-6 py-2.5 bg-primary-main hover:bg-primary-dark text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 group active:scale-95">
               <BarChart3 size={14} /> Export Operational Data
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
