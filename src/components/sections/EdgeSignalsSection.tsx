'use client';

import React, { useState, useMemo } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import {
  ActivityIcon,
  CpuIcon,
  RadioIcon,
  ShieldIcon,
  ZapIcon,
  ClockIcon,
} from '@/components/common/Icons';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

export interface SignalDefinition {
  id: string;
  machineType: 'Turning' | 'Milling' | '5-Axis' | 'Swiss' | 'Grinding' | 'Gear Hobbing' | 'All';
  signal: string;
  exampleValue: string;
  typicalSource: string;
  typicalFrequency: string;
  pocRelevance: string;
  relevanceCategory: 'all' | 'anomaly' | 'performance' | 'energy' | 'quality' | 'health';
  manufacturingInterpretation: string;
}

const EDGE_SIGNALS_CATALOG: SignalDefinition[] = [
  // Turning
  {
    id: 'sig-01',
    machineType: 'Turning',
    signal: 'RPM',
    exampleValue: '3,600',
    typicalSource: 'CNC / Drive',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process / Anomaly',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Tool wear can increase load at same RPM',
  },
  {
    id: 'sig-02',
    machineType: 'Turning',
    signal: 'Feed Rate',
    exampleValue: '1,100 mm/min',
    typicalSource: 'CNC',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process / Performance',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Compare commanded vs actual feed',
  },
  {
    id: 'sig-03',
    machineType: 'Turning',
    signal: 'Spindle Load',
    exampleValue: '51%',
    typicalSource: 'CNC / Drive',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Anomaly / Tool Health',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Rising load indicates cutting resistance',
  },
  {
    id: 'sig-04',
    machineType: 'Turning',
    signal: 'Spindle Torque',
    exampleValue: '28 Nm',
    typicalSource: 'CNC / Drive',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Anomaly / Tool Health',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Useful with load and power correlation',
  },
  {
    id: 'sig-05',
    machineType: 'Turning',
    signal: 'Chuck Pressure',
    exampleValue: '18 bar',
    typicalSource: 'PLC / Pressure Sensor',
    typicalFrequency: '1s',
    pocRelevance: 'Machine / Process Health',
    relevanceCategory: 'health',
    manufacturingInterpretation: 'Pressure drop may affect workholding safety',
  },

  // Milling
  {
    id: 'sig-06',
    machineType: 'Milling',
    signal: 'RPM',
    exampleValue: '8,000',
    typicalSource: 'CNC / Drive',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process / Anomaly',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Compare commanded vs actual speed',
  },
  {
    id: 'sig-07',
    machineType: 'Milling',
    signal: 'Feed Rate',
    exampleValue: '1,200 mm/min',
    typicalSource: 'CNC',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process / Performance',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Cycle optimization and feed override tracking',
  },
  {
    id: 'sig-08',
    machineType: 'Milling',
    signal: 'Spindle Load',
    exampleValue: '42%',
    typicalSource: 'CNC / Drive',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Anomaly / Tool Health',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Rising load can indicate tool wear or hard spots',
  },
  {
    id: 'sig-09',
    machineType: 'Milling',
    signal: 'Power',
    exampleValue: '7.8 kW',
    typicalSource: 'Drive / Energy Meter',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Energy / Anomaly',
    relevanceCategory: 'energy',
    manufacturingInterpretation: 'Energy deviation from historical program baseline',
  },
  {
    id: 'sig-10',
    machineType: 'Milling',
    signal: 'X/Y/Z Position',
    exampleValue: '125.4 / 82.1 / -34.5',
    typicalSource: 'CNC',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Traceability / Process',
    relevanceCategory: 'quality',
    manufacturingInterpretation: 'Correlate anomaly event with exact toolpath coordinates',
  },

  // 5-Axis
  {
    id: 'sig-11',
    machineType: '5-Axis',
    signal: 'A/B/C Axis Position',
    exampleValue: 'B=22°, C=145°',
    typicalSource: 'CNC',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process / Anomaly',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Useful for chatter and axis-specific kinematic issues',
  },
  {
    id: 'sig-12',
    machineType: '5-Axis',
    signal: 'Vibration',
    exampleValue: '2.1 g',
    typicalSource: 'Sensor (Accelerometer)',
    typicalFrequency: 'High Frequency / Aggregated',
    pocRelevance: 'Tool / Machine Health',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Spike may indicate chatter, resonance or spindle imbalance',
  },
  {
    id: 'sig-13',
    machineType: '5-Axis',
    signal: 'Temperature',
    exampleValue: '48°C',
    typicalSource: 'Sensor / PLC',
    typicalFrequency: '1s',
    pocRelevance: 'Machine Health',
    relevanceCategory: 'health',
    manufacturingInterpretation: 'Trend thermal growth against ambient factory baseline',
  },

  // Swiss Micro-machining
  {
    id: 'sig-14',
    machineType: 'Swiss',
    signal: 'Bar Diameter',
    exampleValue: '8 mm',
    typicalSource: 'Machine / Setup',
    typicalFrequency: 'Per Job',
    pocRelevance: 'Process Context',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Crucial for guide bushing clearance in micro-machining',
  },
  {
    id: 'sig-15',
    machineType: 'Swiss',
    signal: 'Tool Life',
    exampleValue: '78% used',
    typicalSource: 'CNC / MES',
    typicalFrequency: 'Event / Cycle',
    pocRelevance: 'Tool Health',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Predict inspection or insert replacement before breakage',
  },

  // Grinding
  {
    id: 'sig-16',
    machineType: 'Grinding',
    signal: 'Wheel RPM',
    exampleValue: '2,500',
    typicalSource: 'CNC',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process Control',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Wheel surface speed condition and dressing management',
  },
  {
    id: 'sig-17',
    machineType: 'Grinding',
    signal: 'Workpiece RPM',
    exampleValue: '450',
    typicalSource: 'CNC',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process Stability',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Maintain synchronized surface finish and roundness',
  },
  {
    id: 'sig-18',
    machineType: 'Grinding',
    signal: 'Grinding Load',
    exampleValue: '38%',
    typicalSource: 'CNC / Drive',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Anomaly / Wheel Wear',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Increasing load indicates abrasive loading or glazing',
  },
  {
    id: 'sig-19',
    machineType: 'Grinding',
    signal: 'Wheel Wear',
    exampleValue: '62%',
    typicalSource: 'Inspection / Model',
    typicalFrequency: 'Per Cycle',
    pocRelevance: 'Predictive Maintenance',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Predict automated wheel dressing or wheel replacement cycle',
  },
  {
    id: 'sig-20',
    machineType: 'Grinding',
    signal: 'Coolant Temperature',
    exampleValue: '29°C',
    typicalSource: 'Sensor',
    typicalFrequency: '1s',
    pocRelevance: 'Process / Quality',
    relevanceCategory: 'health',
    manufacturingInterpretation: 'Thermal stability prevents grinding burn and micro-cracking',
  },

  // Gear Hobbing
  {
    id: 'sig-21',
    machineType: 'Gear Hobbing',
    signal: 'Hob RPM',
    exampleValue: '1,200',
    typicalSource: 'CNC',
    typicalFrequency: '100ms–1s',
    pocRelevance: 'Process',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Correlate synchronization with involute gear profile quality',
  },
  {
    id: 'sig-22',
    machineType: 'Gear Hobbing',
    signal: 'Hob Tool',
    exampleValue: 'Hob-03',
    typicalSource: 'CNC / MES',
    typicalFrequency: 'Event',
    pocRelevance: 'Traceability',
    relevanceCategory: 'quality',
    manufacturingInterpretation: 'Link gear tooth runout and pitch deviations to specific tool',
  },
  {
    id: 'sig-23',
    machineType: 'Gear Hobbing',
    signal: 'Vibration',
    exampleValue: '0.42 mm/s (trend)',
    typicalSource: 'Sensor',
    typicalFrequency: 'High Frequency / Aggregated',
    pocRelevance: 'Tool Health',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Rising vibration indicates hob tooth chipping or flank wear',
  },

  // Plant-Wide / Common (All)
  {
    id: 'sig-24',
    machineType: 'All',
    signal: 'Machine State',
    exampleValue: 'RUNNING / IDLE / SETUP / ALARM',
    typicalSource: 'CNC + PLC',
    typicalFrequency: '1s / Event',
    pocRelevance: 'OEE Availability',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Plant availability calculation and shift utilization',
  },
  {
    id: 'sig-25',
    machineType: 'All',
    signal: 'Alarm Code',
    exampleValue: 'ALM-204',
    typicalSource: 'CNC / PLC',
    typicalFrequency: 'Event',
    pocRelevance: 'Downtime / Maintenance',
    relevanceCategory: 'anomaly',
    manufacturingInterpretation: 'Automated Pareto root-cause analysis and MTBF tracking',
  },
  {
    id: 'sig-26',
    machineType: 'All',
    signal: 'Cycle Time',
    exampleValue: '38.5 sec',
    typicalSource: 'CNC / MES',
    typicalFrequency: 'Per Cycle',
    pocRelevance: 'Performance Speed',
    relevanceCategory: 'performance',
    manufacturingInterpretation: 'Compare actual execution against standard master time',
  },
  {
    id: 'sig-27',
    machineType: 'All',
    signal: 'Good Part',
    exampleValue: '1',
    typicalSource: 'MES / PLC / Quality',
    typicalFrequency: 'Per Cycle',
    pocRelevance: 'Quality / OEE',
    relevanceCategory: 'quality',
    manufacturingInterpretation: 'First Pass Yield (FPY) tally and automated counter',
  },
  {
    id: 'sig-28',
    machineType: 'All',
    signal: 'Reject',
    exampleValue: '0 / 1',
    typicalSource: 'MES / Quality',
    typicalFrequency: 'Per Cycle',
    pocRelevance: 'Quality / Scrap OEE',
    relevanceCategory: 'quality',
    manufacturingInterpretation: 'Instant scrap rate accounting and defect classification',
  },
  {
    id: 'sig-29',
    machineType: 'All',
    signal: 'Coolant State',
    exampleValue: 'ON / OFF',
    typicalSource: 'PLC',
    typicalFrequency: '1s',
    pocRelevance: 'Process Health',
    relevanceCategory: 'health',
    manufacturingInterpretation: 'Detect unintended cutting dry or process interruptions',
  },
  {
    id: 'sig-30',
    machineType: 'All',
    signal: 'Coolant Pressure',
    exampleValue: '20 bar',
    typicalSource: 'PLC / Pressure Sensor',
    typicalFrequency: '1s',
    pocRelevance: 'Anomaly / Quality',
    relevanceCategory: 'health',
    manufacturingInterpretation: 'Low pressure leads to chip jamming and thermal stress',
  },
];

