import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { Globe, Navigation2, Network } from 'lucide-react';

const Preloader = () => {
  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-primary-main flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, translateY: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
        {/* Massive Rotating Background Globe */}
        <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center pointer-events-none text-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                <Globe className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]" />
            </motion.div>
        </div>
        
        {/* Core Foreground Loader */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12"
            >
               <Logo size="xl" textClass="text-white" iconColor="#ffffff" accentColor="#FF6600" />
            </motion.div>
            
            {/* High-Tech Progress Bar */}
            <div className="h-1.5 w-64 md:w-96 bg-white/10 rounded-full overflow-hidden mb-12 relative shadow-[0_0_30px_rgba(255,102,0,0.2)]">
                <motion.div 
                    className="absolute top-0 left-0 h-full bg-accent-main rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                />
            </div>
            
            <div className="flex items-center gap-4 text-white/60 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Network className="w-5 h-5 text-accent-main" />
                </motion.div>
                <motion.span 
                    className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    INITIALIZING GLOBAL LEDGER
                </motion.span>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Navigation2 className="w-5 h-5 text-accent-main" />
                </motion.div>
            </div>
        </div>
    </motion.div>
  );
};

export default Preloader;