import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import { useMachineStore } from '../store/useMachineStore';

export const AnimatedCablePath: React.FC = () => {
  const isRunning = useMachineStore((state) => state.isRunning);
  const isPaused = useMachineStore((state) => state.isPaused);
  const currentStageIndex = useMachineStore((state) => state.currentStageIndex);
  const currentStageProgress = useMachineStore((state) => state.currentStageProgress);
  const cableHeadProgress = useMachineStore((state) => state.cableHeadProgress);
  const lastResult = useMachineStore((state) => state.lastPassRejectResult);
  const testScenario = useMachineStore((state) => state.testScenario);
  const speedMultiplier = useMachineStore((state) => state.speedMultiplier);
  const selectedCableMaterial = useMachineStore((state) => state.selectedCableMaterial);
  const selectedRecipe = useMachineStore((state) => state.selectedRecipe);

  const isFail = testScenario === 'FAIL' || lastResult === 'REJECT';
  const dumbbellMaterial = isFail ? MATERIALS.specimenPunchedReject : MATERIALS.specimenPunchedPass;

  const tubeMeshRef = useRef<THREE.Mesh>(null);
  const leadingTipRef = useRef<THREE.Group>(null);
  const slittingWingTopRef = useRef<THREE.Mesh>(null);
  const slittingWingBtmRef = useRef<THREE.Mesh>(null);
  const exposedConductorRef = useRef<THREE.Group>(null);
  const specimenMeshRef = useRef<THREE.Group>(null);
  const dumbbellMeshRef = useRef<THREE.Group>(null);

  const setSpecimenState = useMachineStore((state) => state.setSpecimenState);
  const advanceStageProgress = useMachineStore((state) => state.advanceStageProgress);

  // Synchronized punch cutting trigger - dumbbell MUST NOT exist before punch die impact
  const [isPunchExecuted, setIsPunchExecuted] = useState(false);

  useEffect(() => {
    if (currentStageIndex < 7) {
      setIsPunchExecuted(false);
    } else if (currentStageIndex === 7) {
      // In Stage 8 (S08_DUMBBELL_PUNCH, idx 7), starts false until punch die makes impact
      setIsPunchExecuted(false);
    } else {
      // Stage 9 (S09_FINISHED_DUMBBELL, idx 8) and onwards: dumbbell already stamped
      setIsPunchExecuted(true);
    }
  }, [currentStageIndex]);

  // Cable visual radius based on selected recipe (PVC: 0.038, XLPE: 0.048, HDPE: 0.058)
  const cableRadius = selectedRecipe.visualRadius || 0.048;

  // Master spline path from Reel exit tangency to Guillotine cut station
  const masterSplinePoints = useMemo(() => {
    return [
      new THREE.Vector3(-6.8, 1.95, 0),    // Reel exit tangency
      new THREE.Vector3(-6.0, 1.62, 0),    // Catenary uncoiling curve
      new THREE.Vector3(-5.3, 1.45, 0),    // Entry guide bushing
      new THREE.Vector3(-4.2, 1.45, 0),    // Feed Roller 1
      new THREE.Vector3(-3.7, 1.45, 0),    // Intermediate guide
      new THREE.Vector3(-3.2, 1.45, 0),    // Feed Roller 2
      new THREE.Vector3(-2.1, 1.45, 0),    // Keyence Laser Micrometer
      new THREE.Vector3(-1.4, 1.45, 0),    // Proximity Datum
      new THREE.Vector3(-0.6, 1.45, 0),    // Vertical Slitter
      new THREE.Vector3(0.3, 1.45, 0),     // Horizontal Guillotine Cut
    ];
  }, []);

  const masterCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(masterSplinePoints, false, 'catmullrom', 0.15);
  }, [masterSplinePoints]);

  const animatedProgress = useRef(0.08);

  // Cable outer sheath material reflecting chosen polymer
  const cableSheathMaterial = useMemo(() => {
    if (selectedCableMaterial === 'PVC') {
      return new THREE.MeshStandardMaterial({
        color: 0x111316,
        roughness: 0.2,
        metalness: 0.1,
      });
    }
    if (selectedCableMaterial === 'HDPE') {
      return new THREE.MeshStandardMaterial({
        color: 0x0a0c0e,
        roughness: 0.32,
        metalness: 0.15,
      });
    }
    return MATERIALS.blackCableSheath;
  }, [selectedCableMaterial]);

  useFrame((_, delta) => {
    // 0. Advance physical stage animation progression
    if (isRunning && !isPaused) {
      advanceStageProgress(delta);
    }

    // 1. Smoothly advance the raw cable emerging from the reel
    const targetProg = isRunning ? THREE.MathUtils.clamp(cableHeadProgress, 0.08, 1.0) : cableHeadProgress;
    animatedProgress.current = THREE.MathUtils.lerp(
      animatedProgress.current,
      targetProg,
      delta * 2.5 * speedMultiplier
    );

    const prog = THREE.MathUtils.clamp(animatedProgress.current, 0.04, 1.0);

    // 2. Rebuild sub-curve geometry for continuous emerging cable
    if (tubeMeshRef.current) {
      const sampleCount = Math.max(12, Math.floor(prog * 60));
      const subPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= sampleCount; i++) {
        const t = (i / sampleCount) * prog;
        subPoints.push(masterCurve.getPoint(t));
      }

      if (subPoints.length >= 2) {
        const subCurve = new THREE.CatmullRomCurve3(subPoints);
        const newGeo = new THREE.TubeGeometry(subCurve, sampleCount, cableRadius, 14, false);
        tubeMeshRef.current.geometry.dispose();
        tubeMeshRef.current.geometry = newGeo;
      }
    }

    // 3. Leading Tip Position
    if (leadingTipRef.current) {
      const headPoint = masterCurve.getPoint(prog);
      const tangent = masterCurve.getTangent(prog);
      leadingTipRef.current.position.copy(headPoint);
      leadingTipRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      leadingTipRef.current.visible = prog < 0.98;
    }

    // 4. Slitting Zone (Stages 4 & 5): Outer jacket parts open, exposing inner conductor
    if (slittingWingTopRef.current && slittingWingBtmRef.current && exposedConductorRef.current) {
      if (currentStageIndex >= 4) {
        slittingWingTopRef.current.position.y = THREE.MathUtils.lerp(slittingWingTopRef.current.position.y, 0.055, delta * 4.0);
        slittingWingTopRef.current.rotation.z = THREE.MathUtils.lerp(slittingWingTopRef.current.rotation.z, 0.25, delta * 4.0);
        slittingWingBtmRef.current.position.y = THREE.MathUtils.lerp(slittingWingBtmRef.current.position.y, -0.055, delta * 4.0);
        slittingWingBtmRef.current.rotation.z = THREE.MathUtils.lerp(slittingWingBtmRef.current.rotation.z, -0.25, delta * 4.0);
        exposedConductorRef.current.visible = true;
      } else {
        slittingWingTopRef.current.position.y = 0;
        slittingWingTopRef.current.rotation.z = 0;
        slittingWingBtmRef.current.position.y = 0;
        slittingWingBtmRef.current.rotation.z = 0;
        exposedConductorRef.current.visible = false;
      }
    }

    // 5. Trigger Punch Impact during Stage 7 (S08_DUMBBELL_PUNCH, index 7)
    if (currentStageIndex === 7) {
      if (currentStageProgress >= 0.45 && !isPunchExecuted) {
        setIsPunchExecuted(true);
        setSpecimenState('FINISHED_DUMBBELL');
      }
    }

    // 6. FLATTENED RECTANGULAR SPECIMEN STRIP (Stages 6 & 7 before punch impact)
    // Stage 6 (S07_FLATTENING): at Flattening Anvil (x = 1.3)
    // Stage 7 (S08_DUMBBELL_PUNCH): at Dumbbell Punch Anvil (x = 2.4) BEFORE punch impact
    if (specimenMeshRef.current) {
      if ((currentStageIndex === 6 || currentStageIndex === 7) && !isPunchExecuted) {
        const targetX = currentStageIndex === 6 ? 1.3 : 2.4;
        specimenMeshRef.current.position.x = THREE.MathUtils.lerp(
          specimenMeshRef.current.position.x,
          targetX,
          delta * 4.0 * speedMultiplier
        );
        specimenMeshRef.current.visible = true;
      } else {
        specimenMeshRef.current.visible = false;
        if (currentStageIndex < 6) {
          specimenMeshRef.current.position.x = 1.3;
        }
      }
    }

    // 7. FINISHED DUMBBELL SPECIMEN (Appears ONLY after Stage 7 die impact and continues through entire inspection)
    // Stage 7 (post-impact): at Punch Anvil (x = 2.4)
    // Stage 8 (S09_FINISHED_DUMBBELL): at Punch Anvil (x = 2.4)
    // Stage 9 (S10_CONVEYOR_TRANSFER): transferring onto Conveyor (x = 3.0 -> x = 3.6)
    // Stage 10 (S11_THICKNESS_METROLOGY): at Thickness Sensor (x = 3.6)
    // Stages 11-15 (S12 to S16): at Telecentric 4K Optical Dome & AI inspection (x = 4.7)
    // Stage 16 (S17_PASS_REJECT): at Output Sorting Diverter (x = 6.4, z = +0.42 PASS / -0.42 REJECT)
    // Stage 17 (S18_DIGITAL_RECORD): in Output Tray (x = 6.4, z = +0.42 PASS / -0.42 REJECT)
    if (dumbbellMeshRef.current) {
      if (isPunchExecuted && currentStageIndex >= 7) {
        dumbbellMeshRef.current.visible = true;

        let targetX = 2.4;
        let targetZ = 0;

        if (currentStageIndex === 7 || currentStageIndex === 8) {
          targetX = 2.4; // Punch anvil bed
          targetZ = 0;
        } else if (currentStageIndex === 9) {
          // Entering conveyor belt
          targetX = THREE.MathUtils.lerp(2.4, 3.6, THREE.MathUtils.clamp(currentStageProgress, 0, 1));
          targetZ = 0;
        } else if (currentStageIndex === 10) {
          targetX = 3.6; // Thickness displacement sensor
          targetZ = 0;
        } else if (currentStageIndex >= 11 && currentStageIndex <= 15) {
          targetX = 4.7; // Telecentric 4K optical dome & AI inspection
          targetZ = 0;
        } else if (currentStageIndex >= 16) {
          targetX = 6.4; // Diverter gate & sorting tray
          targetZ = isFail ? -0.42 : 0.42;
        }

        dumbbellMeshRef.current.position.x = THREE.MathUtils.lerp(
          dumbbellMeshRef.current.position.x,
          targetX,
          delta * 3.5 * speedMultiplier
        );
        dumbbellMeshRef.current.position.z = THREE.MathUtils.lerp(
          dumbbellMeshRef.current.position.z,
          targetZ,
          delta * 2.8 * speedMultiplier
        );
      } else {
        dumbbellMeshRef.current.visible = false;
        dumbbellMeshRef.current.position.set(2.4, 1.42, 0);
      }
    }
  });

  return (
    <group>
      {/* 1. Continuous Unwinding Round Cable from Reel */}
      <mesh ref={tubeMeshRef} material={cableSheathMaterial} castShadow receiveShadow>
        <bufferGeometry />
      </mesh>

      {/* 2. Leading Cable Head (Freshly Emerging Conductor Tip) */}
      <group ref={leadingTipRef} position={[-6.8, 1.95, 0]}>
        <mesh material={MATERIALS.cableInnerInsulation}>
          <cylinderGeometry args={[cableRadius * 0.8, cableRadius * 0.8, 0.02, 16]} />
        </mesh>
        <mesh position={[0, 0.012, 0]} material={MATERIALS.copperWire}>
          <cylinderGeometry args={[cableRadius * 0.4, cableRadius * 0.4, 0.015, 12]} />
        </mesh>
      </group>

      {/* 3. Slitting Zone (Stages 4/5/6): Separating Wings & Shiny Exposed Inner Conductor */}
      <group position={[-0.2, 1.45, 0]}>
        {/* Upper Slit Insulation Wing */}
        <mesh ref={slittingWingTopRef} position={[-0.12, 0, 0]} material={cableSheathMaterial} castShadow>
          <boxGeometry args={[0.3, 0.014, 0.08]} />
        </mesh>
        {/* Lower Slit Insulation Wing */}
        <mesh ref={slittingWingBtmRef} position={[-0.12, 0, 0]} material={cableSheathMaterial} castShadow>
          <boxGeometry args={[0.3, 0.014, 0.08]} />
        </mesh>

        {/* Exposed Bright Conductor Core (Blue Insulation + Metallic Copper) */}
        <group ref={exposedConductorRef} visible={false}>
          <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={MATERIALS.cableInnerInsulation}>
            <cylinderGeometry args={[cableRadius * 0.7, cableRadius * 0.7, 0.36, 16]} />
          </mesh>
          <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={MATERIALS.copperWire}>
            <cylinderGeometry args={[cableRadius * 0.4, cableRadius * 0.4, 0.14, 16]} />
          </mesh>
        </group>
      </group>

      {/* 4. Flattened 115mm Strip Traveling from Flattening Anvil (x=1.3) to Punch Die (x=2.4) */}
      <group ref={specimenMeshRef} position={[1.3, 1.41, 0]} visible={false}>
        {/* Main Flat Rectangular Strip */}
        <mesh material={MATERIALS.specimenFlattened} castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.016, 0.12]} />
        </mesh>
        {/* Longitudinal Slit Surface Markings */}
        <mesh position={[0, 0.009, 0]} material={MATERIALS.hardenedToolSteel}>
          <boxGeometry args={[0.34, 0.001, 0.004]} />
        </mesh>
      </group>

      {/* 5. FINISHED Punched Necked Dumbbell Specimen (Appears only after S08 die impact) */}
      <group ref={dumbbellMeshRef} position={[2.4, 1.42, 0]} visible={false}>
        <group>
          {/* Narrow Center Waist */}
          <mesh material={dumbbellMaterial} castShadow>
            <boxGeometry args={[0.16, 0.015, 0.06]} />
          </mesh>
          {/* Left Wide Tab */}
          <mesh position={[-0.11, 0, 0]} material={dumbbellMaterial} castShadow>
            <boxGeometry args={[0.09, 0.015, 0.12]} />
          </mesh>
          {/* Right Wide Tab */}
          <mesh position={[0.11, 0, 0]} material={dumbbellMaterial} castShadow>
            <boxGeometry args={[0.09, 0.015, 0.12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
