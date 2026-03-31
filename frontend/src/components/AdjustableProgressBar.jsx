import React from 'react';
import { 
  Package, 
  Warehouse, 
  Truck, 
  CheckCircle, 
  Home,
  Navigation
} from 'lucide-react';

const steps = [
    { label: 'Initiated', icon: <Package /> },
    { label: 'Facility', icon: <Warehouse /> },
    { label: 'In Transit', icon: <Truck /> },
    { label: 'Out for Delivery', icon: <Navigation /> },
    { label: 'Delivered', icon: <Home /> }
];

const AdjustableProgressBar = ({ progressStatus }) => {
  // Map 0-100% to index 0-4
  const activeStep = Math.min(4, Math.floor(progressStatus / 20));

  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2" />
        
        {/* Fill Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary-main -translate-y-1/2 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl ${
                isActive 
                  ? 'bg-primary-main text-white scale-110' 
                  : 'bg-slate-100 text-slate-400 scale-100'
              } ${isCurrent ? 'animate-pulse ring-4 ring-primary-main/20' : ''}`}>
                {React.cloneElement(step.icon, { size: 24 })}
              </div>
              
              <div className="mt-4 text-center">
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? 'text-primary-main' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>

              {isActive && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
                  <CheckCircle size={10} className="text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block px-4 py-2 bg-primary-main/10 rounded-full border border-primary-main/20">
          <span className="text-[10px] font-black text-primary-main uppercase tracking-[0.2em]">
            ASSET STREAM PROGRESS: {progressStatus}% COMPLETE
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdjustableProgressBar;
