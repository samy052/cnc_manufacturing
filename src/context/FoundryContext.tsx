'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Machine, TagLogItem, SectionType, ChatMessage, SafetyZone, PredictedEvent, Language, PartEvent } from '@/types';
import { translations, Translations } from '@/i18n/translations';

interface FoundryContextType {
  // Navigation & Theme & Language
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Simulation Controls
  isLive: boolean;
  toggleLive: () => void;
  clockTime: string;

  // Telemetry & Machines
  machines: Machine[];
  filteredMachines: Machine[];
  machineFilter: 'all' | 'warning';
  setMachineFilter: (filter: 'all' | 'warning') => void;
  selectedMachineId: string | null;
  setSelectedMachineId: (id: string | null) => void;
  openMachineDetail: (machineId: string) => void;
  healthyMachinesCount: number;
  warningMachinesCount: number;
  oee: number;
  oeeDelta: number;
  machinesOnline: number;
  activeAlerts: number;
  partsInspected: number;
  incompleteParts: number;
  lastPartEvent: PartEvent | null;
  tagLogs: TagLogItem[];

  // Computer Vision
  partCounter: number;
  isInspectingPass: boolean;
  inspectConfidence: number;
  boxPos: { left: number; top: number };
  recentInspections: boolean[];
  defectRate: number;
  safetyZones: SafetyZone[];

  // Predictive Maintenance
  wearPercent: number;
  anomalyHist: number[];
  lastAnomaly: number;
  predictedEvents: PredictedEvent[];

  // Chat
  chatMessages: ChatMessage[];
  quickChips: string[];
  sendMessage: (query: string) => void;
  clearChat: () => void;
}

const FoundryContext = createContext<FoundryContextType | null>(null);

