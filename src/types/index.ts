export type StageId =
  | 'S01_REEL_LOADING'
  | 'S02_CABLE_FEEDING'
  | 'S03_DIAMETER_SENSING'
  | 'S04_POSITION_DETECTION'
  | 'S05_VERTICAL_CUTTING'
  | 'S06_HORIZONTAL_CUTTING'
  | 'S07_FLATTENING'
  | 'S08_DUMBBELL_PUNCH'
  | 'S09_FINISHED_DUMBBELL'
  | 'S10_CONVEYOR_TRANSFER'
  | 'S11_THICKNESS_METROLOGY'
  | 'S12_VISION_CAPTURE'
  | 'S13_AI_ANALYSIS'
  | 'S14_HEATMAP'
  | 'S15_DIMENSION_ANALYSIS'
  | 'S16_STANDARD_VALIDATION'
  | 'S17_PASS_REJECT'
  | 'S18_DIGITAL_RECORD';

export type SpecimenState =
  | 'RAW_CABLE'
  | 'PROCESSED_STRIP'
  | 'READY_FOR_PUNCH'
  | 'PUNCHING'
  | 'FINISHED_DUMBBELL'
  | 'ON_CONVEYOR'
  | 'UNDER_INSPECTION'
  | 'PASS'
  | 'REJECT';

export interface StageDefinition {
  id: StageId;
  index: number;
  title: string;
  subtitle: string;
  description: string;
  durationMs: number;
  activeComponentIds: MachineComponentId[];
  cameraPreset: CameraPresetId;
  whyThisStep: string;
  telemetrySnapshot: Partial<SensorTelemetry>;
}

export type MachineComponentId =
  | 'reel'
  | 'feed_roller_1'
  | 'feed_roller_2'
  | 'laser_micrometer'
  | 'proximity_sensor'
  | 'vertical_blades'
  | 'horizontal_blade'
  | 'flattening_roller'
  | 'flattening_block'
  | 'thickness_sensor'
  | 'conveyor'
  | 'vision_camera'
  | 'dumbbell_die'
  | 'plc_cabinet'
  | 'weintek_hmi'
  | 'pass_tray'
  | 'reject_tray'
  | 'ai_engine';

export interface ComponentInfo {
  id: MachineComponentId;
  name: string;
  category: string;
  function: string;
  location: string;
  input: string;
  output: string;
  connectedTo: string;
  status: 'ACTIVE' | 'STANDBY' | 'ENGAGED' | 'ONLINE' | 'CALIBRATED';
  currentReading: string;
  purpose: string;
  specs: { label: string; value: string }[];
  position: [number, number, number];
}

export type CameraPresetId =
  | 'overview'
  | 'reel'
  | 'feeding'
  | 'diameter'
  | 'cutting'
  | 'flattening'
  | 'thickness'
  | 'conveyor'
  | 'inspection'
  | 'punching'
  | 'output'
  | 'plc';

export interface CameraPreset {
  id: CameraPresetId;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface SensorTelemetry {
  cableDiameter: number; // mm (e.g. 12.04)
  feedSpeed: number; // mm/s (e.g. 45)
  cablePosition: number; // mm (e.g. 184.2)
  insulationThickness: number; // mm (e.g. 1.48)
  flattenedThickness: number; // mm (e.g. 4.98)
  bladeDepth: number; // mm (e.g. 1.52)
  conveyorSpeed: number; // mm/s (e.g. 35)
  punchPressure: number; // bar (e.g. 6.2)
  cameraConfidence: number; // % (e.g. 98.4)
  defectProbability: number; // % (e.g. 2.1)
  plcCpuTemp: number; // °C (e.g. 41.5)
  hmiSyncRate: number; // Hz (e.g. 50)
  laserStatus: 'READY' | 'EMITTING' | 'CALIBRATING';
  interlockSafety: boolean;
}

export interface StandardRecipe {
  id: string;
  cableType: string;
  standard: 'IS 10810 (Part 7/15)' | 'IS 7098 (Part 1/2)' | 'IS 694 Custom';
  testMethod: string;
  conductorCrossSection: string;
  visualRadius: number;
  nominalOD: number;
  targetDimensions: {
    gaugeLength: number; // mm (e.g. 25.0)
    gaugeLengthTol: number; // +/- mm
    width: number; // mm (e.g. 12.0)
    widthTol: number;
    thickness: number; // mm (e.g. 5.0)
    thicknessTol: number;
    overallLength: number; // mm (e.g. 115.0)
    overallLengthTol: number;
    filletRadius: number; // mm (e.g. 12.0)
    filletRadiusTol: number;
  };
  acceptanceCriteria: {
    minTensileMPa: number;
    minElongationPct: number;
    maxDefectAreaMm2: number;
  };
  notes: string;
}

export type CableMaterialType = 'XLPE' | 'PVC' | 'HDPE';
export type OperationMode = 'AUTO' | 'MANUAL';
export type TestScenarioType = 'AUTO' | 'PASS' | 'FAIL';
export type CycleState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETE';
export type CameraMode = 'OVERVIEW' | 'AUTO_FOCUS' | 'USER';


export type InspectionViewMode = 'original' | 'canny' | 'heatmap' | 'profile3d';

export interface SpecimenRecord {
  specimenId: string;
  timestamp: string;
  cableType: string;
  cableMaterial: CableMaterialType;
  batch: string;
  cycleNumber: number;
  recipeId: string;
  standard: string;
  measurements: {
    gaugeLength: number;
    width: number;
    thickness: number;
    overallLength: number;
    filletRadius: number;
  };
  tolerancesMet: {
    gaugeLength: boolean;
    width: boolean;
    thickness: boolean;
    overallLength: boolean;
    filletRadius: boolean;
  };
  surfaceDefectScore: number;
  dimensionScore: number;
  shapeScore: number;
  overallResult: 'PASS' | 'REJECT';
  rejectionReason?: string;
  aiConfidence: number;
  defectProbability: number;
  qrPayloadUrl: string;
}

