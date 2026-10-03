import React, { useState, useCallback } from 'react';
import { MachineScene } from './3d/MachineScene';
import { StageHeaderHUD } from './components/StageHeaderHUD';
import { BottomControls } from './components/BottomControls';
import { ComponentInfoToast } from './components/ComponentInfoToast';
import { FinalDashboard } from './components/FinalDashboard';
import { ManualCableSelectorModal } from './components/ManualCableSelectorModal';
import { ComponentInfoDrawer } from './components/ComponentInfoDrawer';
import { JudgeModeOverlay } from './components/JudgeModeOverlay';
import { BootLoadingScreen } from './components/BootLoadingScreen';

export const App: React.FC = () => {
  const [isManualSelectorOpen, setIsManualSelectorOpen] = useState(false);
  const [is3dSceneReady, setIs3dSceneReady] = useState(false);
  const [isBootComplete, setIsBootComplete] = useState(false);

  const handleSceneReady = useCallback(() => {
    setIs3dSceneReady(true);
  }, []);

  const handleBootReady = useCallback(() => {
    setIsBootComplete(true);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans'] select-none">
      {/* 0. Full-Screen Industrial Boot / Loading Screen */}
      {!isBootComplete && (
        <BootLoadingScreen
          onReady={handleBootReady}
          is3dMounted={is3dSceneReady}
        />
      )}

      {/* 1. Primary Hero 3D Machine Viewport (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <MachineScene onSceneReady={handleSceneReady} />
      </div>

      {/* 2. Top Center Stage Header & Live Telemetry HUD */}
      {isBootComplete && (
        <>
          <StageHeaderHUD onOpenManualSelector={() => setIsManualSelectorOpen(true)} />

          {/* 3. 1-Second Component Info Floating Overlay */}
          <ComponentInfoToast />

          {/* 4. Floating Judge Mode Rationale Card (if enabled) */}
          <JudgeModeOverlay />

          {/* 5. Clickable 3D Component Engineering Drawer */}
          <ComponentInfoDrawer />

          {/* 6. Floating Hero Bottom Start / Stop Controls */}
          <BottomControls />
        </>
      )}

      {/* 7. Dedicated Final Post-Cycle Inspection Report Dashboard (with real QR & Downloads) */}
      <FinalDashboard />

      {/* 8. Manual Mode Cable & Recipe Selection Modal */}
      <ManualCableSelectorModal
        isOpen={isManualSelectorOpen}
        onClose={() => setIsManualSelectorOpen(false)}
      />
    </div>
  );
};

export default App;
