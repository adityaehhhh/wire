import React, { useState } from 'react';
import {
  Eye,
  Sliders,
  Activity,
  History,
  ChevronRight,
  ChevronLeft,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { AiVisionDashboard } from './AiVisionDashboard';
import { DimensionMetrologyCard } from './DimensionMetrologyCard';
import { LiveTelemetryCard } from './LiveTelemetryCard';
import { PassRejectBadge } from './PassRejectBadge';

interface RightWorkspacePanelProps {
  onOpenCertificate: () => void;
}

export const RightWorkspacePanel: React.FC<RightWorkspacePanelProps> = ({ onOpenCertificate }) => {
  const [activeTab, setActiveTab] = useState<'vision' | 'metrology' | 'telemetry' | 'history'>('vision');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const specimenHistory = useMachineStore((state) => state.specimenHistory);

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="absolute top-20 right-0 bg-slate-900/90 border-l border-t border-b border-cyan-500/40 p-2.5 rounded-l-xl text-cyan-400 hover:text-white shadow-xl z-20 flex items-center space-x-1"
        title="Expand Inspection Panel"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-xs font-bold font-['Chakra_Petch'] [writing-mode:vertical-lr] tracking-wider py-1">
          INSPECTION &amp; TELEMETRY
        </span>
      </button>
    );
  }

  return (
    <aside className="w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 flex flex-col h-full z-20 shrink-0 select-none">
      {/* Header Tabs */}
      <div className="p-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {[
            { id: 'vision', label: 'Vision AI', icon: Eye },
            { id: 'metrology', label: 'Metrology', icon: Sliders },
            { id: 'telemetry', label: 'Sensors', icon: Activity },
            { id: 'history', label: 'History', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Collapse Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
        {activeTab === 'vision' && <AiVisionDashboard />}
        {activeTab === 'metrology' && <DimensionMetrologyCard />}
        {activeTab === 'telemetry' && <LiveTelemetryCard />}

        {activeTab === 'history' && (
          <div className="space-y-2 text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Batch Quality History ({specimenHistory.length} records)
            </div>
            <div className="rounded-lg border border-slate-700 overflow-hidden divide-y divide-slate-800 bg-slate-950/60">
              {specimenHistory.map((rec) => (
                <div key={rec.specimenId} className="p-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-slate-200">{rec.specimenId}</div>
                    <div className="text-[10px] text-slate-400">{rec.timestamp}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      rec.overallResult === 'PASS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {rec.overallResult}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Persistent Quality Verdict / Certificate Banner at Bottom */}
        <PassRejectBadge onOpenCertificate={onOpenCertificate} />
      </div>
    </aside>
  );
};
