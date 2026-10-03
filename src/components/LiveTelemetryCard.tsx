import React from 'react';
import {
  Gauge,
  Activity,
  Cpu,
  Layers,
  ShieldCheck,
  Disc,
  Zap,
  Radio,
} from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';

export const LiveTelemetryCard: React.FC = () => {
  const telemetry = useMachineStore((state) => state.telemetry);
  const isRunning = useMachineStore((state) => state.isRunning);

  return (
    <div className="space-y-3 select-none">
      {/* Simulation Disclaimer Banner */}
      <div className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-1.5 text-cyan-300 font-medium">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>REAL-TIME DIGITAL TWIN TELEMETRY</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
          SIMULATED
        </span>
      </div>

      {/* Grid of Key Sensor Telemetry */}
      <div className="grid grid-cols-2 gap-2">
        {/* Cable Diameter (Laser) */}
        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
            <span>Laser Diameter (OD)</span>
            <Disc className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-base font-mono font-bold text-slate-100 mt-1">
            {telemetry.cableDiameter.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">mm</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Keyence LK-G5000 (50kHz)</div>
        </div>

        {/* Feed Linear Velocity */}
        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
            <span>Feed Velocity</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base font-mono font-bold text-slate-100 mt-1">
            {telemetry.feedSpeed.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">mm/s</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Dual Stepper Rollers</div>
        </div>

        {/* Flattened Thickness */}
        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
            <span>Strip Thickness</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-base font-mono font-bold text-slate-100 mt-1">
            {telemetry.flattenedThickness.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">mm</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Post-Flattening Gauge</div>
        </div>

        {/* Punch Pressure */}
        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
            <span>Punch Pressure</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-mono font-bold text-slate-100 mt-1">
            {telemetry.punchPressure.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">bar</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Hydraulic Booster</div>
        </div>
      </div>

      {/* Controller & Bus Diagnostics */}
      <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Controller Health &amp; Bus
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">Siemens PLC CPU Temp:</span>
          <span className="font-mono text-emerald-400 font-semibold">{telemetry.plcCpuTemp.toFixed(1)} °C</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">Weintek HMI Sync Rate:</span>
          <span className="font-mono text-cyan-400 font-semibold">{telemetry.hmiSyncRate} Hz</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">Safety Interlock Loop:</span>
          <span className="font-mono text-emerald-400 font-semibold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CLOSED / SAFE</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">Laser Sensor Head:</span>
          <span className="font-mono text-slate-200 font-semibold">{telemetry.laserStatus}</span>
        </div>
      </div>
    </div>
  );
};
