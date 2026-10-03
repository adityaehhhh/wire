import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Grid } from '@react-three/drei';
import { MachineBase } from './MachineBase';
import { CableReel } from './CableReel';
import { FeedRollers } from './FeedRollers';
import { LaserMicrometer } from './LaserMicrometer';
import { ProximitySensor } from './ProximitySensor';
import { CuttingStation } from './CuttingStation';
import { FlatteningStation } from './FlatteningStation';
import { ThicknessSensor } from './ThicknessSensor';
import { ConveyorSystem } from './ConveyorSystem';
import { VisionCamera } from './VisionCamera';
import { DumbbellPunch } from './DumbbellPunch';
import { OutputTrays } from './OutputTrays';
import { PlcCabinet } from './PlcCabinet';
import { WeintekHmi } from './WeintekHmi';
import { AnimatedCablePath } from './AnimatedCablePath';
import { CameraController } from './CameraController';
import { useMachineStore } from '../store/useMachineStore';

interface MachineSceneProps {
  onSceneReady?: () => void;
}

export const MachineScene: React.FC<MachineSceneProps> = ({ onSceneReady }) => {
  const setSelectedComponentId = useMachineStore((state) => state.setSelectedComponentId);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 5.5, 9.5], fov: 42, near: 0.1, far: 100 }}
        onCreated={() => {
          if (onSceneReady) onSceneReady();
        }}
        onPointerMissed={() => {
          setSelectedComponentId(null);
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          {/* Instant High-Contrast Industrial Studio Lighting (Zero Remote Network Latency) */}
          <ambientLight intensity={0.85} color="#e2e8f0" />
          <hemisphereLight args={['#38bdf8', '#0f172a', 0.65]} />
          <directionalLight
            position={[8, 12, 8]}
            intensity={1.9}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={30}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-8, 10, -6]} intensity={1.1} color="#93c5fd" />
          <pointLight position={[0, 4, 3]} intensity={1.4} color="#ffffff" />
          <pointLight position={[-6.8, 3, 2]} intensity={0.9} color="#ffffff" />
          <pointLight position={[3.8, 3, 2]} intensity={0.9} color="#ffffff" />
          <pointLight position={[5.2, 3, 2]} intensity={0.9} color="#ffffff" />

          {/* Machine Assemblies */}
          <group position={[0, 0, 0]}>
            <MachineBase />
            <CableReel />
            <FeedRollers />
            <LaserMicrometer />
            <ProximitySensor />
            <CuttingStation />
            <FlatteningStation />
            <ThicknessSensor />
            <ConveyorSystem />
            <VisionCamera />
            <DumbbellPunch />
            <OutputTrays />
            <PlcCabinet />
            <WeintekHmi />
            <AnimatedCablePath />
          </group>

          {/* Contact Shadows on Floor */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.75}
            scale={22}
            blur={1.6}
            far={4.0}
            resolution={1024}
            color="#020617"
          />

          {/* Industrial Floor Grid */}
          <Grid
            position={[0, 0, 0]}
            args={[30, 30]}
            cellSize={0.5}
            cellThickness={0.7}
            cellColor="#1e293b"
            sectionSize={2.0}
            sectionThickness={1.2}
            sectionColor="#334155"
            fadeDistance={25}
            fadeStrength={1.5}
          />

          {/* Camera Controller with Presets */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
};

