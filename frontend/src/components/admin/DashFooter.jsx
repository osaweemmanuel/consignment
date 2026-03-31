import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

const DashFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="py-10 bg-white border-t border-slate-200">
            <div className="max-w-[1600px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-4 text-[11px] font-bold text-slate-400 text-center md:text-left">
                    <div className="flex items-center gap-2 text-slate-700">
                        <ShieldCheck size={14} className="text-primary-main" />
                        <span className="font-black uppercase tracking-tighter">Tunshpresh Global Logistics System</span>
                    </div>
                    <span className="hidden md:block text-slate-200">|</span>
                    <span>Copyright &copy; {currentYear} All Rights Reserved</span>
                </div>
                
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 group cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)] animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operational Node: Alpha-G1</span>
                        </div>
                        <span className="text-slate-200">|</span>
                        <div className="flex items-center gap-2 text-slate-500 group cursor-default">
                            <Globe size={14} className="group-hover:text-primary-main transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Regional Status: Active</span>
                        </div>
                    </div>
                    
                    <div className="h-5 w-px bg-slate-200 hidden md:block" />
                    
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-main hover:italic transition-all group flex items-center gap-2">
                        System Documentation
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default DashFooter;