'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useFoundry } from '@/context/FoundryContext';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

interface ProductionRecord {
  id: string;
  time: string;
  machineId: string;
  machineName: string;
  brand: string;
  partName: string;
  partGrade: string;
  ncProgram: string;
  operation: string;
  tool: string;
  cycleTime: number;
  good: number;
  reject: number;
  status: 'Running' | 'Needs Attention' | 'Completed' | 'Idle';
  thumbImg: string;
  previewImg: string;
  heatNo: string;
  lotNo: string;
  currentPartId: string;
  startedAt: string;
  estCompletion: string;
  totalTarget: number;
  progressPercent: number;
  toolDetails: {
    toolCode: string;
    description: string;
    spindleSpeed: string;
    feedRate: string;
    wearLevel: string;
    remainingLife: string;
    coolantPressure: string;
  };
  materialDetails: {
    spec: string;
    supplier: string;
    dimensions: string;
    tensileStrength: string;
    hardness: string;
  };
  qualityDetails: {
    surfaceFinish: string;
    boreTolerance: string;
    concentricity: string;
    defectRate: string;
  };
  timelineSteps: { step: string; tool: string; duration: string; status: 'done' | 'active' | 'pending' }[];
}

const PRODUCTION_RECORDS: ProductionRecord[] = [
  {
    id: 'rec-01',
    time: '12:58:12',
    machineId: 'CNC-01',
    machineName: 'CNC-01',
    brand: 'DMG MORI',
    partName: 'Aerospace Mounting Flange',
    partGrade: 'AL 7075-T6',
    ncProgram: 'AERO_FLANGE_01',
    operation: '5-Axis Finishing',
    tool: 'T01',
    cycleTime: 42,
    good: 120,
    reject: 1,
    status: 'Running',
    thumbImg: '/prod_part_flange.png',
    previewImg: '/aerospace_flange.jpg',
    heatNo: 'HT-00421',
    lotNo: 'LOT-26001',
    currentPartId: 'AERO-CNC01-000421',
    startedAt: '12:10:05',
    estCompletion: '12:59:30',
    totalTarget: 120,
    progressPercent: 99.2,
    toolDetails: {
      toolCode: 'T01 - Solid Carbide 5-Flute Endmill',
      description: 'Ø16mm TiAlN Coated High-Helix',
      spindleSpeed: '12,500 RPM',
      feedRate: '3,200 mm/min',
      wearLevel: '18% (Optimal)',
      remainingLife: '4.8 Hours',
      coolantPressure: '45 Bar (Through-Spindle)',
    },
    materialDetails: {
      spec: 'AMS 4045 / ASTM B247',
      supplier: 'Hindalco Aerospace Alloys',
      dimensions: 'Billet Ø180mm x 45mm',
      tensileStrength: '572 MPa (Min 510 MPa)',
      hardness: '150 HBW',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.38 µm (Target: ≤ 0.8 µm) — PASS',
      boreTolerance: 'Ø50.002 mm (+0.002 / +0.008) — PASS',
      concentricity: '0.004 mm (Limit: 0.010 mm) — PASS',
      defectRate: '0.83% (Within 1.5% AQL)',
    },
    timelineSteps: [
      { step: 'Billet Clamping & Workpiece Datum Probe', tool: 'Probe P01', duration: '00:04', status: 'done' },
      { step: 'Rough Facing & Outer Diameter Turning', tool: 'T02 Insert', duration: '00:12', status: 'done' },
      { step: 'PCD 8x Bolt Holes Drilling & Chamfering', tool: 'T03 Drill', duration: '00:10', status: 'done' },
      { step: '5-Axis High-Speed Contour Finishing', tool: 'T01 Endmill', duration: '00:16', status: 'active' },
    ],
  },
  {
    id: 'rec-02',
    time: '12:55:43',
    machineId: 'CNC-02',
    machineName: 'CNC-02',
    brand: 'HAAS VF-4',
    partName: 'Transmission Drive Shaft',
    partGrade: 'Alloy Steel 4140',
    ncProgram: 'DRIVE_SHAFT_02',
    operation: 'Turning & Threading',
    tool: 'T03',
    cycleTime: 58,
    good: 95,
    reject: 2,
    status: 'Running',
    thumbImg: '/prod_part_shaft.png',
    previewImg: '/inspection_part_cylinder.jpg',
    heatNo: 'HT-11892',
    lotNo: 'LOT-26002',
    currentPartId: 'SHAFT-CNC02-00189',
    startedAt: '12:05:20',
    estCompletion: '13:02:15',
    totalTarget: 100,
    progressPercent: 95.0,
    toolDetails: {
      toolCode: 'T03 - Carbide Thread Whirling Chaser',
      description: 'M24x1.5 Precision Pitch',
      spindleSpeed: '3,800 RPM',
      feedRate: '1,450 mm/min',
      wearLevel: '24% (Good)',
      remainingLife: '3.6 Hours',
      coolantPressure: '30 Bar Flood',
    },
    materialDetails: {
      spec: 'AISI 4140 / EN19 Quenched & Tempered',
      supplier: 'Jindal Steel & Power',
      dimensions: 'Bar Stock Ø42mm x 350mm',
      tensileStrength: '980 MPa',
      hardness: '28-32 HRC',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.62 µm — PASS',
      boreTolerance: 'Pitch Dia ±0.012mm — PASS',
      concentricity: '0.006 mm — PASS',
      defectRate: '2.06%',
    },
    timelineSteps: [
      { step: 'Stock Feed & Collet Clamping', tool: 'Bar Feeder', duration: '00:05', status: 'done' },
      { step: 'OD Rough Turning & Shoulder Step', tool: 'T01 CNMG', duration: '00:22', status: 'done' },
      { step: 'Spline Milling & Keyway Slotting', tool: 'T02 Slitter', duration: '00:15', status: 'done' },
      { step: 'Thread Turning & Chamfer Deburr', tool: 'T03 Thread', duration: '00:16', status: 'active' },
    ],
  },
  {
    id: 'rec-03',
    time: '12:52:01',
    machineId: 'CNC-03',
    machineName: 'CNC-03',
    brand: 'Mazak Integrex',
    partName: 'Hydraulic Manifold Block',
    partGrade: 'SS 316L',
    ncProgram: 'MANIFOLD_03',
    operation: 'Drilling & Tapping',
    tool: 'T02',
    cycleTime: 36,
    good: 180,
    reject: 3,
    status: 'Running',
    thumbImg: '/prod_part_manifold.png',
    previewImg: '/inspection_part.jpg',
    heatNo: 'HT-55210',
    lotNo: 'LOT-26003',
    currentPartId: 'MANI-CNC03-00084',
    startedAt: '12:12:40',
    estCompletion: '13:05:00',
    totalTarget: 185,
    progressPercent: 97.3,
    toolDetails: {
      toolCode: 'T02 - High-Pressure Coolant Carbide Drill',
      description: 'Ø8.5mm Deep Hole 12xD',
      spindleSpeed: '6,200 RPM',
      feedRate: '880 mm/min',
      wearLevel: '14%',
      remainingLife: '5.5 Hours',
      coolantPressure: '70 Bar Micro-Jet',
    },
    materialDetails: {
      spec: 'ASTM A276 Grade 316L Stainless',
      supplier: 'Tata Steel Special Metals',
      dimensions: 'Block 120 x 85 x 65mm',
      tensileStrength: '580 MPa',
      hardness: '165 HB',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.45 µm — PASS',
      boreTolerance: 'Port Depth ±0.015mm — PASS',
      concentricity: '0.003 mm — PASS',
      defectRate: '1.64%',
    },
    timelineSteps: [
      { step: 'Pneumatic 5-Axis Vise Clamping', tool: 'Pneumatics', duration: '00:03', status: 'done' },
      { step: 'Face Milling 6-Sides Square', tool: 'T01 FaceMill', duration: '00:11', status: 'done' },
      { step: 'Cavity Port Drilling 12-Holes', tool: 'T02 Drill', duration: '00:14', status: 'active' },
      { step: 'G-Thread Form Tapping', tool: 'T04 Tap', duration: '00:08', status: 'pending' },
    ],
  },
  {
    id: 'rec-04',
    time: '12:48:29',
    machineId: 'CNC-04',
    machineName: 'CNC-04',
    brand: 'Makino D500',
    partName: 'Turbine Impeller Blade',
    partGrade: 'Titanium Grade 5',
    ncProgram: 'IMPELLER_04',
    operation: '5-Axis Profiling',
    tool: 'T05',
    cycleTime: 102,
    good: 40,
    reject: 0,
    status: 'Running',
    thumbImg: '/prod_part_impeller.png',
    previewImg: '/inspection_part_gear.jpg',
    heatNo: 'HT-77123',
    lotNo: 'LOT-26004',
    currentPartId: 'TURB-CNC04-00042',
    startedAt: '11:45:00',
    estCompletion: '13:10:00',
    totalTarget: 42,
    progressPercent: 95.2,
    toolDetails: {
      toolCode: 'T05 - Ball Nose Micro Endmill Ø6mm',
      description: 'Diamond Like Coating (DLC) 4-Flute',
      spindleSpeed: '18,000 RPM',
      feedRate: '2,800 mm/min',
      wearLevel: '12%',
      remainingLife: '6.2 Hours',
      coolantPressure: 'Air-Mist Cryogenic',
    },
    materialDetails: {
      spec: 'Ti-6Al-4V Grade 5 Aerospace Spec',
      supplier: 'ATI Specialty Metals',
      dimensions: 'Solid Billet Ø140mm x 80mm',
      tensileStrength: '950 MPa',
      hardness: '36 HRC',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.22 µm — PASS',
      boreTolerance: 'Airfoil Thickness ±0.005mm — PASS',
      concentricity: '0.002 mm — PASS',
      defectRate: '0.00%',
    },
    timelineSteps: [
      { step: 'Zero-Point Mounting Fixture', tool: 'Schunk Chuck', duration: '00:05', status: 'done' },
      { step: 'Blade Hub Roughing & Swarf Removal', tool: 'T01 BullNose', duration: '00:35', status: 'done' },
      { step: '5-Axis Blade Aerodynamic Profiling', tool: 'T05 BallNose', duration: '00:45', status: 'active' },
      { step: 'Root Fillet Radius Polishing', tool: 'T06 Radial', duration: '00:17', status: 'pending' },
    ],
  },
  {
    id: 'rec-05',
    time: '12:45:18',
    machineId: 'CNC-05',
    machineName: 'CNC-05',
    brand: 'Doosan Puma',
    partName: 'Differential Pinion Gear',
    partGrade: '20MnCr5',
    ncProgram: 'PINION_GEAR_05',
    operation: 'Turning',
    tool: 'T04',
    cycleTime: 65,
    good: 85,
    reject: 1,
    status: 'Running',
    thumbImg: '/prod_part_pinion.png',
    previewImg: '/inspection_part_gear.jpg',
    heatNo: 'HT-99341',
    lotNo: 'LOT-26005',
    currentPartId: 'GEAR-CNC05-00112',
    startedAt: '12:00:10',
    estCompletion: '13:00:00',
    totalTarget: 90,
    progressPercent: 94.4,
    toolDetails: {
      toolCode: 'T04 - Heavy Duty Grooving Insert',
      description: 'PVD TiCN Coated 4mm Width',
      spindleSpeed: '2,900 RPM',
      feedRate: '950 mm/min',
      wearLevel: '22%',
      remainingLife: '3.8 Hours',
      coolantPressure: '25 Bar',
    },
    materialDetails: {
      spec: 'Case Hardening Steel DIN 1.7147',
      supplier: 'Saarstahl AG',
      dimensions: 'Forged Blank Ø95mm x 140mm',
      tensileStrength: '1150 MPa (Case)',
      hardness: '58-62 HRC (After Heat)',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.55 µm — PASS',
      boreTolerance: 'Pitch Cone Angle ±0.05° — PASS',
      concentricity: '0.005 mm — PASS',
      defectRate: '1.16%',
    },
    timelineSteps: [
      { step: 'Chuck Hydraulic Grip Check', tool: 'SMW Autoblok', duration: '00:04', status: 'done' },
      { step: 'Bevel Face Turning & Bore Boring', tool: 'T01 Boring Bar', duration: '00:25', status: 'done' },
      { step: 'Snap Ring Grooving & Chamfering', tool: 'T04 Groover', duration: '00:18', status: 'active' },
      { step: 'Gear Tooth Hobbing Alignment', tool: 'T08 Hob', duration: '00:18', status: 'pending' },
    ],
  },
  {
    id: 'rec-06',
    time: '12:40:37',
    machineId: 'CNC-06',
    machineName: 'CNC-06',
    brand: 'Hermle C42',
    partName: 'Injection Mold Cavity',
    partGrade: 'Tool Steel H13',
    ncProgram: 'MOLD_06',
    operation: 'Milling',
    tool: 'T06',
    cycleTime: 78,
    good: 60,
    reject: 2,
    status: 'Needs Attention',
    thumbImg: '/prod_part_mold.png',
    previewImg: '/inspection_part_defect.jpg',
    heatNo: 'HT-66231',
    lotNo: 'LOT-26006',
    currentPartId: 'MOLD-CNC06-00078',
    startedAt: '11:50:00',
    estCompletion: '13:08:45',
    totalTarget: 65,
    progressPercent: 92.3,
    toolDetails: {
      toolCode: 'T06 - CBN Micro Ballnose Insert',
      description: 'Cubic Boron Nitride for Hard Milling',
      spindleSpeed: '22,000 RPM',
      feedRate: '1,800 mm/min',
      wearLevel: '42% (Warning Threshold)',
      remainingLife: '1.2 Hours',
      coolantPressure: 'High Pressure Air Jet',
    },
    materialDetails: {
      spec: 'AISI H13 / DIN 1.2344 Hot Work Steel',
      supplier: 'Bohler Bleche',
      dimensions: 'Cavity Insert 160 x 120 x 80mm',
      tensileStrength: '1580 MPa',
      hardness: '52 HRC',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.72 µm (Alert: limit 0.8 µm) — ATTENTION',
      boreTolerance: 'Parting Line Offset 0.007mm — PASS',
      concentricity: '0.008 mm — PASS',
      defectRate: '3.23% (Review Tooling)',
    },
    timelineSteps: [
      { step: 'Thermal Equilibrium Stabilization', tool: 'Air Purge', duration: '00:08', status: 'done' },
      { step: 'Deep Cavity 3D High-Speed Roughing', tool: 'T02 Torus', duration: '00:32', status: 'done' },
      { step: 'Fine Rib Milling & Corner Clearing', tool: 'T06 CBN', duration: '00:26', status: 'active' },
      { step: 'Optical Laser In-Process CMM', tool: 'Blum Laser', duration: '00:12', status: 'pending' },
    ],
  },
  {
    id: 'rec-07',
    time: '12:38:11',
    machineId: 'CNC-07',
    machineName: 'CNC-07',
    brand: 'Okuma Multus',
    partName: 'Flywheel Hub',
    partGrade: 'Forged Steel 42CrMo4',
    ncProgram: 'HUB_07',
    operation: 'Rough Turning',
    tool: 'T01',
    cycleTime: 95,
    good: 70,
    reject: 4,
    status: 'Running',
    thumbImg: '/prod_part_flywheel.png',
    previewImg: '/inspection_part_cylinder.jpg',
    heatNo: 'HT-44819',
    lotNo: 'LOT-26007',
    currentPartId: 'FLY-CNC07-00095',
    startedAt: '11:30:15',
    estCompletion: '13:00:20',
    totalTarget: 75,
    progressPercent: 93.3,
    toolDetails: {
      toolCode: 'T01 - Heavy Duty Ceramic Turning Insert',
      description: 'CNGA 120408 Whisker Reinforced',
      spindleSpeed: '1,850 RPM',
      feedRate: '2,200 mm/min',
      wearLevel: '26%',
      remainingLife: '3.1 Hours',
      coolantPressure: '40 Bar High Volume',
    },
    materialDetails: {
      spec: 'EN 10083-3 42CrMo4 Forged Blank',
      supplier: 'Tata Steel Special Metals',
      dimensions: 'Forged Ring Ø280mm x 90mm',
      tensileStrength: '1050 MPa',
      hardness: '280-320 HBW',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.68 µm — PASS',
      boreTolerance: 'Central Bore ID ±0.010mm — PASS',
      concentricity: '0.007 mm — PASS',
      defectRate: '5.41% (Thermal Drift Monitored)',
    },
    timelineSteps: [
      { step: 'Chuck Hydraulic Pressure Calibrate', tool: 'Kitagawa Chuck', duration: '00:06', status: 'done' },
      { step: 'Face Flange Heavy Roughing', tool: 'T01 Ceramic', duration: '00:40', status: 'done' },
      { step: 'Step Bore Internal Boring Bar', tool: 'T03 Boring', duration: '00:30', status: 'active' },
      { step: 'Bolt Circle Drilling & Counterbore', tool: 'T07 Drill', duration: '00:19', status: 'pending' },
    ],
  },
  {
    id: 'rec-08',
    time: '12:35:40',
    machineId: 'CNC-08',
    machineName: 'CNC-08',
    brand: 'Citizen Cincom L20',
    partName: 'Miniature Medical Valve Spool',
    partGrade: 'SS 316LVM / Ti-ELI',
    ncProgram: 'VALVE_SPOOL_08',
    operation: 'Swiss Micro-Turning',
    tool: 'T08',
    cycleTime: 28,
    good: 140,
    reject: 1,
    status: 'Running',
    thumbImg: '/prod_part_valve.png',
    previewImg: '/inspection_part_cylinder.jpg',
    heatNo: 'HT-33109',
    lotNo: 'LOT-26008',
    currentPartId: 'VALV-CNC08-00214',
    startedAt: '12:00:00',
    estCompletion: '13:00:00',
    totalTarget: 145,
    progressPercent: 96.6,
    toolDetails: {
      toolCode: 'T08 - Swiss Micro Turn Insert R0.05',
      description: 'Ultra-Sharp CVD Diamond Micro Insert',
      spindleSpeed: '8,500 RPM',
      feedRate: '450 mm/min',
      wearLevel: '15%',
      remainingLife: '5.2 Hours',
      coolantPressure: '15 Bar Neat Cutting Oil',
    },
    materialDetails: {
      spec: 'ASTM F138 Medical Implant Grade',
      supplier: 'Sandvik Materials Technology',
      dimensions: 'Precision Wire Stock Ø6.0mm x 3000mm',
      tensileStrength: '860 MPa',
      hardness: '32 HRC',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.15 µm (Micro-Polished) — PASS',
      boreTolerance: 'Land Width ±0.002mm — PASS',
      concentricity: '0.0015 mm — PASS',
      defectRate: '0.71%',
    },
    timelineSteps: [
      { step: 'Guide Bushing In-Feed & Collet Clamp', tool: 'Guide Bushing', duration: '00:03', status: 'done' },
      { step: 'Spool Land Precision Micro-Turning', tool: 'T08 MicroInsert', duration: '00:14', status: 'done' },
      { step: 'Internal Micro-Port Cross Hole Drill', tool: 'T04 MicroDrill', duration: '00:07', status: 'active' },
      { step: 'Cut-off & Sub-Spindle Back Work', tool: 'T10 CutOff', duration: '00:04', status: 'pending' },
    ],
  },
  {
    id: 'rec-09',
    time: '12:32:15',
    machineId: 'CNC-09',
    machineName: 'CNC-09',
    brand: 'Haas VF-4SS',
    partName: 'EV Gearbox Transmission Case',
    partGrade: 'Cast Aluminium A380',
    ncProgram: 'GEARBOX_CASE_09',
    operation: '4-Axis Rotary Index Milling',
    tool: 'T04',
    cycleTime: 39,
    good: 110,
    reject: 2,
    status: 'Running',
    thumbImg: '/prod_part_gearbox.png',
    previewImg: '/inspection_part.jpg',
    heatNo: 'HT-88120',
    lotNo: 'LOT-26009',
    currentPartId: 'EVGB-CNC09-00109',
    startedAt: '11:40:00',
    estCompletion: '13:05:00',
    totalTarget: 115,
    progressPercent: 95.7,
    toolDetails: {
      toolCode: 'T04 - High-Speed Face Mill Ø50mm',
      description: 'PCD Diamond Tipped 5-Insert Cutter',
      spindleSpeed: '12,000 RPM',
      feedRate: '4,500 mm/min',
      wearLevel: '19%',
      remainingLife: '4.5 Hours',
      coolantPressure: '28 Bar High Velocity',
    },
    materialDetails: {
      spec: 'AlSi10Mg / EN AC-43000 Die Cast',
      supplier: 'Hindalco Foundry Division',
      dimensions: 'Die Cast Housing 320 x 240 x 180mm',
      tensileStrength: '310 MPa',
      hardness: '95 HB',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.42 µm — PASS',
      boreTolerance: 'Bearing Bore Alignment ±0.008mm — PASS',
      concentricity: '0.004 mm — PASS',
      defectRate: '1.78%',
    },
    timelineSteps: [
      { step: 'HRT210 Rotary Fixture Hydraulic Clamp', tool: 'Rotary Table', duration: '00:04', status: 'done' },
      { step: 'Mating Flange Face Milling', tool: 'T04 PCD', duration: '00:15', status: 'done' },
      { step: 'Bearing Pocket Finish Boring', tool: 'T06 Boring', duration: '00:12', status: 'active' },
      { step: 'O-Ring Seal Groove Milling', tool: 'T09 Slitter', duration: '00:08', status: 'pending' },
    ],
  },
  {
    id: 'rec-10',
    time: '12:28:44',
    machineId: 'CNC-10',
    machineName: 'CNC-10',
    brand: 'Mazak Integrex i-200H',
    partName: 'Engine Crankshaft Journal',
    partGrade: 'Forged Alloy Steel 4340',
    ncProgram: 'CRANK_JOURNAL_10',
    operation: 'B-Axis Mill-Turn',
    tool: 'T02',
    cycleTime: 45,
    good: 130,
    reject: 1,
    status: 'Running',
    thumbImg: '/prod_part_crankshaft.png',
    previewImg: '/part_thumb.jpg',
    heatNo: 'HT-72491',
    lotNo: 'LOT-26010',
    currentPartId: 'CRNK-CNC10-00130',
    startedAt: '11:15:00',
    estCompletion: '13:00:00',
    totalTarget: 135,
    progressPercent: 96.3,
    toolDetails: {
      toolCode: 'T02 - Capto C6 High-Torque Pin Lathe',
      description: 'Ceramic Coated High-Feed Pin Mill',
      spindleSpeed: '3,950 RPM',
      feedRate: '1,500 mm/min',
      wearLevel: '21%',
      remainingLife: '3.9 Hours',
      coolantPressure: '70 Bar Dual Micro-Jet',
    },
    materialDetails: {
      spec: 'AISI 4340 / 34CrNiMo6 Forged Billet',
      supplier: 'Bharat Forge Precision Metals',
      dimensions: 'Forged Billet Ø110mm x 480mm',
      tensileStrength: '1100 MPa',
      hardness: '34-38 HRC',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.30 µm (Fine Grinding Mirror) — PASS',
      boreTolerance: 'Main Journal Diameter ±0.004mm — PASS',
      concentricity: '0.003 mm — PASS',
      defectRate: '0.76%',
    },
    timelineSteps: [
      { step: 'C-Axis Synchronized Clamping & Center', tool: 'Tailstock MT5', duration: '00:05', status: 'done' },
      { step: 'Main Journal Diameter Rough Turn', tool: 'T01 Turn', duration: '00:18', status: 'done' },
      { step: 'B-Axis Angular Cross-Oil Hole Drilling', tool: 'T05 Drill', duration: '00:12', status: 'active' },
      { step: 'Journal Micro-Finishing & Super-Polishing', tool: 'T08 Hone', duration: '00:10', status: 'pending' },
    ],
  },
  {
    id: 'rec-11',
    time: '12:24:50',
    machineId: 'CNC-11',
    machineName: 'CNC-11',
    brand: 'FPT Dinomax Gantry',
    partName: 'Aircraft Structural Spar Beam',
    partGrade: 'Al-Li 2099 / AL 7050',
    ncProgram: 'SPAR_BEAM_11',
    operation: 'Heavy Gantry Profiling',
    tool: 'T07',
    cycleTime: 52,
    good: 65,
    reject: 1,
    status: 'Running',
    thumbImg: '/prod_part_spar_beam.png',
    previewImg: '/material_rods.jpg',
    heatNo: 'HT-14022',
    lotNo: 'LOT-26011',
    currentPartId: 'SPAR-CNC11-00066',
    startedAt: '11:00:00',
    estCompletion: '13:12:00',
    totalTarget: 70,
    progressPercent: 92.9,
    toolDetails: {
      toolCode: 'T07 - Heavy Duty Porcupine Rougher Ø40',
      description: 'Wave-Form Helical Roughing Endmill',
      spindleSpeed: '3,500 RPM',
      feedRate: '2,400 mm/min',
      wearLevel: '28%',
      remainingLife: '2.8 Hours',
      coolantPressure: 'Dual Flood Pumps 19 Bar',
    },
    materialDetails: {
      spec: 'AMS 4050 / Aluminium-Lithium Plate',
      supplier: 'Constellium Aerospace Materials',
      dimensions: 'Plate Stock 1200 x 300 x 75mm',
      tensileStrength: '540 MPa',
      hardness: '145 HBW',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.50 µm — PASS',
      boreTolerance: 'Web Thickness ±0.010mm — PASS',
      concentricity: '0.006 mm — PASS',
      defectRate: '1.51%',
    },
    timelineSteps: [
      { step: 'Perimeter Vacuum Fixture Lock Check', tool: 'Vacuum Bed', duration: '00:06', status: 'done' },
      { step: 'Deep Pocket High-Volume Chip Roughing', tool: 'T07 Porcupine', duration: '00:26', status: 'done' },
      { step: 'Thin Web Rib 5-Axis Wall Finishing', tool: 'T03 Endmill', duration: '00:14', status: 'active' },
      { step: 'Fastener Clearance Counterboring', tool: 'T09 StepDrill', duration: '00:06', status: 'pending' },
    ],
  },
  {
    id: 'rec-12',
    time: '12:20:18',
    machineId: 'CNC-12',
    machineName: 'CNC-12',
    brand: 'GF Mikron Mill P 500',
    partName: 'Robotic Cell Mounting Base',
    partGrade: 'Ductile Iron GGG-40',
    ncProgram: 'ROBOT_BASE_12',
    operation: 'High-Speed Finish Milling',
    tool: 'T03',
    cycleTime: 32,
    good: 105,
    reject: 0,
    status: 'Running',
    thumbImg: '/prod_part_robot_base.png',
    previewImg: '/robot_arm.jpg',
    heatNo: 'HT-59044',
    lotNo: 'LOT-26012',
    currentPartId: 'BASE-CNC12-00105',
    startedAt: '11:20:00',
    estCompletion: '12:55:00',
    totalTarget: 110,
    progressPercent: 95.5,
    toolDetails: {
      toolCode: 'T03 - Precision High-Feed Face Mill',
      description: 'Octagonal 8-Cutting Edge Double-Sided',
      spindleSpeed: '6,200 RPM',
      feedRate: '3,800 mm/min',
      wearLevel: '16%',
      remainingLife: '5.0 Hours',
      coolantPressure: '40 Bar Internal Jet',
    },
    materialDetails: {
      spec: 'DIN 1693 GGG-40 / EN-GJS-400-15',
      supplier: 'Georg Fischer Automotive Castings',
      dimensions: 'Machined Base 450 x 380 x 120mm',
      tensileStrength: '400 MPa',
      hardness: '160 HB',
    },
    qualityDetails: {
      surfaceFinish: 'Ra 0.35 µm — PASS',
      boreTolerance: 'Mounting Dowel Centers ±0.005mm — PASS',
      concentricity: '0.003 mm — PASS',
      defectRate: '0.00%',
    },
    timelineSteps: [
      { step: 'KUKA Robot Pallet Clamp Verification', tool: 'Zero-Point', duration: '00:04', status: 'done' },
      { step: 'Base Top Face Rapid Leveling', tool: 'T03 HighFeed', duration: '00:12', status: 'done' },
      { step: 'Robot Axis Mounting Hole Interpolation', tool: 'T06 Carbide', duration: '00:11', status: 'active' },
      { step: 'Datum Edge Chamfer & Deburr Cycle', tool: 'T08 Chamfer', duration: '00:05', status: 'pending' },
    ],
  },
];

