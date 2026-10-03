import { CameraPreset, CameraPresetId } from '../types';

export const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  overview: {
    id: 'overview',
    name: 'Full Machine Overview',
    position: [0, 5.2, 9.2],
    target: [0, 1.2, 0],
  },
  reel: {
    id: 'reel',
    name: 'Industrial Cable Reel',
    position: [-6.8, 2.4, 3.2],
    target: [-6.8, 1.5, 0],
  },
  feeding: {
    id: 'feeding',
    name: 'Dual Feed Rollers',
    position: [-3.7, 2.1, 2.2],
    target: [-3.7, 1.45, 0],
  },
  diameter: {
    id: 'diameter',
    name: 'Keyence Laser Micrometer',
    position: [-2.1, 1.9, 2.0],
    target: [-2.1, 1.45, 0],
  },
  cutting: {
    id: 'cutting',
    name: 'Insulation Slitting & Chop',
    position: [-0.2, 2.0, 2.2],
    target: [-0.2, 1.45, 0],
  },
  flattening: {
    id: 'flattening',
    name: 'Heavy Flattening Anvil & Roller',
    position: [1.3, 2.0, 2.2],
    target: [1.3, 1.45, 0],
  },
  punching: {
    id: 'punching',
    name: 'Precision Dumbbell Punch Die',
    position: [2.4, 2.0, 2.2],
    target: [2.4, 1.45, 0],
  },
  conveyor: {
    id: 'conveyor',
    name: 'Inspection Conveyor Belt',
    position: [4.4, 2.2, 2.8],
    target: [4.4, 1.3, 0],
  },
  thickness: {
    id: 'thickness',
    name: 'Optical Thickness Displacement Gauge',
    position: [3.6, 1.9, 2.0],
    target: [3.6, 1.45, 0],
  },
  inspection: {
    id: 'inspection',
    name: '4K Telecentric Vision Dome & AI Metrology',
    position: [4.7, 2.4, 1.9],
    target: [4.7, 1.55, 0],
  },
  output: {
    id: 'output',
    name: 'PASS / REJECT Sorting Trays',
    position: [6.4, 1.9, 2.2],
    target: [6.4, 1.15, 0],
  },
  plc: {
    id: 'plc',
    name: 'Siemens S7-1200 & HMI Swivel',
    position: [0.0, 1.8, 2.8],
    target: [0.0, 1.2, 0.6],
  },
};

