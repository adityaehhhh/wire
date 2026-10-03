import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

interface RollerPairProps {
  xPos: number;
  componentId: 'feed_roller_1' | 'feed_roller_2';
  title: string;
}

const RollerUnit: React.FC<RollerPairProps> = ({ xPos, componentId, title }) => {
  const topRollerRef = useRef<THREE.Mesh>(null);
  const btmRollerRef = useRef<THREE.Mesh>(null);
  const isRunning = useMachineStore((state) => state.isRunning);
  const isPaused = useMachineStore((state) => state.isPaused);
  const speedMultiplier = useMachineStore((state) => state.speedMultiplier);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isSelected = selectedComponentId === componentId;

  useFrame((_, delta) => {
    if (isRunning && !isPaused) {
      const rotDelta = delta * 4.5 * speedMultiplier;
      if (topRollerRef.current) topRollerRef.current.rotation.z -= rotDelta;
      if (btmRollerRef.current) btmRollerRef.current.rotation.z += rotDelta; // Opposing rotation grips cable
    }
  });

  return (
    <group
      position={[xPos, 1.45, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId(componentId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Heavy Steel Vertical Bearing Stand */}
      <mesh position={[0, 0, 0.28]} material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.22, 0.65, 0.08]} />
      </mesh>
      <mesh position={[0, 0, -0.28]} material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.22, 0.65, 0.08]} />
      </mesh>

      {/* Top Pinch Roller */}
      <mesh
        ref={topRollerRef}
        position={[0, 0.16, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={MATERIALS.knurledRoller}
        castShadow
      >
        <cylinderGeometry args={[0.12, 0.12, 0.38, 24]} />
      </mesh>
      {/* Top Shaft */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.hardenedToolSteel}>
        <cylinderGeometry args={[0.035, 0.035, 0.64, 16]} />
      </mesh>

      {/* Bottom Drive Roller */}
      <mesh
        ref={btmRollerRef}
        position={[0, -0.16, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={MATERIALS.knurledRoller}
        castShadow
      >
        <cylinderGeometry args={[0.12, 0.12, 0.38, 24]} />
      </mesh>
      {/* Bottom Shaft */}
      <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.hardenedToolSteel}>
        <cylinderGeometry args={[0.035, 0.035, 0.64, 16]} />
      </mesh>

      {/* NEMA-34 Stepper Motor attached to rear */}
      <group position={[0, -0.16, -0.48]}>
        <mesh material={MATERIALS.stepperMotorBody} castShadow>
          <boxGeometry args={[0.24, 0.24, 0.32]} />
        </mesh>
        {/* Motor Faceplate */}
        <mesh position={[0, 0, 0.17]} material={MATERIALS.brushedAluminum}>
          <boxGeometry args={[0.26, 0.26, 0.03]} />
        </mesh>
        {/* Encoder Housing */}
        <mesh position={[0, 0, -0.18]} material={MATERIALS.frameSteel}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        </mesh>
      </group>

      {/* Pneumatic Top Clamp Cylinder */}
      <mesh position={[0, 0.38, 0]} material={MATERIALS.brushedAluminum} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 16]} />
      </mesh>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 0.85, 1.1]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};

export const FeedRollers: React.FC = () => {
  return (
    <group>
      {/* Entry Guide Bushing Block (Between Reel and Roller 1) */}
      <group position={[-5.3, 1.45, 0]}>
        <mesh material={MATERIALS.brushedAluminum} castShadow>
          <boxGeometry args={[0.16, 0.24, 0.22]} />
        </mesh>
        {/* Brass Guide Funnel */}
        <mesh rotation={[0, 0, -Math.PI / 2]} material={MATERIALS.brassFittings}>
          <coneGeometry args={[0.07, 0.12, 16, 1, true]} />
        </mesh>
      </group>

      {/* Roller 1 */}
      <RollerUnit xPos={-4.2} componentId="feed_roller_1" title="Feed Roller 1" />

      {/* Intermediate Guide Tube */}
      <mesh position={[-3.7, 1.45, 0]} rotation={[0, 0, Math.PI / 2]} material={MATERIALS.brushedAluminum}>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 16]} />
      </mesh>

      {/* Roller 2 */}
      <RollerUnit xPos={-3.2} componentId="feed_roller_2" title="Feed Roller 2" />

      {/* Guide to Laser */}
      <mesh position={[-2.7, 1.45, 0]} rotation={[0, 0, Math.PI / 2]} material={MATERIALS.brushedAluminum}>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 16]} />
      </mesh>
    </group>
  );
};
