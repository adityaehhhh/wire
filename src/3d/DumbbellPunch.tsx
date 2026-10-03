import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const DumbbellPunch: React.FC = () => {
  const punchHeadRef = useRef<THREE.Group>(null);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);
  const currentStageProgress = useMachineStore((state) => state.currentStageProgress);

  const isSelected = selectedComponentId === 'dumbbell_die';
  const isPunching = currentStageIndex === 7; // Stage 08_DUMBBELL_PUNCH (0-indexed 7)

  const punchPhase = useRef<'IDLE' | 'APPROACH' | 'IMPACT' | 'HOLD' | 'RETRACT'>('IDLE');

  useFrame(() => {
    if (punchHeadRef.current) {
      if (isPunching) {
        const t = currentStageProgress;

        if (t < 0.45) {
          // 1. Approach: Die descends smoothly from 0.32 to 0.075
          punchPhase.current = 'APPROACH';
          punchHeadRef.current.position.y = THREE.MathUtils.lerp(0.32, 0.075, t / 0.45);
        } else if (t >= 0.45 && t < 0.65) {
          // 2. Impact & Hold: Pressed firmly down onto anvil
          punchPhase.current = 'HOLD';
          punchHeadRef.current.position.y = 0.075;
        } else {
          // 3. Retract: Die returns up to 0.32
          punchPhase.current = 'RETRACT';
          const retProg = Math.min(1.0, (t - 0.65) / 0.35);
          punchHeadRef.current.position.y = THREE.MathUtils.lerp(0.075, 0.32, retProg);
        }
      } else {
        punchPhase.current = 'IDLE';
        punchHeadRef.current.position.y = THREE.MathUtils.lerp(punchHeadRef.current.position.y, 0.32, 0.15);
      }
    }
  });

  return (
    <group
      position={[2.4, 1.45, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId('dumbbell_die');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Heavy Four-Post Hydraulic Press Frame */}
      {[-0.14, 0.14].map((x, i) =>
        [-0.18, 0.18].map((z, j) => (
          <mesh
            key={`post-${i}-${j}`}
            position={[x, 0.28, z]}
            material={MATERIALS.hardenedToolSteel}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.8, 16]} />
          </mesh>
        ))
      )}

      {/* Top Hydraulic Booster Crown */}
      <mesh position={[0, 0.68, 0]} material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.38, 0.12, 0.44]} />
      </mesh>
      {/* Heavy Boost Cylinder */}
      <mesh position={[0, 0.54, 0]} material={MATERIALS.brushedAluminum} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.22, 24]} />
      </mesh>

      {/* Ground Punch Anvil Base Plate */}
      <mesh position={[0, -0.12, 0]} material={MATERIALS.hardenedToolSteel} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.1, 0.42]} />
      </mesh>

      {/* Moving Punch Ram & Hardened Dumbbell Die */}
      <group ref={punchHeadRef} position={[0, 0.32, 0]}>
        {/* Upper Platen */}
        <mesh material={MATERIALS.brushedAluminum} castShadow>
          <boxGeometry args={[0.32, 0.08, 0.38]} />
        </mesh>

        {/* Dumbbell Cutter Die Body */}
        <group position={[0, -0.07, 0]}>
          <mesh material={MATERIALS.hardenedToolSteel} castShadow>
            <boxGeometry args={[0.26, 0.06, 0.22]} />
          </mesh>
          {/* Dumbbell Razor Die Blades */}
          <mesh position={[0, -0.04, 0]} material={MATERIALS.hardenedToolSteel}>
            <boxGeometry args={[0.12, 0.02, 0.07]} />
          </mesh>
          <mesh position={[-0.09, -0.04, 0]} material={MATERIALS.hardenedToolSteel}>
            <boxGeometry args={[0.07, 0.02, 0.15]} />
          </mesh>
          <mesh position={[0.09, -0.04, 0]} material={MATERIALS.hardenedToolSteel}>
            <boxGeometry args={[0.07, 0.02, 0.15]} />
          </mesh>
        </group>
      </group>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.5, 0.95, 0.55]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};
