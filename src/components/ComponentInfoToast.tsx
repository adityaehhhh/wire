import React from 'react';
import { useMachineStore } from '../store/useMachineStore';
import { Cpu } from 'lucide-react';

export const ComponentInfoToast: React.FC = () => {
  const activeToast = useMachineStore((state) => state.activeToast);

  if (!activeToast) return null;

  return (
    <div className="fixed top-24 left-8 z-40 animate-in fade-in slide-in-from-left-4 duration-300 pointer-events-none select-none max-w-sm">
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-slate-100 relative overflow-hidden">
        {/* Glow Accent Bar */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600"></div>

        <div className="flex items-center space-x-2 mb-1.5">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            ACTIVE MECHANISM
          </span>
        </div>

        <div className="text-sm font-bold text-white font-['Chakra_Petch'] leading-tight">
          {activeToast.name}
        </div>
        <div className="text-[11px] font-semibold text-slate-400 mb-1">
          {activeToast.subtitle}
        </div>
        <div className="text-[11px] text-slate-300 leading-snug">
          {activeToast.desc}
        </div>
      </div>
    </div>
  );
};
