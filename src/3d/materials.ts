import * as THREE from 'three';

export const MATERIALS = {
  // Metals
  frameSteel: new THREE.MeshStandardMaterial({
    color: 0x1e222b,
    roughness: 0.35,
    metalness: 0.85,
  }),
  brushedAluminum: new THREE.MeshStandardMaterial({
    color: 0x9ba1a6,
    roughness: 0.25,
    metalness: 0.9,
  }),
  hardenedToolSteel: new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.15,
    metalness: 0.95,
  }),
  knurledRoller: new THREE.MeshStandardMaterial({
    color: 0x88929b,
    roughness: 0.45,
    metalness: 0.8,
  }),
  brassFittings: new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.8,
  }),
  copperWire: new THREE.MeshStandardMaterial({
    color: 0xb87333,
    roughness: 0.3,
    metalness: 0.9,
  }),
  stepperMotorBody: new THREE.MeshStandardMaterial({
    color: 0x11161d,
    roughness: 0.6,
    metalness: 0.5,
  }),

  // Cable
  blackCableSheath: new THREE.MeshStandardMaterial({
    color: 0x15171a,
    roughness: 0.55,
    metalness: 0.15,
  }),
  cableInnerInsulation: new THREE.MeshStandardMaterial({
    color: 0x2563eb, // blue insulation
    roughness: 0.4,
    metalness: 0.1,
  }),
  specimenFlattened: new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.2,
  }),
  specimenPunchedPass: new THREE.MeshStandardMaterial({
    color: 0x10b981, // emerald green
    roughness: 0.35,
    metalness: 0.25,
  }),
  specimenPunchedReject: new THREE.MeshStandardMaterial({
    color: 0xef4444, // red
    roughness: 0.35,
    metalness: 0.25,
  }),

  // Plastics & Enclosures
  acrylicClear: new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    thickness: 0.05,
  }),
  conveyorBelt: new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.7,
    metalness: 0.05,
  }),
  keyenceHousing: new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.3,
    metalness: 0.6,
  }),
  siemensPlcGray: new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.4,
    metalness: 0.3,
  }),
  trayGreen: new THREE.MeshStandardMaterial({
    color: 0x065f46,
    roughness: 0.4,
    metalness: 0.2,
  }),
  trayRed: new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.4,
    metalness: 0.2,
  }),

  // Emitters & Sensors
  laserRed: new THREE.MeshBasicMaterial({
    color: 0xff1e1e,
    transparent: true,
    opacity: 0.85,
  }),
  laserBlue: new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
  }),
  ledGreen: new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: new THREE.Color(0x22c55e),
    emissiveIntensity: 2.0,
    roughness: 0.2,
  }),
  ledRed: new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: new THREE.Color(0xef4444),
    emissiveIntensity: 2.0,
    roughness: 0.2,
  }),
  ledAmber: new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: new THREE.Color(0xf59e0b),
    emissiveIntensity: 2.0,
    roughness: 0.2,
  }),
  visionStrobeDome: new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1.2,
    roughness: 0.1,
  }),

  // Highlighting
  highlightGlow: new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  }),
};
