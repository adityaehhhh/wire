import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const ConveyorSystem: React.FC = () => {
  const roller1Ref = useRef<THREE.Mesh>(null);
  const roller2Ref = useRef<THREE.Mesh>(null);

  const isRunning = useMachineStore((state) => state.isRunning);
  const isPaused = useMachineStore((state) => state.isPaused);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const speedMultiplier = useMachineStore((state) => state.speedMultiplier);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isSelected = selectedComponentId === 'conveyor';
  // Conveyor moves during S10 (transfer from punch, idx 9), and S17 (transfer to sorting tray, idx 16)
  const isConveying =
    (isRunning && !isPaused && (currentStageIndex === 9 || currentStageIndex === 16)) ||
    currentStageIndex === 9;

  useFrame((_, delta) => {
    if (isConveying) {
      const rot = delta * 4.0 * speedMultiplier;
      if (roller1Ref.current) roller1Ref.current.rotation.z -= rot;
      if (roller2Ref.current) roller2Ref.current.rotation.z -= rot;
    }
  });

  return (
    <group
      position={[4.4, 1.32, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId('conveyor');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Aluminum Extrusion Side Frame Rails (Length: 3.0m) */}
      <mesh position={[0, 0, 0.16]} material={MATERIALS.brushedAluminum} castShadow>
        <boxGeometry args={[3.0, 0.08, 0.04]} />
      </mesh>
      <mesh position={[0, 0, -0.16]} material={MATERIALS.brushedAluminum} castShadow>
        <boxGeometry args={[3.0, 0.08, 0.04]} />
      </mesh>

      {/* Main Flat Anti-Static Belt */}
      <mesh position={[0, 0.035, 0]} material={MATERIALS.conveyorBelt} receiveShadow>
        <boxGeometry args={[2.96, 0.015, 0.28]} />
      </mesh>
      <mesh position={[0, -0.035, 0]} material={MATERIALS.conveyorBelt}>
        <boxGeometry args={[2.96, 0.015, 0.28]} />
      </mesh>

      {/* Entry Crown Roller (Left) */}
      <mesh
        ref={roller1Ref}
        position={[-1.46, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={MATERIALS.hardenedToolSteel}
        castShadow
      >
        <cylinderGeometry args={[0.04, 0.04, 0.28, 20]} />
      </mesh>

      {/* Exit Crown Roller (Right) */}
      <mesh
        ref={roller2Ref}
        position={[1.46, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={MATERIALS.hardenedToolSteel}
        castShadow
      >
        <cylinderGeometry args={[0.04, 0.04, 0.28, 20]} />
      </mesh>

      {/* Brushless Conveyor Drive Gearmotor */}
      <group position={[1.46, -0.12, -0.24]}>
        <mesh material={MATERIALS.stepperMotorBody} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.18, 16]} />
        </mesh>
      </group>

      {/* Mounting Stanchions to Base Bed */}
      <mesh position={[-1.1, -0.26, 0]} material={MATERIALS.frameSteel}>
        <boxGeometry args={[0.1, 0.44, 0.24]} />
      </mesh>
      <mesh position={[1.1, -0.26, 0]} material={MATERIALS.frameSteel}>
        <boxGeometry args={[0.1, 0.44, 0.24]} />
      </mesh>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 0.35, 0.5]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};
