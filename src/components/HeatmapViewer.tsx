import React, { useEffect, useRef } from 'react';
import { Eye, Scan, Flame, Box, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { InspectionViewMode } from '../types';

interface HeatmapViewerProps {
  compact?: boolean;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ compact = false }) => {
  const inspectionViewMode = useMachineStore((state) => state.inspectionViewMode);
  const setInspectionViewMode = useMachineStore((state) => state.setInspectionViewMode);
  const currentSpecimen = useMachineStore((state) => state.currentSpecimen);
  const lastResult = useMachineStore((state) => state.lastPassRejectResult);
  const testScenario = useMachineStore((state) => state.testScenario);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);
  const telemetry = useMachineStore((state) => state.telemetry);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isReject = (currentSpecimen?.overallResult || lastResult) === 'REJECT' || testScenario === 'FAIL';

  // Draw functional canvas heatmap when in heatmap mode
  useEffect(() => {
    if (inspectionViewMode !== 'heatmap') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw dark background grid
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dumbbell specimen silhouette path
    const drawDumbbellPath = () => {
      ctx.beginPath();
      // Center specimen coordinates
      const cx = width / 2;
      const cy = height / 2;
      const w = width * 0.75;
      const h = height * 0.55;
      const x0 = cx - w / 2;
      const y0 = cy - h / 2;

      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + w * 0.25, y0);
      ctx.quadraticCurveTo(x0 + w * 0.35, cy - h * 0.2, x0 + w * 0.4, cy - h * 0.2);
      ctx.lineTo(x0 + w * 0.6, cy - h * 0.2);
      ctx.quadraticCurveTo(x0 + w * 0.65, y0, x0 + w * 0.75, y0);
      ctx.lineTo(x0 + w, y0);
      ctx.lineTo(x0 + w, y0 + h);
      ctx.lineTo(x0 + w * 0.75, y0 + h);
      ctx.quadraticCurveTo(x0 + w * 0.65, cy + h * 0.2, x0 + w * 0.6, cy + h * 0.2);
      ctx.lineTo(x0 + w * 0.4, cy + h * 0.2);
      ctx.quadraticCurveTo(x0 + w * 0.35, y0 + h, x0 + w * 0.25, y0 + h);
      ctx.lineTo(x0, y0 + h);
      ctx.closePath();
    };

    // Draw specimen base fill
    ctx.save();
    drawDumbbellPath();
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.strokeStyle = isReject ? '#ef4444' : '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.clip(); // Restrict heatmaps to inside the specimen

    // Render Procedural Thermal Heatmap Gradients
    // Center baseline temperature (blue/cyan background)
    const baseGrad = ctx.createLinearGradient(0, 0, width, 0);
    baseGrad.addColorStop(0, 'rgba(14, 165, 233, 0.15)');
    baseGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
    baseGrad.addColorStop(1, 'rgba(14, 165, 233, 0.15)');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);

    // Primary Heat Hotspot (e.g. gauge neck region)
    const hx1 = width * 0.48;
    const hy1 = height * 0.5;
    const r1 = 26;
    const grad1 = ctx.createRadialGradient(hx1, hy1, 0, hx1, hy1, r1);
    if (isReject) {
      grad1.addColorStop(0, 'rgba(239, 68, 68, 0.85)');   // Red warning
      grad1.addColorStop(0.4, 'rgba(249, 115, 22, 0.6)'); // Orange
      grad1.addColorStop(1, 'rgba(14, 165, 233, 0)');
    } else {
      grad1.addColorStop(0, 'rgba(34, 197, 94, 0.7)');    // Normal green
      grad1.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
      grad1.addColorStop(1, 'rgba(14, 165, 233, 0)');
    }
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.arc(hx1, hy1, r1, 0, Math.PI * 2);
    ctx.fill();

    // If REJECT / FAIL CASE: Primary Defect Hotspot on specimen shoulder
    if (isReject) {
      const hx2 = width * 0.68;
      const hy2 = height * 0.42;
      const r2 = 36;
      const grad2 = ctx.createRadialGradient(hx2, hy2, 0, hx2, hy2, r2);
      grad2.addColorStop(0, 'rgba(239, 68, 68, 0.98)');   // High intense red
      grad2.addColorStop(0.35, 'rgba(249, 115, 22, 0.85)'); // Orange
      grad2.addColorStop(0.7, 'rgba(234, 179, 8, 0.6)');   // Yellow
      grad2.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(hx2, hy2, r2, 0, Math.PI * 2);
      ctx.fill();

      // Bounding box on defect
      ctx.restore();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(hx2 - 22, hy2 - 22, 44, 44);
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('ACTIVE HOTSPOT [DEFECT: 87.4%]', hx2 - 38, hy2 - 26);
      return;
    }

    ctx.restore();
  }, [inspectionViewMode, isReject]);

  const dims = currentSpecimen?.measurements || {
    gaugeLength: 25.03,
    width: 12.01,
    thickness: 4.98,
    overallLength: 115.02,
    filletRadius: 12.04,
  };

  return (
    <div className="space-y-2.5 select-none">
      {/* 4 View Modes Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
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
              className={`flex flex-col items-center justify-center py-1.5 rounded-md transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Optical Frame Visualizer Screen */}
      <div className="relative w-full h-48 rounded-xl bg-slate-950 border border-slate-700/80 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Optical Crosshairs and Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:18px_18px] opacity-40"></div>

        {/* Heatmap Mode: Real Canvas */}
        {inspectionViewMode === 'heatmap' ? (
          <div className="relative w-full h-full">
            <canvas ref={canvasRef} width={340} height={192} className="w-full h-full object-contain" />
            {/* Color Temperature Scale */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded text-[9px] font-mono text-slate-300">
              <span>LOW</span>
              <div className="w-16 h-2 rounded bg-gradient-to-r from-cyan-500 via-yellow-400 to-red-500"></div>
              <span>HIGH</span>
            </div>
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-[9px] font-mono text-purple-300 font-bold">
              SIMULATED AI INSPECTION
            </div>
          </div>
        ) : (
          /* SVG Vector Visualizer for Original, Canny, Metrology */
          <svg viewBox="0 0 320 160" className="w-full h-full p-4 relative z-10">
            {/* 1. Original View */}
            {inspectionViewMode === 'original' && (
              <g>
                <path
                  d="M 40,40 L 90,40 C 110,40 120,65 140,65 L 180,65 C 200,65 210,40 230,40 L 280,40 L 280,120 L 230,120 C 210,120 200,95 180,95 L 140,95 C 120,95 110,120 90,120 L 40,120 Z"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="2"
                />
                {/* Surface texture lines */}
                <line x1="140" y1="80" x2="180" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            )}

            {/* 2. Canny Edge View */}
            {inspectionViewMode === 'canny' && (
              <g>
                <path
                  d="M 40,40 L 90,40 C 110,40 120,65 140,65 L 180,65 C 200,65 210,40 230,40 L 280,40 L 280,120 L 230,120 C 210,120 200,95 180,95 L 140,95 C 120,95 110,120 90,120 L 40,120 Z"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeDasharray="4 1"
                />
                {/* Detected Sub-pixel Edge Points */}
                {[40, 90, 140, 180, 230, 280].map((x, i) => (
                  <g key={`vert-${i}`}>
                    <circle cx={x} cy={65} r="2.5" fill="#22c55e" />
                    <circle cx={x} cy={95} r="2.5" fill="#22c55e" />
                  </g>
                ))}
              </g>
            )}

            {/* 3. Metrology View */}
            {inspectionViewMode === 'profile3d' && (
              <g>
                <path
                  d="M 40,40 L 90,40 C 110,40 120,65 140,65 L 180,65 C 200,65 210,40 230,40 L 280,40 L 280,120 L 230,120 C 210,120 200,95 180,95 L 140,95 C 120,95 110,120 90,120 L 40,120 Z"
                  fill="#0f172a"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                />
                {/* Dimension Line: Gauge Length L0 */}
                <line x1="140" y1="80" x2="180" y2="80" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="140" y1="74" x2="140" y2="86" stroke="#38bdf8" strokeWidth="1" />
                <line x1="180" y1="74" x2="180" y2="86" stroke="#38bdf8" strokeWidth="1" />
                <text x="160" y="74" fill="#38bdf8" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  L0: {dims.gaugeLength}mm
                </text>

                {/* Dimension Line: Width W */}
                <line x1="160" y1="65" x2="160" y2="95" stroke="#22c55e" strokeWidth="1.5" />
                <text x="175" y="90" fill="#22c55e" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  W: {dims.width}mm
                </text>

                {/* Overall Length Callout */}
                <line x1="40" y1="135" x2="280" y2="135" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
                <text x="160" y="148" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  OVERALL LENGTH: {dims.overallLength}mm
                </text>
              </g>
            )}
          </svg>
        )}

        {/* Live Top Status Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 font-mono text-[9px] text-cyan-300">
          FOV: 120 x 90 mm | 4K Optical
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] text-slate-400">MODEL CONFIDENCE</div>
          <div className="font-mono font-bold text-emerald-400">
            {currentSpecimen?.aiConfidence || telemetry.cameraConfidence.toFixed(1)}%
          </div>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] text-slate-400">DEFECT PROBABILITY</div>
          <div className={`font-mono font-bold ${isReject ? 'text-red-400' : 'text-emerald-400'}`}>
            {currentSpecimen?.defectProbability || telemetry.defectProbability.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
