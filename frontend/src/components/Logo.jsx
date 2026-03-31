import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ 
  className = '', 
  textClass = 'text-slate-900', 
  iconColor = '#4D148C',
  accentColor = '#FF6600', // FedEx Orange secondary accent
  size = 'md' 
}) => {
  // Size multiplier logic
  const dimensions = {
    sm: { icon: 24, fontMain: 'text-xl', fontSub: 'text-[6px]', box: 'w-8 h-8' },
    md: { icon: 32, fontMain: 'text-2xl', fontSub: 'text-[8px]', box: 'w-10 h-10' },
    lg: { icon: 48, fontMain: 'text-4xl', fontSub: 'text-[10px]', box: 'w-16 h-16' },
    xl: { icon: 80, fontMain: 'text-6xl', fontSub: 'text-xs', box: 'w-24 h-24' },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Animated 3D/Geometric Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${dimensions.box}`}>
         {/* Background skew block */}
         <motion.div 
            className="absolute inset-0 rounded-xl opacity-20"
            style={{ backgroundColor: accentColor }}
            animate={{ rotate: [12, 16, 12] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         />
         {/* Inner geometric globe/box hybrid */}
         <svg 
            width={dimensions.icon} 
            height={dimensions.icon} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={iconColor} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="relative z-10"
         >
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M2 12H22" />
            <path d="M12 2C15.3137 2 18 6.47715 18 12C18 17.5228 15.3137 22 12 22" />
            <path d="M12 2C8.68629 2 6 6.47715 6 12C6 17.5228 8.68629 22 12 22" />
            {/* Superimposed logistics tracking node */}
            <circle cx="12" cy="12" r="3" fill={accentColor} stroke="none" />
         </svg>
      </div>

      {/* Typography block */}
      <div className={`font-black uppercase tracking-tighter leading-none ${textClass}`}>
          TUNSHPRESH<span style={{ color: accentColor }}>.</span><br/>
          <span className={`${dimensions.fontSub} tracking-[0.4em] font-bold opacity-70`}>GLOBAL ARCHITECTURE</span>
      </div>
    </div>
  );
};

export default Logo;
