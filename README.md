# SPECI-X: 3D Interactive Digital Twin & AI Inspection Dashboard
### Automated Cable Specimen Preparation & Inspection System (IS 10810 / IS 7098)

SPECI-X is an industrial-grade 3D Digital Twin, animated machine simulator, and AI metrology inspection dashboard designed for cable specimen preparation conforming to Indian Standards (**IS 10810** and **IS 7098**).

---

## 🚀 Key Features

1. **Realistic 3D Machine Architecture**:
   - **Industrial Cable Reel (Pay-off Drum)**: Heavy structural frame with rotating drum and black cable uncoiling dynamically.
   - **Feeding Rollers 1 & 2**: Stepper-driven knurled pinch rollers with electronic gearing.
   - **Laser Micrometer (Keyence LK-G5000)**: Non-contact optical triangulation scanner with 50kHz telemetry.
   - **Cutting Station**: Dual vertical carbide slitter blades and high-speed horizontal guillotine.
   - **Flattening Module**: High-tonnage pneumatic roller and mirror-ground anvil base plate.
   - **Conveyor & Vision Station**: Motorized anti-static belt, 4K telecentric camera with diffuse LED dome strobe.
   - **Dumbbell Punch Die**: Precision IS 10810 Type 2 punching press.
   - **PASS & REJECT Collection Trays**: Automated sorting diverter gate.
   - **Automation Cabinet**: Siemens S7-1200 PLC & Weintek 10.1" HMI touchscreen on articulated swivel arm.

2. **Full Automated 18-Stage State Machine**:
   - S01: Cable Reel Pay-off
   - S02: Dual Feed Rollers
   - S03: Laser Micrometer Diameter Scan
   - S04: Optical Position Registration
   - S05: Vertical Insulation Slitting
   - S06: Horizontal Guillotine Chopping
   - S07: Heavy Flattening & Anvil Pressing
   - S08: Post-Flattening Thickness Gauge
   - S09: Automated Conveyor Transfer
   - S10: 4K Vision Capture
   - S11: AI Preprocessing & CLAHE Filtering
   - S12: Specimen Boundary Extraction
   - S13: Geometric Shape & Symmetry Check
   - S14: AI Anomaly & Defect Heatmap
   - S15: Automated Metrology Analysis
   - S16: IS 10810 / IS 7098 Compliance Rule Check
   - S17: Dumbbell Punch & Automated Sorting
   - S18: Digital Twin Certificate & QR Generation

3. **Clickable Component Engineering Panel**:
   - Click any 3D machine component to view detailed engineering metadata, input/output connections, live telemetry, and specifications.

4. **Judge Mode**:
   - Built-in presentation overlay displaying *"Why This Step?"* engineering rationale for hackathons and SIH evaluations.

5. **AI Inspection & Traceability**:
   - 4 Metrology view modes: Original, Canny Edge Detection, Defect Heatmap, 3D Metrology Profile.
   - Live serialized certificate generation with QR code and cloud record URL.

---

## 🛠️ Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

---

## 🔌 Future Hardware Integration Endpoints
Designed to connect seamlessly via REST / WebSockets / OPC UA:
- `/api/specimen/create`
- `/api/specimen/{id}`
- `/api/inspection/run`
- `/api/machine/status`
- `/api/sensor/readings`
- `/api/standard/validate`
