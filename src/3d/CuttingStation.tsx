import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const CuttingStation: React.FC = () => {
  const topSlitterRef = useRef<THREE.Group>(null);
  const btmSlitterRef = useRef<THREE.Group>(null);
  const chopBladeRef = useRef<THREE.Group>(null);

  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isVerticalSelected = selectedComponentId === 'vertical_blades';
  const isHorizontalSelected = selectedComponentId === 'horizontal_blade';

  // Animation states
  const isVerticalCutting = currentStageIndex === 4; // S05_VERTICAL_CUTTING
  const isHorizontalCutting = currentStageIndex === 5; // S06_HORIZONTAL_CUTTING

  useFrame((state) => {
    // Animate Vertical Slitters
    if (topSlitterRef.current && btmSlitterRef.current) {
      if (isVerticalCutting) {
        const osc = Math.sin(state.clock.getElapsedTime() * 8) * 0.04;
        topSlitterRef.current.position.y = 0.12 - 0.06 + osc; // moves down to cable
        btmSlitterRef.current.position.y = -0.12 + 0.06 - osc; // moves up to cable
      } else {
        // Retracted safe position
        topSlitterRef.current.position.y = THREE.MathUtils.lerp(topSlitterRef.current.position.y, 0.15, 0.1);
        btmSlitterRef.current.position.y = THREE.MathUtils.lerp(btmSlitterRef.current.position.y, -0.15, 0.1);
      }
    }

    // Animate Horizontal Guillotine Chop Blade
    if (chopBladeRef.current) {
      if (isHorizontalCutting) {
        // rapid chop stroke
        const chop = (Math.sin(state.clock.getElapsedTime() * 10) + 1) * 0.5;
        chopBladeRef.current.position.y = 0.28 - chop * 0.25;
      } else {
        chopBladeRef.current.position.y = THREE.MathUtils.lerp(chopBladeRef.current.position.y, 0.28, 0.15);
      }
    }
  });

  return (
    <group position={[0, 1.45, 0]}>
      {/* ----------------- VERTICAL SLITTING SECTION (x = -0.6) ----------------- */}
      <group
        position={[-0.6, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('vertical_blades');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Main Mounting Frame Columns */}
        <mesh position={[0, 0, 0.25]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.2, 0.75, 0.08]} />
        </mesh>
        <mesh position={[0, 0, -0.25]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.2, 0.75, 0.08]} />
        </mesh>

        {/* Linear Guide Rods */}
        <mesh position={[0.05, 0, 0]} material={MATERIALS.hardenedToolSteel}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 16]} />
        </mesh>
        <mesh position={[-0.05, 0, 0]} material={MATERIALS.hardenedToolSteel}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 16]} />
        </mesh>

        {/* Top Slitter Blade Carrier */}
        <group ref={topSlitterRef} position={[0, 0.15, 0]}>
          {/* Blade Mount */}
          <mesh material={MATERIALS.brushedAluminum} castShadow>
            <boxGeometry args={[0.16, 0.08, 0.14]} />
          </mesh>
          {/* Upper Slitter Carbide Blade */}
          <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 4]} material={MATERIALS.hardenedToolSteel}>
            <boxGeometry args={[0.06, 0.06, 0.01]} />
          </mesh>
          {/* Pneumatic Cylinder Top */}
          <mesh position={[0, 0.12, 0]} material={MATERIALS.brushedAluminum}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
          </mesh>
        </group>

        {/* Bottom Slitter Blade Carrier */}
        <group ref={btmSlitterRef} position={[0, -0.15, 0]}>
          {/* Blade Mount */}
          <mesh material={MATERIALS.brushedAluminum} castShadow>
            <boxGeometry args={[0.16, 0.08, 0.14]} />
          </mesh>
          {/* Lower Slitter Carbide Blade */}
          <mesh position={[0, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]} material={MATERIALS.hardenedToolSteel}>
            <boxGeometry args={[0.06, 0.06, 0.01]} />
          </mesh>
          {/* Pneumatic Cylinder Bottom */}
          <mesh position={[0, -0.12, 0]} material={MATERIALS.brushedAluminum}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
          </mesh>
        </group>

        {/* Vertical Highlight */}
        {isVerticalSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.4, 0.9, 0.6]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>

      {/* ----------------- HORIZONTAL GUILLOTINE SECTION (x = 0.3) ----------------- */}
      <group
        position={[0.3, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('horizontal_blade');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Guillotine Portal Tower Frame */}
        <mesh position={[0, 0.2, 0.22]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.18, 0.85, 0.08]} />
        </mesh>
        <mesh position={[0, 0.2, -0.22]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.18, 0.85, 0.08]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} material={MATERIALS.frameSteel}>
          <boxGeometry args={[0.18, 0.08, 0.48]} />
        </mesh>

        {/* Heavy Guillotine Pneumatic Cylinder */}
        <mesh position={[0, 0.45, 0]} material={MATERIALS.brushedAluminum} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.22, 16]} />
        </mesh>

        {/* Anvil Base Block */}
        <mesh position={[0, -0.15, 0]} material={MATERIALS.hardenedToolSteel} castShadow>
          <boxGeometry args={[0.14, 0.12, 0.3]} />
        </mesh>

        {/* Moving Guillotine Blade Slide */}
        <group ref={chopBladeRef} position={[0, 0.28, 0]}>
          {/* Blade Crosshead */}
          <mesh material={MATERIALS.brushedAluminum} castShadow>
            <boxGeometry args={[0.14, 0.08, 0.32]} />
          </mesh>
          {/* Hardened Ground Beveled Guillotine Blade */}
          <mesh position={[0, -0.08, 0]} material={MATERIALS.hardenedToolSteel} castShadow>
            <boxGeometry args={[0.03, 0.1, 0.28]} />
          </mesh>
        </group>

        {/* Polycarbonate Guillotine Splash Shield */}
        <mesh position={[0, 0.1, 0.28]} material={MATERIALS.acrylicClear}>
          <boxGeometry args={[0.22, 0.4, 0.02]} />
        </mesh>

        {/* Horizontal Highlight */}
        {isHorizontalSelected && (
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.38, 0.95, 0.6]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>
    </group>
  );
};
