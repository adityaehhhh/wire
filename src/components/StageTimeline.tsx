import React from 'react';
import { CheckCircle2, Circle, PlayCircle, ChevronRight } from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { STAGES } from '../data/stages';

export const StageTimeline: React.FC = () => {
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const setStageIndex = useMachineStore((state) => state.setStageIndex);
  const isRunning = useMachineStore((state) => state.isRunning);

  return (
    <aside className="w-72 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col h-full z-20 shrink-0 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Chakra_Petch']">
            Process Timeline
          </h2>
          <div className="text-[11px] text-slate-400">
            Stage {String(currentStageIndex + 1).padStart(2, '0')} of {STAGES.length}
          </div>
        </div>
        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          IS 10810 / 7098
        </div>
      </div>

      {/* Stage List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {STAGES.map((stage, idx) => {
          const isActive = idx === currentStageIndex;
          const isCompleted = idx < currentStageIndex;

          return (
            <button
              key={stage.id}
              onClick={() => setStageIndex(idx)}
              className={`w-full text-left p-2 rounded-lg transition-all flex items-start space-x-2.5 border ${
                isActive
                  ? 'bg-cyan-950/60 border-cyan-500/50 shadow-md shadow-cyan-950/50 text-white'
                  : isCompleted
                  ? 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
              }`}
            >
              {/* Icon Status Indicator */}
              <div className="mt-0.5 shrink-0">
                {isActive ? (
                  <PlayCircle className={`w-4 h-4 text-cyan-400 ${isRunning ? 'animate-pulse' : ''}`} />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400/80' : 'text-slate-400'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {(stage.durationMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div
                  className={`text-xs font-semibold truncate ${
                    isActive ? 'text-cyan-100 font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-300'
                  }`}
                >
                  {stage.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {stage.subtitle}
                </div>
              </div>

              {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 self-center shrink-0" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
