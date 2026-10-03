import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Eye,
  Layers,
  Network,
  Settings,
  ShieldCheck,
  Video,
  Sparkles,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { RECIPES } from '../data/recipes';

interface HeaderProps {
  onOpenDataFlow: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDataFlow }) => {
  const isRunning = useMachineStore((state) => state.isRunning);
  const judgeMode = useMachineStore((state) => state.judgeMode);
  const setJudgeMode = useMachineStore((state) => state.setJudgeMode);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);
  const setSelectedRecipe = useMachineStore((state) => state.setSelectedRecipe);
  const cycleCount = useMachineStore((state) => state.cycleCount);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-wider font-['Chakra_Petch'] text-white">
              SPECI-X
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Digital Twin v2.6
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-['Plus_Jakarta_Sans']">
            Automated Cable Specimen Preparation &amp; AI Inspection System
          </p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* System Online Badge */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700/80">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isRunning ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isRunning ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <span className="text-xs font-semibold tracking-wide text-slate-200">
            {isRunning ? 'CYCLE ACTIVE' : 'SYSTEM ONLINE'}
          </span>
        </div>

        {/* PLC / Safety Status */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Siemens S7-1200: <strong className="text-emerald-400">PROFINET OK</strong></span>
        </div>

        {/* Cycle Count */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-['JetBrains_Mono']">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>CYCLE: #{124 + cycleCount - 1}</span>
        </div>
      </div>

      {/* Right Action Tools & Recipe Selector */}
      <div className="flex items-center space-x-3">
        {/* Recipe Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-left">
            <div className="text-[9px] text-slate-400 uppercase font-semibold">Standard Recipe</div>
            <select
              value={selectedRecipe.id}
              onChange={(e) => {
                const found = RECIPES.find((r) => r.id === e.target.value);
                if (found) setSelectedRecipe(found);
              }}
              className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {RECIPES.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-slate-100">
                  {r.standard} - {r.cableType.substring(0, 20)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Flow Architecture Button */}
        <button
          onClick={onOpenDataFlow}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
          title="View Digital Twin Architecture & Data Flow"
        >
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Data Flow</span>
        </button>

        {/* Judge Mode Switch */}
        <button
          onClick={() => setJudgeMode(!judgeMode)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
            judgeMode
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/10'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Judge Mode (includes step explanations and rationale)"
        >
          <Sparkles className={`w-4 h-4 ${judgeMode ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span>JUDGE MODE</span>
          <span
            className={`text-[9px] uppercase px-1.5 py-0.2 rounded ${
              judgeMode ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {judgeMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </header>
  );
};
