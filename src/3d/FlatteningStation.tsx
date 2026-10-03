import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const FlatteningStation: React.FC = () => {
  const rollerHeadRef = useRef<THREE.Group>(null);
  const rollerCylinderRef = useRef<THREE.Mesh>(null);

  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isRollerSelected = selectedComponentId === 'flattening_roller';
  const isBlockSelected = selectedComponentId === 'flattening_block';

  const isFlattening = currentStageIndex === 6; // S07_FLATTENING

  useFrame((state, delta) => {
    if (rollerHeadRef.current) {
      if (isFlattening) {
        // Press down with force oscillation
        const press = (Math.sin(state.clock.getElapsedTime() * 6) + 1) * 0.5;
        rollerHeadRef.current.position.y = 0.28 - press * 0.16; // presses onto cable
        if (rollerCylinderRef.current) {
          rollerCylinderRef.current.rotation.z -= delta * 5.0; // rolling across surface
        }
      } else {
        // Retract upward
        rollerHeadRef.current.position.y = THREE.MathUtils.lerp(rollerHeadRef.current.position.y, 0.32, 0.1);
      }
    }
  });

  return (
    <group position={[1.3, 1.45, 0]}>
      {/* Heavy Portal Gantry Frame Columns */}
      <mesh position={[0, 0.25, 0.3]} material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.22, 0.9, 0.1]} />
      </mesh>
      <mesh position={[0, 0.25, -0.3]} material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.22, 0.9, 0.1]} />
      </mesh>
      {/* Top Cross Beam */}
      <mesh position={[0, 0.68, 0]} material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.24, 0.1, 0.68]} />
      </mesh>

      {/* Main High-Tonnage Press Cylinder */}
      <mesh position={[0, 0.52, 0]} material={MATERIALS.brushedAluminum} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.24, 24]} />
      </mesh>

      {/* Ground Base Anvil Block */}
      <group
        position={[0, -0.16, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('flattening_block');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh material={MATERIALS.hardenedToolSteel} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.12, 0.44]} />
        </mesh>
        {/* Mirror Polished Top Surface */}
        <mesh position={[0, 0.061, 0]} material={MATERIALS.brushedAluminum}>
          <boxGeometry args={[0.36, 0.002, 0.42]} />
        </mesh>

        {isBlockSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.18, 0.48]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>

      {/* Moving Heavy Flattening Roller Carriage */}
      <group
        ref={rollerHeadRef}
        position={[0, 0.32, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('flattening_roller');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Yoke / Bearing Chocks */}
        <mesh position={[0, 0.08, 0]} material={MATERIALS.brushedAluminum} castShadow>
          <boxGeometry args={[0.24, 0.1, 0.42]} />
        </mesh>

        {/* Heavy Solid Ground Flattening Roller */}
        <mesh
          ref={rollerCylinderRef}
          position={[0, -0.06, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={MATERIALS.hardenedToolSteel}
          castShadow
        >
          <cylinderGeometry args={[0.11, 0.11, 0.36, 32]} />
        </mesh>

        {/* Central Heavy Steel Shaft */}
        <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.hardenedToolSteel}>
          <cylinderGeometry args={[0.04, 0.04, 0.48, 16]} />
        </mesh>

        {isRollerSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.4, 0.52]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>
    </group>
  );
};
