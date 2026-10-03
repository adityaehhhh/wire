import React from 'react';
import { Layers, X, Check, Disc, Play, Activity } from 'lucide-react';
import { useMachineStore } from '../store/useMachineStore';
import { CableMaterialType, OperationMode } from '../types';
import { RECIPES } from '../data/recipes';

interface ManualCableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualCableSelectorModal: React.FC<ManualCableSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const operationMode = useMachineStore((state) => state.operationMode);
  const setOperationMode = useMachineStore((state) => state.setOperationMode);
  const testScenario = useMachineStore((state) => state.testScenario);
  const setTestScenario = useMachineStore((state) => state.setTestScenario);
  const selectedCableMaterial = useMachineStore((state) => state.selectedCableMaterial);
  const setSelectedCableMaterial = useMachineStore((state) => state.setSelectedCableMaterial);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);
  const setSelectedRecipe = useMachineStore((state) => state.setSelectedRecipe);
  const resetCycle = useMachineStore((state) => state.resetCycle);

  if (!isOpen) return null;

  const cableOptions: {
    material: CableMaterialType;
    name: string;
    description: string;
    standard: string;
    conductor: string;
    nominalOD: string;
  }[] = [
    {
      material: 'XLPE',
      name: '1.1kV XLPE 3-Core 25 sq.mm',
      description: 'Cross-linked Polyethylene high-voltage insulation for power distribution (Medium OD).',
      standard: 'IS 10810 (Part 7/15) & IS 7098',
      conductor: '3-Core 25.0 mm² Stranded Copper',
      nominalOD: '12.04 mm (Radius: 0.048)',
    },
    {
      material: 'PVC',
      name: '1100V Flame Retardant PVC Flexible',
      description: 'Polyvinyl Chloride flexible cable with flame-retardant outer sheath (Smaller OD).',
      standard: 'IS 694 Custom Recipe',
      conductor: 'Multi-strand 16.0 mm² Bare Copper',
      nominalOD: '11.80 mm (Radius: 0.038)',
    },
    {
      material: 'HDPE',
      name: '3.3kV Heavy Duty HDPE Sheathed',
      description: 'High-Density Polyethylene rugged outer jacket for underground runs (Larger OD).',
      standard: 'IS 7098 (Part 1/2)',
      conductor: '50.0 mm² Compacted Aluminum',
      nominalOD: '12.50 mm (Radius: 0.058)',
    },
  ];

  const handleSelect = (mat: CableMaterialType) => {
    setSelectedCableMaterial(mat);
  };

  const handleLoadToReel = () => {
    resetCycle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Disc className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                CABLE SPECIFICATION &amp; INSPECTION SETUP
              </h3>
              <p className="text-xs text-slate-400">
                Configure pay-off reel material, dimensions, and inspection test scenario
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Test Scenario Case: PASS CASE vs FAIL CASE */}
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2 font-mono">
              AI Inspection Test Scenario
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTestScenario('PASS')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  testScenario === 'PASS'
                    ? 'bg-emerald-950/70 border-emerald-500/80 text-white shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-['Chakra_Petch'] text-emerald-400">
                    PASS CASE
                  </span>
                  {testScenario === 'PASS' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  100% compliant dimensional tolerances, low defect probability (1.2%), normal thermal signature.
                </p>
              </button>

              <button
                onClick={() => setTestScenario('FAIL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  testScenario === 'FAIL'
                    ? 'bg-red-950/70 border-red-500/80 text-white shadow-md ring-1 ring-red-500/40'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-['Chakra_Petch'] text-red-400">
                    FAIL CASE (REJECT)
                  </span>
                  {testScenario === 'FAIL' && <Check className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  High-intensity thermal hotspot on shoulder, 87.4% surface defect probability, automated REJECT sorting.
                </p>
              </button>
            </div>
          </div>

          {/* Operation Mode Toggle */}
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2 font-mono">
              Select Operation Mode
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOperationMode('AUTO')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  operationMode === 'AUTO'
                    ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-['Chakra_Petch']">AUTO MODE</span>
                  {operationMode === 'AUTO' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Runs complete 18-stage cycle automatically with cinematic camera focus.
                </p>
              </button>

              <button
                onClick={() => setOperationMode('MANUAL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  operationMode === 'MANUAL'
                    ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-['Chakra_Petch']">MANUAL MODE</span>
                  {operationMode === 'MANUAL' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Allows step-by-step verification, component drawer inspection, and custom setups.
                </p>
              </button>
            </div>
          </div>

          {/* Cable Material Selection List */}
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2 font-mono">
              Select Cable Material on Industrial Reel
            </div>
            <div className="space-y-2.5">
              {cableOptions.map((opt) => {
                const isSelected = selectedCableMaterial === opt.material;
                return (
                  <button
                    key={opt.material}
                    onClick={() => handleSelect(opt.material)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-md ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                          {opt.material}
                        </span>
                        <span className="text-sm font-bold font-['Chakra_Petch'] text-white">
                          {opt.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
                      <div className="flex items-center space-x-4 text-[11px] text-slate-400 mt-2 font-mono">
                        <span>Conductor: {opt.conductor}</span>
                        <span>Nominal OD: {opt.nominalOD}</span>
                        <span>Standard: {opt.standard}</span>
                      </div>
                    </div>

                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Active: <strong className="text-cyan-400">{selectedCableMaterial}</strong> | Standard:{' '}
            {selectedRecipe.standard}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLoadToReel}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-['Chakra_Petch'] text-xs transition-colors shadow-md"
            >
              <Disc className="w-4 h-4" />
              <span>LOAD CABLE TO REEL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
