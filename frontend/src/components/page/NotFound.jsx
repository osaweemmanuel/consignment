import React from 'react';
import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div className="space-y-10 max-w-2xl animate-slide-up">
        {/* Flagship Fault Terminal */}
        <div className="inline-flex p-10 rounded-full bg-primary-main/10 border border-primary-main/20 text-primary-light">
          <Construction className="w-20 h-20" />
        </div>

        <div>
          <h1 className="text-8xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-primary-light uppercase tracking-widest mb-10">
            Node Not Established
          </h2>
          <p className="text-white/40 text-lg font-medium leading-relaxed max-w-md mx-auto italic">
            "The requested corridor does not exist within our global logistics network. Please verify the coordinate link and try again."
          </p>
        </div>

        <Link 
          to="/" 
          className="inline-block bg-primary-main hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all duration-300 shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:scale-95"
        >
          Return to Command
        </Link>
      </div>
    </div>
  );
};

export default NotFound;