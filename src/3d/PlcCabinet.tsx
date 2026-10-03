import React from 'react';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const PlcCabinet: React.FC = () => {
  const isRunning = useMachineStore((state) => state.isRunning);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isSelected = selectedComponentId === 'plc_cabinet';

  return (
    <group
      position={[0, 0.42, 0.95]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId('plc_cabinet');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Industrial Rittal-style Steel Cabinet Enclosure */}
      <mesh material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[1.4, 0.55, 0.35]} />
      </mesh>

      {/* Clear Polycarbonate Inspection Window */}
      <mesh position={[0, 0, 0.18]} material={MATERIALS.acrylicClear}>
        <boxGeometry args={[1.25, 0.42, 0.02]} />
      </mesh>

      {/* Internal DIN Rail */}
      <mesh position={[0, 0.05, 0.08]} material={MATERIALS.brushedAluminum}>
        <boxGeometry args={[1.1, 0.03, 0.015]} />
      </mesh>

      {/* ----------------- SIEMENS S7-1200 PLC MODULES ----------------- */}
      <group position={[-0.2, 0.05, 0.1]}>
        {/* CPU 1214C Main Module */}
        <mesh material={MATERIALS.siemensPlcGray} castShadow>
          <boxGeometry args={[0.22, 0.2, 0.08]} />
        </mesh>
        {/* Siemens Classic Blue Top Trim */}
        <mesh position={[0, 0.09, 0.041]} material={MATERIALS.cableInnerInsulation}>
          <boxGeometry args={[0.22, 0.02, 0.005]} />
        </mesh>
        {/* CPU Run / Stop LEDs */}
        <mesh position={[-0.06, 0.04, 0.041]} material={isRunning ? MATERIALS.ledGreen : MATERIALS.ledAmber}>
          <sphereGeometry args={[0.008, 12, 12]} />
        </mesh>
        <mesh position={[-0.03, 0.04, 0.041]} material={MATERIALS.ledGreen}>
          <sphereGeometry args={[0.008, 12, 12]} />
        </mesh>
        {/* PROFINET Green RJ45 Cable */}
        <mesh position={[-0.06, -0.08, 0.045]} material={MATERIALS.ledGreen}>
          <cylinderGeometry args={[0.008, 0.008, 0.06, 12]} />
        </mesh>

        {/* Digital I/O Expansion Module (SM 1221) */}
        <group position={[0.15, 0, 0]}>
          <mesh material={MATERIALS.siemensPlcGray} castShadow>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
          </mesh>
          <mesh position={[0, 0.09, 0.041]} material={MATERIALS.cableInnerInsulation}>
            <boxGeometry args={[0.08, 0.02, 0.005]} />
          </mesh>
          {/* I/O Active Blinking LEDs */}
          <mesh position={[0, 0.04, 0.041]} material={MATERIALS.ledGreen}>
            <sphereGeometry args={[0.006, 12, 12]} />
          </mesh>
        </group>

        {/* Analog Input Module (SM 1231 for Laser Micrometer) */}
        <group position={[0.26, 0, 0]}>
          <mesh material={MATERIALS.siemensPlcGray} castShadow>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
          </mesh>
          <mesh position={[0, 0.09, 0.041]} material={MATERIALS.cableInnerInsulation}>
            <boxGeometry args={[0.08, 0.02, 0.005]} />
          </mesh>
        </group>
      </group>

      {/* 24V DC Industrial Power Supply (SITOP) */}
      <group position={[-0.45, 0.05, 0.1]}>
        <mesh material={MATERIALS.brushedAluminum} castShadow>
          <boxGeometry args={[0.12, 0.22, 0.08]} />
        </mesh>
        {/* Power LED */}
        <mesh position={[0, 0.08, 0.041]} material={MATERIALS.ledGreen}>
          <sphereGeometry args={[0.008, 12, 12]} />
        </mesh>
      </group>

      {/* Wire Ducting (Top & Bottom Slotted Raceways) */}
      <mesh position={[0, 0.22, 0.08]} material={MATERIALS.frameSteel}>
        <boxGeometry args={[1.2, 0.05, 0.04]} />
      </mesh>
      <mesh position={[0, -0.16, 0.08]} material={MATERIALS.frameSteel}>
        <boxGeometry args={[1.2, 0.05, 0.04]} />
      </mesh>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.65, 0.45]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};
