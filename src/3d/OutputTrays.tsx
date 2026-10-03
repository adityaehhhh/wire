import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

// Precision 3D Dumbbell Specimen Geometry
const DumbbellMesh: React.FC<{ isPass: boolean; position: [number, number, number]; rotation?: [number, number, number] }> = ({
  isPass,
  position,
  rotation = [0, 0, 0],
}) => {
  const mat = isPass ? MATERIALS.specimenPunchedPass : MATERIALS.specimenPunchedReject;

  return (
    <group position={position} rotation={rotation}>
      {/* Center Narrow Gauge Waist */}
      <mesh material={mat} castShadow>
        <boxGeometry args={[0.12, 0.012, 0.06]} />
      </mesh>
      {/* Left Grip Tab */}
      <mesh position={[-0.09, 0, 0]} material={mat} castShadow>
        <boxGeometry args={[0.07, 0.012, 0.12]} />
      </mesh>
      {/* Right Grip Tab */}
      <mesh position={[0.09, 0, 0]} material={mat} castShadow>
        <boxGeometry args={[0.07, 0.012, 0.12]} />
      </mesh>
    </group>
  );
};

export const OutputTrays: React.FC = () => {
  const diverterRef = useRef<THREE.Group>(null);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const lastResult = useMachineStore((state) => state.lastPassRejectResult);
  const testScenario = useMachineStore((state) => state.testScenario);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isPassSelected = selectedComponentId === 'pass_tray';
  const isRejectSelected = selectedComponentId === 'reject_tray';

  // Diverter flap moves towards pass or reject
  const isFail = testScenario === 'FAIL' || lastResult === 'REJECT';
  const targetAngle = isFail ? -0.45 : 0.45;

  useFrame(() => {
    if (diverterRef.current) {
      if (currentStageIndex >= 16) {
        diverterRef.current.rotation.y = THREE.MathUtils.lerp(diverterRef.current.rotation.y, targetAngle, 0.1);
      } else {
        diverterRef.current.rotation.y = THREE.MathUtils.lerp(diverterRef.current.rotation.y, 0, 0.1);
      }
    }
  });

  return (
    <group position={[6.3, 0.9, 0]}>
      {/* Diverter Sorting Gate Module */}
      <group position={[-0.3, 0.45, 0]}>
        <mesh material={MATERIALS.brushedAluminum} castShadow>
          <boxGeometry args={[0.1, 0.16, 0.48]} />
        </mesh>
        {/* Pivoting Flap */}
        <group ref={diverterRef} position={[0.05, 0, 0]}>
          <mesh position={[0.12, 0, 0]} material={MATERIALS.hardenedToolSteel} castShadow>
            <boxGeometry args={[0.22, 0.12, 0.02]} />
          </mesh>
        </group>
      </group>

      {/* ----------------- PASS TRAY (FRONT / GREEN) ----------------- */}
      <group
        position={[0.3, 0.15, 0.42]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('pass_tray');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Tray Base & Walls */}
        <mesh material={MATERIALS.trayGreen} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.12, 0.42]} />
        </mesh>
        {/* Soft ESD Anti-Scratch Inner Bed */}
        <mesh position={[0, 0.04, 0]} material={MATERIALS.conveyorBelt}>
          <boxGeometry args={[0.5, 0.05, 0.38]} />
        </mesh>
        {/* Green Label Plate */}
        <mesh position={[-0.26, 0, 0]} material={MATERIALS.ledGreen}>
          <boxGeometry args={[0.01, 0.06, 0.2]} />
        </mesh>

        {/* Stack of Finished Compliant Dumbbell Specimens in Tray */}
        <DumbbellMesh isPass={true} position={[0.02, 0.08, 0.02]} rotation={[0, 0.05, 0]} />
        <DumbbellMesh isPass={true} position={[-0.03, 0.095, -0.04]} rotation={[0, -0.08, 0]} />
        <DumbbellMesh isPass={true} position={[0.05, 0.11, 0.01]} rotation={[0, 0.02, 0]} />

        {isPassSelected && (
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.65, 0.25, 0.52]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>

      {/* ----------------- REJECT TRAY (REAR / RED) ----------------- */}
      <group
        position={[0.3, 0.15, -0.42]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId('reject_tray');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Tray Base & Walls */}
        <mesh material={MATERIALS.trayRed} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.12, 0.42]} />
        </mesh>
        {/* Soft Inner Bed */}
        <mesh position={[0, 0.04, 0]} material={MATERIALS.conveyorBelt}>
          <boxGeometry args={[0.5, 0.05, 0.38]} />
        </mesh>
        {/* Red Label Plate */}
        <mesh position={[-0.26, 0, 0]} material={MATERIALS.ledRed}>
          <boxGeometry args={[0.01, 0.06, 0.2]} />
        </mesh>

        {/* Rejected Defective Specimen in Tray */}
        <DumbbellMesh isPass={false} position={[0, 0.08, 0]} rotation={[0, 0.2, 0]} />

        {isRejectSelected && (
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.65, 0.25, 0.52]} />
            <primitive object={MATERIALS.highlightGlow} attach="material" />
          </mesh>
        )}
      </group>
    </group>
  );
};
