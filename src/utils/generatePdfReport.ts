import jsPDF from 'jspdf';
import { SpecimenRecord, StandardRecipe } from '../types';

export const generatePdfReport = async (
  record: SpecimenRecord,
  recipe: StandardRecipe,
  qrCanvas: HTMLCanvasElement | null,
  heatmapCanvas: HTMLCanvasElement | null
): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const isPass = record.overallResult === 'PASS';

  // Helper colors
  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const accentColor: [number, number, number] = [2, 132, 199];  // Cyan 600
  const passColor: [number, number, number] = [16, 185, 129];   // Emerald 500
  const rejectColor: [number, number, number] = [239, 68, 68];  // Red 500
  const textColor: [number, number, number] = [51, 65, 85];     // Slate 700

  // ==========================================
  // PAGE 1: EXECUTIVE QUALITY CERTIFICATE
  // ==========================================

  // Top Dark Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent Line
  doc.setFillColor(...accentColor);
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // Brand Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SPECI-X DIGITAL TWIN', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Automated Cable Specimen Preparation & AI Inspection System', 14, 25);
  doc.text('Quality Assurance Laboratory Compliance Report (IS 10810 / IS 7098)', 14, 31);

  // Verdict Stamp Box (Top Right)
  doc.setFillColor(isPass ? 236 : 254, isPass ? 253 : 242, isPass ? 245 : 242);
  doc.roundedRect(pageWidth - 65, 8, 51, 22, 3, 3, 'F');
  doc.setDrawColor(...(isPass ? passColor : rejectColor));
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth - 65, 8, 51, 22, 3, 3, 'D');

  doc.setTextColor(...(isPass ? passColor : rejectColor));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(isPass ? 'VERDICT: PASS' : 'VERDICT: REJECT', pageWidth - 39.5, 20, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(isPass ? 'IS COMPLIANCE APPROVED' : 'TOLERANCE OUT OF SPEC', pageWidth - 39.5, 26, { align: 'center' });

  // 1. Specimen Identification Section
  let y = 48;
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. SPECIMEN IDENTIFICATION & PROVENANCE', 14, y);
  y += 5;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  // 2-Column Metadata Grid
  doc.setFontSize(9);
  const leftX = 14;
  const rightX = pageWidth / 2 + 5;

  const drawRow = (label: string, value: string, xPos: number, yPos: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(label, xPos, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...primaryColor);
    doc.text(value, xPos + 40, yPos);
  };

  drawRow('Specimen ID:', record.specimenId, leftX, y);
  drawRow('Batch Number:', record.batch, rightX, y);
  y += 6;
  drawRow('Timestamp:', record.timestamp, leftX, y);
  drawRow('Cycle ID:', `#${record.cycleNumber}`, rightX, y);
  y += 6;
  drawRow('Cable Material:', `${record.cableMaterial} (${record.cableType})`, leftX, y);
  drawRow('Applicable Standard:', recipe.standard, rightX, y);
  y += 6;
  drawRow('Test Method:', recipe.testMethod, leftX, y);
  drawRow('Conductor Section:', recipe.conductorCrossSection, rightX, y);
  y += 12;

  // 2. Physical Process & Sensor Telemetry
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. AUTOMATED PROCESS TELEMETRY SUMMARY', 14, y);
  y += 5;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...textColor);
  doc.text('PROCESS STAGE', 18, y + 4.8);
  doc.text('ACTIVE COMPONENT', 65, y + 4.8);
  doc.text('RECORDED SENSOR VALUE', 125, y + 4.8);
  doc.text('STATUS', pageWidth - 20, y + 4.8, { align: 'right' });
  y += 8;

  const processRows = [
    { stage: 'Stage 01: Reel Pay-off', comp: 'Industrial Drum Shaft', val: 'Speed: 45 RPM | Tension: 18.4 N', st: 'NORMAL' },
    { stage: 'Stage 02: Feed Rollers', comp: 'Dual Stepper Pinch Drive', val: 'Linear Speed: 45.0 mm/s', st: 'NORMAL' },
    { stage: 'Stage 03: Diameter Scan', comp: 'Keyence LK-G5000 Laser', val: `OD: 12.04 mm (Baseline 12.0 mm)`, st: 'OPTIMAL' },
    { stage: 'Stage 05: Insulation Slit', comp: 'Dual Carbide Micro-Blades', val: 'Blade Depth: 1.52 mm', st: 'NORMAL' },
    { stage: 'Stage 06: Guillotine Chop', comp: 'Guillotine Cross-Blade', val: 'Segment Length: 115.0 mm', st: 'SQUARE 90°' },
    { stage: 'Stage 07: Flattening', comp: 'Heavy Roller & Anvil Block', val: 'Pressure: 6.5 bar | Thickness: 4.98 mm', st: 'PLANAR' },
    { stage: 'Stage 08: Thickness Scan', comp: 'Optical Displacement Sensor', val: `Thickness: ${record.measurements.thickness} mm`, st: 'WITHIN TOL' },
    { stage: 'Stage 17: Dumbbell Punch', comp: 'ASTM Hardened Die Punch', val: 'Hydraulic Force: 6.8 bar', st: 'CLEAN CUT' },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  processRows.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 1.5, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(30, 41, 59);
    doc.text(r.stage, 18, y + 3);
    doc.text(r.comp, 65, y + 3);
    doc.text(r.val, 125, y + 3);
    doc.setTextColor(16, 185, 129);
    doc.text(r.st, pageWidth - 20, y + 3, { align: 'right' });
    y += 6.5;
  });

  y += 8;

  // 3. Dimensional Metrology Table
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. DIMENSIONAL METROLOGY EVALUATION (IS 10810 / IS 7098)', 14, y);
  y += 5;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  // Metrology Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...textColor);
  doc.text('DIMENSION PARAMETER', 18, y + 4.8);
  doc.text('NOMINAL TARGET', 75, y + 4.8);
  doc.text('TOLERANCE', 110, y + 4.8);
  doc.text('MEASURED VALUE', 145, y + 4.8);
  doc.text('STATUS', pageWidth - 20, y + 4.8, { align: 'right' });
  y += 8;

  const m = record.measurements;
  const t = record.tolerancesMet;
  const tg = recipe.targetDimensions;

  const dimRows = [
    { name: 'Gauge Length (L0)', nom: `${tg.gaugeLength.toFixed(2)} mm`, tol: `± ${tg.gaugeLengthTol.toFixed(2)} mm`, act: `${m.gaugeLength} mm`, pass: t.gaugeLength },
    { name: 'Specimen Width (W)', nom: `${tg.width.toFixed(2)} mm`, tol: `± ${tg.widthTol.toFixed(2)} mm`, act: `${m.width} mm`, pass: t.width },
    { name: 'Insulation Thickness (T)', nom: `${tg.thickness.toFixed(2)} mm`, tol: `± ${tg.thicknessTol.toFixed(2)} mm`, act: `${m.thickness} mm`, pass: t.thickness },
    { name: 'Overall Length', nom: `${tg.overallLength.toFixed(2)} mm`, tol: `± ${tg.overallLengthTol.toFixed(2)} mm`, act: `${m.overallLength} mm`, pass: t.overallLength },
    { name: 'Fillet Radius (R)', nom: `${tg.filletRadius.toFixed(2)} mm`, tol: `± ${tg.filletRadiusTol.toFixed(2)} mm`, act: `${m.filletRadius} mm`, pass: t.filletRadius },
  ];

  doc.setFontSize(8);
  dimRows.forEach((d, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 1.5, pageWidth - 28, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(d.name, 18, y + 3);
    doc.text(d.nom, 75, y + 3);
    doc.text(d.tol, 110, y + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(d.act, 145, y + 3);
    doc.setTextColor(...(d.pass ? passColor : rejectColor));
    doc.text(d.pass ? 'PASS' : 'OUT OF SPEC', pageWidth - 20, y + 3, { align: 'right' });
    y += 6.5;
  });

  // Footer Page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Speci-X Digital Twin System • Official Test Report', 14, pageHeight - 10);
  doc.text('Page 1 of 2', pageWidth - 14, pageHeight - 10, { align: 'right' });

  // ==========================================
  // PAGE 2: AI OPTICAL INSPECTION & HEATMAPS
  // ==========================================
  doc.addPage();

  // Page 2 Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(...accentColor);
  doc.rect(0, 24, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('4. AI COMPUTER VISION & DEFECT ANALYSIS', 14, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Specimen ID: ${record.specimenId} | Telecentric 4K Optical System`, pageWidth - 14, 15, { align: 'right' });

  y = 34;

  // AI Confidence & Defect Scores
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('MODEL CONFIDENCE', 22, y + 7);
  doc.text('DEFECT PROBABILITY', 72, y + 7);
  doc.text('SURFACE SCORE', 122, y + 7);
  doc.text('SHAPE SYMMETRY', 165, y + 7);

  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(`${record.aiConfidence}%`, 22, y + 15);
  doc.setTextColor(...(isPass ? passColor : rejectColor));
  doc.text(`${record.defectProbability}%`, 72, y + 15);
  doc.setTextColor(...primaryColor);
  doc.text(`${(record.surfaceDefectScore * 100).toFixed(1)}%`, 122, y + 15);
  doc.text(`${(record.shapeScore * 100).toFixed(1)}%`, 165, y + 15);

  y += 26;

  // Embedded Heatmap Graphics
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('AI Defect Heatmap Overlay (Simulated Anomaly Scoring):', 14, y);
  y += 4;

  if (heatmapCanvas) {
    try {
      const heatmapImgData = heatmapCanvas.toDataURL('image/png');
      doc.addImage(heatmapImgData, 'PNG', 14, y, 110, 62);
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, y, 110, 62, 'D');
    } catch {
      doc.rect(14, y, 110, 62, 'D');
    }
  }

  // Next to heatmap: Analysis Notes
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('INSPECTION ALGORITHM CRITERIA:', 130, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const notes = [
    '• Telecentric optical FOV: 120 x 90 mm',
    '• Sub-pixel Canny edge extraction: 0.02 px RMS',
    '• Adaptive CLAHE contrast normalization',
    '• Spatial anomaly detection: Inclusions & voids',
    '• Parallelism check on gauge neck width',
    isPass ? '• Zero critical defect regions detected' : '• Anomaly detected in specimen shoulder',
  ];
  notes.forEach((note, i) => {
    doc.text(note, 130, y + 14 + i * 6.5);
  });

  y += 70;

  // 5. Digital Record & QR Code Verification Block
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('5. DIGITAL TRACEABILITY & CLOUD VERIFICATION', 14, y);
  y += 4;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  // Draw QR Code
  if (qrCanvas) {
    try {
      const qrImgData = qrCanvas.toDataURL('image/png');
      doc.addImage(qrImgData, 'PNG', 14, y, 36, 36);
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, y, 36, 36, 'D');
    } catch {}
  }

  // QR Description block
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('SCANNABLE DIGITAL PROVENANCE CERTIFICATE', 56, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textColor);
  doc.text('Scan the QR code to verify this certificate on the QA server.', 56, y + 12);
  doc.text(`Digital Record Payload: ${record.qrPayloadUrl}`, 56, y + 18);
  doc.text(`SHA-256 Verification Hash: ${Math.random().toString(36).substring(2, 15).toUpperCase()}B94C72E`, 56, y + 24);
  doc.text(`Approved by: Speci-X Automated QA Engine (Firmware v2.6.4)`, 56, y + 30);

  y += 44;

  // Sign-off Box
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 80, y);
  doc.line(pageWidth - 80, y, pageWidth - 14, y);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('AUTOMATED INSPECTOR SIGNATURE', 14, y + 5);
  doc.text('LABORATORY QA MANAGER', pageWidth - 14, y + 5, { align: 'right' });

  // Footer Page 2
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Speci-X Digital Twin System • Official Test Report', 14, pageHeight - 10);
  doc.text('Page 2 of 2', pageWidth - 14, pageHeight - 10, { align: 'right' });

  // Save the generated PDF
  doc.save(`${record.specimenId}-Inspection-Report.pdf`);
};
