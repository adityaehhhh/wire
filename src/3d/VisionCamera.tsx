import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const VisionCamera: React.FC = () => {
  const scanConeRef = useRef<THREE.Mesh>(null);
  const strobeRef = useRef<THREE.PointLight>(null);

  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isCameraSelected = selectedComponentId === 'vision_camera';
  const isAiSelected = selectedComponentId === 'ai_engine';
  const isInspecting = currentStageIndex >= 11 && currentStageIndex <= 15; // S12_VISION_CAPTURE to S16_STANDARD_VALIDATION

  useFrame((state) => {
    if (scanConeRef.current) {
      if (isInspecting) {
        const t = state.clock.getElapsedTime();
        const pulse = Math.sin(t * 8) * 0.5 + 0.5;
        (scanConeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + pulse * 0.35;
        if (strobeRef.current) {
          strobeRef.current.intensity = 1.5 + pulse * 1.5;
        }
      } else {
        (scanConeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.05;
        if (strobeRef.current) {
          strobeRef.current.intensity = 0.2;
        }
      }
    }
  });

  return (
    <group position={[4.7, 2.15, 0]}>
      {/* Heavy Overhead Portal Gantry Arm */}
      <mesh position={[0, 0.45, -0.45]} material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
      </mesh>
      <mesh position={[0, 0.85, -0.2]} material={MATERIALS.brushedAluminum} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.65]} />
      </mesh>

      {/* Industrial Camera & Lens Assembly */}
      <group
        position={[0, 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('vision_camera');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Camera Main Body (Basler/FLIR Industrial Form) */}
        <mesh position={[0, 0.18, 0]} material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.18, 0.22, 0.18]} />
        </mesh>
        {/* Blue Industrial Accent Plate */}
        <mesh position={[0, 0.18, 0.092]} material={MATERIALS.cableInnerInsulation}>
          <boxGeometry args={[0.14, 0.16, 0.005]} />
        </mesh>
        {/* Status LED */}
        <mesh position={[0.06, 0.24, 0.092]} material={isInspecting ? MATERIALS.ledGreen : MATERIALS.ledAmber}>
          <sphereGeometry args={[0.012, 12, 12]} />
        </mesh>
        {/* GigE RJ45 & Power Cables at Top */}
        <mesh position={[0, 0.32, -0.04]} material={MATERIALS.blackCableSheath}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 12]} />
        </mesh>

        {/* Bi-Telecentric High-Magnification Optical Lens */}
        <group position={[0, -0.04, 0]}>
          <mesh material={MATERIALS.hardenedToolSteel} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.2, 24]} />
          </mesh>
          {/* Front Optical Element */}
          <mesh position={[0, -0.101, 0]} material={MATERIALS.acrylicClear}>
            <cylinderGeometry args={[0.055, 0.055, 0.01, 24]} />
          </mesh>
        </group>

        {/* Hemispherical Diffuse LED Dome Strobe Illuminator */}
        <group position={[0, -0.2, 0]}>
          <mesh material={MATERIALS.visionStrobeDome} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 0.12, 24, 1, true]} />
          </mesh>
          {/* Top Cap */}
          <mesh position={[0, 0.06, 0]} material={MATERIALS.brushedAluminum}>
            <cylinderGeometry args={[0.16, 0.16, 0.01, 24]} />
          </mesh>
          {/* Diffuse Ring Strobe Light Source */}
          <pointLight ref={strobeRef} color="#ffffff" intensity={0.5} distance={1.5} position={[0, -0.02, 0]} />
        </group>

        {/* Optical Scanning Cone to Specimen */}
        <mesh ref={scanConeRef} position={[0, -0.5, 0]} material={MATERIALS.laserBlue}>
          <coneGeometry args={[0.3, 0.6, 24, 1, true]} />
        </mesh>

        {/* Camera Selection Highlight */}
        {isCameraSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.45, 0.9, 0.45]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>

      {/* AI Edge Inference Computer Box (Mounted on Frame) */}
      <group
        position={[0.3, 0.35, -0.45]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('ai_engine');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh material={MATERIALS.frameSteel} castShadow>
          <boxGeometry args={[0.26, 0.32, 0.14]} />
        </mesh>
        {/* Aluminum Heatsink Fins */}
        <mesh position={[0, 0, 0.075]} material={MATERIALS.brushedAluminum}>
          <boxGeometry args={[0.22, 0.28, 0.02]} />
        </mesh>
        {/* AI Status Pulsing LED */}
        <mesh position={[0.08, 0.1, 0.085]} material={isInspecting ? MATERIALS.ledGreen : MATERIALS.ledAmber}>
          <sphereGeometry args={[0.01, 12, 12]} />
        </mesh>

        {/* AI Selection Highlight */}
        {isAiSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.35, 0.4, 0.25]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>
    </group>
  );
};
