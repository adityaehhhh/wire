import React from 'react';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const ProximitySensor: React.FC = () => {
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isSelected = selectedComponentId === 'proximity_sensor';
  const isDetecting = currentStageIndex >= 3; // Active from S04 onward

  return (
    <group
      position={[-1.4, 1.45, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId('proximity_sensor');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Aluminum Mounting Angle Bracket */}
      <mesh position={[0, -0.18, 0.16]} material={MATERIALS.brushedAluminum} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.12]} />
      </mesh>

      {/* Sensor Threaded Barrel */}
      <group position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Brass Threaded Body */}
        <mesh material={MATERIALS.brassFittings} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 16]} />
        </mesh>
        {/* Lock Nuts */}
        <mesh position={[0, 0.02, 0]} material={MATERIALS.hardenedToolSteel}>
          <cylinderGeometry args={[0.038, 0.038, 0.02, 6]} />
        </mesh>
        <mesh position={[0, -0.04, 0]} material={MATERIALS.hardenedToolSteel}>
          <cylinderGeometry args={[0.038, 0.038, 0.02, 6]} />
        </mesh>
        {/* Sensing Face Tip */}
        <mesh position={[0, 0.095, 0]} material={isDetecting ? MATERIALS.ledGreen : MATERIALS.ledAmber}>
          <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
        </mesh>
        {/* Rear LED Indicator */}
        <mesh position={[0, -0.095, 0]} material={isDetecting ? MATERIALS.ledGreen : MATERIALS.ledAmber}>
          <sphereGeometry args={[0.012, 12, 12]} />
        </mesh>
      </group>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[0.3, 0.45, 0.4]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};
