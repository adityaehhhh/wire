import React from 'react';
import {
  X,
  Network,
  Cpu,
  Radio,
  Eye,
  Sliders,
  CheckCircle2,
  Database,
  QrCode,
  LineChart,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';

interface DataFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataFlowModal: React.FC<DataFlowModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const flowNodes = [
    {
      title: 'Physical Machine Sensors',
      desc: 'Keyence LK-G5000, encoders, proximity, pressure transducers',
      icon: Radio,
      tag: 'Hardware Layer',
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    },
    {
      title: 'Siemens S7-1200 PLC & Weintek HMI',
      desc: 'Real-time deterministic motion control, PROFINET bus & safety interlocks',
      icon: Cpu,
      tag: 'Control Layer',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    },
    {
      title: 'High-Speed Telemetry Acquisition',
      desc: 'Modbus TCP / OPC UA / MQTT industrial edge gateway',
      icon: Network,
      tag: 'DAQ Gateway',
      color: 'border-teal-500/40 text-teal-400 bg-teal-950/20',
    },
    {
      title: '4K Vision Capture & CLAHE Preprocessing',
      desc: 'Telecentric image capture, bilateral noise filter, sub-pixel normalization',
      icon: Eye,
      tag: 'Vision Processing',
      color: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
    },
    {
      title: 'AI Anomaly & Dimension Metrology',
      desc: 'Canny contour extraction, defect heatmap, L0, W, T metrology calculation',
      icon: Sliders,
      tag: 'AI Metrology',
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
    },
    {
      title: 'IS 10810 / IS 7098 Rule Engine',
      desc: 'Automated tolerance compliance verification against Indian Standards',
      icon: CheckCircle2,
      tag: 'Validation Engine',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    },
    {
      title: 'Automated Sorting Decision (PASS / REJECT)',
      desc: 'Pneumatic diverter trigger to designated collection tray',
      icon: Cpu,
      tag: 'Execution Layer',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    },
    {
      title: 'Serialized Digital Record & QR Minting',
      desc: 'Cloud database synchronization, cryptographic SHA-256 hash, QR badge',
      icon: QrCode,
      tag: 'Traceability',
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
    },
    {
      title: 'Historical QA Analytics & SPC',
      desc: 'Statistical Process Control, yield tracking, preventative maintenance',
      icon: LineChart,
      tag: 'Analytics Layer',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Network className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                System Topology
              </span>
              <h2 className="text-lg font-bold text-white font-['Chakra_Petch'] leading-tight mt-1">
                Digital Twin Data-Flow &amp; Architecture
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

        {/* Body Flow Cards */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          <p className="text-xs text-slate-400 mb-2">
            The end-to-end data pipeline integrates physical sensors with edge AI inference, deterministic PLC motion, Indian Standards compliance validation, and cloud traceability.
          </p>

          <div className="space-y-2">
            {flowNodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-full p-3 rounded-xl border flex items-center justify-between ${node.color}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 font-['Chakra_Petch']">
                          {node.title}
                        </div>
                        <div className="text-[11px] text-slate-300">{node.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 shrink-0 ml-2">
                      {node.tag}
                    </span>
                  </div>

                  {i < flowNodes.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-cyan-500 my-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Future Integration: Ready for REST API, OPC UA, MQTT, PostgreSQL</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
