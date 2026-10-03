import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const ThicknessSensor: React.FC = () => {
  const beamRef = useRef<THREE.Mesh>(null);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isSelected = selectedComponentId === 'thickness_sensor';
  const isMeasuring = currentStageIndex === 10; // Stage 11 (0-indexed 10: S11_THICKNESS_METROLOGY)

  useFrame((state) => {
    if (beamRef.current) {
      if (isMeasuring) {
        const t = state.clock.getElapsedTime();
        (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85 + Math.sin(t * 15) * 0.15;
      } else {
        (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2;
      }
    }
  });

  return (
    <group
      position={[3.6, 1.45, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId('thickness_sensor');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Aluminum Overhang Bracket */}
      <mesh position={[0, 0.45, -0.2]} material={MATERIALS.brushedAluminum} castShadow>
        <boxGeometry args={[0.08, 0.45, 0.08]} />
      </mesh>
      <mesh position={[0, 0.65, -0.05]} material={MATERIALS.brushedAluminum} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.28]} />
      </mesh>

      {/* Sensor Head Body */}
      <group position={[0, 0.52, 0]}>
        <mesh material={MATERIALS.keyenceHousing} castShadow>
          <boxGeometry args={[0.16, 0.2, 0.16]} />
        </mesh>
        {/* Optical Lens Face */}
        <mesh position={[0, -0.095, 0]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.acrylicClear}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        </mesh>
        {/* LED Indicator */}
        <mesh position={[0.075, 0.05, 0]} material={isMeasuring ? MATERIALS.ledGreen : MATERIALS.ledAmber}>
          <sphereGeometry args={[0.012, 12, 12]} />
        </mesh>
      </group>

      {/* Blue Optical Thickness Laser Line Projection */}
      <mesh ref={beamRef} position={[0, 0.24, 0]} material={MATERIALS.laserBlue}>
        <boxGeometry args={[0.004, 0.5, 0.08]} />
      </mesh>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.35]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};