export default function ProductionSection() {
  const { openMachineDetail } = useFoundry();

  const [selectedRecordId, setSelectedRecordId] = useState<string>('rec-01');
  const [activeBottomTab, setActiveBottomTab] = useState<'production' | 'material' | 'tool' | 'quality' | 'timeline'>('production');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedPart, setSelectedPart] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedOperation, setSelectedOperation] = useState<string>('all');
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({ 'rec-01': true });
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [viewModalRecord, setViewModalRecord] = useState<ProductionRecord | null>(null);
  const [isPartPreviewModalOpen, setIsPartPreviewModalOpen] = useState<boolean>(false);

  const selectedRecord = PRODUCTION_RECORDS.find((r) => r.id === selectedRecordId) || PRODUCTION_RECORDS[0];

  // Filtering
  const filteredRecords = PRODUCTION_RECORDS.filter((rec) => {
    if (selectedMachine !== 'all' && rec.machineId !== selectedMachine) return false;
    if (selectedPart !== 'all' && rec.partName !== selectedPart) return false;
    if (selectedMaterial !== 'all' && rec.partGrade !== selectedMaterial) return false;
    if (selectedOperation !== 'all' && rec.operation !== selectedOperation) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.partName.toLowerCase().includes(q) ||
        rec.machineId.toLowerCase().includes(q) ||
        rec.partGrade.toLowerCase().includes(q) ||
        rec.ncProgram.toLowerCase().includes(q) ||
        rec.operation.toLowerCase().includes(q) ||
        rec.tool.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllRows = () => {
    const allSelected = filteredRecords.every((r) => selectedRows[r.id]);
    const next: Record<string, boolean> = {};
    filteredRecords.forEach((r) => {
      next[r.id] = !allSelected;
    });
    setSelectedRows(next);
  };

  const handleExport = (format: string) => {
    setIsExportOpen(false);
    setExportNotice(`Exporting ${filteredRecords.length} production records to ${format.toUpperCase()}...`);
    setTimeout(() => {
      setExportNotice(`✓ Successfully downloaded CNC_Production_Records_${Date.now()}.${format}`);
      setTimeout(() => setExportNotice(null), 4000);
    }, 1200);
  };

  const [prodTimeFrame, setProdTimeFrame] = useState<TimeFrameKey>('8H');

  const partsProducedTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 540, formatted: '540 pcs' },
      { label: '12:20 PM', value: 552, formatted: '552 pcs' },
      { label: '12:30 PM', value: 560, formatted: '560 pcs' },
      { label: '12:40 PM', value: 558, formatted: '558 pcs' },
      { label: '12:50 PM', value: 565, formatted: '565 pcs' },
      { label: '01:00 PM', value: 567, formatted: '567 pcs' },
    ],
    '8H': [
      { label: '08:00 AM', value: 480, formatted: '480 pcs' },
      { label: '09:00 AM', value: 512, formatted: '512 pcs' },
      { label: '10:00 AM', value: 545, formatted: '545 pcs' },
      { label: '11:00 AM', value: 560, formatted: '560 pcs' },
      { label: '12:00 PM', value: 555, formatted: '555 pcs' },
      { label: '01:00 PM', value: 570, formatted: '570 pcs' },
      { label: '02:00 PM', value: 567, formatted: '567 pcs' },
    ],
    '24H': [
      { label: '00:00', value: 1200, formatted: '1,200 pcs' },
      { label: '04:00', value: 2400, formatted: '2,400 pcs' },
      { label: '08:00', value: 3100, formatted: '3,100 pcs' },
      { label: '12:00', value: 3800, formatted: '3,800 pcs' },
      { label: '16:00', value: 4200, formatted: '4,200 pcs' },
      { label: 'Now', value: 4731, formatted: '4,731 pcs' },
    ],
    '7D': [
      { label: 'Thu', value: 4200, formatted: '4,200' },
      { label: 'Fri', value: 4350, formatted: '4,350' },
      { label: 'Sat', value: 4420, formatted: '4,420' },
      { label: 'Sun', value: 4380, formatted: '4,380' },
      { label: 'Mon', value: 4500, formatted: '4,500' },
      { label: 'Tue', value: 4620, formatted: '4,620' },
      { label: 'Today', value: 4731, formatted: '4,731' },
    ],
    '30D': [
      { label: 'W1', value: 28500, formatted: '28.5k' },
      { label: 'W2', value: 29200, formatted: '29.2k' },
      { label: 'W3', value: 31000, formatted: '31.0k' },
      { label: 'W4', value: 30500, formatted: '30.5k' },
      { label: 'Cur', value: 31400, formatted: '31.4k' },
    ],
  };

  const goodPartsTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 531, formatted: '531 pcs' },
      { label: '12:20 PM', value: 543, formatted: '543 pcs' },
      { label: '12:30 PM', value: 551, formatted: '551 pcs' },
      { label: '12:40 PM', value: 549, formatted: '549 pcs' },
      { label: '12:50 PM', value: 555, formatted: '555 pcs' },
      { label: '01:00 PM', value: 557, formatted: '557 pcs' },
    ],
    '8H': [
      { label: '08:00 AM', value: 471, formatted: '471 pcs' },
      { label: '09:00 AM', value: 502, formatted: '502 pcs' },
      { label: '10:00 AM', value: 535, formatted: '535 pcs' },
      { label: '11:00 AM', value: 550, formatted: '550 pcs' },
      { label: '12:00 PM', value: 545, formatted: '545 pcs' },
      { label: '01:00 PM', value: 560, formatted: '560 pcs' },
      { label: '02:00 PM', value: 557, formatted: '557 pcs' },
    ],
    '24H': [
      { label: '00:00', value: 1178, formatted: '1,178 pcs' },
      { label: '04:00', value: 2355, formatted: '2,355 pcs' },
      { label: '08:00', value: 3042, formatted: '3,042 pcs' },
      { label: '12:00', value: 3730, formatted: '3,730 pcs' },
      { label: '16:00', value: 4120, formatted: '4,120 pcs' },
      { label: 'Now', value: 4642, formatted: '4,642 pcs' },
    ],
    '7D': [
      { label: 'Thu', value: 4120, formatted: '4,120' },
      { label: 'Fri', value: 4270, formatted: '4,270' },
      { label: 'Sat', value: 4340, formatted: '4,340' },
      { label: 'Sun', value: 4300, formatted: '4,300' },
      { label: 'Mon', value: 4415, formatted: '4,415' },
      { label: 'Tue', value: 4530, formatted: '4,530' },
      { label: 'Today', value: 4642, formatted: '4,642' },
    ],
    '30D': [
      { label: 'W1', value: 27960, formatted: '28.0k' },
      { label: 'W2', value: 28650, formatted: '28.7k' },
      { label: 'W3', value: 30410, formatted: '30.4k' },
      { label: 'W4', value: 29920, formatted: '29.9k' },
      { label: 'Cur', value: 30800, formatted: '30.8k' },
    ],
  };

  const cycleTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 43.1, formatted: '43.1s' },
      { label: '12:20 PM', value: 42.8, formatted: '42.8s' },
      { label: '12:30 PM', value: 42.4, formatted: '42.4s' },
      { label: '12:40 PM', value: 42.0, formatted: '42.0s' },
      { label: '12:50 PM', value: 41.9, formatted: '41.9s' },
      { label: '01:00 PM', value: 42.0, formatted: '42.0s' },
    ],
    '8H': [
      { label: '08:00 AM', value: 44.5, formatted: '44.5s' },
      { label: '09:00 AM', value: 43.8, formatted: '43.8s' },
      { label: '10:00 AM', value: 42.9, formatted: '42.9s' },
      { label: '11:00 AM', value: 42.2, formatted: '42.2s' },
      { label: '12:00 PM', value: 42.0, formatted: '42.0s' },
      { label: '01:00 PM', value: 41.8, formatted: '41.8s' },
      { label: '02:00 PM', value: 42.0, formatted: '42.0s' },
    ],
    '24H': [
      { label: '00:00', value: 45.2, formatted: '45.2s' },
      { label: '04:00', value: 44.1, formatted: '44.1s' },
      { label: '08:00', value: 43.5, formatted: '43.5s' },
      { label: '12:00', value: 42.1, formatted: '42.1s' },
      { label: '16:00', value: 42.0, formatted: '42.0s' },
      { label: 'Now', value: 42.0, formatted: '42.0s' },
    ],
    '7D': [
      { label: 'Thu', value: 43.8, formatted: '43.8s' },
      { label: 'Fri', value: 43.1, formatted: '43.1s' },
      { label: 'Sat', value: 42.9, formatted: '42.9s' },
      { label: 'Sun', value: 42.5, formatted: '42.5s' },
      { label: 'Mon', value: 42.2, formatted: '42.2s' },
      { label: 'Tue', value: 42.0, formatted: '42.0s' },
      { label: 'Today', value: 42.0, formatted: '42.0s' },
    ],
    '30D': [
      { label: 'W1', value: 44.2, formatted: '44.2s' },
      { label: 'W2', value: 43.6, formatted: '43.6s' },
      { label: 'W3', value: 42.8, formatted: '42.8s' },
      { label: 'W4', value: 42.2, formatted: '42.2s' },
      { label: 'Cur', value: 42.0, formatted: '42.0s' },
    ],
  };

  return (
    <div className="prod-container">
      {/* Header */}
      <div className="prod-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="prod-title" style={{ fontSize: '22px', fontWeight: 800 }}>Production Cadence</h1>
            <span className="live-badge-mint">
              <span className="pulse-dot" /> Live MES Stream
            </span>
          </div>
          <p className="prod-subtitle" style={{ marginTop: '2px', fontSize: '13px' }}>
            Part, material, NC program, operation, tool, cycle time, good/reject telemetry
          </p>
        </div>

        <div className="time-filter-pill-group">
          {(['1H', '8H', '24H', '7D', '30D'] as TimeFrameKey[]).map((tf) => (
            <button
              key={tf}
              type="button"
              className={`time-filter-btn ${prodTimeFrame === tf ? 'active' : ''}`}
              onClick={() => setProdTimeFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Top Enterprise KPI Cards */}
      <div className="overview-kpi-row-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '18px' }}>
        {/* Card 1: Total Parts Produced */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">▲ +12% vs Target</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">4,731</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Parts</span>
          </div>
          <div className="kpi-label">Total Parts Produced</div>
          <div className="kpi-sub-line font-sm">
            <span>Shift Target: <strong>4,500</strong></span>
            <span>Cadence: <strong>567 pcs/hr</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={partsProducedTimeFrames[prodTimeFrame]}
              timeFrameData={partsProducedTimeFrames}
              activeTimeFrame={prodTimeFrame}
              onTimeFrameChange={setProdTimeFrame}
              color="#16A34A"
              width={180}
              height={26}
              unit="pcs"
            />
          </div>
        </div>

        {/* Card 2: Good Parts */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">98.1% FPY</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">4,642</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Good</span>
          </div>
          <div className="kpi-label">First-Pass Yield (Approved)</div>
          <div className="kpi-sub-line font-sm">
            <span><span className="dot-status green pulse" /> Zero Escapes to Assembly</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={goodPartsTimeFrames[prodTimeFrame]}
              timeFrameData={goodPartsTimeFrames}
              activeTimeFrame={prodTimeFrame}
              onTimeFrameChange={setProdTimeFrame}
              color="#0D9488"
              width={180}
              height={26}
              unit="good"
            />
          </div>
        </div>

        {/* Card 3: Rejected Parts */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square red">
              <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span className="kpi-badge-pill red">1.9% Scrap</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular" style={{ color: '#DC2626' }}>89</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Rejects</span>
          </div>
          <div className="kpi-label">Scrap & Defect Interceptions</div>
          <div className="kpi-sub-line font-sm">
            <span>Edge Vision automated reject diverter active</span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>100% Intercepted</span>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>Review Log ↓</span>
          </div>
        </div>

        {/* Card 4: Avg Cycle Time */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">▼ -6% Cycle</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">42</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>sec / part</span>
          </div>
          <div className="kpi-label">Avg. Machining Cycle Time</div>
          <div className="kpi-sub-line font-sm">
            <span>Target: <strong>40.0s</strong></span>
            <span>Feed Rate: <strong>3,200 mm/min</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={cycleTimeFrames[prodTimeFrame]}
              timeFrameData={cycleTimeFrames}
              activeTimeFrame={prodTimeFrame}
              onTimeFrameChange={setProdTimeFrame}
              color="#2563EB"
              width={180}
              height={26}
              unit="s"
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="prod-filters-bar">
        <div className="prod-filter-group-left">
          {/* Date Range */}
          <div className="prod-date-picker-btn">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>01 Oct 2026 - 01 Oct 2026</span>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </div>

          {/* Machine Dropdown */}
          <div className="prod-select-wrap">
            <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)}>
              <option value="all">All Machines (12)</option>
              <option value="CNC-01">CNC-01 (DMG MORI)</option>
              <option value="CNC-02">CNC-02 (HAAS VF-4)</option>
              <option value="CNC-03">CNC-03 (Mazak)</option>
              <option value="CNC-04">CNC-04 (Makino)</option>
              <option value="CNC-05">CNC-05 (Doosan)</option>
              <option value="CNC-06">CNC-06 (Hermle)</option>
              <option value="CNC-07">CNC-07 (Okuma)</option>
              <option value="CNC-08">CNC-08 (Citizen Cincom)</option>
              <option value="CNC-09">CNC-09 (Haas VF-4SS)</option>
              <option value="CNC-10">CNC-10 (Mazak Integrex)</option>
              <option value="CNC-11">CNC-11 (FPT Dinomax)</option>
              <option value="CNC-12">CNC-12 (GF Mikron)</option>
            </select>
          </div>

          {/* Part Dropdown */}
          <div className="prod-select-wrap">
            <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)}>
              <option value="all">All Parts (12)</option>
              <option value="Aerospace Mounting Flange">Aerospace Mounting Flange</option>
              <option value="Transmission Drive Shaft">Transmission Drive Shaft</option>
              <option value="Hydraulic Manifold Block">Hydraulic Manifold Block</option>
              <option value="Turbine Impeller Blade">Turbine Impeller Blade</option>
              <option value="Differential Pinion Gear">Differential Pinion Gear</option>
              <option value="Injection Mold Cavity">Injection Mold Cavity</option>
              <option value="Flywheel Hub">Flywheel Hub</option>
              <option value="Miniature Medical Valve Spool">Miniature Medical Valve Spool</option>
              <option value="EV Gearbox Transmission Case">EV Gearbox Transmission Case</option>
              <option value="Engine Crankshaft Journal">Engine Crankshaft Journal</option>
              <option value="Aircraft Structural Spar Beam">Aircraft Structural Spar Beam</option>
              <option value="Robotic Cell Mounting Base">Robotic Cell Mounting Base</option>
            </select>
          </div>

          {/* Material Dropdown */}
          <div className="prod-select-wrap">
            <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
              <option value="all">All Materials (12)</option>
              <option value="AL 7075-T6">AL 7075-T6</option>
              <option value="Alloy Steel 4140">Alloy Steel 4140</option>
              <option value="SS 316L">SS 316L</option>
              <option value="Titanium Grade 5">Titanium Grade 5</option>
              <option value="20MnCr5">20MnCr5</option>
              <option value="Tool Steel H13">Tool Steel H13</option>
              <option value="Forged Steel 42CrMo4">Forged Steel 42CrMo4</option>
              <option value="SS 316LVM / Ti-ELI">SS 316LVM / Ti-ELI</option>
              <option value="Cast Aluminium A380">Cast Aluminium A380</option>
              <option value="Forged Alloy Steel 4340">Forged Alloy Steel 4340</option>
              <option value="Al-Li 2099 / AL 7050">Al-Li 2099 / AL 7050</option>
              <option value="Ductile Iron GGG-40">Ductile Iron GGG-40</option>
            </select>
          </div>

          {/* Operations Dropdown */}
          <div className="prod-select-wrap">
            <select value={selectedOperation} onChange={(e) => setSelectedOperation(e.target.value)}>
              <option value="all">All Operations (12)</option>
              <option value="5-Axis Finishing">5-Axis Finishing</option>
              <option value="Turning & Threading">Turning & Threading</option>
              <option value="Drilling & Tapping">Drilling & Tapping</option>
              <option value="5-Axis Profiling">5-Axis Profiling</option>
              <option value="Turning">Turning</option>
              <option value="Milling">Milling</option>
              <option value="Rough Turning">Rough Turning</option>
              <option value="Swiss Micro-Turning">Swiss Micro-Turning</option>
              <option value="4-Axis Rotary Index Milling">4-Axis Rotary Index Milling</option>
              <option value="B-Axis Mill-Turn">B-Axis Mill-Turn</option>
              <option value="Heavy Gantry Profiling">Heavy Gantry Profiling</option>
              <option value="High-Speed Finish Milling">High-Speed Finish Milling</option>
            </select>
          </div>
        </div>

        <div className="prod-filter-group-right">
          {/* Search Box */}
          <div className="prod-search-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search part, material, NC program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="prod-search-clear" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="prod-export-btn-container">
            <button className="prod-export-btn" onClick={() => setIsExportOpen(!isExportOpen)}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isExportOpen && (
              <div className="prod-export-menu">
                <button onClick={() => handleExport('csv')}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="16" y2="17" />
                  </svg>
                  Export as CSV (.csv)
                </button>
                <button onClick={() => handleExport('xlsx')}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  Export as Excel (.xlsx)
                </button>
                <button onClick={() => handleExport('pdf')}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Shift Production PDF Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {exportNotice && <div className="prod-toast-notice">{exportNotice}</div>}

      {/* Middle Section: Production Records */}
      <div className="prod-records-card">
        <div className="prod-records-header">
          <div className="prod-records-title-group">
            <div className="prod-records-icon-box">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h2 className="prod-records-heading">Production Records</h2>
              <p className="prod-records-desc">Part, material, NC program, operation, tool, cycle time, good/reject details</p>
            </div>
          </div>

          <div className="prod-view-toggle-btns">
            <button
              className={`prod-toggle-pill ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
              </svg>
              Table View
            </button>
            <button
              className={`prod-toggle-pill ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Timeline View
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="prod-table-responsive">
            <table className="prod-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>
                    <input
                      type="checkbox"
                      className="prod-checkbox"
                      checked={filteredRecords.length > 0 && filteredRecords.every((r) => selectedRows[r.id])}
                      onChange={toggleAllRows}
                    />
                  </th>
                  <th>Time</th>
                  <th>Machine</th>
                  <th>Part Name / End Product</th>
                  <th>Material (Grade)</th>
                  <th>NC Program</th>
                  <th>Operation</th>
                  <th>Tool</th>
                  <th>Cycle Time ⬍</th>
                  <th>Good</th>
                  <th>Reject</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((row) => {
                  const isSelected = selectedRecordId === row.id;
                  const isChecked = !!selectedRows[row.id];

                  return (
                    <tr
                      key={row.id}
                      className={`prod-tr ${isSelected ? 'row-selected' : ''}`}
                      onClick={() => setSelectedRecordId(row.id)}
                    >
                      <td onClick={(e) => toggleRow(row.id, e)}>
                        <input
                          type="checkbox"
                          className="prod-checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                        />
                      </td>
                      <td className="prod-cell-time">{row.time}</td>
                      <td>
                        <button
                          className="prod-machine-badge-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMachineDetail(row.machineId);
                          }}
                          title={`Open ${row.machineId} Live Diagnostics`}
                        >
                          {row.machineId}
                        </button>
                      </td>
                      <td>
                        <div className="prod-part-name-cell">
                          <div className="prod-part-thumb-wrap">
                            <Image
                              src={row.thumbImg}
                              alt={row.partName}
                              width={26}
                              height={26}
                              className="prod-part-thumb"
                            />
                          </div>
                          <span className="prod-part-title-text">{row.partName}</span>
                        </div>
                      </td>
                      <td className="prod-cell-grade">{row.partGrade}</td>
                      <td className="prod-cell-nc">
                        <code>{row.ncProgram}</code>
                      </td>
                      <td className="prod-cell-operation">{row.operation}</td>
                      <td>
                        <span className="prod-tool-badge">{row.tool}</span>
                      </td>
                      <td className="prod-cell-cycletime">{row.cycleTime}s</td>
                      <td className="prod-cell-good">{row.good}</td>
                      <td className={`prod-cell-reject ${row.reject > 0 ? 'has-reject' : ''}`}>
                        {row.reject}
                      </td>
                      <td>
                        <span
                          className={`prod-status-tag ${
                            row.status === 'Running'
                              ? 'status-running'
                              : row.status === 'Needs Attention'
                              ? 'status-attention'
                              : 'status-idle'
                          }`}
                        >
                          <span className="prod-status-dot" />
                          {row.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="prod-actions-wrap">
                          <button
                            className="prod-view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewModalRecord(row);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="prod-more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecordId(row.id);
                            }}
                            title="More details"
                          >
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Timeline View */
          <div className="prod-timeline-container">
            <div className="prod-timeline-grid-header">
              <div className="prod-tl-col-machine">Machine</div>
              <div className="prod-tl-col-part">Part & Current Cycle</div>
              <div className="prod-tl-col-progress">Live Shift Timeline (06:00 - 14:00)</div>
              <div className="prod-tl-col-yield">Yield %</div>
            </div>

            <div className="prod-timeline-list">
              {filteredRecords.map((r) => (
                <div
                  key={r.id}
                  className={`prod-timeline-item ${selectedRecordId === r.id ? 'active-tl' : ''}`}
                  onClick={() => setSelectedRecordId(r.id)}
                >
                  <div className="prod-tl-machine-info">
                    <span className="prod-tl-machine-name">{r.machineId}</span>
                    <span className="prod-tl-machine-brand">{r.brand}</span>
                  </div>

                  <div className="prod-tl-part-info">
                    <div className="prod-tl-part-row">
                      <Image src={r.thumbImg} alt={r.partName} width={20} height={20} className="prod-tl-thumb" />
                      <strong>{r.partName}</strong>
                    </div>
                    <span className="prod-tl-op">{r.operation} ({r.cycleTime}s cycle)</span>
                  </div>

                  <div className="prod-tl-bar-track">
                    <div className="prod-tl-segment op1" style={{ width: '30%' }} title="Rough Milling: 30%" />
                    <div className="prod-tl-segment op2" style={{ width: '25%' }} title="Drilling & Tapping: 25%" />
                    <div className="prod-tl-segment op3" style={{ width: '38%' }} title="5-Axis Finishing: 38%" />
                    <div className="prod-tl-marker-now" style={{ left: '93%' }} title="Current Time Marker" />
                  </div>

                  <div className="prod-tl-yield-box">
                    <span className="prod-tl-yield-num">
                      {((r.good / (r.good + r.reject)) * 100).toFixed(1)}%
                    </span>
                    <span className="prod-tl-units">{r.good} / {r.good + r.reject}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Split Cards */}
      <div className="prod-bottom-row">
        {/* Left Card (~75% width): Selected Machine Detail */}
        <div className="prod-detail-card">
          <div className="prod-detail-header">
            <div className="prod-detail-machine-badge">
              <span className="prod-status-dot-pulse" />
              <span className="prod-machine-title">{selectedRecord.machineId}</span>
              <span className="prod-brand-tag">{selectedRecord.brand}</span>
              <span className="prod-running-pill">{selectedRecord.status}</span>
            </div>

            <div className="prod-detail-nav-tabs">
              <button
                className={`prod-tab-pill ${activeBottomTab === 'production' ? 'active' : ''}`}
                onClick={() => setActiveBottomTab('production')}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Production Details
              </button>
              <button
                className={`prod-tab-pill ${activeBottomTab === 'material' ? 'active' : ''}`}
                onClick={() => setActiveBottomTab('material')}
              >
                Material Details
              </button>
              <button
                className={`prod-tab-pill ${activeBottomTab === 'tool' ? 'active' : ''}`}
                onClick={() => setActiveBottomTab('tool')}
              >
                Tool Details
              </button>
              <button
                className={`prod-tab-pill ${activeBottomTab === 'quality' ? 'active' : ''}`}
                onClick={() => setActiveBottomTab('quality')}
              >
                Quality Details
              </button>
              <button
                className={`prod-tab-pill ${activeBottomTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveBottomTab('timeline')}
              >
                Timeline
              </button>
              <button
                className="prod-open-diag-btn"
                onClick={() => openMachineDetail(selectedRecord.machineId)}
                title="Open Dedicated Machine Diagnostic Page"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>
          </div>

          <div className="prod-detail-body">
            {activeBottomTab === 'production' && (
              <div className="prod-production-tab-content">
                {/* Left Part Showcase */}
                <div className="prod-part-showcase-col">
                  <div className="prod-3d-model-wrap">
                    <Image
                      src={selectedRecord.id === 'rec-01' ? '/prod_flange_3d.png' : selectedRecord.thumbImg}
                      alt={selectedRecord.partName}
                      width={100}
                      height={90}
                      className="prod-3d-render"
                    />
                  </div>
                  <div className="prod-part-info-block">
                    <h3 className="prod-part-title">{selectedRecord.partName}</h3>
                    <p className="prod-part-sub">{selectedRecord.operation}</p>

                    <div className="prod-meta-grid-2col">
                      <div>
                        <span className="prod-meta-label">Material Grade</span>
                        <span className="prod-meta-value">{selectedRecord.partGrade}</span>
                      </div>
                      <div>
                        <span className="prod-meta-label">Heat No.</span>
                        <span className="prod-meta-value">{selectedRecord.heatNo}</span>
                      </div>
                      <div>
                        <span className="prod-meta-label">NC Program</span>
                        <span className="prod-meta-value">
                          <code>{selectedRecord.ncProgram}</code>
                        </span>
                      </div>
                      <div>
                        <span className="prod-meta-label">Current Operation</span>
                        <span className="prod-meta-value">{selectedRecord.operation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right KPIs & Progress */}
                <div className="prod-metrics-showcase-col">
                  <div className="prod-mini-kpis-row">
                    <div className="prod-mini-kpi">
                      <div className="prod-mini-icon-circle purple">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <span className="prod-mini-label">Cycle Time</span>
                        <span className="prod-mini-val">{selectedRecord.cycleTime}s</span>
                      </div>
                    </div>

                    <div className="prod-mini-kpi">
                      <div className="prod-mini-icon-circle mint">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <div>
                        <span className="prod-mini-label">Parts Produced</span>
                        <span className="prod-mini-val">{selectedRecord.totalTarget}</span>
                      </div>
                    </div>

                    <div className="prod-mini-kpi">
                      <div className="prod-mini-icon-circle mint">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <polyline points="9 12 11 14 15 10" />
                        </svg>
                      </div>
                      <div>
                        <span className="prod-mini-label">Good Parts</span>
                        <span className="prod-mini-val">{selectedRecord.good}</span>
                      </div>
                    </div>

                    <div className="prod-mini-kpi">
                      <div className="prod-mini-icon-circle coral">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                        </svg>
                      </div>
                      <div>
                        <span className="prod-mini-label">Rejected</span>
                        <span className="prod-mini-val coral">{selectedRecord.reject}</span>
                      </div>
                    </div>
                  </div>

                  {/* Production Progress Bar */}
                  <div className="prod-progress-block">
                    <div className="prod-progress-header-row">
                      <span className="prod-prog-title">Production Progress</span>
                      <span className="prod-prog-fraction">
                        {selectedRecord.good} / {selectedRecord.totalTarget} ({selectedRecord.progressPercent}%)
                      </span>
                    </div>
                    <div className="prod-progress-large-track">
                      <div
                        className="prod-progress-large-fill"
                        style={{ width: `${selectedRecord.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Meta 3 Columns */}
                  <div className="prod-meta-bottom-3col">
                    <div>
                      <span className="prod-meta-bottom-label">Current Part ID</span>
                      <span className="prod-meta-bottom-value">{selectedRecord.currentPartId}</span>
                    </div>
                    <div>
                      <span className="prod-meta-bottom-label">Started At</span>
                      <span className="prod-meta-bottom-value">{selectedRecord.startedAt}</span>
                    </div>
                    <div>
                      <span className="prod-meta-bottom-label">Estimated Completion</span>
                      <span className="prod-meta-bottom-value">{selectedRecord.estCompletion}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeBottomTab === 'material' && (
              <div className="prod-extra-tab-grid">
                <div className="prod-extra-card">
                  <h4>Material Specifications</h4>
                  <div className="prod-spec-row">
                    <span>Grade & Specification:</span>
                    <strong>{selectedRecord.partGrade} ({selectedRecord.materialDetails.spec})</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Approved Supplier:</span>
                    <strong>{selectedRecord.materialDetails.supplier}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Raw Stock Billet Size:</span>
                    <strong>{selectedRecord.materialDetails.dimensions}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Tensile Strength:</span>
                    <strong>{selectedRecord.materialDetails.tensileStrength}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Material Hardness:</span>
                    <strong>{selectedRecord.materialDetails.hardness}</strong>
                  </div>
                </div>
                <div className="prod-extra-card">
                  <h4>Traceability & MTC Link</h4>
                  <div className="prod-spec-row">
                    <span>Heat Number:</span>
                    <strong>{selectedRecord.heatNo}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Lot Batch Number:</span>
                    <strong>{selectedRecord.lotNo}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Mill Test Certificate:</span>
                    <span className="prod-link-badge">MTC-{selectedRecord.heatNo}.pdf (Verified)</span>
                  </div>
                  <div className="prod-spec-row">
                    <span>Ultrasonic Non-Destructive Test:</span>
                    <strong style={{ color: 'var(--color-primary-500, #10b981)' }}>Passed (Class AA Defect Free)</strong>
                  </div>
                </div>
              </div>
            )}

            {activeBottomTab === 'tool' && (
              <div className="prod-extra-tab-grid">
                <div className="prod-extra-card">
                  <h4>Tooling Configuration</h4>
                  <div className="prod-spec-row">
                    <span>Active Tool:</span>
                    <strong>{selectedRecord.toolDetails.toolCode}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Tool Geometry & Coating:</span>
                    <strong>{selectedRecord.toolDetails.description}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Spindle Speed:</span>
                    <strong>{selectedRecord.toolDetails.spindleSpeed}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Feed Rate:</span>
                    <strong>{selectedRecord.toolDetails.feedRate}</strong>
                  </div>
                </div>
                <div className="prod-extra-card">
                  <h4>Tool Health & Diagnostics</h4>
                  <div className="prod-spec-row">
                    <span>Flank Wear Level:</span>
                    <strong>{selectedRecord.toolDetails.wearLevel}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Estimated Remaining Tool Life:</span>
                    <strong style={{ color: 'var(--color-primary-500, #10b981)' }}>{selectedRecord.toolDetails.remainingLife}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Internal Coolant Delivery:</span>
                    <strong>{selectedRecord.toolDetails.coolantPressure}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Vibration / Chatter Level:</span>
                    <strong>0.38 mm/s RMS (Nominal)</strong>
                  </div>
                </div>
              </div>
            )}

            {activeBottomTab === 'quality' && (
              <div className="prod-extra-tab-grid">
                <div className="prod-extra-card">
                  <h4>In-Line Metrology & Tolerances</h4>
                  <div className="prod-spec-row">
                    <span>Surface Roughness:</span>
                    <strong>{selectedRecord.qualityDetails.surfaceFinish}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Critical Bore Tolerance:</span>
                    <strong>{selectedRecord.qualityDetails.boreTolerance}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Concentricity & Runout:</span>
                    <strong>{selectedRecord.qualityDetails.concentricity}</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Batch Defect Percentage:</span>
                    <strong>{selectedRecord.qualityDetails.defectRate}</strong>
                  </div>
                </div>
                <div className="prod-extra-card">
                  <h4>Optical Vision & Camera Check</h4>
                  <div className="prod-spec-row">
                    <span>Vision Station Status:</span>
                    <strong style={{ color: 'var(--color-primary-500, #10b981)' }}>Connected & Online</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Automated Inspection Score:</span>
                    <strong>99.4% (Threshold: 95.0%)</strong>
                  </div>
                  <div className="prod-spec-row">
                    <span>Defect Classification:</span>
                    <span>No Burrs / No Chatter Marks Detected</span>
                  </div>
                  <div className="prod-spec-row">
                    <span>AI Confidence:</span>
                    <strong>99.8%</strong>
                  </div>
                </div>
              </div>
            )}

            {activeBottomTab === 'timeline' && (
              <div className="prod-timeline-steps-wrap">
                <div className="prod-timeline-steps-track">
                  {selectedRecord.timelineSteps.map((step, idx) => (
                    <div key={idx} className={`prod-step-card ${step.status}`}>
                      <div className="prod-step-header">
                        <span className="prod-step-num">Step {idx + 1}</span>
                        <span className="prod-step-duration">{step.duration}</span>
                      </div>
                      <div className="prod-step-title">{step.step}</div>
                      <div className="prod-step-tool">Tool: {step.tool}</div>
                      <div className="prod-step-status-tag">{step.status.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Card (~25% width): Part Preview */}
        <div className="prod-preview-card">
          <div className="prod-preview-header">
            <h3 className="prod-preview-title">Part Preview</h3>
            <div className="prod-preview-icons">
              <button
                className="prod-preview-icon-btn"
                onClick={() => setIsPartPreviewModalOpen(true)}
                title="Fullscreen Preview"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>
          </div>

          <div className="prod-preview-img-wrap" onClick={() => setIsPartPreviewModalOpen(true)}>
            <Image
              src={selectedRecord.previewImg}
              alt={selectedRecord.partName}
              width={340}
              height={230}
              className="prod-preview-img"
            />
          </div>

          <div className="prod-preview-caption">
            <h4 className="prod-caption-title">{selectedRecord.partName}</h4>
            <span className="prod-caption-sub">{selectedRecord.partGrade}</span>
          </div>
        </div>
      </div>

      {/* Production Record Detail Modal */}
      {viewModalRecord && (
        <div className="prod-modal-backdrop" onClick={() => setViewModalRecord(null)}>
          <div className="prod-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prod-modal-header">
              <div className="prod-modal-title-group">
                <span className="prod-modal-badge">{viewModalRecord.machineId}</span>
                <h2>{viewModalRecord.partName}</h2>
              </div>
              <button className="prod-modal-close" onClick={() => setViewModalRecord(null)}>
                ✕
              </button>
            </div>

            <div className="prod-modal-body">
              <div className="prod-modal-grid">
                <div className="prod-modal-img-col">
                  <Image
                    src={viewModalRecord.previewImg}
                    alt={viewModalRecord.partName}
                    width={320}
                    height={220}
                    className="prod-modal-img"
                  />
                  <div className="prod-modal-status-pill">
                    Status: <strong>{viewModalRecord.status}</strong>
                  </div>
                </div>

                <div className="prod-modal-info-col">
                  <div className="prod-modal-info-section">
                    <h3>Operational Parameters</h3>
                    <div className="prod-modal-row">
                      <span>NC Program:</span>
                      <code>{viewModalRecord.ncProgram}</code>
                    </div>
                    <div className="prod-modal-row">
                      <span>Active Operation:</span>
                      <strong>{viewModalRecord.operation}</strong>
                    </div>
                    <div className="prod-modal-row">
                      <span>Cutting Tool:</span>
                      <strong>{viewModalRecord.toolDetails.toolCode}</strong>
                    </div>
                    <div className="prod-modal-row">
                      <span>Cycle Time:</span>
                      <strong>{viewModalRecord.cycleTime} seconds</strong>
                    </div>
                    <div className="prod-modal-row">
                      <span>Spindle & Feed:</span>
                      <strong>{viewModalRecord.toolDetails.spindleSpeed} @ {viewModalRecord.toolDetails.feedRate}</strong>
                    </div>
                  </div>

                  <div className="prod-modal-info-section">
                    <h3>Production Counts & Yield</h3>
                    <div className="prod-modal-row">
                      <span>Total Run Target:</span>
                      <strong>{viewModalRecord.totalTarget} units</strong>
                    </div>
                    <div className="prod-modal-row">
                      <span>Good Parts Passed:</span>
                      <strong style={{ color: 'var(--color-primary-500, #10b981)' }}>{viewModalRecord.good}</strong>
                    </div>
                    <div className="prod-modal-row">
                      <span>Rejection Count:</span>
                      <strong style={{ color: viewModalRecord.reject > 0 ? '#ef4444' : 'inherit' }}>
                        {viewModalRecord.reject}
                      </strong>
                    </div>
                    <div className="prod-modal-row">
                      <span>First Pass Yield:</span>
                      <strong>{((viewModalRecord.good / (viewModalRecord.good + viewModalRecord.reject)) * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="prod-modal-footer">
              <button
                className="prod-modal-btn-secondary"
                onClick={() => {
                  openMachineDetail(viewModalRecord.machineId);
                  setViewModalRecord(null);
                }}
              >
                Go to {viewModalRecord.machineId} Live Diagnostics
              </button>
              <button className="prod-modal-btn-primary" onClick={() => setViewModalRecord(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Part Preview Modal */}
      {isPartPreviewModalOpen && (
        <div className="prod-modal-backdrop" onClick={() => setIsPartPreviewModalOpen(false)}>
          <div className="prod-modal-dialog part-preview-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prod-modal-header">
              <div>
                <h2>{selectedRecord.partName}</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {selectedRecord.partGrade} • Machined on {selectedRecord.machineId} ({selectedRecord.brand})
                </p>
              </div>
              <button className="prod-modal-close" onClick={() => setIsPartPreviewModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="prod-preview-fullscreen-wrap">
              <Image
                src={selectedRecord.previewImg}
                alt={selectedRecord.partName}
                width={800}
                height={550}
                className="prod-fullscreen-img"
              />
            </div>
            <div className="prod-modal-footer">
              <button className="prod-modal-btn-primary" onClick={() => setIsPartPreviewModalOpen(false)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
