import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Award,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';

interface DigitalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalRecordModal: React.FC<DigitalRecordModalProps> = ({ isOpen, onClose }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentSpecimen = useMachineStore((state) => state.currentSpecimen);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);
  const cycleCount = useMachineStore((state) => state.cycleCount);

  const specimenId = currentSpecimen?.specimenId || `SPEC-2026-${String(124 + cycleCount - 1).padStart(6, '0')}`;
  const timestamp = currentSpecimen?.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
  const isPass = currentSpecimen ? currentSpecimen.overallResult === 'PASS' : true;

  const qrPayloadUrl = `https://speci-x.industrial-qa.internal/specimen/${specimenId}`;

  useEffect(() => {
    if (isOpen && qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        qrPayloadUrl,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR code generation error', error);
        }
      );
    }
  }, [isOpen, qrPayloadUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950 overflow-hidden flex flex-col">
        {/* Certificate Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Award className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Official Digital Provenance Record
              </span>
              <h2 className="text-lg font-bold text-white font-['Chakra_Petch'] leading-tight mt-1">
                Cable Specimen Quality Certificate
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[75vh] scrollbar-thin scrollbar-thumb-slate-700 text-xs">
          {/* Top Info Banner & QR */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800 gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">SPECIMEN ID:</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{specimenId}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Timestamp: {timestamp} (UTC+05:30)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Standard: <strong>{selectedRecipe.standard}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>Cable Type: {selectedRecipe.cableType}</span>
              </div>
              <div className="flex items-center space-x-1.5 pt-1">
                <span className="text-[10px] text-slate-400">FINAL VERDICT:</span>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                    isPass
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border-red-500/40'
                  }`}
                >
                  {isPass ? 'COMPLIANT (PASS)' : 'NON-COMPLIANT (REJECT)'}
                </span>
              </div>
            </div>

            {/* QR Code Canvas */}
            <div className="p-2 bg-white rounded-xl shadow-md shrink-0 flex flex-col items-center">
              <canvas ref={qrCanvasRef} className="rounded"></canvas>
              <span className="text-[9px] text-slate-800 font-mono font-bold mt-1">
                SCAN FOR CLOUD RECORD
              </span>
            </div>
          </div>

          {/* Dimensional Metrology Report */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-['Chakra_Petch']">
              Dimensional Metrology Analysis
            </h4>
            <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800 bg-slate-950/60">
              <div className="grid grid-cols-12 px-3 py-2 bg-slate-800/60 text-[10px] uppercase font-bold text-slate-400">
                <div className="col-span-4">Parameter</div>
                <div className="col-span-3 text-right">Measured Value</div>
                <div className="col-span-3 text-right">Standard Tolerance</div>
                <div className="col-span-2 text-right">Result</div>
              </div>

              {[
                { name: 'Gauge Length (L₀)', val: '25.03 mm', tol: '25.0 ± 0.5 mm' },
                { name: 'Parallel Width (W)', val: '12.01 mm', tol: '12.0 ± 0.2 mm' },
                { name: 'Specimen Thickness (T)', val: '4.98 mm', tol: '5.0 ± 0.3 mm' },
                { name: 'Overall Length', val: '115.02 mm', tol: '115.0 ± 2.0 mm' },
                { name: 'Fillet Radius (R)', val: '12.04 mm', tol: '12.0 ± 0.5 mm' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-12 px-3 py-2 items-center text-[11px]">
                  <div className="col-span-4 text-slate-200 font-medium">{row.name}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-cyan-300">{row.val}</div>
                  <div className="col-span-3 text-right font-mono text-slate-400">{row.tol}</div>
                  <div className="col-span-2 flex justify-end items-center space-x-1 text-emerald-400 font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Machine & AI Provenance Footer */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
            <div>
              Generated by <strong>SPECI-X System Twin</strong> | Siemens S7-1200 PLC | Keyence LK-G5000
            </div>
            <div className="font-mono text-cyan-400">SHA-256: 7f8a92...b41c</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-600/20"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
