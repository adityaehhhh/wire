import React from 'react';
import { CheckCircle2, XCircle, Sliders } from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';

export const DimensionMetrologyCard: React.FC = () => {
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);
  const currentSpecimen = useMachineStore((state) => state.currentSpecimen);
  const telemetry = useMachineStore((state) => state.telemetry);

  const target = selectedRecipe.targetDimensions;
  const isPrePunch = currentStageIndex < 8;

  if (isPrePunch) {
    return (
      <div className="space-y-2.5 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200 font-['Chakra_Petch']">
              Dimension Metrology vs Standard
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Recipe: {selectedRecipe.standard}
          </span>
        </div>

        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Sliders className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 font-['Chakra_Petch'] uppercase">
              Metrology Awaiting Specimen Punch
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
              Material is still continuous cable/flat strip. Full dimensional analysis (Gauge Length, Width, Fillet Radius) evaluates the finished dumbbell after punch stamping at Stage 08.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use current specimen values if available, or current telemetry snapshot
  const measured = currentSpecimen?.measurements || {
    gaugeLength: 25.03,
    width: 12.01,
    thickness: telemetry.flattenedThickness || 4.98,
    overallLength: 115.02,
    filletRadius: 12.04,
  };

  const tolMet = currentSpecimen?.tolerancesMet || {
    gaugeLength: Math.abs(measured.gaugeLength - target.gaugeLength) <= target.gaugeLengthTol,
    width: Math.abs(measured.width - target.width) <= target.widthTol,
    thickness: Math.abs(measured.thickness - target.thickness) <= target.thicknessTol,
    overallLength: Math.abs(measured.overallLength - target.overallLength) <= target.overallLengthTol,
    filletRadius: Math.abs(measured.filletRadius - target.filletRadius) <= target.filletRadiusTol,
  };

  const items = [
    {
      name: 'Gauge Length (L₀)',
      measured: measured.gaugeLength,
      target: target.gaugeLength,
      tol: target.gaugeLengthTol,
      valid: tolMet.gaugeLength,
    },
    {
      name: 'Parallel Width (W)',
      measured: measured.width,
      target: target.width,
      tol: target.widthTol,
      valid: tolMet.width,
    },
    {
      name: 'Thickness (T)',
      measured: measured.thickness,
      target: target.thickness,
      tol: target.thicknessTol,
      valid: tolMet.thickness,
    },
    {
      name: 'Overall Length',
      measured: measured.overallLength,
      target: target.overallLength,
      tol: target.overallLengthTol,
      valid: tolMet.overallLength,
    },
    {
      name: 'Fillet Radius (R)',
      measured: measured.filletRadius,
      target: target.filletRadius,
      tol: target.filletRadiusTol,
      valid: tolMet.filletRadius,
    },
  ];

  return (
    <div className="space-y-2.5 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 font-['Chakra_Petch']">
            Dimension Metrology vs Standard
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Recipe: {selectedRecipe.standard}
        </span>
      </div>

      <div className="rounded-lg border border-slate-700 overflow-hidden divide-y divide-slate-800 bg-slate-950/60 text-xs">
        <div className="grid grid-cols-12 px-3 py-1.5 bg-slate-800/70 text-[10px] uppercase font-bold text-slate-400">
          <div className="col-span-5">Parameter</div>
          <div className="col-span-3 text-right">Measured</div>
          <div className="col-span-3 text-right">Target (Tol)</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 px-3 py-2 items-center text-[11px]">
            <div className="col-span-5 text-slate-300 font-medium truncate">{item.name}</div>
            <div className="col-span-3 text-right font-mono font-bold text-cyan-300">
              {item.measured.toFixed(2)} mm
            </div>
            <div className="col-span-3 text-right font-mono text-slate-400">
              {item.target.toFixed(1)} ±{item.tol.toFixed(2)}
            </div>
            <div className="col-span-1 flex justify-end">
              {item.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
