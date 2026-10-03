import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  CheckCircle2,
  XCircle,
  QrCode,
  Download,
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { HeatmapViewer } from './HeatmapViewer';
import { generatePdfReport } from '../utils/generatePdfReport';

export const FinalDashboard: React.FC = () => {
  const finalDashboardOpen = useMachineStore((state) => state.finalDashboardOpen);
  const setFinalDashboardOpen = useMachineStore((state) => state.setFinalDashboardOpen);
  const currentSpecimen = useMachineStore((state) => state.currentSpecimen);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);
  const startCycle = useMachineStore((state) => state.startCycle);
  const resetCycle = useMachineStore((state) => state.resetCycle);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Generate real QR code when specimen is available
  useEffect(() => {
    if (!finalDashboardOpen || !currentSpecimen || !qrCanvasRef.current) return;

    QRCode.toCanvas(
      qrCanvasRef.current,
      currentSpecimen.qrPayloadUrl,
      {
        width: 140,
        margin: 1,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      },
      () => {}
    );
  }, [finalDashboardOpen, currentSpecimen]);

  if (!finalDashboardOpen || !currentSpecimen) return null;

  const isPass = currentSpecimen.overallResult === 'PASS';
  const m = currentSpecimen.measurements;
  const t = currentSpecimen.tolerancesMet;

  // Download QR Code image as PNG
  const handleDownloadQR = () => {
    if (!qrCanvasRef.current) return;
    const url = qrCanvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${currentSpecimen.specimenId}-QR.png`;
    link.href = url;
    link.click();
  };

  // Download complete multi-page PDF report
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const heatmapCanvas = document.querySelector('canvas') as HTMLCanvasElement | null;
      await generatePdfReport(currentSpecimen, selectedRecipe, qrCanvasRef.current, heatmapCanvas);
    } catch (e) {
      console.error('PDF Generation Error:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPass
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-red-500/20 border border-red-500/40 text-red-400'
              }`}
            >
              {isPass ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-['Chakra_Petch']">
                  SPECI-X INSPECTION DASHBOARD
                </h2>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isPass
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  VERDICT: {currentSpecimen.overallResult}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Specimen ID: <strong className="text-cyan-400 font-mono">{currentSpecimen.specimenId}</strong> | Cable:{' '}
                {currentSpecimen.cableType}
              </p>
            </div>
          </div>

          <button
            onClick={() => setFinalDashboardOpen(false)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center 2-Column Content Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Left Column: AI Vision & Heatmap Viewer (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Chakra_Petch'] flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AI Computer Vision Metrology</span>
            </div>

            <HeatmapViewer />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">DIMENSION CHECK</div>
                <div className={`font-mono text-xs font-bold ${isPass ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isPass ? '✓ 100% MATCH' : '⚠ TOLERANCE OFF'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">SHAPE SYMMETRY</div>
                <div className="font-mono text-xs font-bold text-emerald-400">
                  {(currentSpecimen.shapeScore * 100).toFixed(1)}% (PASS)
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">STANDARD VALIDATION</div>
                <div className="font-mono text-xs font-bold text-cyan-400">
                  {currentSpecimen.standard}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dimensional Breakdown & QR Download (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Dimensions Table */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Chakra_Petch'] flex items-center justify-between">
                <span>Dimensional Metrology</span>
                <span className="text-[10px] font-mono text-cyan-400">IS 10810 Compliant</span>
              </div>

              <div className="divide-y divide-slate-800 text-xs font-mono">
                <div className="py-1.5 flex justify-between items-center">
                  <span className="text-slate-400">Gauge Length (L0):</span>
                  <span className={t.gaugeLength ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {m.gaugeLength} mm
                  </span>
                </div>
                <div className="py-1.5 flex justify-between items-center">
                  <span className="text-slate-400">Specimen Width (W):</span>
                  <span className={t.width ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {m.width} mm
                  </span>
                </div>
                <div className="py-1.5 flex justify-between items-center">
                  <span className="text-slate-400">Thickness (T):</span>
                  <span className={t.thickness ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {m.thickness} mm
                  </span>
                </div>
                <div className="py-1.5 flex justify-between items-center">
                  <span className="text-slate-400">Overall Length:</span>
                  <span className={t.overallLength ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {m.overallLength} mm
                  </span>
                </div>
                <div className="py-1.5 flex justify-between items-center">
                  <span className="text-slate-400">Fillet Radius (R):</span>
                  <span className={t.filletRadius ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {m.filletRadius} mm
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code & Traceability Certificate Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Chakra_Petch']">
                Digital Traceability QR
              </div>
              
              {/* Real QR Code Canvas */}
              <div className="p-2 rounded-xl bg-white shadow-md inline-block">
                <canvas ref={qrCanvasRef} className="rounded" />
              </div>

              <div className="text-[10px] font-mono text-slate-400 max-w-xs break-all">
                {currentSpecimen.qrPayloadUrl}
              </div>

              {/* Action Buttons for Download */}
              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                <button
                  onClick={handleDownloadQR}
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD QR</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isGeneratingPdf ? 'CREATING...' : 'DOWNLOAD PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Batch: <strong className="text-slate-200">{currentSpecimen.batch}</strong> | Time:{' '}
            {currentSpecimen.timestamp}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                resetCycle();
                startCycle();
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold font-['Chakra_Petch'] text-xs transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>START NEW CYCLE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
