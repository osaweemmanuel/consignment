import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  History, 
  Wallet, 
  Receipt, 
  ShieldAlert, 
  LogOut, 
  Settings, 
  Bell, 
  Globe,
  User,
  Search,
  ChevronRight,
  ChevronDown,
  Terminal,
  Activity,
  MessageSquare,
  BarChart3,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../features/auth/userApiSlice';
import DashFooter from './DashFooter';
import Logo from '../Logo';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(['OPERATIONS']);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    if (!userInfo) navigate("/login");
  }, [navigate, userInfo]);

  const toggleGroup = (group) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const menuGroups = [
    {
      title: 'OPERATIONS',
      icon: <Briefcase size={16} />,
      items: [
        { name: 'Operations Center', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
        { name: 'Consignment Ledger', icon: <Package size={18} />, path: '/admin/dashboard' },
        { name: 'System Activity', icon: <History size={18} />, path: '/admin/activity-logs' },
      ]
    },
    {
      title: 'ACCOUNTS',
      icon: <CreditCard size={16} />,
      items: [
        { name: 'Financial Gateway', icon: <Wallet size={18} />, path: '/admin/wallet' },
        { name: 'Billing Records', icon: <Receipt size={18} />, path: '/admin/receipt' },
      ]
    },
    {
      title: 'UTILITIES',
      icon: <Settings size={16} />,
      items: [
        { name: 'Security Control', icon: <ShieldAlert size={18} />, path: '/admin/change-password' },
        { name: 'View Website', icon: <Globe size={18} />, path: '/service' },
      ]
    },
    {
      title: 'REPORTS',
      icon: <BarChart3 size={16} />,
      items: [
        { name: 'Activity Report', icon: <Terminal size={18} />, path: '/admin/activity-logs' },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const SidebarContent = ({ isMobile, onClose }) => (
    <div className="flex flex-col h-full bg-primary-main text-white/70 font-sans">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div onClick={() => { navigate('/admin/dashboard'); if(isMobile) onClose(); }} className="cursor-pointer">
           <Logo size="sm" textClass="text-white" iconColor="#ffffff" accentColor="#FF6600" />
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-2">
        {menuGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.title);
          return (
            <div key={group.title} className="space-y-1">
              <button 
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/40 group-hover:text-accent-main transition-colors">{group.icon}</span>
                  {group.title}
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden relative ml-3 border-l border-white/10"
                  >
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <NavLink
                          key={item.name}
                          to={item.path}
                          onClick={isMobile ? onClose : undefined}
                          className={`
                            flex items-center gap-4 px-6 py-3 text-[13px] font-bold transition-all border-l-2 -ml-[1px]
                            ${isActive 
                              ? 'text-white border-accent-main bg-white/5' 
                              : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'}
                          `}
                        >
                          <span className={`${isActive ? 'text-accent-main' : 'text-white/30'}`}>{item.icon}</span>
                          {item.name}
                        </NavLink>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer / User Quick Select */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-accent-main flex items-center justify-center text-white font-black">
            {userInfo?.firstname?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-black text-white truncate uppercase tracking-widest">{userInfo?.firstname}</div>
            <div className="text-[10px] font-bold text-white/40 truncate uppercase tracking-tighter">Command Admin</div>
          </div>
          <button onClick={handleLogout} className="p-2 text-white/40 hover:text-rose-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200">
        <SidebarContent isMobile={false} />
      </aside>
 
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 z-[101] lg:hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent isMobile={true} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
 
      {/* Main Interface Wrapper */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {/* Professional Header Hub */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button 
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
                <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-blue-50 border border-slate-100 rounded-lg px-4 py-1.5 w-72 focus-within:ring-2 focus-within:ring-primary-main/10 transition-all">
                <Search size={16} className="text-slate-400" />
                <input 
                  placeholder="Search Global Nodes..." 
                  className="bg-transparent border-none outline-none text-xs text-slate-600 ml-3 w-full font-medium"
                />
            </div>
          </div>
  
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-4 text-slate-400 text-xs font-bold tracking-tight">
               <span className="text-slate-300">|</span>
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500" />
                  <span className="uppercase tracking-widest text-[9px] font-black text-slate-500">Node: Local-01</span>
               </div>
               <span className="text-slate-300">|</span>
               <span className="uppercase tracking-widest text-[9px] font-black">{new Date().getFullYear()} [v8.4.0]</span>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all relative">
                    <MessageSquare size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-main rounded-full ring-2 ring-white" />
                </button>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all relative">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 text-[7px] text-white font-black flex items-center justify-center rounded-full ring-2 ring-white">12</span>
                </button>
                <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
                    <Globe size={18} />
                </button>
                <div 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 pl-2 cursor-pointer group relative"
                >
                    <div className="w-8 h-8 rounded-lg bg-primary-main flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        {userInfo?.firstname?.[0]}
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    
                    {userMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-[100] animate-scale-in">
                        <div className="px-4 py-2 border-b border-slate-100 mb-2">
                           <div className="text-xs font-black text-slate-900 uppercase truncate">{userInfo?.firstname}</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrator</div>
                        </div>
                        <button onClick={() => { navigate('/admin/change-password'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-main flex items-center gap-3 transition-colors">
                           <User size={14} /> Profile Node
                        </button>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors">
                           <LogOut size={14} /> Terminate Session
                        </button>
                      </div>
                    )}
                </div>
            </div>
          </div>
        </header>
  
        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
            <div className="relative z-10 max-w-[1600px] mx-auto">
              <Outlet />
            </div>
        </main>
  
        <DashFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
