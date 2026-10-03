import { create } from 'zustand';
import {
  CableMaterialType,
  CameraPresetId,
  InspectionViewMode,
  MachineComponentId,
  OperationMode,
  SensorTelemetry,
  SpecimenRecord,
  SpecimenState,
  StandardRecipe,
} from '../types';
import { STAGES } from '../data/stages';
import { RECIPES } from '../data/recipes';
import { COMPONENTS_DATA } from '../data/componentsData';
import { soundManager } from '../utils/soundManager';

export interface ComponentToastInfo {
  name: string;
  subtitle: string;
  desc: string;
}

interface MachineState {
  operationMode: OperationMode;
  selectedCableMaterial: CableMaterialType;
  isRunning: boolean;
  isPaused: boolean;
  judgeMode: boolean;
  testScenario: 'PASS' | 'FAIL' | 'AUTO';
  currentStageIndex: number;
  currentStageProgress: number; // 0 to 1
  cableHeadProgress: number; // 0.05 to 1.0 (spline position from reel to cut point)
  specimenState: SpecimenState;
  laserActive: boolean;
  cycleCount: number;
  speedMultiplier: number;
  selectedComponentId: MachineComponentId | null;
  activeCameraPreset: CameraPresetId;
  isCameraFollowEnabled: boolean;
  isOverviewMode: boolean;
  inspectionViewMode: InspectionViewMode;
  selectedRecipe: StandardRecipe;
  telemetry: SensorTelemetry;
  currentSpecimen: SpecimenRecord | null;
  specimenHistory: SpecimenRecord[];
  lastPassRejectResult: 'PASS' | 'REJECT' | null;
  autoCycleComplete: boolean;
  finalDashboardOpen: boolean;
  soundEnabled: boolean;
  activeToast: ComponentToastInfo | null;

  // Actions
  setOperationMode: (mode: OperationMode) => void;
  setTestScenario: (scenario: 'PASS' | 'FAIL' | 'AUTO') => void;
  setSelectedCableMaterial: (material: CableMaterialType) => void;
  setSpecimenState: (state: SpecimenState) => void;
  startCycle: () => void;
  stopCycle: () => void;
  togglePlayPause: () => void;
  resetCycle: () => void;
  setStageIndex: (index: number) => void;
  nextStage: () => void;
  prevStage: () => void;
  setJudgeMode: (val: boolean) => void;
  setSpeedMultiplier: (speed: number) => void;
  setSelectedComponentId: (id: MachineComponentId | null) => void;
  setActiveCameraPreset: (preset: CameraPresetId, userInteracted?: boolean) => void;
  setIsCameraFollowEnabled: (val: boolean) => void;
  toggleOverviewMode: () => void;
  setInspectionViewMode: (mode: InspectionViewMode) => void;
  setSelectedRecipe: (recipe: StandardRecipe) => void;
  updateTelemetry: (partial: Partial<SensorTelemetry>) => void;
  setStageProgress: (progress: number) => void;
  advanceStageProgress: (deltaSec: number) => void;
  setSoundEnabled: (val: boolean) => void;
  setFinalDashboardOpen: (val: boolean) => void;
  generateSpecimenRecord: () => SpecimenRecord;
}

const initialTelemetry: SensorTelemetry = {
  cableDiameter: 12.04,
  feedSpeed: 0,
  cablePosition: 0,
  insulationThickness: 1.48,
  flattenedThickness: 4.98,
  bladeDepth: 0,
  conveyorSpeed: 0,
  punchPressure: 0,
  cameraConfidence: 99.2,
  defectProbability: 1.4,
  plcCpuTemp: 41.2,
  hmiSyncRate: 50,
  laserStatus: 'READY',
  interlockSafety: true,
};

let toastTimer: number | null = null;

