import React from 'react';
import {
  CheckCircle2,
  XCircle,
  QrCode,
  Award,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';

interface PassRejectBadgeProps {
  onOpenCertificate: () => void;
}

export const PassRejectBadge: React.FC<PassRejectBadgeProps> = ({ onOpenCertificate }) => {
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const lastResult = useMachineStore((state) => state.lastPassRejectResult);
  const currentSpecimen = useMachineStore((state) => state.currentSpecimen);
  const testScenario = useMachineStore((state) => state.testScenario);
  const autoCycleComplete = useMachineStore((state) => state.autoCycleComplete);

  // Show final verdict only when stage is 16 or 17 (PASS/REJECT or DIGITAL RECORD) or if full cycle completed
  const isFinalDecision = currentStageIndex >= 16 || autoCycleComplete;
  const isFail = testScenario === 'FAIL' || lastResult === 'REJECT';
  const isPass = !isFail;

  if (!isFinalDecision) {
    const isPrePunch = currentStageIndex < 8;
    return (
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            {isPrePunch ? 'Preparation Phase' : 'Inspection Phase'}
          </span>
        </div>
        <div className="text-xs font-bold text-slate-200 mt-1 font-['Chakra_Petch']">
          {isPrePunch
            ? `Stage S0${currentStageIndex + 1}: Specimen Preparation`
            : `Stage S${currentStageIndex + 1}: Automated Inspection Line`}
        </div>
        <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
          {isPrePunch
            ? 'Raw cable is being processed and flattened. Final specimen classification begins after dumbbell punching.'
            : 'Finished dumbbell is undergoing multi-point metrology and AI vision verification.'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3.5 rounded-xl border select-none transition-all ${
        isPass
          ? 'bg-gradient-to-br from-emerald-950/70 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/40'
          : 'bg-gradient-to-br from-red-950/70 to-slate-900 border-red-500/50 shadow-lg shadow-red-950/40'
      }`}
    >
      {/* Result Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isPass ? (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-400/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Quality Verdict</div>
            <h4
              className={`text-base font-bold font-['Chakra_Petch'] leading-none ${
                isPass ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isPass ? 'SPECIMEN APPROVED (PASS)' : 'SPECIMEN REJECTED'}
            </h4>
          </div>
        </div>

        {/* Specimen ID Tag */}
        <div className="text-right font-mono text-[10px] text-slate-300">
          <div>ID: {currentSpecimen?.specimenId || 'SPEC-2026-000124'}</div>
          <div className="text-[9px] text-cyan-400">ROUTED TO {isPass ? 'PASS' : 'REJECT'} TRAY</div>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] font-medium">
        <div className="flex items-center space-x-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Dimension Tolerance</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Profile Symmetry</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Surface Integrity</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>IS 10810 Validation</span>
        </div>
      </div>

      {/* Digital QR Certificate Button */}
      <button
        onClick={onOpenCertificate}
        className="w-full mt-3 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center space-x-2 text-xs font-semibold text-cyan-300 transition-colors shadow-sm"
      >
        <QrCode className="w-4 h-4 text-cyan-400" />
        <span>View Digital Traceability Certificate &amp; QR</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
};
