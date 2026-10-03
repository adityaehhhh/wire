import React, { useEffect, useRef } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  SkipBack,
  SkipForward,
  Gauge,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { STAGES } from '../data/stages';

export const BottomControls: React.FC = () => {
  const isRunning = useMachineStore((state) => state.isRunning);
  const isPaused = useMachineStore((state) => state.isPaused);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const speedMultiplier = useMachineStore((state) => state.speedMultiplier);
  const autoCycleComplete = useMachineStore((state) => state.autoCycleComplete);

  const startCycle = useMachineStore((state) => state.startCycle);
  const stopCycle = useMachineStore((state) => state.stopCycle);
  const resetCycle = useMachineStore((state) => state.resetCycle);
  const nextStage = useMachineStore((state) => state.nextStage);
  const prevStage = useMachineStore((state) => state.prevStage);
  const setSpeedMultiplier = useMachineStore((state) => state.setSpeedMultiplier);

  const currentStage = STAGES[currentStageIndex];

  return (
    <footer className="absolute bottom-4 left-0 right-0 z-30 flex flex-col items-center pointer-events-none select-none px-4">
      {/* Operation Status Pill */}
      <div className="mb-2 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-4 py-1 rounded-full shadow-lg flex items-center space-x-2 text-xs font-mono font-bold pointer-events-auto">
        <span
          className={`w-2 h-2 rounded-full ${
            isRunning
              ? 'bg-emerald-400 animate-ping'
              : autoCycleComplete
              ? 'bg-cyan-400'
              : 'bg-amber-400'
          }`}
        ></span>
        <span
          className={
            isRunning
              ? 'text-emerald-400'
              : autoCycleComplete
              ? 'text-cyan-400'
              : 'text-amber-400'
          }
        >
          {isRunning ? '● OPERATION ACTIVE' : autoCycleComplete ? '✓ CYCLE COMPLETE' : '○ SYSTEM STANDBY'}
        </span>
      </div>

      {/* Main Bottom Control Island */}
      <div className="bg-slate-900/95 border border-slate-700/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-4 pointer-events-auto">
        {/* Step Navigation & Reset */}
        <div className="flex items-center space-x-1.5 border-r border-slate-800 pr-3">
          <button
            onClick={resetCycle}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            title="Reset Machine to Initial State"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={prevStage}
            disabled={currentStageIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Stage"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={nextStage}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Next Stage"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero START / STOP Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={startCycle}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold font-['Chakra_Petch'] tracking-wider text-sm transition-all shadow-lg ${
              isRunning
                ? 'bg-emerald-950/60 text-emerald-500 border border-emerald-500/40 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/25 active:scale-95'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
            <span>START CYCLE</span>
          </button>

          <button
            onClick={stopCycle}
            disabled={!isRunning}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold font-['Chakra_Petch'] tracking-wider text-sm transition-all shadow-lg ${
              !isRunning
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-500/25 active:scale-95'
            }`}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP</span>
          </button>
        </div>

        {/* Speed Multiplier Pill */}
        <div className="hidden sm:flex items-center space-x-1 border-l border-slate-800 pl-3">
          <Gauge className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => setSpeedMultiplier(s)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                speedMultiplier === s
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
