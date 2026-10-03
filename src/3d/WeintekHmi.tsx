import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';
import { STAGES } from '../data/stages';

export const WeintekHmi: React.FC = () => {
  const isRunning = useMachineStore((state) => state.isRunning);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const cycleCount = useMachineStore((state) => state.cycleCount);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);
  const selectedCableMaterial = useMachineStore((state) => state.selectedCableMaterial);
  const telemetry = useMachineStore((state) => state.telemetry);
  const laserActive = useMachineStore((state) => state.laserActive);
  const selectedComponentId = useMachineStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  const isSelected = selectedComponentId === 'weintek_hmi';
  const currentStage = STAGES[currentStageIndex];

  // Dynamic canvas texture rendering Weintek HMI display
  const hmiCanvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 320);

    // Top Brand Bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 44);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('WEINTEK cMT3102X • SPECI-X HMI', 16, 28);

    // Online Status Indicator
    ctx.fillStyle = isRunning ? '#22c55e' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(480, 22, 7, 0, Math.PI * 2);
    ctx.fill();

    // Main Stage Card
    ctx.fillStyle = '#1e293b';
    ctx.roundRect(14, 52, 484, 118, 6);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`CURRENT STAGE: [${String(currentStage.index).padStart(2, '0')} / 18]`, 28, 76);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(currentStage.title.toUpperCase(), 28, 104);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(currentStage.subtitle.substring(0, 52), 28, 128);

    // Live Sub-parameter
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px monospace';
    const subParam =
      currentStageIndex === 2
        ? `LASER BEAM: ${laserActive ? 'EMITTING (OD 12.06mm)' : 'STANDBY'}`
        : currentStageIndex === 6
        ? 'ANVIL PRESSURE: 6.5 bar • FLATTENING'
        : currentStageIndex === 7
        ? 'PUNCH FORCE: 12.5 kN • DIE STAMP'
        : currentStageIndex === 10
        ? `THICKNESS LASER: ${laserActive ? '4.98 mm SCANNING' : 'ONLINE'}`
        : currentStageIndex >= 11 && currentStageIndex <= 15
        ? '4K VISION: ACTIVE • TELECENTRIC'
        : currentStageIndex >= 16
        ? 'SORTING DIVERTER: CLASSIFICATION'
        : 'FEED SERVO: SYNCHRONIZED';
    ctx.fillText(`▶ ${subParam}`, 28, 152);

    // Bottom Grid: Left Box (Cable & Material)
    ctx.fillStyle = '#1e293b';
    ctx.roundRect(14, 180, 234, 124, 6);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('RECIPE & CABLE', 26, 202);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`CABLE: ${selectedCableMaterial}`, 26, 226);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px sans-serif';
    ctx.fillText(`OD: ${selectedRecipe.nominalOD} mm`, 26, 248);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(selectedRecipe.standard.substring(0, 26), 26, 270);
    ctx.fillText('PLC: S7-1200 ONLINE', 26, 290);

    // Bottom Grid: Right Box (Machine Telemetry)
    ctx.fillStyle = '#1e293b';
    ctx.roundRect(264, 180, 234, 124, 6);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('LIVE STATUS & STATS', 276, 202);

    ctx.fillStyle = isRunning ? '#22c55e' : '#f59e0b';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`STATUS: ${isRunning ? 'RUNNING' : 'STANDBY'}`, 276, 226);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px sans-serif';
    ctx.fillText(`CYCLE: #${124 + cycleCount - 1}`, 276, 248);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`FEED SPEED: ${telemetry.feedSpeed || 45} mm/s`, 276, 270);
    ctx.fillText(`SAFETY: OK • 41.2°C`, 276, 290);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [isRunning, currentStageIndex, cycleCount, selectedRecipe, selectedCableMaterial, telemetry, laserActive]);

  return (
    <group
      position={[5.6, 1.45, 1.2]}
      rotation={[-0.08, -0.4, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId('weintek_hmi');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Heavy Steel Support Pedestal from Frame Base */}
      <mesh position={[0, -0.65, -0.1]} material={MATERIALS.frameSteel} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.0, 16]} />
      </mesh>
      {/* Articulated Swivel Arm */}
      <mesh position={[0, -0.15, -0.05]} material={MATERIALS.brushedAluminum} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 16]} />
      </mesh>
      {/* Pivot Knuckle */}
      <mesh position={[0, 0, -0.05]} material={MATERIALS.frameSteel}>
        <sphereGeometry args={[0.055, 16, 16]} />
      </mesh>

      {/* Weintek HMI 10.1" Bezel Housing */}
      <mesh material={MATERIALS.frameSteel} castShadow>
        <boxGeometry args={[0.72, 0.48, 0.06]} />
      </mesh>
      {/* Screen Inset Bezel */}
      <mesh position={[0, 0, 0.031]} material={MATERIALS.hardenedToolSteel}>
        <boxGeometry args={[0.66, 0.42, 0.005]} />
      </mesh>

      {/* Live Glowing HMI LCD Screen */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[0.64, 0.4]} />
        <meshBasicMaterial map={hmiCanvasTexture} />
      </mesh>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.82, 0.58, 0.16]} />
          <primitive object={MATERIALS.highlightGlow} attach="material" />
        </mesh>
      )}
    </group>
  );
};

