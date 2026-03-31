import React from 'react';
import { 
  Truck, 
  Package, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Globe,
  Clock,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, subtext, color = 'primary', delay, trend = 'up' }) => {
  const colorVariants = {
    primary: 'bg-primary-main/5 text-primary-main border-primary-main/10',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col gap-6 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary-main/5 transition-colors" />
      
      <div className="flex justify-between items-start relative z-10">
          <div className={`p-3.5 rounded-xl border ${colorVariants[color]} transition-transform duration-500 group-hover:scale-110 shadow-sm bg-white`}>
            {React.cloneElement(icon, { size: 22, strokeWidth: 2.5 })}
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${trend === 'up' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend === 'up' ? '+12.5%' : '-3.2%'}
          </div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 shadow-white">
          {title}
        </h4>
        <div className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-3 group-hover:text-primary-main transition-colors italic">
          {value}
        </div>
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${color === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-70">
                {subtext}
            </span>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardStats = ({ parcels, receipts }) => {
  const parcelList = Array.isArray(parcels) ? parcels : (parcels?.parcelResult || parcels?.results || []);
  const receiptList = Array.isArray(receipts) ? receipts : (receipts?.results || receipts?.receiptResult || []);

  const total = parcelList.length || 0;
  const inTransit = parcelList.filter(p => {
    const s = p.status?.toLowerCase();
    return s === 'in transit' || s === 'on hold' || s === 'pending';
  }).length || 0;
  const delivered = parcelList.filter(p => p.status?.toLowerCase() === 'delivered').length || 0;
  
  const revenue = receiptList.reduce((acc, r) => acc + (parseFloat(r.total_payment) || 0), 0) || 0;

  const stats = [
    {
      title: 'Total Consignments',
      value: total,
      icon: <Package />,
      subtext: 'Global Asset Records',
      color: 'blue',
      delay: 0.1,
      trend: 'up'
    },
    {
      title: 'Active Shipments',
      value: inTransit,
      icon: <Truck />,
      subtext: 'Assets in transit',
      color: 'primary',
      delay: 0.2,
      trend: 'up'
    },
    {
      title: 'Success Rate',
      value: `${total ? Math.round((delivered/total)*100) : 0}%`,
      icon: <UserCheck />,
      subtext: 'Fulfilled Deliveries',
      color: 'emerald',
      delay: 0.3,
      trend: 'up'
    },
    {
      title: 'Aggregate Revenue',
      value: `$${revenue.toLocaleString()}`,
      icon: <CreditCard />,
      subtext: 'Financial Settlement',
      color: 'amber',
      delay: 0.4,
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
