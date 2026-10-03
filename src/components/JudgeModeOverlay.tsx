import React from 'react';
import { Sparkles, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { STAGES } from '../data/stages';

export const JudgeModeOverlay: React.FC = () => {
  const judgeMode = useMachineStore((state) => state.judgeMode);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const currentStage = STAGES[currentStageIndex];

  if (!judgeMode || !currentStage) return null;

  return (
    <div className="absolute top-4 left-4 max-w-md bg-slate-900/90 backdrop-blur-md border border-amber-500/40 rounded-xl p-3.5 shadow-xl shadow-amber-950/30 z-20 select-none animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 font-['Chakra_Petch']">
          JUDGE MODE: WHY THIS STEP?
        </span>
        <span className="text-[9px] font-mono text-slate-400 ml-auto">
          Stage {currentStage.index}/18
        </span>
      </div>

      {/* Stage Title */}
      <h3 className="text-xs font-bold text-white mt-1.5 font-['Chakra_Petch']">
        {currentStage.title}
      </h3>

      {/* Why This Step Rationale */}
      <p className="text-[11px] text-amber-100/90 mt-1 leading-relaxed bg-amber-950/30 p-2 rounded border border-amber-500/20">
        "{currentStage.whyThisStep}"
      </p>

      {/* Process Description */}
      <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
        {currentStage.description}
      </p>
    </div>
  );
};
