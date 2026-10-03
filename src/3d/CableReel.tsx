import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const CableReel: React.FC = () => {
  const drumRef = useRef<THREE.Group>(null);
  const isRunning = useMachineStore((state) => state.isRunning);
  const isPaused = useMachineStore((state) => state.isPaused);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const speedMultiplier = useMachineStore((state) => state.speedMultiplier);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);
  const selectedCableMaterial = useMachineStore((state) => state.selectedCableMaterial);

  const isSelected = selectedComponentId === 'reel';

  // Cable winding material based on selected cable type
  const cableSpoolMaterial = useMemo(() => {
    if (selectedCableMaterial === 'PVC') {
      return new THREE.MeshStandardMaterial({
        color: 0x111316,
        roughness: 0.25,
        metalness: 0.1,
      });
    }
    if (selectedCableMaterial === 'HDPE') {
      return new THREE.MeshStandardMaterial({
        color: 0x0a0c0e,
        roughness: 0.35,
        metalness: 0.15,
      });
    }
    return MATERIALS.blackCableSheath;
  }, [selectedCableMaterial]);

  useFrame((_, delta) => {
    if (drumRef.current && isRunning && !isPaused) {
      // Rotate reel drum clockwise uncoiling towards the right (faster in stages 0 and 1)
      const stageSpeed = currentStageIndex <= 1 ? 2.5 : 1.2;
      drumRef.current.rotation.z -= delta * stageSpeed * speedMultiplier;
    }
  });

  return (
    <group position={[-6.8, 1.4, 0]}>
      {/* Heavy Triangular A-Frame Supports */}
      {/* Front Support */}
      <group position={[0, 0, 0.55]}>
        <mesh position={[-0.3, -0.3, 0]} rotation={[0, 0, 0.35]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.08]} />
        </mesh>
        <mesh position={[0.3, -0.3, 0]} rotation={[0, 0, -0.35]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.08]} />
        </mesh>
        {/* Pillow Block Bearing */}
        <mesh position={[0, 0.05, 0]} material={MATERIALS.brushedAluminum} castShadow>
          <boxGeometry args={[0.22, 0.18, 0.1]} />
        </mesh>
      </group>

      {/* Back Support */}
      <group position={[0, 0, -0.55]}>
        <mesh position={[-0.3, -0.3, 0]} rotation={[0, 0, 0.35]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.08]} />
        </mesh>
        <mesh position={[0.3, -0.3, 0]} rotation={[0, 0, -0.35]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.08]} />
        </mesh>
        {/* Pillow Block Bearing */}
        <mesh position={[0, 0.05, 0]} material={MATERIALS.brushedAluminum} castShadow>
          <boxGeometry args={[0.22, 0.18, 0.1]} />
        </mesh>
      </group>

      {/* Main Support Crossbar Bottom */}
      <mesh position={[0, -0.65, 0]} material={MATERIALS.frameSteel}>
        <boxGeometry args={[0.8, 0.08, 1.2]} />
      </mesh>

      {/* Central Rotating Shaft */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.hardenedToolSteel} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.3, 32]} />
      </mesh>

      {/* Rotating Reel Assembly Group */}
      <group
        ref={drumRef}
        position={[0, 0.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('reel');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Drum Core Cylinder */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.frameSteel} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.85, 32]} />
        </mesh>

        {/* Coiled Layers of Heavy Cable on Spool */}
        {/* Inner Cable Ring Layer */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={cableSpoolMaterial} castShadow>
          <cylinderGeometry args={[0.52, 0.52, 0.82, 32]} />
        </mesh>
        {/* Outer Cable Coils Texturing */}
        {[-0.32, -0.16, 0, 0.16, 0.32].map((z, i) => (
          <mesh key={`cable-coil-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} material={cableSpoolMaterial}>
            <torusGeometry args={[0.54, 0.045, 16, 32]} />
          </mesh>
        ))}

        {/* Industrial Flange Plates (Left & Right) */}
        {/* Front Flange */}
        <group position={[0, 0, 0.44]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.frameSteel} castShadow>
            <cylinderGeometry args={[0.72, 0.72, 0.04, 32]} />
          </mesh>
          {/* Radial Reinforcing Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={`spoke-f-${i}`} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0, 0.025]} material={MATERIALS.brushedAluminum}>
              <boxGeometry args={[0.65, 0.04, 0.02]} />
            </mesh>
          ))}
          {/* Flange Center Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} material={MATERIALS.brushedAluminum}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          </mesh>
        </group>

        {/* Back Flange */}
        <group position={[0, 0, -0.44]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.frameSteel} castShadow>
            <cylinderGeometry args={[0.72, 0.72, 0.04, 32]} />
          </mesh>
          {/* Radial Reinforcing Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={`spoke-b-${i}`} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0, -0.025]} material={MATERIALS.brushedAluminum}>
              <boxGeometry args={[0.65, 0.04, 0.02]} />
            </mesh>
          ))}
          {/* Flange Center Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} material={MATERIALS.brushedAluminum}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          </mesh>
        </group>
      </group>

      {/* Highlight Box if Selected */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.6, 1.6, 1.4]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};

