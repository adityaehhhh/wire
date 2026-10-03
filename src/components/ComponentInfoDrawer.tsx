import React from 'react';
import { X, Info, CheckCircle2, Zap, ArrowRight, Eye, Settings2 } from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { COMPONENTS_DATA } from '../data/componentsData';
import { CAMERA_PRESETS } from '../data/cameraPresets';
import { CameraPresetId } from '../types';

export const ComponentInfoDrawer: React.FC = () => {
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);
  const setActiveCameraPreset = useMachineStore((state) => state.setActiveCameraPreset);

  if (!selectedComponentId) return null;

  const component = COMPONENTS_DATA[selectedComponentId];
  if (!component) return null;

  const handleFocusCamera = () => {
    // Map component to nearest camera preset
    let preset: CameraPresetId = 'overview';
    if (component.id === 'reel') preset = 'reel';
    else if (component.id.includes('roller')) preset = 'feeding';
    else if (component.id === 'laser_micrometer') preset = 'diameter';
    else if (component.id.includes('blade') || component.id === 'proximity_sensor') preset = 'cutting';
    else if (component.id.includes('flattening')) preset = 'flattening';
    else if (component.id === 'thickness_sensor') preset = 'thickness';
    else if (component.id === 'conveyor') preset = 'conveyor';
    else if (component.id === 'vision_camera' || component.id === 'ai_engine') preset = 'inspection';
    else if (component.id === 'dumbbell_die') preset = 'punching';
    else if (component.id.includes('tray')) preset = 'output';
    else if (component.id === 'plc_cabinet' || component.id === 'weintek_hmi') preset = 'plc';

    setActiveCameraPreset(preset, true);
  };

  return (
    <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 flex flex-col z-30 overflow-hidden select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
            <Settings2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {component.category}
            </span>
            <h3 className="text-base font-bold text-white font-['Chakra_Petch'] leading-tight mt-1">
              {component.name}
            </h3>
          </div>
        </div>
        <button
          onClick={() => setSelectedComponentId(null)}
          className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body Scroll */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs">
        {/* Status & Live Reading Banner */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Status</div>
            <div className="flex items-center space-x-1.5 mt-0.5 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{component.status}</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Live Reading</div>
            <div className="text-xs font-mono font-bold text-cyan-300 truncate mt-0.5">
              {component.currentReading}
            </div>
          </div>
        </div>

        {/* Function */}
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Function</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-200 leading-relaxed">
            {component.function}
          </div>
        </div>

        {/* Purpose in Process */}
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Engineering Purpose</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-300 leading-relaxed">
            {component.purpose}
          </div>
        </div>

        {/* Input / Output / Connection Flow */}
        <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-[11px]">
          <div>
            <strong className="text-slate-400">INPUT: </strong>
            <span className="text-slate-300">{component.input}</span>
          </div>
          <div>
            <strong className="text-slate-400">OUTPUT: </strong>
            <span className="text-cyan-300">{component.output}</span>
          </div>
          <div>
            <strong className="text-slate-400">CONNECTED TO: </strong>
            <span className="text-emerald-400">{component.connectedTo}</span>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
            Technical Specifications
          </div>
          <div className="rounded-lg border border-slate-700/80 overflow-hidden divide-y divide-slate-800">
            {component.specs.map((spec, i) => (
              <div key={i} className="flex justify-between items-center px-3 py-1.5 bg-slate-800/40 text-[11px]">
                <span className="text-slate-400">{spec.label}</span>
                <span className="font-mono font-semibold text-slate-200">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={handleFocusCamera}
          className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-600/20"
        >
          <Eye className="w-4 h-4" />
          <span>Focus 3D Viewport on Component</span>
        </button>
      </div>
    </div>
  );
};
