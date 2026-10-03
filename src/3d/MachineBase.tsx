import React from 'react';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const MachineBase: React.FC = () => {
  const isRunning = useMachineStore((state) => state.isRunning);
  const lastResult = useMachineStore((state) => state.lastPassRejectResult);

  // Stack light status
  const isGreenOn = isRunning && lastResult !== 'REJECT';
  const isAmberOn = !isRunning;
  const isRedOn = lastResult === 'REJECT';

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Table Top Machine Bed */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow material={MATERIALS.frameSteel}>
        <boxGeometry args={[14.2, 0.2, 2.4]} />
      </mesh>

      {/* Brushed Anodized Tooling Bed Sub-plate */}
      <mesh position={[0, 0.86, 0]} castShadow receiveShadow material={MATERIALS.brushedAluminum}>
        <boxGeometry args={[13.8, 0.02, 2.0]} />
      </mesh>

      {/* Main Structural Legs & T-Slot Frame */}
      {[-6.6, -2.2, 2.2, 6.6].map((x, i) => (
        <React.Fragment key={`leg-pair-${i}`}>
          {/* Front Leg */}
          <mesh position={[x, 0.375, 1.0]} castShadow material={MATERIALS.frameSteel}>
            <boxGeometry args={[0.15, 0.75, 0.15]} />
          </mesh>
          {/* Back Leg */}
          <mesh position={[x, 0.375, -1.0]} castShadow material={MATERIALS.frameSteel}>
            <boxGeometry args={[0.15, 0.75, 0.15]} />
          </mesh>
          {/* Cross Brace */}
          <mesh position={[x, 0.2, 0]} castShadow material={MATERIALS.frameSteel}>
            <boxGeometry args={[0.1, 0.08, 1.9]} />
          </mesh>
          {/* Leveling Feet Front */}
          <mesh position={[x, 0.03, 1.0]} castShadow material={MATERIALS.hardenedToolSteel}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          </mesh>
          {/* Leveling Feet Back */}
          <mesh position={[x, 0.03, -1.0]} castShadow material={MATERIALS.hardenedToolSteel}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Bottom Tie-Bar Frame */}
      <mesh position={[0, 0.15, 1.0]} castShadow material={MATERIALS.frameSteel}>
        <boxGeometry args={[13.4, 0.08, 0.1]} />
      </mesh>
      <mesh position={[0, 0.15, -1.0]} castShadow material={MATERIALS.frameSteel}>
        <boxGeometry args={[13.4, 0.08, 0.1]} />
      </mesh>

      {/* Clear Polycarbonate Safety Enclosure (Center & Right Station) */}
      <group position={[1.2, 1.9, 0]}>
        {/* Top Roof */}
        <mesh position={[0, 0.8, 0]} material={MATERIALS.acrylicClear}>
          <boxGeometry args={[8.8, 0.02, 1.8]} />
        </mesh>
        {/* Back Wall */}
        <mesh position={[0, 0, -0.9]} material={MATERIALS.acrylicClear}>
          <boxGeometry args={[8.8, 1.6, 0.02]} />
        </mesh>
        {/* Front Transparent Interlock Door */}
        <mesh position={[0, 0, 0.9]} material={MATERIALS.acrylicClear}>
          <boxGeometry args={[8.8, 1.6, 0.02]} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[4.4, 0, 0]} material={MATERIALS.acrylicClear}>
          <boxGeometry args={[0.02, 1.6, 1.8]} />
        </mesh>

        {/* Aluminum Corner Struts */}
        {[-4.4, 4.4].map((x, i) => (
          <React.Fragment key={`strut-${i}`}>
            <mesh position={[x, 0, 0.9]} material={MATERIALS.brushedAluminum}>
              <boxGeometry args={[0.06, 1.6, 0.06]} />
            </mesh>
            <mesh position={[x, 0, -0.9]} material={MATERIALS.brushedAluminum}>
              <boxGeometry args={[0.06, 1.6, 0.06]} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Industrial 3-Tier Status Tower Light (Stack Light) */}
      <group position={[-6.8, 2.7, -0.9]}>
        {/* Pole */}
        <mesh position={[0, -0.5, 0]} material={MATERIALS.frameSteel}>
          <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
        </mesh>
        {/* Base */}
        <mesh position={[0, 0.05, 0]} material={MATERIALS.frameSteel}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
        </mesh>
        {/* Red Tier */}
        <mesh position={[0, 0.35, 0]} material={isRedOn ? MATERIALS.ledRed : MATERIALS.frameSteel}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        </mesh>
        {/* Amber Tier */}
        <mesh position={[0, 0.22, 0]} material={isAmberOn ? MATERIALS.ledAmber : MATERIALS.frameSteel}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        </mesh>
        {/* Green Tier */}
        <mesh position={[0, 0.09, 0]} material={isGreenOn ? MATERIALS.ledGreen : MATERIALS.frameSteel}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        </mesh>
      </group>
    </group>
  );
};