const INITIAL_MACHINES: Machine[] = [
  {
    id: 'CNC-01',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: '5-Axis VMC Machining Center',
    line: 'Line 1 · Cell A',
    bay: 'Aero Precision Bay',
    model: 'DMG MORI DMU 50 5-Axis',
    imageUrl: '/machines/cnc_vmc_5axis.jpg',
    workpiece: 'Motor Housing',
    scenario: 'Tool wear / cutting resistance',
    signalsEvidence: 'Spindle load rises 40% → 65% while RPM/feed remain stable',
    recommendedAction: 'Check Tool T05; compare with tool-age baseline',
    useCase: 'Anomaly Detection',
    currentTask: '5-Axis High-Speed Finishing',
    plc: {
      id: 'PLC-L1-01',
      controllerModel: 'Siemens Sinumerik 840D sl',
      cycleTime: 34.2,
      cycleTarget: 35.0,
      program: 'PRG-O1042_MOTOR_HOUSING.nc',
      step: 'Step 04/12 (High Speed Finishing)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Hydraulic Clamped (CH1 OK)',
        coolant: 'High-Pressure 20 Bar (ON)',
        doorInterlock: 'Safety Interlock Engaged (Closed)',
        toolChanger: 'Tool Pocket #08 Active (Carbide Endmill)',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L1-GW',
      tagCount: 2480,
      sampleRateMs: 250,
      feedRate: 1450,
      powerKw: 14.2,
      coolantPressureBar: 19.4,
      axisLoadPercent: { x: 48, y: 52, z: 61 },
    },
    metrics: { spindle: 4420, cycle: 34.2, tags: 2480, temp: 38, vib: 0.4, partsToday: 420 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-02',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'Heavy Duty Horizontal Lathe',
    line: 'Line 1 · Cell A',
    bay: 'Aero Precision Bay',
    model: 'Mazak Quick Turn 250MSY',
    imageUrl: '/machines/cnc_turning_lathe.jpg',
    workpiece: 'Transmission Shaft',
    scenario: 'Tool wear',
    signalsEvidence: 'Cycle time rises 38.5 → 43 sec; load and tool age increase',
    recommendedAction: 'Inspect/replace T08 if trend continues',
    useCase: 'Performance + Tool Health',
    currentTask: 'Precision OD Turning & Threading',
    plc: {
      id: 'PLC-L1-02',
      controllerModel: 'Mazatrol SmoothG / Fanuc 31i',
      cycleTime: 38.5,
      cycleTarget: 40.0,
      program: 'PRG-O1088_TRANS_SHAFT.nc',
      step: 'Step 06/10 (Precision OD Turning)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Collet Chuck Clamped (12 Bar)',
        coolant: 'Flood Coolant Active',
        doorInterlock: 'Safety Guard Closed',
        toolChanger: 'Turret Station #03 Locked',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L1-GW',
      tagCount: 2390,
      sampleRateMs: 250,
      feedRate: 1100,
      powerKw: 18.5,
      coolantPressureBar: 18.0,
      axisLoadPercent: { x: 55, y: 38, z: 70 },
    },
    metrics: { spindle: 3600, cycle: 38.5, tags: 2390, temp: 40, vib: 0.5, partsToday: 385 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-03',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'High Precision Drill & Tap Center',
    line: 'Line 1 · Cell B',
    bay: 'Aero Precision Bay',
    model: 'Fanuc RoboDrill α-D21LiB5',
    imageUrl: '/machines/cnc_drill_tap.jpg',
    workpiece: 'Aerospace Bracket',
    scenario: 'Chatter',
    signalsEvidence: 'Vibration increases during a specific B-axis position',
    recommendedAction: 'Inspect tool, fixturing and cutting parameters',
    useCase: '5-Axis Anomaly',
    currentTask: 'Multi-Hole Rigid Tapping M8',
    plc: {
      id: 'PLC-L1-03',
      controllerModel: 'Fanuc 31i-B5 Dual Check Safety',
      cycleTime: 28.4,
      cycleTarget: 30.0,
      program: 'PRG-O1120_AERO_BRACKET.nc',
      step: 'Step 09/14 (Rigid Tapping M8)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Pneumatic Vise Clamped (6 Bar)',
        coolant: 'Through-Spindle Coolant ON',
        doorInterlock: 'Safety Interlock Engaged',
        toolChanger: '21-Tool Turret Pocket #14',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L1-GW',
      tagCount: 2610,
      sampleRateMs: 250,
      feedRate: 2200,
      powerKw: 11.8,
      coolantPressureBar: 22.0,
      axisLoadPercent: { x: 38, y: 41, z: 54 },
    },
    metrics: { spindle: 4850, cycle: 28.4, tags: 2610, temp: 37, vib: 0.3, partsToday: 412 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-04',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: '5-Axis High Precision Milling',
    line: 'Line 1 · Cell B',
    bay: 'Aero Precision Bay',
    model: 'Makino D500 5-Axis VMC',
    imageUrl: '/machines/cnc_vmc_5axis.jpg',
    workpiece: 'Medical Bone Screw',
    scenario: 'Tool damage / chatter',
    signalsEvidence: 'Vibration increases from ~1.2g to ~3.8g',
    recommendedAction: 'Inspect T12 and cutting stability',
    useCase: 'Micro-machining Anomaly',
    currentTask: 'Continuous 5-Axis Profiling',
    plc: {
      id: 'PLC-L1-04',
      controllerModel: 'Makino Professional 6 (Fanuc)',
      cycleTime: 41.0,
      cycleTarget: 42.0,
      program: 'PRG-O1204_BONE_SCREW.nc',
      step: 'Step 08/16 (Continuous 5-Axis Sim)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Zero-Point Clamping Locked',
        coolant: 'Air-Oil Mist System ON',
        doorInterlock: 'Safety Interlock Engaged',
        toolChanger: 'Matrix Tool Magazine #42',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L1-GW',
      tagCount: 2750,
      sampleRateMs: 250,
      feedRate: 1800,
      powerKw: 16.4,
      coolantPressureBar: 20.5,
      axisLoadPercent: { x: 62, y: 58, z: 66 },
    },
    metrics: { spindle: 4547, cycle: 41.0, tags: 2750, temp: 41, vib: 0.6, partsToday: 365 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-05',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'Twin-Spindle Turning Center',
    line: 'Line 2 · Cell A',
    bay: 'Heavy Machining Bay',
    model: 'Doosan Puma TT2100SY',
    imageUrl: '/machines/cnc_mill_turn.jpg',
    workpiece: 'Hydraulic Valve Body',
    scenario: 'Coolant issue',
    signalsEvidence: 'Coolant pressure falls 20 → 11 bar',
    recommendedAction: 'Check pump, filter and nozzle',
    useCase: 'Process Anomaly',
    currentTask: 'Twin-Spindle Turning & Transfer',
    plc: {
      id: 'PLC-L2-05',
      controllerModel: 'Siemens S7-1500 / Fanuc 32i',
      cycleTime: 36.8,
      cycleTarget: 38.0,
      program: 'PRG-O2015_VALVE_BODY.nc',
      step: 'Step 05/11 (Sub-Spindle Transfer)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Dual 8" Chucks Synchronized',
        coolant: 'Dual High Flow Lines Active',
        doorInterlock: 'Operator Door Locked',
        toolChanger: 'Upper 12-Station Turret Active',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L2-GW',
      tagCount: 2530,
      sampleRateMs: 250,
      feedRate: 1350,
      powerKw: 22.0,
      coolantPressureBar: 18.5,
      axisLoadPercent: { x: 50, y: 46, z: 59 },
    },
    metrics: { spindle: 3720, cycle: 36.8, tags: 2530, temp: 39, vib: 0.4, partsToday: 390 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-06',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'Ultra-Speed Die & Mold Milling',
    line: 'Line 2 · Cell A',
    bay: 'Heavy Machining Bay',
    model: 'Röders RXP 601 DSH',
    imageUrl: '/machines/cnc_vmc_5axis.jpg',
    workpiece: 'Transmission Case',
    scenario: 'Performance loss',
    signalsEvidence: 'Actual cycle 267 sec vs target 240 sec',
    recommendedAction: 'Break down time loss by tool change, rapid moves and micro-stops',
    useCase: 'Cycle Optimization',
    currentTask: 'Surface Mirror-Finish Polishing',
    plc: {
      id: 'PLC-L2-06',
      controllerModel: 'Röders RMS6 High-End CNC/PLC',
      cycleTime: 44.5,
      cycleTarget: 45.0,
      program: 'PRG-O2040_TRANS_CASE.nc',
      step: 'Step 11/18 (Surface Micro-Polishing)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Magnetic Chuck Energized 100%',
        coolant: 'Cryogenic CO2 Assist Active',
        doorInterlock: 'Safety Guard Closed & Monitored',
        toolChanger: 'Laser Tool Setter Calibrated',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L2-GW',
      tagCount: 2840,
      sampleRateMs: 250,
      feedRate: 3200,
      powerKw: 15.0,
      coolantPressureBar: 15.0,
      axisLoadPercent: { x: 44, y: 49, z: 52 },
    },
    metrics: { spindle: 4900, cycle: 44.5, tags: 2840, temp: 36, vib: 0.3, partsToday: 445 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-07',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'warning',
    name: 'Heavy Duty Turning Center',
    line: 'Line 2 · Cell B',
    bay: 'Heavy Machining Bay',
    model: 'Okuma LB3000 EX II',
    imageUrl: '/machines/cnc_turning_lathe.jpg',
    workpiece: 'Hydraulic Cylinder Rod',
    scenario: 'High cutting resistance',
    signalsEvidence: 'Load rises from ~62% to ~74%',
    recommendedAction: 'Check tool wear, material and cutting parameters',
    useCase: 'Heavy Machining Anomaly',
    currentTask: 'Heavy OD Rough Turning',
    plc: {
      id: 'PLC-L2-07',
      controllerModel: 'Okuma OSP-P300LA Controller',
      cycleTime: 36.4,
      cycleTarget: 35.0,
      program: 'PRG-O2077_CYLINDER_ROD.nc',
      step: 'Step 07/12 (Heavy Rough Turn)',
      diagnostics: 'WARNING',
      ioStatus: {
        clamping: '10" Heavy Hydraulic Chuck (OK)',
        coolant: 'Standard High Flow (35 L/min)',
        doorInterlock: 'Door Interlocked & Safe',
        toolChanger: 'BMT-60 Live Tooling Pocket #06',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L2-GW',
      tagCount: 2721,
      sampleRateMs: 250,
      feedRate: 980,
      powerKw: 24.5,
      coolantPressureBar: 17.0,
      axisLoadPercent: { x: 74, y: 62, z: 74 },
    },
    metrics: { spindle: 3305, cycle: 36.4, tags: 2721, temp: 44, vib: 0.9, partsToday: 295 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-08',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'Swiss Precision Micro Lathe',
    line: 'Line 2 · Cell B',
    bay: 'Heavy Machining Bay',
    model: 'Citizen Cincom L20 Type IX',
    imageUrl: '/machines/cnc_drill_tap.jpg',
    workpiece: 'Turbine Impeller',
    scenario: 'Vibration',
    signalsEvidence: 'Abnormal vibration appears during blade finishing',
    recommendedAction: 'Inspect tool and machining parameters',
    useCase: 'Advanced AI / Anomaly',
    currentTask: 'Swiss Precision Micro-Turning',
    plc: {
      id: 'PLC-L2-08',
      controllerModel: 'Mitsubishi M800 / Citizen Cincom PLC',
      cycleTime: 27.8,
      cycleTarget: 28.0,
      program: 'PRG-O2092_TURBINE_IMP.nc',
      step: 'Step 04/09 (Simultaneous Guide Bushing)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Bar Feeder Hydrobar Interlocked',
        coolant: 'Neat Cutting Oil 15 Bar',
        doorInterlock: 'Sliding Enclosure Interlock OK',
        toolChanger: 'Gang Tool Post 5 OD / 4 ID',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L2-GW',
      tagCount: 2450,
      sampleRateMs: 250,
      feedRate: 1600,
      powerKw: 9.5,
      coolantPressureBar: 16.0,
      axisLoadPercent: { x: 32, y: 35, z: 41 },
    },
    metrics: { spindle: 4600, cycle: 27.8, tags: 2450, temp: 35, vib: 0.2, partsToday: 378 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-09',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: '4-Axis Vertical Machining Center',
    line: 'Line 3 · Cell A',
    bay: 'Robotic Automated Bay',
    model: 'Haas VF-4SS Super Speed VMC',
    imageUrl: '/machines/cnc_vmc_5axis.jpg',
    workpiece: 'Bearing Shaft',
    scenario: 'Grinding wheel wear',
    signalsEvidence: 'Wheel wear + grinding load + temperature trend upward',
    recommendedAction: 'Dress or replace wheel',
    useCase: 'Predictive Maintenance',
    currentTask: '4-Axis Rotary Index Milling',
    plc: {
      id: 'PLC-L3-09',
      controllerModel: 'Haas Next Generation Control (NGC)',
      cycleTime: 39.2,
      cycleTarget: 40.0,
      program: 'PRG-O3004_BEARING_SHAFT.nc',
      step: 'Step 08/15 (HRT210 Rotary Indexing)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Rotary 4th Axis Brake Clamped',
        coolant: 'Programmable Coolant Nozzle ON',
        doorInterlock: 'Auto-Door System Closed',
        toolChanger: '30+1 Side-Mount Tool Changer #19',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L3-GW',
      tagCount: 2580,
      sampleRateMs: 250,
      feedRate: 1750,
      powerKw: 17.2,
      coolantPressureBar: 18.0,
      axisLoadPercent: { x: 53, y: 55, z: 62 },
    },
    metrics: { spindle: 4100, cycle: 39.2, tags: 2580, temp: 39, vib: 0.4, partsToday: 410 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-10',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'Multi-Tasking Mill-Turn Center',
    line: 'Line 3 · Cell A',
    bay: 'Robotic Automated Bay',
    model: 'Mazak Integrex i-200H S',
    imageUrl: '/machines/cnc_mill_turn.jpg',
    workpiece: 'Transmission Gear',
    scenario: 'Hob wear',
    signalsEvidence: 'Load + vibration increase and gear inspection deviations rise',
    recommendedAction: 'Inspect Hob-03',
    useCase: 'Tool Health + Quality',
    currentTask: 'Complex B-Axis Angular Mill-Turn',
    plc: {
      id: 'PLC-L3-10',
      controllerModel: 'Mazatrol SmoothAi Integrated PLC',
      cycleTime: 45.0,
      cycleTarget: 46.0,
      program: 'PRG-O3045_TRANS_GEAR.nc',
      step: 'Step 10/18 (B-Axis Milling 45°)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Main Spindle C-Axis Locked',
        coolant: 'High Pressure 70 Bar Jet ON',
        doorInterlock: 'Auto-Window Interlocked',
        toolChanger: 'Capto C6 72-Tool Magazine #28',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L3-GW',
      tagCount: 2900,
      sampleRateMs: 250,
      feedRate: 1500,
      powerKw: 26.0,
      coolantPressureBar: 21.0,
      axisLoadPercent: { x: 58, y: 64, z: 67 },
    },
    metrics: { spindle: 3950, cycle: 45.0, tags: 2900, temp: 42, vib: 0.5, partsToday: 360 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-11',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'Heavy Gantry 5-Axis Profiler',
    line: 'Line 3 · Cell B',
    bay: 'Robotic Automated Bay',
    model: 'FPT Dinomax High Performance Gantry',
    imageUrl: '/machines/cnc_gantry_profiler.jpg',
    workpiece: 'Aircraft Structural Beam',
    scenario: 'Energy deviation',
    signalsEvidence: 'Power consumption higher than historical runs for same program',
    recommendedAction: 'Investigate cutting condition and tool condition',
    useCase: 'Energy Analytics',
    currentTask: 'Heavy Gantry Deep Pocket Roughing',
    plc: {
      id: 'PLC-L3-11',
      controllerModel: 'Heidenhain TNC 640 / Siemens PLC',
      cycleTime: 52.3,
      cycleTarget: 54.0,
      program: 'PRG-O3089_STRUCTURAL_BEAM.nc',
      step: 'Step 03/08 (Deep Pocket Roughing)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Hydraulic Fixture Array High',
        coolant: 'Dual High-Volume Flood Pumps',
        doorInterlock: 'Perimeter Laser Fence Active',
        toolChanger: 'Chain Tool Changer #12',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L3-GW',
      tagCount: 2680,
      sampleRateMs: 250,
      feedRate: 2400,
      powerKw: 29.5,
      coolantPressureBar: 19.0,
      axisLoadPercent: { x: 67, y: 69, z: 72 },
    },
    metrics: { spindle: 3500, cycle: 52.3, tags: 2680, temp: 40, vib: 0.5, partsToday: 336 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
  {
    id: 'CNC-12',
    type: 'CNC',
    protocol: 'OPC-UA / Industrial IoT',
    status: 'running',
    name: 'Robotic Flexible Cell Mill',
    line: 'Line 3 · Cell B',
    bay: 'Robotic Automated Bay',
    model: 'GF Machining Mikron Mill P 500',
    imageUrl: '/machines/cnc_robotic_cell.jpg',
    workpiece: 'Fuel Injection Pin',
    scenario: 'Tool life',
    signalsEvidence: 'Tool usage approaches threshold',
    recommendedAction: 'Schedule inspection/replacement before quality loss',
    useCase: 'Tool Life Prediction',
    currentTask: 'Pallet Exchange & Finish Milling',
    plc: {
      id: 'PLC-L3-12',
      controllerModel: 'Heidenhain iTNC 530 + KUKA PLC Interface',
      cycleTime: 31.6,
      cycleTarget: 32.0,
      program: 'PRG-O3112_INJECTION_PIN.nc',
      step: 'Step 05/10 (Pallet Exchange & Finish)',
      diagnostics: 'OK',
      ioStatus: {
        clamping: 'Robot Arm Pallet Clamp Confirmed',
        coolant: 'Through-Spindle Internal 40 Bar',
        doorInterlock: 'Safety Curtain Zone 1 Clean',
        toolChanger: '60-Tool Disc Changer #07',
      },
    },
    scada: {
      gatewayId: 'SCADA-HIST / L3-GW',
      tagCount: 2790,
      sampleRateMs: 250,
      feedRate: 1900,
      powerKw: 15.8,
      coolantPressureBar: 20.0,
      axisLoadPercent: { x: 42, y: 45, z: 51 },
    },
    metrics: { spindle: 4350, cycle: 31.6, tags: 2790, temp: 37, vib: 0.3, partsToday: 335 },
    hist: { spindle: [], cycle: [], tags: [], temp: [], vib: [] },
  },
];

function randomWalk(val: number, delta: number, min: number, max: number): number {
  const v = val + (Math.random() - 0.5) * delta;
  return Math.max(min, Math.min(max, v));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TAG_NAMES = [
  'PLC_CYCLE_STEP',
  'SCADA_SPINDLE_RPM',
  'PLC_HYDRAULIC_CLAMP',
  'SCADA_BEARING_TEMP',
  'PLC_TOOL_ATC',
  'SCADA_VIBRATION_RMS',
  'SCADA_COOLANT_PRESS',
  'PLC_SAFETY_INTERLOCK',
];

const PREDICTED_EVENTS: PredictedEvent[] = [
  { machine: 'CNC-07', component: 'Spindle Bearing', window: '~12 days', confidence: 82 },
  { machine: 'CNC-05', component: 'PLC Relay Switch (PLC-L2)', window: '~24 days', confidence: 75 },
  { machine: 'CNC-04', component: 'Cooling Pump', window: '~35 days', confidence: 68 },
];

const INITIAL_CYCLE_CONFIG: Record<string, { progress: number; state: Machine['cycleState']; incomplete: number }> = {
  'CNC-01': { progress: 64, state: 'cutting', incomplete: 1 },
  'CNC-02': { progress: 42, state: 'cutting', incomplete: 1 },
  'CNC-03': { progress: 85, state: 'cutting', incomplete: 0 },
  'CNC-04': { progress: 28, state: 'cutting', incomplete: 1 },
  'CNC-05': { progress: 73, state: 'cutting', incomplete: 2 },
  'CNC-06': { progress: 51, state: 'cutting', incomplete: 0 },
  'CNC-07': { progress: 42, state: 'feed_hold', incomplete: 4 },
  'CNC-08': { progress: 90, state: 'cutting', incomplete: 1 },
  'CNC-09': { progress: 35, state: 'cutting', incomplete: 1 },
  'CNC-10': { progress: 58, state: 'cutting', incomplete: 2 },
  'CNC-11': { progress: 79, state: 'cutting', incomplete: 1 },
  'CNC-12': { progress: 18, state: 'cutting', incomplete: 0 },
};

export function FoundryProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<SectionType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as SectionType;
      const validTabs: SectionType[] = [
        'overview', 'production', 'collection', 'edge_signals',
        'vision', 'maintenance', 'downtime', 'traceability',
        'optimization', 'smart_kpi', 'assistant', 'machine_detail'
      ];
      if (tab && validTabs.includes(tab)) {
        return tab;
      }
    }
    return 'overview';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [clockTime, setClockTime] = useState('--:--:--');
  const [machineFilter, setMachineFilter] = useState<'all' | 'warning'>('all');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>('CNC-05');

  // Support direct query param navigation & popstate (?tab=production, etc.)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLocation = () => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') as SectionType;
        const validTabs: SectionType[] = [
          'overview', 'production', 'collection', 'edge_signals',
          'vision', 'maintenance', 'downtime', 'traceability',
          'optimization', 'smart_kpi', 'assistant', 'machine_detail'
        ];
        if (tab && validTabs.includes(tab)) {
          setActiveSection(tab);
        }
      };
      handleLocation();
      window.addEventListener('popstate', handleLocation);
      return () => window.removeEventListener('popstate', handleLocation);
    }
  }, []);

  const openMachineDetail = useCallback((machineId: string) => {
    setSelectedMachineId(machineId);
    setActiveSection('machine_detail');
  }, []);

  const t = useMemo(() => translations[language] || translations.en, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('foundry-lang', lang);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('foundry-theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      const savedLang = localStorage.getItem('foundry-lang') as Language | null;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('foundry-theme', next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Telemetry state with realistic machine cycle progress & incomplete parts tracking
  const [machines, setMachines] = useState<Machine[]>(() => {
    return INITIAL_MACHINES.map((m) => {
      const cfg = INITIAL_CYCLE_CONFIG[m.id] || { progress: 50, state: 'cutting', incomplete: 0 };
      const histCopy: Record<string, number[]> = {};
      Object.keys(m.metrics).forEach((k) => {
        const val = m.metrics[k] ?? 0;
        histCopy[k] = Array.from({ length: 18 }, () => val);
      });
      return {
        ...m,
        cycleProgress: cfg.progress,
        cycleState: cfg.state,
        partsIncomplete: cfg.incomplete,
        hist: histCopy as Machine['hist'],
      };
    });
  });

  const [oee, setOee] = useState(88.5);
  const [oeeDelta, setOeeDelta] = useState(0.3);
  const [partsInspected, setPartsInspected] = useState(4531);
  const [incompleteParts, setIncompleteParts] = useState(14);
  const [lastPartEvent, setLastPartEvent] = useState<PartEvent | null>({
    type: 'success',
    machineId: 'CNC-01',
    workpiece: 'Aerospace Mounting Flange',
    message: 'Part cycle completed (Pass) · Dimensions within ±0.005mm',
    timestamp: 'Just now',
  });
  const activeAlerts = 1;
  const machinesOnline = 11;

  const healthyMachinesCount = useMemo(() => {
    return machines.filter((m) => m.status === 'running').length;
  }, [machines]);

  const warningMachinesCount = useMemo(() => {
    return machines.filter((m) => m.status === 'warning').length;
  }, [machines]);

  const filteredMachines = useMemo(() => {
    if (machineFilter === 'warning') {
      return machines.filter((m) => m.status === 'warning');
    }
    return machines;
  }, [machines, machineFilter]);

  // Tag Logs
  const [tagLogs, setTagLogs] = useState<TagLogItem[]>(() => {
    const initial: TagLogItem[] = [];
    const now = new Date();
    const sampleLogTemplates = [
      { tag: 'PLC: Cycle Step Executed', val: 'Cycle 34.2s (Normal)' },
      { tag: 'SCADA-HIST: Spindle RPM Verified', val: '4,420 RPM (Steady)' },
      { tag: 'PLC: Hydraulic Clamping Verified', val: '18 Bar Locked' },
      { tag: 'SCADA-HIST: Bearing Temp Logged', val: '38°C (Normal)' },
      { tag: 'PLC: Tool Pocket #08 Indexed', val: 'ATC Ready' },
      { tag: 'SCADA-HIST: 250ms Telemetry Frame', val: '2,480 Tags Streamed' },
    ];
    for (let i = 0; i < 6; i++) {
      const m = INITIAL_MACHINES[i] || pickRandom(INITIAL_MACHINES);
      const sample = sampleLogTemplates[i] || sampleLogTemplates[0];
      initial.push({
        id: 'init-' + i,
        time: new Date(now.getTime() - i * 2000).toLocaleTimeString('en-IN', { hour12: false }),
        machineId: m.id,
        tag: sample.tag,
        value: sample.val,
      });
    }
    return initial;
  });

  // Computer Vision state
  const [partCounter, setPartCounter] = useState(2350);
  const [isInspectingPass, setIsInspectingPass] = useState(true);
  const [inspectConfidence, setInspectConfidence] = useState(98);
  const [boxPos, setBoxPos] = useState({ left: 38, top: 32 });
  const [recentInspections, setRecentInspections] = useState<boolean[]>([
    true, true, true, true, true, true, true, false, true, true, true, true,
  ]);
  const [defectRate, setDefectRate] = useState(1.4);

  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([
    { id: 'zone-a', name: 'CNC Machine Bay', status: 'compliant' },
    { id: 'zone-b', name: 'Loading & Dispatch', status: 'compliant' },
    { id: 'zone-c', name: 'Robot Work Area', status: 'checking' },
  ]);

  // Predictive Maintenance state
  const [wearPercent, setWearPercent] = useState(48);
  const [anomalyHist, setAnomalyHist] = useState<number[]>(() =>
    Array.from({ length: 24 }, () => 18 + Math.random() * 8)
  );

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-0',
      role: 'bot',
      text: translations.en.assistant.initialGreeting,
      tagText: 'SMART COPILOT',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
    },
  ]);

  useEffect(() => {
    setChatMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg-0') {
        return [
          {
            ...prev[0],
            text: t.assistant.initialGreeting,
          },
        ];
      }
      return prev;
    });
  }, [language, t]);

  // Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      setClockTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Realistic Machining Cycle & Shopfloor Telemetry Engine
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setOee((prev) => {
        const next = randomWalk(prev, 0.8, 82, 95);
        setOeeDelta(+(next - prev).toFixed(1));
        return next;
      });

      const nowTime = new Date().toLocaleTimeString('en-IN', { hour12: false });
      let partCompletedThisTick = false;
      let partErrorThisTick = false;

      setMachines((prevMachines) =>
        prevMachines.map((m) => {
          const newMetrics = { ...m.metrics };
          const newHist = { ...m.hist };
          let newProgress = m.cycleProgress ?? 50;
          let newCycleState: Machine['cycleState'] = m.cycleState ?? 'cutting';
          let partsTodayCount = newMetrics.partsToday ?? 350;
          let partsIncompleteCount = m.partsIncomplete ?? 0;

          // Normal telemetry sensor drifts
          Object.keys(newMetrics).forEach((k) => {
            if (k === 'partsToday' || k === 'partsIncomplete') return;
            const currentVal = newMetrics[k] ?? 0;
            let min = 0;
            let max = 100;
            let delta = 2;

            if (k === 'spindle') { min = 2800; max = 5200; delta = 30; }
            else if (k === 'temp') { min = 25; max = 50; delta = 0.5; }
            else if (k === 'vib') { min = 0.2; max = 1.6; delta = 0.03; }
            else if (k === 'cycle') { min = 25; max = 55; delta = 0.5; }
            else if (k === 'tags') { min = 1800; max = 3000; delta = 15; }

            const updatedVal = randomWalk(currentVal, delta, min, max);
            newMetrics[k] = updatedVal;

            const existingHist = newHist[k] ? [...newHist[k]!] : [];
            existingHist.push(updatedVal);
            if (existingHist.length > 18) existingHist.shift();
            newHist[k] = existingHist;
          });

          // Realistic Cycle Progress:
          // In real CNC operations, each part takes ~28s to 54s to machine.
          // Ticker runs every 2.5s, advancing cycle by ~5% to 9%.
          const cycleTargetSeconds = m.plc?.cycleTarget || m.plc?.cycleTime || 36;
          const progressStep = (2.5 / cycleTargetSeconds) * 100;

          // CNC-07 (Warning / Spindle Vibration) handling:
          if (m.status === 'warning') {
            if (newCycleState === 'feed_hold') {
              // Stays in feed-hold to inspect tool/harmonic vibration, then resumes
              if (Math.random() > 0.45) {
                newCycleState = 'cutting';
                newProgress = 6;
              }
              return {
                ...m,
                cycleProgress: newProgress,
                cycleState: newCycleState,
                partsIncomplete: partsIncompleteCount,
                metrics: newMetrics,
                hist: newHist,
              };
            }
          }

          newProgress += progressStep;

          if (newProgress >= 100) {
            // Cycle reached 100%!
            // Did this part complete smoothly or did an error / feed-hold occur?
            // In a real factory: CNC-07 has higher error rate (~16%), others have ~2.5% scrap/error rate
            const hasError = m.status === 'warning' ? Math.random() < 0.16 : Math.random() < 0.025;

            if (hasError && !partErrorThisTick) {
              partErrorThisTick = true;
              newCycleState = 'incomplete';
              partsIncompleteCount += 1;
              newProgress = m.status === 'warning' ? 42 : 0;
              if (m.status === 'warning') newCycleState = 'feed_hold';

              const errorReason =
                m.status === 'warning'
                  ? `⚠️ CNC-07: Spindle harmonic vibration (0.92 mm/s). Feed-hold engaged · Part cycle incomplete.`
                  : `⚠️ ${m.id}: Dimension/clamp tolerance check caught error on final pass · Part marked incomplete/scrap.`;

              setIncompleteParts((prev) => prev + 1);
              setLastPartEvent({
                type: 'incomplete',
                machineId: m.id,
                workpiece: m.workpiece || 'Component',
                message: errorReason,
                timestamp: nowTime,
              });

              setTagLogs((prev) => [
                {
                  id: String(Date.now()) + Math.random(),
                  time: nowTime,
                  machineId: m.id,
                  tag: 'PLC: Cycle Interrupted (Error)',
                  value: 'Part Incomplete · Feed Hold Engaged',
                },
                ...prev.slice(0, 24),
              ]);
            } else {
              // Successfully Completed Part!
              partCompletedThisTick = true;
              partsTodayCount += 1;
              newProgress = Math.floor(Math.random() * 4); // Reset to 0-3% for next blank
              newCycleState = 'cutting';

              setPartsInspected((prev) => prev + 1);
              setLastPartEvent({
                type: 'success',
                machineId: m.id,
                workpiece: m.workpiece || 'Component',
                message: `${m.id} completed 1x ${m.workpiece} · Dimension verified OK (0.04s optical check)`,
                timestamp: nowTime,
              });

              setTagLogs((prev) => [
                {
                  id: String(Date.now()) + Math.random(),
                  time: nowTime,
                  machineId: m.id,
                  tag: 'PLC: Cycle Finished (Good Part)',
                  value: `${m.id} completed ${m.workpiece} (Passed QC)`,
                },
                ...prev.slice(0, 24),
              ]);
            }
          }

          newMetrics.partsToday = partsTodayCount;

          return {
            ...m,
            cycleProgress: Math.min(100, Math.round(newProgress)),
            cycleState: newCycleState,
            partsIncomplete: partsIncompleteCount,
            metrics: newMetrics,
            hist: newHist,
          };
        })
      );

      setDefectRate((prev) => randomWalk(prev, 0.2, 0.8, 2.8));
      setWearPercent((prev) => randomWalk(prev, 0.4, 42, 65));
      setAnomalyHist((prev) => {
        const lastVal = prev[prev.length - 1] ?? 20;
        const nextVal = randomWalk(lastVal, 4, 10, 35);
        const updated = [...prev, nextVal];
        if (updated.length > 24) updated.shift();
        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  // CV Inspection Ticker
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPartCounter((p) => p + 1);
      const isPass = Math.random() > 0.07;
      const conf = Math.floor(96 + Math.random() * 3);

      setIsInspectingPass(isPass);
      setInspectConfidence(conf);
      setBoxPos({
        left: Math.floor(30 + Math.random() * 20),
        top: Math.floor(22 + Math.random() * 20),
      });

      setRecentInspections((prev) => [isPass, ...prev.slice(0, 15)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Friendly conversational reply builder
  const buildGenAIReply = useCallback(
    (query: string): string => {
      const q = query.toLowerCase();
      const matchedMachine = machines.find((m) => query.toUpperCase().includes(m.id));

      const isKn = language === 'kn' || /[\u0C80-\u0CFF]/.test(query);
      const isTa = language === 'ta' || /[\u0B80-\u0BFF]/.test(query);
      const isTe = language === 'te' || /[\u0C00-\u0C7F]/.test(query);
      const isHi = language === 'hi' || /[\u0900-\u097F]/.test(query) || q.includes('dikkat') || q.includes('kya');

      // --- KANNADA ---
      if (isKn) {
        if (q.includes('ಸಮಸ್ಯೆ') || q.includes('ತೊಂದರೆ') || q.includes('alert')) {
          return 'ಕೇವಲ 1 ಯಂತ್ರದ (CNC-07) ಮೇಲೆ ಗಮನ ಅಗತ್ಯವಿದೆ — ಸ್ವಲ್ಪ ಕಂಪನ ಹೆಚ್ಚಾಗಿದೆ. ಉಳಿದ ಎಲ್ಲಾ ಯಂತ್ರಗಳು ಯಾವುದೇ ತೊಂದರೆಯಿಲ್ಲದೆ ಉತ್ತಮವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ.';
        }
        if (q.includes('ಭಾಗ') || q.includes('ತಯಾರ') || q.includes('parts')) {
          return `ಇಂದು ಇದುವರೆಗೆ ಒಟ್ಟು ${partsInspected.toLocaleString('en-IN')} ಭಾಗಗಳು ತಯಾರಾಗಿವೆ. ಇದರಲ್ಲಿ 98% ಗಿಂತ ಹೆಚ್ಚು ಭಾಗಗಳು ಪರೀಕ್ಷೆಯಲ್ಲಿ ಪಾಸ್ ಆಗಿವೆ!`;
        }
        if (q.includes('ಸರ್ವೀಸ್') || q.includes('maintenance')) {
          return 'ಮುಂದಿನ 12 ದಿನಗಳಲ್ಲಿ CNC-07 ಸ್ಪಿಂಡಲ್ ಬೇರಿಂಗ್‌ಗೆ ಸಾಮಾನ್ಯ ಸರ್ವೀಸ್ ಮಾಡಿಸಬೇಕಾಗಿದೆ. ಉಳಿದ ಯಂತ್ರಗಳಿಗೆ ತಕ್ಷಣದ ಸರ್ವೀಸ್ ಅಗತ್ಯವಿಲ್ಲ.';
        }
        if (matchedMachine) {
          return `${matchedMachine.id} ${matchedMachine.status === 'warning' ? 'ಸಾಮಾನ್ಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ (ಸ್ವಲ್ಪ ಕಂಪನವಿದೆ)' : 'ಬಹಳ ಉತ್ತಮವಾಗಿ ಓಡುತ್ತಿದೆ'}. ತಾಪಮಾನ: ${matchedMachine.metrics.temp.toFixed(0)}°C (ಸಹಜವಾಗಿದೆ).`;
        }
        return 'ಕಾರ್ಖಾನೆಯ ಎಲ್ಲಾ ಮುಖ್ಯ ಯಂತ್ರಗಳು ಸಕ್ರಿಯವಾಗಿವೆ. ಉತ್ಪಾದನೆ ಮತ್ತು ಗುಣಮಟ್ಟ ಸಹಜವಾಗಿದೆ.';
      }

      // --- TAMIL ---
      if (isTa) {
        if (q.includes('பிரச்சனை') || q.includes('alert')) {
          return 'CNC-07 இயந்திரத்தில் மட்டும் லேசான அதிர்வு உள்ளது. மற்ற அனைத்து இயந்திரங்களும் எந்த பிரச்சனையும் இன்றி சீராக ஓடுகின்றன.';
        }
        if (q.includes('பாகங்கள்') || q.includes('உற்பத்தி') || q.includes('parts')) {
          return `இன்று மொத்தம் ${partsInspected.toLocaleString('en-IN')} பாகங்கள் தயாரிக்கப்பட்டுள்ளன. இதில் 98% பாகங்கள் நல்ல தரத்துடன் தேர்ச்சி பெற்றுள்ளன!`;
        }
        if (q.includes('பராமரிப்பு') || q.includes('service')) {
          return 'அடுத்த 12 நாட்களில் CNC-07 சுழல் தாங்கிக்கு வழக்கமான பராமரிப்பு செய்ய வேண்டும். மற்ற இயந்திரங்கள் நல்ல நிலையில் உள்ளன.';
        }
        if (matchedMachine) {
          return `${matchedMachine.id} ${matchedMachine.status === 'warning' ? 'கவனிக்கப்பட வேண்டும் (லேசான அதிர்வு)' : 'மிகவும் சீராக ஓடுகிறது'}. வெப்பநிலை: ${matchedMachine.metrics.temp.toFixed(0)}°C (இயல்பானது).`;
        }
        return 'தொழிற்சாலையின் அனைத்து அமைப்புகளும் சாதாரணமாக இயங்குகின்றன. உற்பத்தி சீராக உள்ளது.';
      }

      // --- TELUGU ---
      if (isTe) {
        if (q.includes('సమస్య') || q.includes('alert')) {
          return 'CNC-07 మెషిన్‌లో మాత్రమే స్వల్ప కంపనం ఉంది. మిగిలిన అన్ని మెషిన్లు ఎలాంటి సమస్య లేకుండా చక్కగా నడుస్తున్నాయి.';
        }
        if (q.includes('భాగాలు') || q.includes('తయార') || q.includes('parts')) {
          return `ఈరోజు ఇప్పటివరకు మొత్తం ${partsInspected.toLocaleString('en-IN')} భాగాలు తయారయ్యాయి. 98% పైగా నాణ్యతతో పాస్ అయ్యాయి!`;
        }
        if (q.includes('సర్వీస్') || q.includes('maintenance')) {
          return 'తదుపరి 12 రోజుల్లో CNC-07 స్పిండిల్ బేరింగ్‌కు సాధారణ సర్వీస్ అవసరం. ఇతర మెషిన్లకు తక్షణ సర్వీస్ అవసరం లేదు.';
        }
        if (matchedMachine) {
          return `${matchedMachine.id} ${matchedMachine.status === 'warning' ? 'తనిఖీ అవసరం (స్వల్ప కంపనం)' : 'చాలా బాగుంది'}. ఉష్ణోగ్రత: ${matchedMachine.metrics.temp.toFixed(0)}°C (సాధారణం).`;
        }
        return 'ఫ్యాక్టరీలో అన్ని పనులు సజావుగా సాగుతున్నాయి. నాణ్యత మరియు ఉత్పత్తి మంచి స్థాయిలో ఉన్నాయి.';
      }

      // --- HINDI ---
      if (isHi) {
        if (q.includes('dikkat') || q.includes('problem') || q.includes('alert') || q.includes('kharab')) {
          return 'चिंता की कोई बात नहीं है! सिर्फ CNC-07 में हल्का सा वाइब्रेशन है जिसको अगले 12 दिन में रूटीन सर्विस चाहिए। बाकी सभी 11 मशीनें बिल्कुल बढ़िया चल रही हैं।';
        }
        if (q.includes('kitna') || q.includes('maal') || q.includes('parts') || q.includes('production')) {
          return `आज कारखाने में कुल ${partsInspected.toLocaleString('en-IN')} पार्ट्स बन चुके हैं, और 98.6% माल क्वालिटी चेक में बिल्कुल सही पास हुआ है!`;
        }
        if (q.includes('service') || q.includes('maintenance') || q.includes('repair')) {
          return 'अगली सर्विस CNC-07 के स्पिंडल बेयरिंग की लगभग 12 दिन बाद होनी है। इससे अचानक खराबी रुक जाती है और लाखों की बचत होती है।';
        }
        if (matchedMachine) {
          if (q.includes('diagnos') || q.includes('anomaly') || q.includes('kya') || q.includes('dikkat') || q.includes('action') || q.includes('scenario') || q.includes('check')) {
            return `${matchedMachine.id} [पार्ट: ${matchedMachine.workpiece || 'घटक'}] की AI डायग्नोस्टिक्स रिपोर्ट:\n• स्थिति / समस्या: ${matchedMachine.scenario || 'सामान्य'}\n• सिग्नल / टेलीमेट्री सबूत: ${matchedMachine.signalsEvidence || 'सभी सेंसर्स नॉर्मल हैं'}\n• AI सुझाई गई कार्रवाई: ${matchedMachine.recommendedAction || 'स्टैंडर्ड प्रोडक्शन जारी रखें'}\n• यूज़ केस: ${matchedMachine.useCase || 'प्रेडिक्टिव मेंटेनेंस'}`;
          }
          return `${matchedMachine.id} अभी ${matchedMachine.status === 'warning' ? 'ध्यान देने की स्थिति में है (हल्का कंपन)' : 'बिल्कुल सही चल रही है'}. मोटर तापमान ${matchedMachine.metrics.temp.toFixed(0)}°C नॉर्मल है।`;
        }
        return 'कारखाने की स्थिति बिल्कुल सामान्य है। 11 मशीनें एक्टिव हैं और काम बिना किसी रुकावट के चल रहा है।';
      }

      // --- ENGLISH ---
      if (matchedMachine) {
        if (
          q.includes('diagnos') ||
          q.includes('anomaly') ||
          q.includes('evidence') ||
          q.includes('action') ||
          q.includes('recommend') ||
          q.includes('scenario') ||
          q.includes('signal') ||
          q.includes('part') ||
          q.includes('fix') ||
          q.includes('summary')
        ) {
          return `AI Diagnostic Report for ${matchedMachine.id} [Part: ${matchedMachine.workpiece || 'Precision Component'}]:\n• Scenario: ${matchedMachine.scenario || 'Nominal Operation'}\n• Signals / Evidence: ${matchedMachine.signalsEvidence || 'All sensors nominal'}\n• GenAI Prescriptive Action: ${matchedMachine.recommendedAction || 'Continue standard production'}\n• Use Case Domain: ${matchedMachine.useCase || 'Predictive Maintenance'}`;
        }
      }

      if (q.includes('problem') || q.includes('issue') || q.includes('alert')) {
        return 'Good news: 11 of 12 machines are running smoothly! Only CNC-07 shows minor motor vibration, with scheduled routine service recommended in about 12 days.';
      }
      if (q.includes('made') || q.includes('parts') || q.includes('production')) {
        return `Today's production count is ${partsInspected.toLocaleString('en-IN')} parts, with over 98.4% passing quality inspection on the first pass.`;
      }
      if (q.includes('service') || q.includes('maintenance')) {
        return 'Next scheduled routine service is for CNC-07 Spindle Bearing in ~12 days. Catching this early prevents sudden downtime and has saved ~₹4.2 Lakhs this month.';
      }
      if (matchedMachine) {
        return `${matchedMachine.id} is ${matchedMachine.status === 'warning' ? 'flagged for routine check soon' : 'running in healthy condition'}. Temperature is ${matchedMachine.metrics.temp.toFixed(0)}°C (normal).`;
      }
      return 'Factory floor is operating normally. All smart cameras and sensors are connected live.';
    },
    [language, machines, partsInspected]
  );

  const sendMessage = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: String(Date.now()),
        role: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      };

      setChatMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        const replyText = buildGenAIReply(trimmed);
        const botMsg: ChatMessage = {
          id: String(Date.now() + 1),
          role: 'bot',
          text: replyText,
          tagText: 'SMART COPILOT',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        };
        setChatMessages((prev) => [...prev, botMsg]);
      }, 400);
    },
    [buildGenAIReply]
  );

  const clearChat = useCallback(() => {
    setChatMessages([
      {
        id: 'msg-reset',
        role: 'system',
        text: t.assistant.clearedMessage,
        tagText: 'SMART COPILOT',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      },
    ]);
  }, [t]);

  const lastAnomaly = useMemo(() => {
    return anomalyHist[anomalyHist.length - 1] ?? 20;
  }, [anomalyHist]);

  const value = useMemo(
    () => ({
      activeSection,
      setActiveSection,
      isSidebarOpen,
      toggleSidebar: () => setIsSidebarOpen((p) => !p),
      closeSidebar: () => setIsSidebarOpen(false),
      theme,
      toggleTheme,
      language,
      setLanguage,
      t,
      isLive,
      toggleLive: () => setIsLive((p) => !p),
      clockTime,
      machines,
      filteredMachines,
      machineFilter,
      setMachineFilter,
      selectedMachineId,
      setSelectedMachineId,
      openMachineDetail,
      healthyMachinesCount,
      warningMachinesCount,
      oee,
      oeeDelta,
      machinesOnline,
      activeAlerts,
      partsInspected,
      incompleteParts,
      lastPartEvent,
      tagLogs,
      partCounter,
      isInspectingPass,
      inspectConfidence,
      boxPos,
      recentInspections,
      defectRate,
      safetyZones,
      wearPercent,
      anomalyHist,
      lastAnomaly,
      predictedEvents: PREDICTED_EVENTS,
      chatMessages,
      quickChips: t.assistant.chips,
      sendMessage,
      clearChat,
    }),
    [
      activeSection,
      isSidebarOpen,
      theme,
      toggleTheme,
      language,
      setLanguage,
      t,
      isLive,
      clockTime,
      machines,
      filteredMachines,
      machineFilter,
      selectedMachineId,
      openMachineDetail,
      healthyMachinesCount,
      warningMachinesCount,
      oee,
      oeeDelta,
      machinesOnline,
      activeAlerts,
      partsInspected,
      incompleteParts,
      lastPartEvent,
      tagLogs,
      partCounter,
      isInspectingPass,
      inspectConfidence,
      boxPos,
      recentInspections,
      defectRate,
      safetyZones,
      wearPercent,
      anomalyHist,
      lastAnomaly,
      chatMessages,
      sendMessage,
      clearChat,
    ]
  );

  return <FoundryContext.Provider value={value}>{children}</FoundryContext.Provider>;
}

export function useFoundry() {
  const context = useContext(FoundryContext);
  if (!context) {
    throw new Error('useFoundry must be used within a FoundryProvider');
  }
  return context;
}