export default function EdgeSignalsSection() {
  const { sendMessage, setActiveSection } = useFoundry();

  const [activeMachineType, setActiveMachineType] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtered signals list
  const filteredSignals = useMemo(() => {
    return EDGE_SIGNALS_CATALOG.filter((item) => {
      // Machine Type Filter
      if (activeMachineType !== 'all') {
        if (item.machineType !== activeMachineType) return false;
      }

      // Category / Relevance Filter
      if (activeCategory !== 'all') {
        if (item.relevanceCategory !== activeCategory) return false;
      }

      // Search Filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesSignal = item.signal.toLowerCase().includes(q);
        const matchesMachine = item.machineType.toLowerCase().includes(q);
        const matchesSource = item.typicalSource.toLowerCase().includes(q);
        const matchesRelevance = item.pocRelevance.toLowerCase().includes(q);
        const matchesInterp = item.manufacturingInterpretation.toLowerCase().includes(q);
        const matchesVal = item.exampleValue.toLowerCase().includes(q);
        return matchesSignal || matchesMachine || matchesSource || matchesRelevance || matchesInterp || matchesVal;
      }

      return true;
    });
  }, [activeMachineType, activeCategory, searchTerm]);

  const handleAskCopilot = (sig: SignalDefinition) => {
    const prompt = `Explain the industrial significance of signal "${sig.signal}" on a ${sig.machineType} machine. How does its source (${sig.typicalSource}) and frequency (${sig.typicalFrequency}) feed into GenAI anomaly detection and manufacturing interpretation ("${sig.manufacturingInterpretation}")?`;
    sendMessage(prompt);
    setActiveSection('assistant');
  };

  const getTypeBadgeClass = (mType: string) => {
    switch (mType) {
      case 'Turning': return 'badge-turning';
      case 'Milling': return 'badge-milling';
      case '5-Axis': return 'badge-5axis';
      case 'Swiss': return 'badge-swiss';
      case 'Grinding': return 'badge-grinding';
      case 'Gear Hobbing': return 'badge-hobbing';
      default: return 'badge-all';
    }
  };

  // Multi-timeframe controls for Edge Signals DAQ
  const [edgeTimeFrame, setEdgeTimeFrame] = useState<TimeFrameKey>('8H');

  const cncDriveTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 100, formatted: '100ms' },
      { label: '12:20 PM', value: 100, formatted: '100ms' },
      { label: '12:30 PM', value: 100, formatted: '100ms' },
      { label: '12:40 PM', value: 100, formatted: '100ms' },
      { label: '12:50 PM', value: 100, formatted: '100ms' },
      { label: '01:00 PM', value: 100, formatted: '100ms' },
    ],
    '8H': [
      { label: '08:00 AM', value: 100, formatted: '100ms' },
      { label: '09:00 AM', value: 100, formatted: '100ms' },
      { label: '10:00 AM', value: 100, formatted: '100ms' },
      { label: '11:00 AM', value: 100, formatted: '100ms' },
      { label: '12:00 PM', value: 100, formatted: '100ms' },
      { label: '01:00 PM', value: 100, formatted: '100ms' },
      { label: '02:00 PM', value: 100, formatted: '100ms' },
    ],
    '24H': [
      { label: '00:00', value: 100, formatted: '100ms' },
      { label: '04:00', value: 100, formatted: '100ms' },
      { label: '08:00', value: 100, formatted: '100ms' },
      { label: '12:00', value: 100, formatted: '100ms' },
      { label: '16:00', value: 100, formatted: '100ms' },
      { label: '20:00', value: 100, formatted: '100ms' },
      { label: 'Now', value: 100, formatted: '100ms' },
    ],
    '7D': [
      { label: 'Thu', value: 100, formatted: '100ms' },
      { label: 'Fri', value: 100, formatted: '100ms' },
      { label: 'Sat', value: 100, formatted: '100ms' },
      { label: 'Sun', value: 100, formatted: '100ms' },
      { label: 'Mon', value: 100, formatted: '100ms' },
      { label: 'Tue', value: 100, formatted: '100ms' },
      { label: 'Today', value: 100, formatted: '100ms' },
    ],
    '30D': [
      { label: 'W1', value: 100, formatted: '100ms' },
      { label: 'W2', value: 100, formatted: '100ms' },
      { label: 'W3', value: 100, formatted: '100ms' },
      { label: 'W4', value: 100, formatted: '100ms' },
      { label: 'Cur', value: 100, formatted: '100ms' },
    ],
  };

  const plcIoTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 3.8, formatted: '3.8ms' },
      { label: '12:20 PM', value: 3.9, formatted: '3.9ms' },
      { label: '12:30 PM', value: 3.8, formatted: '3.8ms' },
      { label: '12:40 PM', value: 4.1, formatted: '4.1ms' },
      { label: '12:50 PM', value: 3.9, formatted: '3.9ms' },
      { label: '01:00 PM', value: 3.8, formatted: '3.8ms' },
    ],
    '8H': [
      { label: '08:00 AM', value: 3.6, formatted: '3.6ms' },
      { label: '09:00 AM', value: 3.7, formatted: '3.7ms' },
      { label: '10:00 AM', value: 4.0, formatted: '4.0ms' },
      { label: '11:00 AM', value: 3.8, formatted: '3.8ms' },
      { label: '12:00 PM', value: 3.9, formatted: '3.9ms' },
      { label: '01:00 PM', value: 3.8, formatted: '3.8ms' },
      { label: '02:00 PM', value: 3.8, formatted: '3.8ms' },
    ],
    '24H': [
      { label: '00:00', value: 3.5, formatted: '3.5ms' },
      { label: '04:00', value: 3.6, formatted: '3.6ms' },
      { label: '08:00', value: 3.8, formatted: '3.8ms' },
      { label: '12:00', value: 3.9, formatted: '3.9ms' },
      { label: '16:00', value: 3.8, formatted: '3.8ms' },
      { label: '20:00', value: 3.7, formatted: '3.7ms' },
      { label: 'Now', value: 3.8, formatted: '3.8ms' },
    ],
    '7D': [
      { label: 'Thu', value: 3.7, formatted: '3.7ms' },
      { label: 'Fri', value: 3.8, formatted: '3.8ms' },
      { label: 'Sat', value: 3.6, formatted: '3.6ms' },
      { label: 'Sun', value: 3.5, formatted: '3.5ms' },
      { label: 'Mon', value: 3.8, formatted: '3.8ms' },
      { label: 'Tue', value: 3.8, formatted: '3.8ms' },
      { label: 'Today', value: 3.8, formatted: '3.8ms' },
    ],
    '30D': [
      { label: 'W1', value: 3.6, formatted: '3.6ms' },
      { label: 'W2', value: 3.7, formatted: '3.7ms' },
      { label: 'W3', value: 3.8, formatted: '3.8ms' },
      { label: 'W4', value: 3.8, formatted: '3.8ms' },
      { label: 'Cur', value: 3.8, formatted: '3.8ms' },
    ],
  };

  const vibFftTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 2.5, formatted: '2.5 kHz' },
      { label: '12:20 PM', value: 2.5, formatted: '2.5 kHz' },
      { label: '12:30 PM', value: 2.5, formatted: '2.5 kHz' },
      { label: '12:40 PM', value: 2.5, formatted: '2.5 kHz' },
      { label: '12:50 PM', value: 2.5, formatted: '2.5 kHz' },
      { label: '01:00 PM', value: 2.5, formatted: '2.5 kHz' },
    ],
    '8H': [
      { label: '08:00 AM', value: 2.5, formatted: '2.5 kHz' },
      { label: '09:00 AM', value: 2.5, formatted: '2.5 kHz' },
      { label: '10:00 AM', value: 2.5, formatted: '2.5 kHz' },
      { label: '11:00 AM', value: 2.5, formatted: '2.5 kHz' },
      { label: '12:00 PM', value: 2.5, formatted: '2.5 kHz' },
      { label: '01:00 PM', value: 2.5, formatted: '2.5 kHz' },
      { label: '02:00 PM', value: 2.5, formatted: '2.5 kHz' },
    ],
    '24H': [
      { label: '00:00', value: 2.5, formatted: '2.5 kHz' },
      { label: '04:00', value: 2.5, formatted: '2.5 kHz' },
      { label: '08:00', value: 2.5, formatted: '2.5 kHz' },
      { label: '12:00', value: 2.5, formatted: '2.5 kHz' },
      { label: '16:00', value: 2.5, formatted: '2.5 kHz' },
      { label: '20:00', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Now', value: 2.5, formatted: '2.5 kHz' },
    ],
    '7D': [
      { label: 'Thu', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Fri', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Sat', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Sun', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Mon', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Tue', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Today', value: 2.5, formatted: '2.5 kHz' },
    ],
    '30D': [
      { label: 'W1', value: 2.5, formatted: '2.5 kHz' },
      { label: 'W2', value: 2.5, formatted: '2.5 kHz' },
      { label: 'W3', value: 2.5, formatted: '2.5 kHz' },
      { label: 'W4', value: 2.5, formatted: '2.5 kHz' },
      { label: 'Cur', value: 2.5, formatted: '2.5 kHz' },
    ],
  };

  const mesEventTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 34.2, formatted: '34.2s' },
      { label: '12:20 PM', value: 33.8, formatted: '33.8s' },
      { label: '12:30 PM', value: 34.0, formatted: '34.0s' },
      { label: '12:40 PM', value: 34.5, formatted: '34.5s' },
      { label: '12:50 PM', value: 34.1, formatted: '34.1s' },
      { label: '01:00 PM', value: 34.2, formatted: '34.2s' },
    ],
    '8H': [
      { label: '08:00 AM', value: 35.0, formatted: '35.0s' },
      { label: '09:00 AM', value: 34.6, formatted: '34.6s' },
      { label: '10:00 AM', value: 34.3, formatted: '34.3s' },
      { label: '11:00 AM', value: 34.1, formatted: '34.1s' },
      { label: '12:00 PM', value: 34.0, formatted: '34.0s' },
      { label: '01:00 PM', value: 34.2, formatted: '34.2s' },
      { label: '02:00 PM', value: 34.2, formatted: '34.2s' },
    ],
    '24H': [
      { label: '00:00', value: 36.1, formatted: '36.1s' },
      { label: '04:00', value: 35.8, formatted: '35.8s' },
      { label: '08:00', value: 34.8, formatted: '34.8s' },
      { label: '12:00', value: 34.1, formatted: '34.1s' },
      { label: '16:00', value: 34.3, formatted: '34.3s' },
      { label: '20:00', value: 34.4, formatted: '34.4s' },
      { label: 'Now', value: 34.2, formatted: '34.2s' },
    ],
    '7D': [
      { label: 'Thu', value: 34.8, formatted: '34.8s' },
      { label: 'Fri', value: 34.5, formatted: '34.5s' },
      { label: 'Sat', value: 35.2, formatted: '35.2s' },
      { label: 'Sun', value: 35.0, formatted: '35.0s' },
      { label: 'Mon', value: 34.4, formatted: '34.4s' },
      { label: 'Tue', value: 34.2, formatted: '34.2s' },
      { label: 'Today', value: 34.2, formatted: '34.2s' },
    ],
    '30D': [
      { label: 'W1', value: 35.6, formatted: '35.6s' },
      { label: 'W2', value: 35.0, formatted: '35.0s' },
      { label: 'W3', value: 34.5, formatted: '34.5s' },
      { label: 'W4', value: 34.2, formatted: '34.2s' },
      { label: 'Cur', value: 34.2, formatted: '34.2s' },
    ],
  };

  return (
    <section className="section-wrapper edge-signals-page animate-fade-in">
      {/* Page Hero Header */}
      <div className="overview-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-hero-title" style={{ fontSize: '22px', fontWeight: 800 }}>
              Industrial Edge Signals & DAQ Dictionary
            </h1>
            <span className="live-badge-mint">
              <span className="pulse-dot" /> 30 Telemetry Channels Active
            </span>
          </div>
          <p className="page-hero-desc" style={{ marginTop: '2px', marginBottom: 0, fontSize: '13px' }}>
            Standardized DAQ mapping across Turning, Milling, 5-Axis, Swiss Micro, Grinding & Gear Hobbing cells with manufacturing engineering interpretations.
          </p>
        </div>

        <div className="time-filter-pill-group">
          {(['1H', '8H', '24H', '7D', '30D'] as TimeFrameKey[]).map((tf) => (
            <button
              key={tf}
              type="button"
              className={`time-filter-btn ${edgeTimeFrame === tf ? 'active' : ''}`}
              onClick={() => setEdgeTimeFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Architecture KPI Cards */}
      <div className="overview-kpi-row-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '18px' }}>
        {/* Card 1: High-Speed CNC Drives */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <ActivityIcon size={18} color="#059669" />
            </div>
            <span className="kpi-badge-pill green">● Deterministic Bus</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">100ms – 1s</span>
          </div>
          <div className="kpi-label">
            <span>High-Speed CNC Drives</span>
            <span className="kpi-info-icon" title="Fanuc & Siemens drive bus sampled every 100ms">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status green pulse" />
            <span>Spindle RPM, Load, Torque & Feed</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={cncDriveTimeFrames[edgeTimeFrame].map((d) => d.value)}
              timeFrameData={cncDriveTimeFrames}
              activeTimeFrame={edgeTimeFrame}
              onTimeFrameChange={setEdgeTimeFrame}
              color="#059669"
              width={180}
              height={26}
              unit="ms"
            />
          </div>
        </div>

        {/* Card 2: Controller & PLC I/O */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <CpuIcon size={18} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">● Safety Interlocked</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">1s Sampling</span>
          </div>
          <div className="kpi-label">
            <span>Controller & PLC I/O</span>
            <span className="kpi-info-icon" title="Programmable Logic Controller inputs & hydraulic switches">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status green" />
            <span>Pressure, Coolant State & Door Interlocks</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={plcIoTimeFrames[edgeTimeFrame].map((d) => d.value)}
              timeFrameData={plcIoTimeFrames}
              activeTimeFrame={edgeTimeFrame}
              onTimeFrameChange={setEdgeTimeFrame}
              color="#2563EB"
              width={180}
              height={26}
              unit="ms"
            />
          </div>
        </div>

        {/* Card 3: High-Frequency Sensors */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <ZapIcon size={18} color="#0D9488" />
            </div>
            <span className="kpi-badge-pill green">● Tri-Axial DK</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">2.5 kHz FFT</span>
          </div>
          <div className="kpi-label">
            <span>High-Frequency Sensors</span>
            <span className="kpi-info-icon" title="Piezoelectric vibration DK sampled at high acoustic frequencies">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status green" />
            <span>Chatter, resonance & bearing accelerometers</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={vibFftTimeFrames[edgeTimeFrame].map((d) => d.value)}
              timeFrameData={vibFftTimeFrames}
              activeTimeFrame={edgeTimeFrame}
              onTimeFrameChange={setEdgeTimeFrame}
              color="#0D9488"
              width={180}
              height={26}
              unit="kHz"
            />
          </div>
        </div>

        {/* Card 4: MES & Event Triggers */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <RadioIcon size={18} color="#059669" />
            </div>
            <span className="kpi-badge-pill green">● ISO 13374 Sync</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">Per Cycle</span>
          </div>
          <div className="kpi-label">
            <span>MES & Event Triggers</span>
            <span className="kpi-info-icon" title="Part counter, scrap tally and OEE batch markers">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status green" />
            <span>Parts made, rejects, tool wear life & OEE</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={mesEventTimeFrames[edgeTimeFrame].map((d) => d.value)}
              timeFrameData={mesEventTimeFrames}
              activeTimeFrame={edgeTimeFrame}
              onTimeFrameChange={setEdgeTimeFrame}
              color="#059669"
              width={180}
              height={26}
              unit="s"
            />
          </div>
        </div>
      </div>

      {/* Edge Ingestion Architectural Pipeline Flow Banner */}
      <div className="edge-pipeline-flow-banner">
        <div className="pipeline-flow-title">
          <span>Industrial Telemetry-to-Intelligence Pipeline:</span>
        </div>
        <div className="pipeline-flow-steps">
          <div className="pipeline-step-item">
            <span className="pipeline-step-num">1</span>
            <div>
              <strong>Field Sensors & Drives</strong>
              <span>Fanuc, Siemens & IO-Link</span>
            </div>
          </div>
          <span className="pipeline-flow-arrow">➔</span>
          <div className="pipeline-step-item">
            <span className="pipeline-step-num">2</span>
            <div>
              <strong>Edge Gateway (100ms)</strong>
              <span>OPC-UA / MQTT Sparkplug</span>
            </div>
          </div>
          <span className="pipeline-flow-arrow">➔</span>
          <div className="pipeline-step-item">
            <span className="pipeline-step-num">3</span>
            <div>
              <strong>Time-Series Feature Store</strong>
              <span>FFT Harmonics & Power Baseline</span>
            </div>
          </div>
          <span className="pipeline-flow-arrow">➔</span>
          <div className="pipeline-step-item">
            <span className="pipeline-step-num">4</span>
            <div>
              <strong>GenAI Root-Cause Model</strong>
              <span>Prescriptive Action Recommendations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="edge-signals-controls-card">
        <div className="edge-controls-top-row">
          <div className="edge-search-wrap">
            <svg
              className="edge-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="edge-search-input"
              placeholder="Search signal name, machine type, data source, or interpretation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="edge-search-clear"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="edge-relevance-pills">
            <span className="edge-filter-label">Filter Relevance:</span>
            <button
              type="button"
              className={`edge-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Relevances
            </button>
            <button
              type="button"
              className={`edge-cat-btn ${activeCategory === 'anomaly' ? 'active' : ''}`}
              onClick={() => setActiveCategory('anomaly')}
            >
              Anomaly & Tool
            </button>
            <button
              type="button"
              className={`edge-cat-btn ${activeCategory === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveCategory('performance')}
            >
              Performance & OEE
            </button>
            <button
              type="button"
              className={`edge-cat-btn ${activeCategory === 'quality' ? 'active' : ''}`}
              onClick={() => setActiveCategory('quality')}
            >
              Traceability & Quality
            </button>
            <button
              type="button"
              className={`edge-cat-btn ${activeCategory === 'health' ? 'active' : ''}`}
              onClick={() => setActiveCategory('health')}
            >
              Machine Health
            </button>
          </div>
        </div>

        {/* Machine Type Filter Tabs */}
        <div className="edge-machine-type-tabs">
          <span className="edge-filter-label">Machine Type:</span>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === 'all' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('all')}
          >
            All Machines ({EDGE_SIGNALS_CATALOG.length})
          </button>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === 'Turning' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('Turning')}
          >
            Turning Lathes (5)
          </button>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === 'Milling' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('Milling')}
          >
            Milling VMC (5)
          </button>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === '5-Axis' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('5-Axis')}
          >
            5-Axis Simultaneous (3)
          </button>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === 'Swiss' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('Swiss')}
          >
            Swiss Micro (2)
          </button>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === 'Grinding' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('Grinding')}
          >
            Precision Grinding (5)
          </button>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === 'Gear Hobbing' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('Gear Hobbing')}
          >
            Gear Hobbing (3)
          </button>
          <button
            type="button"
            className={`edge-mtype-pill ${activeMachineType === 'All' ? 'active' : ''}`}
            onClick={() => setActiveMachineType('All')}
          >
            Common / All Cells (7)
          </button>
        </div>
      </div>

      {/* Main Signals Table */}
      <div className="edge-signals-table-wrap">
        <div className="edge-table-header-strip">
          <div className="edge-table-summary">
            Showing <strong>{filteredSignals.length}</strong> of {EDGE_SIGNALS_CATALOG.length} Industrial Sensor Channels
          </div>
          <span className="edge-table-export-note">
            Standard ISO 13374 / MTConnect / OPC-UA Part 100 Compliant
          </span>
        </div>

        <table className="edge-signals-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Machine / Type</th>
              <th style={{ width: '180px' }}>Signal Name</th>
              <th style={{ width: '180px' }}>Live Example Value</th>
              <th style={{ width: '180px' }}>Typical Source</th>
              <th style={{ width: '160px' }}>Frequency</th>
              <th style={{ width: '190px' }}>POC Relevance</th>
              <th>Manufacturing Interpretation</th>
              <th style={{ width: '110px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSignals.map((item) => (
              <tr key={item.id}>
                {/* Machine / Type */}
                <td>
                  <span className={`edge-type-badge ${getTypeBadgeClass(item.machineType)}`}>
                    {item.machineType}
                  </span>
                </td>

                {/* Signal Name */}
                <td>
                  <div className="edge-signal-name-cell">
                    <span className="edge-signal-icon-dot" />
                    <strong className="edge-signal-title">{item.signal}</strong>
                  </div>
                </td>

                {/* Example Value */}
                <td>
                  <span className="edge-value-chip tabular">
                    {item.exampleValue}
                  </span>
                </td>

                {/* Source */}
                <td>
                  <span className="edge-source-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="8" rx="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" />
                      <line x1="6" y1="6" x2="6.01" y2="6" />
                      <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                    <span>{item.typicalSource}</span>
                  </span>
                </td>

                {/* Frequency */}
                <td>
                  <span className="edge-freq-chip">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{item.typicalFrequency}</span>
                  </span>
                </td>

                {/* POC Relevance */}
                <td>
                  <span className={`edge-relevance-pill ${item.relevanceCategory}`}>
                    {item.pocRelevance}
                  </span>
                </td>

                {/* Manufacturing Interpretation */}
                <td>
                  <div className="edge-interp-text">
                    {item.manufacturingInterpretation}
                  </div>
                </td>

                {/* Action */}
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="edge-ask-ai-btn"
                    onClick={() => handleAskCopilot(item)}
                    title={`Ask GenAI Copilot to analyze ${item.signal}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>Analyze</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
