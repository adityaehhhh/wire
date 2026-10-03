import React from 'react';
import {
  Eye,
  Scan,
  Flame,
  Box,
  Cpu,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { InspectionViewMode } from '../types';

export const AiVisionDashboard: React.FC = () => {
  const inspectionViewMode = useMachineStore((state) => state.inspectionViewMode);
  const setInspectionViewMode = useMachineStore((state) => state.setInspectionViewMode);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const telemetry = useMachineStore((state) => state.telemetry);
  const lastResult = useMachineStore((state) => state.lastPassRejectResult);

  const isReject = lastResult === 'REJECT';
  const isPrePunch = currentStageIndex < 8;
  const isEnteringInspection = currentStageIndex === 8 || currentStageIndex === 9;

  if (isPrePunch) {
    return (
      <div className="space-y-3 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-slate-200 font-['Chakra_Petch']">
              AI Computer Vision &amp; Metrology
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            STANDBY
          </span>
        </div>

        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Scan className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 font-['Chakra_Petch'] uppercase">
              Specimen Preparation in Progress
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
              Material is currently in the uncoiling / cutting / flattening phase. Optical vision inspection and defect analysis activate after dumbbell specimen punching at Stage 08.
            </p>
          </div>
          <div className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
            CURRENT: STAGE S0{currentStageIndex + 1}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 select-none">
      {/* AI Pipeline Top Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-xs font-bold text-slate-200 font-['Chakra_Petch']">
            AI Computer Vision &amp; Metrology
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
          SIMULATED AI
        </span>
      </div>

      {/* 4 View Modes Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
        {[
          { id: 'original', label: 'Original', icon: Eye },
          { id: 'canny', label: 'Canny Edge', icon: Scan },
          { id: 'heatmap', label: 'Heatmap', icon: Flame },
          { id: 'profile3d', label: 'Metrology', icon: Box },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = inspectionViewMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setInspectionViewMode(item.id as InspectionViewMode)}
              className={`flex flex-col items-center justify-center py-1.5 rounded transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Optical Frame Visualizer Screen */}
      <div className="relative w-full h-44 rounded-xl bg-slate-950 border border-slate-700/80 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Optical Crosshairs and Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>

        {/* Center Reticle */}
        <div className="absolute w-6 h-6 border border-cyan-500/40 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
        </div>

        {/* SVG Dumbbell Specimen Inspection Profile */}
        <svg viewBox="0 0 320 160" className="w-full h-full p-4 relative z-10">
          {/* Specimen Dumbbell Body Shape */}
          {inspectionViewMode === 'original' && (
            <path
              d="M 40,40 L 90,40 C 110,40 120,65 140,65 L 180,65 C 200,65 210,40 230,40 L 280,40 L 280,120 L 230,120 C 210,120 200,95 180,95 L 140,95 C 120,95 110,120 90,120 L 40,120 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
          )}

          {inspectionViewMode === 'canny' && (
            <g>
              <path
                d="M 40,40 L 90,40 C 110,40 120,65 140,65 L 180,65 C 200,65 210,40 230,40 L 280,40 L 280,120 L 230,120 C 210,120 200,95 180,95 L 140,95 C 120,95 110,120 90,120 L 40,120 Z"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeDasharray="4 1"
              />
              {/* Detected Sub-pixel Vertex Points */}
              {[40, 90, 140, 180, 230, 280].map((x, i) => (
                <circle key={`v-${i}`} cx={x} cy={65} r="2.5" fill="#22c55e" />
              ))}
            </g>
          )}

          {inspectionViewMode === 'heatmap' && (
            <g>
              <defs>
                <radialGradient id="heatGrad1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </radialGradient>
              </defs>
              <path
                d="M 40,40 L 90,40 C 110,40 120,65 140,65 L 180,65 C 200,65 210,40 230,40 L 280,40 L 280,120 L 230,120 C 210,120 200,95 180,95 L 140,95 C 120,95 110,120 90,120 L 40,120 Z"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              {/* Heatmap Anomalies */}
              <circle cx="160" cy="80" r={isReject ? 26 : 14} fill="url(#heatGrad1)" />
              {isReject && <circle cx="215" cy="55" r="18" fill="url(#heatGrad1)" />}
            </g>
          )}

          {inspectionViewMode === 'profile3d' && (
            <g>
              <path
                d="M 40,40 L 90,40 C 110,40 120,65 140,65 L 180,65 C 200,65 210,40 230,40 L 280,40 L 280,120 L 230,120 C 210,120 200,95 180,95 L 140,95 C 120,95 110,120 90,120 L 40,120 Z"
                fill="#0f172a"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
              {/* Dimension Dimension Lines */}
              {/* Gauge Length L0 */}
              <line x1="140" y1="80" x2="180" y2="80" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="160" y="75" fill="#38bdf8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                L0: 25.03mm
              </text>
              {/* Width W */}
              <line x1="160" y1="65" x2="160" y2="95" stroke="#22c55e" strokeWidth="1.5" />
              <text x="175" y="90" fill="#22c55e" fontSize="9" fontFamily="monospace">
                W: 12.01mm
              </text>
            </g>
          )}
        </svg>

        {/* Live Overlay Badges */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 font-mono text-[9px] text-cyan-300">
          FOV: 120 x 90 mm | Res: 3840x2160
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 font-mono text-[9px] text-emerald-400">
          CONFIDENCE: {telemetry.cameraConfidence.toFixed(1)}%
        </div>
      </div>

      {/* Preprocessing Pipeline Steps */}
      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5 text-[11px]">
        <div className="flex justify-between items-center text-slate-400">
          <span>1. CLAHE &amp; Bilateral Noise Filter:</span>
          <span className="text-emerald-400 font-semibold font-mono">CONVERGED</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>2. Canny Sub-pixel Edge Fit:</span>
          <span className="text-emerald-400 font-semibold font-mono">0.02 px RMS</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>3. Spatial Anomaly Defect Prob:</span>
          <span className={`font-mono font-semibold ${isReject ? 'text-red-400' : 'text-emerald-400'}`}>
            {isReject ? '14.8% (ANOMALY)' : `${telemetry.defectProbability.toFixed(1)}% (PASS)`}
          </span>
        </div>
      </div>
    </div>
  );
};
