# SPECI-X: Automated Cable Specimen Preparation & Inspection System
## System Architecture & Specification Document (Source of Truth)

### 1. Overview
SPECI-X is an automated, industrial-grade Cable Specimen Preparation and AI Inspection System designed in accordance with Indian Standards (IS 10810, IS 7098). It bridges physical industrial automation (cable pay-off, dual feed rollers, laser micrometer, dual-axis cutting, heavy flattening, thickness gauge, high-speed conveyor, AI optical inspection, precision dumbbell punching) with a real-time 3D Digital Twin, PLC/HMI telemetry, deterministic physics simulation, and automated quality classification.

---

### 2. Machine Process Flow (Hero Stages)
1. **S01_REEL_LOADING / INDUSTRIAL CABLE REEL**: Heavy industrial cable drum with dual flanges, black sheath cable wound around the shaft, rotational pay-off feed.
2. **S02_CABLE_FEEDING / FEED ROLLERS**: Roller 1 and Roller 2 powered by precision stepper drives, guiding cable through linear guide rail.
3. **S03_DIAMETER_SENSING / KEYENCE LK-G5000**: High-precision dual-head laser triangulation micrometer scanning outer diameter (OD).
4. **S04_POSITION_DETECTION / PROXIMITY SENSOR**: Inductive / optical indexing sensor for cut position registration.
5. **S05_VERTICAL_CUTTING / DUAL SLITTING BLADES**: Solenoid/pneumatic actuated opposing blades slitting outer insulation jacket.
6. **S06_HORIZONTAL_CUTTING / CHOP BLADE**: Precision cross-cut blade isolating required length of insulation specimen.
7. **S07_FLATTENING / HEAVY ROLLER**: Pneumatic / weighted roller assembly pressing curved insulation strip into flat planar strip.
8. **S08_THICKNESS_MEASUREMENT / THICKNESS LASER GAUGE**: High-accuracy micrometer validating post-flattening gauge thickness.
9. **S09_CONVEYOR_TRANSFER / FLAT CONVEYOR**: Industrial motor-driven belt transferring flattened strip to inspection and punching stations.
10. **S10_VISION_CAPTURE / INDUSTRIAL CAMERA**: 4K Industrial GigE optical camera capturing high-res telecentric image.
11. **S11_IMAGE_PREPROCESSING / CLAHE & FILTERS**: Contrast Limited Adaptive Histogram Equalization, bilateral noise reduction, normalization.
12. **S12_SPECIMEN_DETECTION / CONTOUR EXTRACTION**: Specimen localization and coordinate mapping.
13. **S13_SHAPE_CLASSIFICATION / GEOMETRIC ANALYSIS**: Profile symmetry, edge parallelism, and distortion validation.
14. **S14_DEFECT_ANALYSIS / DEFECT HEATMAP**: Anomaly scoring for inclusions, micro-voids, burrs, uneven wall thickness.
15. **S15_DIMENSION_ANALYSIS / METROLOGY**: Metrology calculation of Gauge Length ($L_0$), Width ($W$), Thickness ($T$), Overall Length, Fillet Radius.
16. **S16_STANDARD_VALIDATION / IS 10810 & IS 7098**: Automated recipe rules comparison against Indian Standards tolerance envelopes.
17. **S17_PASS_REJECT & PUNCHING / DUMBBELL PUNCH & CLASSIFICATION**: Precision hydraulic/pneumatic dumbbell die punch and automated pneumatic diverter to PASS Tray or REJECT Tray.
18. **S18_DIGITAL_RECORD / QR CODE & TRACEABILITY**: Generation of unique Specimen ID (`SPEC-2026-XXXXXX`), serialized record payload, and interactive QR badge.

---

### 3. Core Component Register (Clickable 3D Components)
- **Industrial Cable Reel (Pay-off Drum)**: Heavy structural steel frame, rotating drum, black multi-core/single-core cable spool.
- **Feed Roller 1 & 2 (Dual Stepper Driven)**: Hardened steel knurled pinch rollers with NEMA-34 closed-loop steppers.
- **Keyence LK-G5000 Laser Micrometer**: Ultra-high accuracy laser sensor for non-contact outer diameter tracking.
- **Proximity & Position Sensor**: Omron inductive sensor for longitudinal positioning and edge detection.
- **Vertical Insulation Slitter (Blade 1 & 2)**: Dual carbide micro-blades with precision pneumatic actuators.
- **Horizontal Chop Blade**: Linear guide guillotine blade with safety interlock housing.
- **Heavy Flattening Roller & Block**: Ground tool steel anvil plate with pneumatic pressing cylinder.
- **Thickness Sensor**: High-resolution optical displacement sensor for post-flattening verification.
- **Conveyor Assembly**: Variable frequency drive (VFD) flat belt conveyor with tracking sensors.
- **Industrial Telecentric Vision Camera**: Basler / FLIR style vision system with uniform white LED dome illumination.
- **Precision Dumbbell Punch Die**: Hardened tool steel ASTM / IS standard dumbbell cutting die.
- **Siemens S7-1200 PLC System**: Main automation controller with digital/analog I/O and PROFINET bus.
- **Weintek HMI Touchscreen**: 10.1" industrial operator interface with real-time process monitoring.
- **Dual Sorting Trays (PASS / REJECT)**: Segregated collection bins with optical count sensors.
- **AI / Computer Vision Processor**: Industrial edge computing unit for real-time OpenCV / ML inference.

---

### 4. Standards & Recipes (IS 10810 & IS 7098)
- **Standard 1**: IS 10810 (Part 7 & Part 15) - Methods of test for cables (Insulation thickness, Tensile strength & elongation).
- **Standard 2**: IS 7098 (Part 1 & Part 2) - Cross-linked polyethylene (XLPE) insulated cables specification.
- **Configurable Recipe System**: Flexible tolerance matrix including Gauge Length ($25.0 \pm 0.5\text{ mm}$), Width ($12.0 \pm 0.2\text{ mm}$), Thickness ($4.8 \pm 0.3\text{ mm}$), and Tensile area criteria.
