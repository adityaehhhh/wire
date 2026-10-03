import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const LaserMicrometer: React.FC = () => {
  const laserFanRef = useRef<THREE.Mesh>(null);
  const laserLineSpotRef = useRef<THREE.Mesh>(null);
  const horizontalFanRef = useRef<THREE.Mesh>(null);
  const laserActive = useMachineStore((state) => state.laserActive);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);

  const isSelected = selectedComponentId === 'laser_micrometer';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (laserActive) {
      // Dynamic scanning sweep motion across the cable cross-section (X and Z)
      const sweepX = Math.sin(t * 14) * 0.045;
      const sweepZ = Math.cos(t * 14) * 0.035;
      const pulseIntensity = 0.85 + Math.sin(t * 22) * 0.15;

      if (laserFanRef.current) {
        laserFanRef.current.position.x = sweepX;
        (laserFanRef.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * pulseIntensity;
        laserFanRef.current.visible = true;
      }
      if (laserLineSpotRef.current) {
        laserLineSpotRef.current.position.x = sweepX;
        laserLineSpotRef.current.position.z = sweepZ;
        (laserLineSpotRef.current.material as THREE.MeshBasicMaterial).opacity = 0.95 * pulseIntensity;
        laserLineSpotRef.current.visible = true;
      }
      if (horizontalFanRef.current) {
        horizontalFanRef.current.position.x = sweepX;
        (horizontalFanRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * pulseIntensity;
        horizontalFanRef.current.visible = true;
      }
    } else {
      if (laserFanRef.current) laserFanRef.current.visible = false;
      if (laserLineSpotRef.current) laserLineSpotRef.current.visible = false;
      if (horizontalFanRef.current) horizontalFanRef.current.visible = false;
    }
  });

  return (
    <group
      position={[-2.1, 1.45, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId('laser_micrometer');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Keyence LK-G5000 Heavy U-Frame Sensor Housing */}
      <mesh position={[0, 0, -0.22]} material={MATERIALS.keyenceHousing} castShadow>
        <boxGeometry args={[0.34, 0.68, 0.12]} />
      </mesh>

      {/* Top Laser Emitter Head */}
      <group position={[0, 0.24, 0]}>
        <mesh material={MATERIALS.keyenceHousing} castShadow>
          <boxGeometry args={[0.28, 0.16, 0.38]} />
        </mesh>
        {/* Optical Glass Lens Aperture (Source of Red Laser) */}
        <mesh position={[0, -0.076, 0]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.acrylicClear}>
          <cylinderGeometry args={[0.045, 0.045, 0.015, 24]} />
        </mesh>
        {/* Keyence Brand Accent Plate */}
        <mesh position={[0.141, 0, 0]} material={MATERIALS.brushedAluminum}>
          <boxGeometry args={[0.01, 0.08, 0.22]} />
        </mesh>
        {/* Active Laser Indicator LED */}
        <mesh
          position={[0, 0.075, 0.14]}
          material={laserActive ? MATERIALS.ledGreen : MATERIALS.ledAmber}
        >
          <sphereGeometry args={[0.018, 16, 16]} />
        </mesh>
      </group>

      {/* Bottom Optical Receiver Head */}
      <group position={[0, -0.24, 0]}>
        <mesh material={MATERIALS.keyenceHousing} castShadow>
          <boxGeometry args={[0.28, 0.16, 0.38]} />
        </mesh>
        {/* Optical Glass Lens Aperture */}
        <mesh position={[0, 0.076, 0]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.acrylicClear}>
          <cylinderGeometry args={[0.045, 0.045, 0.015, 24]} />
        </mesh>
      </group>

      {/* 1. Main High-Intensity Vertical Laser Curtain (From Emitter Aperture to Cable) */}
      <mesh ref={laserFanRef} position={[0, 0.08, 0]} material={MATERIALS.laserRed} visible={false}>
        <boxGeometry args={[0.008, 0.32, 0.12]} />
      </mesh>

      {/* 2. Horizontal Cross-Triangulation Laser Fan */}
      <mesh
        ref={horizontalFanRef}
        position={[0, 0.08, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={MATERIALS.laserRed}
        visible={false}
      >
        <boxGeometry args={[0.006, 0.24, 0.09]} />
      </mesh>

      {/* 3. Glowing Laser Sweep Spot / Line on Cable Surface */}
      <mesh
        ref={laserLineSpotRef}
        position={[0, 0.048, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={MATERIALS.laserRed}
        visible={false}
      >
        <planeGeometry args={[0.08, 0.14]} />
      </mesh>

      {/* Sensor Stanchion & Base Mount */}
      <mesh position={[0, -0.45, -0.22]} material={MATERIALS.frameSteel}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
      </mesh>

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.85, 0.6]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};
