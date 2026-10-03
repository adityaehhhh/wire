import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useMachineStore } from '../store/useMachineStore';
import { CAMERA_PRESETS } from '../data/cameraPresets';

export const CameraController: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const activeCameraPreset = useMachineStore((state) => state.activeCameraPreset);
  const isRunning = useMachineStore((state) => state.isRunning);
  const isPaused = useMachineStore((state) => state.isPaused);
  const isOverviewMode = useMachineStore((state) => state.isOverviewMode);
  const autoCycleComplete = useMachineStore((state) => state.autoCycleComplete);

  const targetPos = useRef(new THREE.Vector3(...CAMERA_PRESETS[activeCameraPreset].position));
  const targetLook = useRef(new THREE.Vector3(...CAMERA_PRESETS[activeCameraPreset].target));

  useEffect(() => {
    const preset = CAMERA_PRESETS[activeCameraPreset] || CAMERA_PRESETS.overview;
    targetPos.current.set(...preset.position);
    targetLook.current.set(...preset.target);
  }, [activeCameraPreset]);

  // Orbit controls are locked during active running cycle unless in overview mode or cycle complete
  const isOrbitLocked = isRunning && !isPaused && !isOverviewMode && !autoCycleComplete;

  useFrame((_, delta) => {
    if (controlsRef.current) {
      // Smooth cinematic camera interpolation
      const lerpSpeed = isRunning ? 2.6 : 3.2;
      camera.position.lerp(targetPos.current, delta * lerpSpeed);
      controlsRef.current.target.lerp(targetLook.current, delta * lerpSpeed);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below floor
      enabled={!isOrbitLocked}
    />
  );
};

