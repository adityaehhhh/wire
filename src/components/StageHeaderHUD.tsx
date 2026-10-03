import React from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  Camera,
  CheckCircle2,
  XCircle,
  Scan,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { STAGES } from '../data/stages';

interface StageHeaderHUDProps {
  onOpenManualSelector: () => void;
}

export const StageHeaderHUD: React.FC<StageHeaderHUDProps> = ({ onOpenManualSelector }) => {
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const operationMode = useMachineStore((state) => state.operationMode);
  const testScenario = useMachineStore((state) => state.testScenario);
  const setTestScenario = useMachineStore((state) => state.setTestScenario);
  const selectedCableMaterial = useMachineStore((state) => state.selectedCableMaterial);
  const soundEnabled = useMachineStore((state) => state.soundEnabled);
  const setSoundEnabled = useMachineStore((state) => state.setSoundEnabled);
  const isOverviewMode = useMachineStore((state) => state.isOverviewMode);
  const toggleOverviewMode = useMachineStore((state) => state.toggleOverviewMode);
  const telemetry = useMachineStore((state) => state.telemetry);
  const laserActive = useMachineStore((state) => state.laserActive);
  const setFinalDashboardOpen = useMachineStore((state) => state.setFinalDashboardOpen);
  const currentSpecimen = useMachineStore((state) => state.currentSpecimen);

  const stage = STAGES[currentStageIndex];

  // Stage-specific live status readout
  const getStageTelemetryText = () => {
    switch (currentStageIndex) {
      case 0:
        return `Speed: 45 RPM • Tension: 18.4 N • Spool: ${selectedCableMaterial}`;
      case 1:
        return `Pinch Speed: ${telemetry.feedSpeed || 45} mm/s • Pos: 85.5 mm`;
      case 2:
        return laserActive
          ? `DIAMETER SCANNING... OD: ${telemetry.cableDiameter.toFixed(2)} mm • ACTIVE SCAN`
          : `MEASUREMENT COMPLETE ✓ • OD: ${telemetry.cableDiameter.toFixed(2)} mm`;
      case 3:
        return `Datum Position: 184.2 mm • Optical Registered ✓`;
      case 4:
        return `Blade Depth: 1.52 mm • Dual Carbide Slitters Engaged`;
      case 5:
        return `Chop Stroke: 115 mm Segment • Square Crosscut ✓`;
      case 6:
        return `Anvil Force: 6.5 bar • Flattened Strip Prepared`;
      case 7:
        return `Punch Force: 12.5 kN • Die Impact "DHAAMM" • Dumbbell Stamped ✓`;
      case 8:
        return `Stamped Dumbbell Revealed • Die Retracted ✓`;
      case 9:
        return `Conveyor Transfer: 35 mm/s • Staging Finished Dumbbell to Metrology Line`;
      case 10:
        return `Thickness Laser: ${telemetry.flattenedThickness.toFixed(2)} mm • Within Recipe Tolerance ✓`;
      case 11:
        return `Camera Active • Telecentric 4K Optical Strobe [CAPTURED ✓]`;
      case 12:
        return `Preprocessing: Bilateral Filter + CLAHE + Canny 0.02 px RMS`;
      case 13:
        return testScenario === 'FAIL'
          ? `Defect Heatmap: 87.4% Anomaly (REJECT Hotspot Detected)`
          : `Defect Heatmap: 1.2% Anomaly (PASS - Within Limits)`;
      case 14:
        return `Metrology: L0=25.03mm, W=12.01mm, T=4.98mm, R=12.04mm`;
      case 15:
        return testScenario === 'FAIL'
          ? `IS Compliance Check: TOLERANCE / DEFECT VIOLATION`
          : `IS 10810 / IS 7098 Rule Check: 100% COMPLIANT ✓`;
      case 16:
        return testScenario === 'FAIL'
          ? `Final Verdict: REJECT • Diverted to Quarantine Bin`
          : `Final Verdict: PASS • Diverted to PASS Tray`;
      case 17:
        return `Digital Certificate Generated • SPEC-2026 Ready`;
      default:
        return `System Online • Interlock Safe`;
    }
  };

  const isVisionStage = currentStageIndex >= 11 && currentStageIndex <= 15;

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-5 py-3 flex items-start justify-between pointer-events-none select-none">
      {/* Top Left: Speci-X Brand + Mode Badge + Quick Scenario Toggle */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-bold tracking-wider font-['Chakra_Petch'] text-white">
            SPECI-X
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
            {selectedCableMaterial}
          </span>
        </div>

        {/* Cable / Mode Switcher */}
        <button
          onClick={onOpenManualSelector}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors shadow-lg backdrop-blur-md pointer-events-auto"
          title="Select Cable Type & Mode"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>{operationMode}</span>
        </button>

        {/* Quick PASS / FAIL Toggle Button */}
        <button
          onClick={() => setTestScenario(testScenario === 'PASS' ? 'FAIL' : 'PASS')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-lg backdrop-blur-md pointer-events-auto ${
            testScenario === 'PASS'
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/80'
              : 'bg-red-950/80 border-red-500/60 text-red-300 hover:bg-red-900/80'
          }`}
          title="Toggle Inspection Test Case (PASS vs FAIL)"
        >
          {testScenario === 'PASS' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PASS CASE</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span>FAIL CASE</span>
            </>
          )}
        </button>

        {currentSpecimen && (
          <button
            onClick={() => setFinalDashboardOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-colors shadow-lg backdrop-blur-md pointer-events-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>REPORT</span>
          </button>
        )}
      </div>

      {/* Top Center: Sleek Compact Stage Header */}
      <div className="flex flex-col items-center text-center pointer-events-auto max-w-lg mx-auto">
        <div className="bg-slate-900/95 border border-slate-700/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-2xl space-y-0.5">
          <div className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
            STAGE {String(stage.index).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
          </div>

          <div className="text-sm sm:text-base font-bold text-white uppercase tracking-wide font-['Chakra_Petch'] leading-tight">
            {stage.title}
          </div>

          <div className="text-[11px] text-slate-400 font-medium truncate max-w-sm">
            {stage.subtitle}
          </div>

          {/* Operation Live Telemetry Pill */}
          <div className="pt-1 flex items-center justify-center space-x-1.5 text-[10px] font-mono text-cyan-300 font-semibold border-t border-slate-800/80 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{getStageTelemetryText()}</span>
          </div>
        </div>

        {/* Live 4K Vision Capture Viewfinder (Stages 12 to 16, indices 11 to 15) */}
        {isVisionStage && (
          <div className="mt-2 bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md px-3 py-2 rounded-xl shadow-2xl flex items-center space-x-3 text-left animate-in fade-in slide-in-from-top-2">
            {/* Viewfinder Miniature */}
            <div className="relative w-28 h-14 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex items-center justify-center">
              {/* Telecentric Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:8px_8px] opacity-30"></div>
              {/* Captured Specimen Contour */}
              <svg viewBox="0 0 100 40" className="w-full h-full p-1 relative z-10">
                <path
                  d="M 10,12 L 25,12 C 30,12 33,18 38,18 L 62,18 C 67,18 70,12 75,12 L 90,12 L 90,28 L 75,28 C 70,28 67,22 62,22 L 38,22 C 33,22 30,28 25,28 L 10,28 Z"
                  fill="#1e293b"
                  stroke={testScenario === 'FAIL' ? '#ef4444' : '#38bdf8'}
                  strokeWidth="1.2"
                />
                {testScenario === 'FAIL' && (
                  <circle cx="68" cy="18" r="3.5" fill="#ef4444" className="animate-ping" />
                )}
              </svg>
              {/* Scanning Laser Line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse"></div>
            </div>

            {/* Viewfinder Telemetry */}
            <div className="text-[10px] font-mono space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <strong className="text-white">● CAMERA ACTIVE</strong>
              </div>
              <div className="text-cyan-400">
                {currentStageIndex === 11 ? '[ SCANNING CAPTURE... ]' : '[ IMAGE CAPTURED ✓ ]'}
              </div>
              <div className="text-slate-400 text-[9px]">FOV: 120 x 90 mm | 4K Strobe</div>
            </div>
          </div>
        )}
      </div>

      {/* Top Right: Sound & Overview Controls */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        <button
          onClick={toggleOverviewMode}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-lg backdrop-blur-md ${
            isOverviewMode
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle Full Machine Overview"
        >
          {isOverviewMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">OVERVIEW</span>
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all shadow-lg backdrop-blur-md ${
            soundEnabled
              ? 'bg-slate-900/90 border-slate-700 text-cyan-400'
              : 'bg-slate-900/90 border-slate-700 text-slate-500'
          }`}
          title={soundEnabled ? 'Industrial Sound Effects On' : 'Sound Effects Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
