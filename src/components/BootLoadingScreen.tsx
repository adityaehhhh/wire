import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

interface BootLoadingScreenProps {
  onReady: () => void;
  is3dMounted: boolean;
}

interface Milestone {
  id: string;
  label: string;
}

const MILESTONES: Milestone[] = [
  { id: 'twin', label: 'INITIALIZING DIGITAL TWIN' },
  { id: 'geom', label: 'LOADING MACHINE GEOMETRY' },
  { id: 'cable', label: 'INITIALIZING CABLE SYSTEM' },
  { id: 'materials', label: 'LOADING MATERIALS & SHADERS' },
  { id: 'sensors', label: 'INITIALIZING SENSOR SYSTEM' },
  { id: 'camera', label: 'INITIALIZING TELECENTRIC 4K CAMERA' },
  { id: 'ai', label: 'INITIALIZING INSPECTION ENGINE' },
  { id: 'plc', label: 'SYNCHRONIZING PLC S7-1200 & HMI' },
  { id: 'ready', label: 'SYSTEM READY' },
];

export const BootLoadingScreen: React.FC<BootLoadingScreenProps> = ({ onReady, is3dMounted }) => {
  const [progress, setProgress] = useState(12);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Speci-X Digital Twin Engine...');
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Progressive milestone sequence
    const steps = [
      { p: 18, m: 0, text: 'Connecting to Three.js WebGL rendering pipeline...' },
      { p: 32, m: 1, text: 'Loading structural frame and steel base assemblies...' },
      { p: 48, m: 2, text: 'Configuring CatmullRom spline cable physics & pay-off reel...' },
      { p: 62, m: 3, text: 'Compiling PBR materials and optical shaders...' },
      { p: 76, m: 4, text: 'Initializing Keyence LK-G5000 dual laser sensors...' },
      { p: 88, m: 5, text: 'Calibrating telecentric 4K optical camera dome...' },
      { p: 94, m: 6, text: 'Loading Canny edge extractor & CLAHE neural weights...' },
      { p: 98, m: 7, text: 'Synchronizing Siemens S7-1200 PLC & Weintek HMI...' },
      { p: 100, m: 8, text: '✓ DIGITAL TWIN ONLINE' },
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        setProgress(step.p);
        setCurrentMilestoneIndex(step.m);
        setStatusText(step.text);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 180);

    // Timeout safety fallback
    const timeoutTimer = setTimeout(() => {
      setIsTimedOut(true);
      if (!isComplete) {
        setProgress(100);
        setCurrentMilestoneIndex(MILESTONES.length - 1);
        setIsComplete(true);
      }
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutTimer);
    };
  }, []);

  // When complete and 3D canvas is mounted, trigger smooth transition
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const exitTimer = setTimeout(() => {
          onReady();
        }, 650);
        return () => clearTimeout(exitTimer);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [isComplete, onReady]);

  const handleRetry = () => {
    setHasError(false);
    setProgress(15);
    setCurrentMilestoneIndex(0);
    setIsComplete(false);
    window.location.reload();
  };

  const handleForceContinue = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onReady();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-950 text-slate-100 select-none transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Blueprint Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12)_0,rgba(2,6,23,0.95)_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_28px] opacity-20"></div>

      {/* Top Bar: Speci-X Logo & Version */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#38bdf8]"></div>
          <span className="text-sm font-bold tracking-widest font-['Chakra_Petch'] text-white">
            SPECI-X
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            DIGITAL TWIN V2.6
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          IS 10810 / IS 7098 COMPLIANT
        </div>
      </div>

      {/* Center Hero: Animated Machine Wireframe Silhouette & Progress */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full my-auto space-y-6">
        {/* Machine Wireframe Silhouette SVG with Sweeping Laser Line */}
        <div className="relative w-full max-w-lg h-36 sm:h-44 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md overflow-hidden flex items-center justify-center p-4 shadow-2xl">
          {/* Subtle Machine Architectural Outline SVG */}
          <svg viewBox="0 0 500 140" className="w-full h-full text-cyan-500/30">
            {/* Base Table Frame */}
            <rect x="20" y="90" width="460" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="60" y1="110" x2="60" y2="135" stroke="currentColor" strokeWidth="2" />
            <line x1="250" y1="110" x2="250" y2="135" stroke="currentColor" strokeWidth="2" />
            <line x1="440" y1="110" x2="440" y2="135" stroke="currentColor" strokeWidth="2" />

            {/* Reel (Left) */}
            <circle cx="65" cy="55" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="65" cy="55" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />

            {/* Feed Rollers */}
            <circle cx="140" cy="78" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="140" cy="98" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />

            {/* Laser Micrometer */}
            <rect x="180" y="60" width="18" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" />

            {/* Cutting Station */}
            <rect x="230" y="55" width="22" height="45" fill="none" stroke="currentColor" strokeWidth="1.5" />

            {/* Flattening Station */}
            <rect x="280" y="65" width="30" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="295" cy="62" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" />

            {/* Conveyor */}
            <rect x="330" y="85" width="70" height="10" fill="none" stroke="currentColor" strokeWidth="1.2" />

            {/* Vision Camera Portal */}
            <rect x="355" y="38" width="20" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="365" y1="63" x2="365" y2="85" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />

            {/* Punch Press */}
            <rect x="420" y="45" width="25" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" />

            {/* Continuous Cable Guideline */}
            <path
              d="M 65,55 Q 100,88 140,88 L 440,88"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </svg>

          {/* Sweeping Laser Scanline */}
          <div
            className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-[scan_2.4s_ease-in-out_infinite]"
            style={{ left: `${progress}%` }}
          ></div>

          {/* Center Subtle Label */}
          <div className="absolute bottom-2 right-3 font-mono text-[9px] text-cyan-400/60 uppercase tracking-wider">
            SPECI-X DIGITAL TWIN TOPOLOGY
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider font-['Chakra_Petch']">
            SPECI-X
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
            Automated Cable Specimen Preparation &amp; AI Inspection System
          </p>
        </div>

        {/* Main Loading Bar & Percentage */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              {isComplete ? 'SYSTEM READY' : 'DIGITAL TWIN INITIALIZING'}
            </span>
            <span className="text-white font-extrabold text-sm">{progress}%</span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-200 ease-out ${
                isComplete
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#10b981]'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_12px_#38bdf8]'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Dynamic Status Text */}
          <div className="text-xs font-mono text-slate-400 truncate flex items-center justify-center space-x-2 pt-1">
            {isComplete ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            )}
            <span className={isComplete ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Milestone Steps Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full pt-2 text-left">
          {MILESTONES.map((m, idx) => {
            const isDone = idx < currentMilestoneIndex || isComplete;
            const isCurrent = idx === currentMilestoneIndex && !isComplete;
            return (
              <div
                key={m.id}
                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-sm'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <span className="truncate pr-1">{m.label}</span>
                <span className="font-bold">
                  {isDone ? (
                    <span className="text-emerald-400">✓</span>
                  ) : isCurrent ? (
                    <span className="text-cyan-400 animate-pulse">●</span>
                  ) : (
                    <span className="text-slate-600">○</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error / Slow Network Fallback Dialog */}
        {hasError && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-red-400 font-bold font-['Chakra_Petch'] text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>DIGITAL TWIN LOAD TIMEOUT</span>
            </div>
            <p className="text-xs text-slate-300">
              Unable to complete high-resolution shader initialization on this browser.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleRetry}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY</span>
              </button>
              <button
                onClick={handleForceContinue}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950 font-['Chakra_Petch']"
              >
                CONTINUE DEMO
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div>SYSTEM INITIALIZATION</div>
        <div className="text-cyan-500/80">
          {isComplete ? 'READY FOR INTERACTION' : 'LOADING INDUSTRIAL ASSETS...'}
        </div>
      </div>
    </div>
  );
};