export const useMachineStore = create<MachineState>((set, get) => ({
  operationMode: 'AUTO',
  selectedCableMaterial: 'XLPE',
  isRunning: false,
  isPaused: false,
  judgeMode: false,
  testScenario: 'PASS',
  currentStageIndex: 0,
  currentStageProgress: 0,
  cableHeadProgress: 0.08, // Initial: small stub right at reel tangency
  specimenState: 'RAW_CABLE',
  laserActive: false,
  cycleCount: 1,
  speedMultiplier: 1.0,
  selectedComponentId: null,
  activeCameraPreset: 'overview',
  isCameraFollowEnabled: true,
  isOverviewMode: false,
  inspectionViewMode: 'original',
  selectedRecipe: RECIPES[0],
  telemetry: initialTelemetry,
  currentSpecimen: null,
  specimenHistory: [
    {
      specimenId: 'SPEC-2026-000121',
      timestamp: '2026-10-01 23:40:12',
      cableType: '1.1kV XLPE 3-Core 25 sq.mm',
      cableMaterial: 'XLPE',
      batch: 'BATCH-2026-A19',
      cycleNumber: 121,
      recipeId: 'RECIPE_IS_10810_P7',
      standard: 'IS 10810 (Part 7/15)',
      measurements: {
        gaugeLength: 25.02,
        width: 12.01,
        thickness: 4.99,
        overallLength: 115.1,
        filletRadius: 12.03,
      },
      tolerancesMet: {
        gaugeLength: true,
        width: true,
        thickness: true,
        overallLength: true,
        filletRadius: true,
      },
      surfaceDefectScore: 0.98,
      dimensionScore: 0.99,
      shapeScore: 0.97,
      overallResult: 'PASS',
      aiConfidence: 99.1,
      defectProbability: 1.2,
      qrPayloadUrl: 'https://speci-x.example/specimen/SPEC-2026-000121',
    },
    {
      specimenId: 'SPEC-2026-000122',
      timestamp: '2026-10-01 23:45:34',
      cableType: '1.1kV XLPE 3-Core 25 sq.mm',
      cableMaterial: 'XLPE',
      batch: 'BATCH-2026-A19',
      cycleNumber: 122,
      recipeId: 'RECIPE_IS_10810_P7',
      standard: 'IS 10810 (Part 7/15)',
      measurements: {
        gaugeLength: 25.04,
        width: 11.99,
        thickness: 4.97,
        overallLength: 114.9,
        filletRadius: 12.01,
      },
      tolerancesMet: {
        gaugeLength: true,
        width: true,
        thickness: true,
        overallLength: true,
        filletRadius: true,
      },
      surfaceDefectScore: 0.99,
      dimensionScore: 0.98,
      shapeScore: 0.99,
      overallResult: 'PASS',
      aiConfidence: 99.4,
      defectProbability: 0.9,
      qrPayloadUrl: 'https://speci-x.example/specimen/SPEC-2026-000122',
    },
  ],
  lastPassRejectResult: null,
  autoCycleComplete: false,
  finalDashboardOpen: false,
  soundEnabled: true,
  activeToast: null,

  setOperationMode: (mode) => set({ operationMode: mode }),
  setTestScenario: (scenario) => set({ testScenario: scenario }),

  setSelectedCableMaterial: (material) => {
    let matchedRecipe = RECIPES[0];
    if (material === 'PVC') {
      matchedRecipe = RECIPES.find((r) => r.id === 'RECIPE_IS_694') || RECIPES[2];
    } else if (material === 'HDPE') {
      matchedRecipe = RECIPES.find((r) => r.id === 'RECIPE_IS_7098_P1') || RECIPES[1];
    } else {
      matchedRecipe = RECIPES[0];
    }
    set({
      selectedCableMaterial: material,
      selectedRecipe: matchedRecipe,
    });
  },

  setSoundEnabled: (val) => {
    soundManager.setEnabled(val);
    set({ soundEnabled: val });
  },

  setFinalDashboardOpen: (val) => set({ finalDashboardOpen: val }),

  toggleOverviewMode: () => {
    set((state) => {
      const next = !state.isOverviewMode;
      return {
        isOverviewMode: next,
        activeCameraPreset: next ? 'overview' : STAGES[state.currentStageIndex]?.cameraPreset || 'overview',
      };
    });
  },

  startCycle: () => {
    const { currentStageIndex } = get();
    const stage = STAGES[currentStageIndex];

    soundManager.playStartup();
    soundManager.startMotor('reel_motor', 55, 0.035);

    set({
      isRunning: true,
      isPaused: false,
      autoCycleComplete: false,
      finalDashboardOpen: false,
      isOverviewMode: false,
      activeCameraPreset: stage?.cameraPreset || 'reel',
    });

    get().setStageIndex(currentStageIndex);
  },

  stopCycle: () => {
    soundManager.playShutdown();
    set({
      isRunning: false,
      isPaused: false,
      laserActive: false,
      telemetry: {
        ...get().telemetry,
        feedSpeed: 0,
        conveyorSpeed: 0,
        bladeDepth: 0,
        punchPressure: 0,
        laserStatus: 'READY',
      },
    });
  },

  togglePlayPause: () => {
    const nextPaused = !get().isPaused;
    if (nextPaused) {
      soundManager.stopAllMotors();
    }
    set({
      isPaused: nextPaused,
      isRunning: !nextPaused,
    });
  },

  setSpecimenState: (state) => set({ specimenState: state }),

  resetCycle: () => {
    soundManager.stopAllMotors();
    set({
      isRunning: false,
      isPaused: false,
      currentStageIndex: 0,
      currentStageProgress: 0,
      cableHeadProgress: 0.08,
      specimenState: 'RAW_CABLE',
      laserActive: false,
      telemetry: initialTelemetry,
      activeCameraPreset: 'overview',
      isOverviewMode: true,
      lastPassRejectResult: null,
      autoCycleComplete: false,
      finalDashboardOpen: false,
      activeToast: null,
    });
  },

  advanceStageProgress: (deltaSec: number) => {
    const { isRunning, isPaused, currentStageIndex, currentStageProgress, speedMultiplier, nextStage } = get();
    if (!isRunning || isPaused) return;

    const stage = STAGES[currentStageIndex];
    if (!stage) return;

    const durationSec = Math.max(0.2, (stage.durationMs / 1000) / speedMultiplier);
    const progressInc = deltaSec / durationSec;
    const nextProg = currentStageProgress + progressInc;

    if (nextProg >= 1.0) {
      set({ currentStageProgress: 1.0 });
      nextStage();
    } else {
      set({ currentStageProgress: nextProg });
    }
  },

  setStageIndex: (index: number) => {
    const clamped = Math.max(0, Math.min(STAGES.length - 1, index));
    const stage = STAGES[clamped];
    const { isOverviewMode, isRunning, testScenario } = get();

    // Position-based spline cable progress
    let cableProgress = 1.0;
    if (clamped === 0) cableProgress = 0.28;
    else if (clamped === 1) cableProgress = 0.62;
    else if (clamped === 2) cableProgress = 0.82;
    else if (clamped === 3) cableProgress = 1.0;
    else cableProgress = 1.0;

    // Laser micrometer is active during Stage 03 (OD scan, idx 2) and Stage 11 (Thickness scan, idx 10)
    const isLaserOn = clamped === 2 || clamped === 10;

    const isFailMode = testScenario === 'FAIL';

    // Derive deterministic specimen state based on 18-stage order
    let nextSpecimenState: SpecimenState = 'RAW_CABLE';
    if (clamped <= 3) nextSpecimenState = 'RAW_CABLE';
    else if (clamped <= 5) nextSpecimenState = 'PROCESSED_STRIP';
    else if (clamped === 6) nextSpecimenState = 'READY_FOR_PUNCH';
    else if (clamped === 7) nextSpecimenState = 'PUNCHING';
    else if (clamped === 8) nextSpecimenState = 'FINISHED_DUMBBELL';
    else if (clamped === 9) nextSpecimenState = 'ON_CONVEYOR';
    else if (clamped <= 15) nextSpecimenState = 'UNDER_INSPECTION';
    else nextSpecimenState = isFailMode ? 'REJECT' : 'PASS';

    // Synchronized audio sound effects
    if (isRunning) {
      if (clamped === 0) {
        soundManager.startMotor('reel_motor', 52, 0.035);
      } else if (clamped === 1) {
        soundManager.startMotor('feeder_motor', 82, 0.04);
      } else if (clamped === 2) {
        soundManager.playLaserScan();
        setTimeout(() => soundManager.playLaserConfirmation(), 1400);
      } else if (clamped === 4) {
        soundManager.playStrippingCut();
      } else if (clamped === 5) {
        soundManager.playGuillotineChop();
      } else if (clamped === 6) {
        soundManager.playFlattenPress();
      } else if (clamped === 7) {
        // Stage 08: Heavy industrial metal die punch impact ("DHAAMM")
        soundManager.playHeavyPunchImpact();
      } else if (clamped === 9) {
        // Stage 10: Conveyor transfer motor starts
        soundManager.startMotor('conveyor_motor', 58, 0.035);
      } else if (clamped === 10) {
        // Stage 11: Thickness displacement sensor scan
        soundManager.playLaserScan();
      } else if (clamped === 11) {
        // Stage 12: 4K Vision Camera optical strobe capture
        soundManager.playCameraCapture();
      } else if (clamped === 16) {
        // Stage 17: Pass / Reject verdict sound
        if (isFailMode) {
          soundManager.playRejectTone();
        } else {
          soundManager.playPassChime();
        }
      }
    }

    // 1-second floating active component toast
    const activeCompId = stage.activeComponentIds[0];
    const compData = activeCompId ? COMPONENTS_DATA[activeCompId] : null;

    if (toastTimer) clearTimeout(toastTimer);
    if (compData) {
      set({
        activeToast: {
          name: compData.name,
          subtitle: compData.category,
          desc: compData.purpose || compData.function,
        },
      });
      toastTimer = window.setTimeout(() => {
        set({ activeToast: null });
      }, 1200);
    } else {
      set({ activeToast: null });
    }

    set((state) => ({
      currentStageIndex: clamped,
      currentStageProgress: 0,
      cableHeadProgress: cableProgress,
      specimenState: nextSpecimenState,
      laserActive: isLaserOn,
      telemetry: {
        ...state.telemetry,
        ...stage.telemetrySnapshot,
        defectProbability: clamped >= 13 ? (isFailMode ? 87.4 : 1.2) : stage.telemetrySnapshot.defectProbability || state.telemetry.defectProbability,
        laserStatus: isLaserOn ? 'EMITTING' : 'READY',
      },
      activeCameraPreset: isOverviewMode ? 'overview' : stage.cameraPreset,
    }));
  },

  nextStage: () => {
    const { currentStageIndex, setStageIndex, generateSpecimenRecord } = get();
    if (currentStageIndex < STAGES.length - 1) {
      setStageIndex(currentStageIndex + 1);
    } else {
      // Completed full cycle
      soundManager.stopAllMotors();
      const rec = generateSpecimenRecord();

      if (rec.overallResult === 'PASS') {
        soundManager.playPassChime();
      } else {
        soundManager.playRejectTone();
      }

      set((state) => ({
        isRunning: false,
        autoCycleComplete: true,
        finalDashboardOpen: true,
        cycleCount: state.cycleCount + 1,
        lastPassRejectResult: rec.overallResult,
        specimenHistory: [rec, ...state.specimenHistory],
        currentSpecimen: rec,
        activeCameraPreset: 'overview',
        isOverviewMode: true,
        activeToast: null,
      }));
    }
  },

  prevStage: () => {
    const { currentStageIndex, setStageIndex } = get();
    if (currentStageIndex > 0) {
      setStageIndex(currentStageIndex - 1);
    }
  },

  setJudgeMode: (val) => set({ judgeMode: val }),
  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
  setSelectedComponentId: (id) => set({ selectedComponentId: id }),

  setActiveCameraPreset: (preset, userInteracted = false) => {
    set({
      activeCameraPreset: preset,
      isOverviewMode: preset === 'overview',
      ...(userInteracted ? { isCameraFollowEnabled: false } : {}),
    });
  },

  setIsCameraFollowEnabled: (val) => set({ isCameraFollowEnabled: val }),
  setInspectionViewMode: (mode) => set({ inspectionViewMode: mode }),
  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

  updateTelemetry: (partial) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...partial },
    })),

  setStageProgress: (progress) => set({ currentStageProgress: Math.min(1, Math.max(0, progress)) }),

  generateSpecimenRecord: () => {
    const { cycleCount, selectedRecipe, selectedCableMaterial, testScenario } = get();
    const cycleNum = 124 + cycleCount - 1;
    const padded = String(cycleNum).padStart(6, '0');
    const specimenId = `SPEC-2026-${padded}`;
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const isPass = testScenario === 'PASS' ? true : testScenario === 'FAIL' ? false : Math.random() > 0.15;
    const delta = (range: number) => (Math.random() - 0.5) * range;

    const target = selectedRecipe.targetDimensions;
    const measurements = {
      gaugeLength: +(target.gaugeLength + (isPass ? delta(0.2) : delta(1.8) + 0.9)).toFixed(2),
      width: +(target.width + (isPass ? delta(0.12) : delta(0.7) + 0.4)).toFixed(2),
      thickness: +(target.thickness + (isPass ? delta(0.15) : delta(0.8) + 0.5)).toFixed(2),
      overallLength: +(target.overallLength + (isPass ? delta(0.8) : delta(3.5))).toFixed(2),
      filletRadius: +(target.filletRadius + (isPass ? delta(0.2) : delta(1.2))).toFixed(2),
    };

    const tolerancesMet = {
      gaugeLength: Math.abs(measurements.gaugeLength - target.gaugeLength) <= target.gaugeLengthTol,
      width: isPass ? Math.abs(measurements.width - target.width) <= target.widthTol : false,
      thickness: Math.abs(measurements.thickness - target.thickness) <= target.thicknessTol,
      overallLength: Math.abs(measurements.overallLength - target.overallLength) <= target.overallLengthTol,
      filletRadius: Math.abs(measurements.filletRadius - target.filletRadius) <= target.filletRadiusTol,
    };

    const overallResult: 'PASS' | 'REJECT' = isPass ? 'PASS' : 'REJECT';
    const defectProbability = isPass ? 1.2 : 87.4;

    const record: SpecimenRecord = {
      specimenId,
      timestamp,
      cableType: selectedRecipe.cableType,
      cableMaterial: selectedCableMaterial,
      batch: 'BATCH-2026-A19',
      cycleNumber: cycleNum,
      recipeId: selectedRecipe.id,
      standard: selectedRecipe.standard,
      measurements,
      tolerancesMet,
      surfaceDefectScore: isPass ? 0.985 : 0.62,
      dimensionScore: isPass ? 0.988 : 0.74,
      shapeScore: isPass ? 0.991 : 0.81,
      overallResult,
      rejectionReason: !isPass
        ? 'SURFACE DEFECT DETECTED: Thermal anomaly & micro-void on specimen shoulder (87.4% defect probability)'
        : undefined,
      aiConfidence: isPass ? 99.2 : 98.8,
      defectProbability,
      qrPayloadUrl: `https://speci-x.example/specimen/${specimenId}`,
    };

    return record;
  },
}));


