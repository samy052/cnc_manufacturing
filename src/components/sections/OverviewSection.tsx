'use client';

import React, { useState, useMemo } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import {
  AlertIcon,
  BoxIcon,
  GearIcon,
  ShieldIcon,
  CoinIcon,
  ZapIcon,
  ClockIcon,
  CheckIcon,
  ActivityIcon,
} from '@/components/common/Icons';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

interface AlarmItem {
  id: string;
  machineId: string;
  line: string;
  severity: 'critical' | 'warning' | 'info';
  code: string;
  description: string;
  metric: string;
  timestamp: string;
  timeAgo: string;
}

export default function OverviewSection() {
  const {
    partsInspected,
    machinesOnline,
    defectRate,
    oee,
    machines,
    setActiveSection,
    openMachineDetail,
  } = useFoundry();

  const [globalTimeFrame, setGlobalTimeFrame] = useState<TimeFrameKey>('8H');
  const [chartTimeFrame, setChartTimeFrame] = useState<TimeFrameKey>('8H');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{ x: number; y: number; time: string; actual: number; target: number } | null>(null);
  
  // Machine table filter & search
  const [tableFilter, setTableFilter] = useState<'all' | 'running' | 'idle' | 'warning'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Alarm Diagnostics Modal
  const [activeAlarmModal, setActiveAlarmModal] = useState<AlarmItem | null>(null);

  // Active alarms list
  const activeAlarms: AlarmItem[] = [
    {
      id: 'ALM-101',
      machineId: 'CNC-07',
      line: 'Line 2 · Aero Precision Bay',
      severity: 'critical',
      code: 'ERR-VIB-482',
      description: 'Spindle Bearing High Vibration',
      metric: '4.8 mm/s (>3.2 threshold)',
      timestamp: '13:38:12',
      timeAgo: '12m ago',
    },
    {
      id: 'ALM-102',
      machineId: 'CNC-03',
      line: 'Line 1 · Cell B',
      severity: 'warning',
      code: 'WARN-CYC-114',
      description: 'Cycle Time Variance Exceeded',
      metric: '168s (Target: 140s, +20%)',
      timestamp: '13:22:45',
      timeAgo: '28m ago',
    },
    {
      id: 'ALM-103',
      machineId: 'CNC-09',
      line: 'Line 3 · Heavy Bay',
      severity: 'warning',
      code: 'WARN-TMP-092',
      description: 'Coolant Fluid Temp High',
      metric: '42.4°C (Limit: 38.0°C)',
      timestamp: '13:05:10',
      timeAgo: '45m ago',
    },
  ];

  // Multi-timeframe datasets for KPI Sparklines
  const activeMachinesTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 11, formatted: '11 / 12' },
      { label: '12:20 PM', value: 11, formatted: '11 / 12' },
      { label: '12:30 PM', value: 11, formatted: '11 / 12' },
      { label: '12:40 PM', value: 11, formatted: '11 / 12' },
      { label: '12:50 PM', value: 11, formatted: '11 / 12' },
      { label: '01:00 PM', value: machinesOnline, formatted: `${machinesOnline} / 12` },
    ],
    '8H': [
      { label: '08:00 AM', value: 12, formatted: '12 / 12' },
      { label: '09:00 AM', value: 12, formatted: '12 / 12' },
      { label: '10:00 AM', value: 12, formatted: '12 / 12' },
      { label: '11:00 AM', value: 11, formatted: '11 / 12 (CNC-07 maint)' },
      { label: '12:00 PM', value: 11, formatted: '11 / 12' },
      { label: '01:00 PM', value: 11, formatted: '11 / 12' },
      { label: '02:00 PM', value: machinesOnline, formatted: `${machinesOnline} / 12` },
    ],
    '24H': [
      { label: '00:00', value: 12, formatted: '12 / 12' },
      { label: '04:00', value: 12, formatted: '12 / 12' },
      { label: '08:00', value: 12, formatted: '12 / 12' },
      { label: '12:00', value: 11, formatted: '11 / 12' },
      { label: '16:00', value: 11, formatted: '11 / 12' },
      { label: '20:00', value: 11, formatted: '11 / 12' },
      { label: 'Now', value: machinesOnline, formatted: `${machinesOnline} / 12` },
    ],
    '7D': [
      { label: 'Thu', value: 12, formatted: '12 / 12' },
      { label: 'Fri', value: 12, formatted: '12 / 12' },
      { label: 'Sat', value: 11, formatted: '11 / 12' },
      { label: 'Sun', value: 10, formatted: '10 / 12' },
      { label: 'Mon', value: 12, formatted: '12 / 12' },
      { label: 'Tue', value: 12, formatted: '12 / 12' },
      { label: 'Today', value: machinesOnline, formatted: `${machinesOnline} / 12` },
    ],
    '30D': [
      { label: 'W1', value: 12, formatted: '12 / 12' },
      { label: 'W2', value: 11, formatted: '11 / 12' },
      { label: 'W3', value: 12, formatted: '12 / 12' },
      { label: 'W4', value: 11, formatted: '11 / 12' },
      { label: 'Cur', value: machinesOnline, formatted: `${machinesOnline} / 12` },
    ],
  };

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
      { label: 'Now', value: partsInspected, formatted: `${partsInspected} pcs` },
    ],
    '7D': [
      { label: 'Thu', value: 4200, formatted: '4,200' },
      { label: 'Fri', value: 4350, formatted: '4,350' },
      { label: 'Sat', value: 4420, formatted: '4,420' },
      { label: 'Sun', value: 4380, formatted: '4,380' },
      { label: 'Mon', value: 4500, formatted: '4,500' },
      { label: 'Tue', value: 4520, formatted: '4,520' },
      { label: 'Today', value: partsInspected, formatted: `${partsInspected}` },
    ],
    '30D': [
      { label: 'W1', value: 28500, formatted: '28.5k' },
      { label: 'W2', value: 29200, formatted: '29.2k' },
      { label: 'W3', value: 31000, formatted: '31.0k' },
      { label: 'W4', value: 30500, formatted: '30.5k' },
      { label: 'Cur', value: 31400, formatted: '31.4k' },
    ],
  };

  const oeeTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 82.1, formatted: '82.1%' },
      { label: '12:20 PM', value: 82.3, formatted: '82.3%' },
      { label: '12:30 PM', value: 82.5, formatted: '82.5%' },
      { label: '12:40 PM', value: 82.4, formatted: '82.4%' },
      { label: '12:50 PM', value: 82.6, formatted: '82.6%' },
      { label: '01:00 PM', value: parseFloat(oee.toFixed(1)), formatted: `${oee.toFixed(1)}%` },
    ],
    '8H': [
      { label: '08:00 AM', value: 80.5, formatted: '80.5%' },
      { label: '09:00 AM', value: 81.2, formatted: '81.2%' },
      { label: '10:00 AM', value: 81.8, formatted: '81.8%' },
      { label: '11:00 AM', value: 82.0, formatted: '82.0%' },
      { label: '12:00 PM', value: 82.4, formatted: '82.4%' },
      { label: '01:00 PM', value: 82.5, formatted: '82.5%' },
      { label: '02:00 PM', value: parseFloat(oee.toFixed(1)), formatted: `${oee.toFixed(1)}%` },
    ],
    '24H': [
      { label: '00:00', value: 79.8, formatted: '79.8%' },
      { label: '04:00', value: 80.5, formatted: '80.5%' },
      { label: '08:00', value: 81.2, formatted: '81.2%' },
      { label: '12:00', value: 82.1, formatted: '82.1%' },
      { label: '16:00', value: 82.4, formatted: '82.4%' },
      { label: 'Now', value: parseFloat(oee.toFixed(1)), formatted: `${oee.toFixed(1)}%` },
    ],
    '7D': [
      { label: 'Thu', value: 81.0, formatted: '81.0%' },
      { label: 'Fri', value: 81.5, formatted: '81.5%' },
      { label: 'Sat', value: 82.1, formatted: '82.1%' },
      { label: 'Sun', value: 81.9, formatted: '81.9%' },
      { label: 'Mon', value: 82.4, formatted: '82.4%' },
      { label: 'Tue', value: 82.5, formatted: '82.5%' },
      { label: 'Today', value: parseFloat(oee.toFixed(1)), formatted: `${oee.toFixed(1)}%` },
    ],
    '30D': [
      { label: 'W1', value: 80.2, formatted: '80.2%' },
      { label: 'W2', value: 81.1, formatted: '81.1%' },
      { label: 'W3', value: 81.8, formatted: '81.8%' },
      { label: 'W4', value: 82.2, formatted: '82.2%' },
      { label: 'Cur', value: parseFloat(oee.toFixed(1)), formatted: `${oee.toFixed(1)}%` },
    ],
  };

  const powerTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 14.5, formatted: '14.5 kW' },
      { label: '12:20 PM', value: 14.2, formatted: '14.2 kW' },
      { label: '12:30 PM', value: 14.1, formatted: '14.1 kW' },
      { label: '12:40 PM', value: 14.3, formatted: '14.3 kW' },
      { label: '12:50 PM', value: 14.0, formatted: '14.0 kW' },
      { label: '01:00 PM', value: 14.2, formatted: '14.2 kW' },
    ],
    '8H': [
      { label: '08:00 AM', value: 12.8, formatted: '12.8 kW' },
      { label: '09:00 AM', value: 13.5, formatted: '13.5 kW' },
      { label: '10:00 AM', value: 14.0, formatted: '14.0 kW' },
      { label: '11:00 AM', value: 14.6, formatted: '14.6 kW' },
      { label: '12:00 PM', value: 14.4, formatted: '14.4 kW' },
      { label: '01:00 PM', value: 14.1, formatted: '14.1 kW' },
      { label: '02:00 PM', value: 14.2, formatted: '14.2 kW' },
    ],
    '24H': [
      { label: '00:00', value: 6.2, formatted: '6.2 kW' },
      { label: '04:00', value: 8.4, formatted: '8.4 kW' },
      { label: '08:00', value: 13.8, formatted: '13.8 kW' },
      { label: '12:00', value: 14.5, formatted: '14.5 kW' },
      { label: '16:00', value: 14.2, formatted: '14.2 kW' },
      { label: 'Now', value: 14.2, formatted: '14.2 kW' },
    ],
    '7D': [
      { label: 'Thu', value: 13.9, formatted: '13.9 kW' },
      { label: 'Fri', value: 14.1, formatted: '14.1 kW' },
      { label: 'Sat', value: 14.4, formatted: '14.4 kW' },
      { label: 'Sun', value: 14.0, formatted: '14.0 kW' },
      { label: 'Mon', value: 14.3, formatted: '14.3 kW' },
      { label: 'Tue', value: 14.5, formatted: '14.5 kW' },
      { label: 'Today', value: 14.2, formatted: '14.2 kW' },
    ],
    '30D': [
      { label: 'W1', value: 14.0, formatted: '14.0 kW' },
      { label: 'W2', value: 14.2, formatted: '14.2 kW' },
      { label: 'W3', value: 14.5, formatted: '14.5 kW' },
      { label: 'W4', value: 14.1, formatted: '14.1 kW' },
      { label: 'Cur', value: 14.2, formatted: '14.2 kW' },
    ],
  };

  // Production Chart Multi-Timeframe Series (Actual vs Planned)
  const productionChartData: Record<TimeFrameKey, { times: string[]; actual: number[]; target: number[] }> = {
    '1H': {
      times: ['12:10', '12:20', '12:30', '12:40', '12:50', '13:00'],
      actual: [90, 94, 95, 93, 96, 99],
      target: [92, 92, 92, 92, 92, 92],
    },
    '8H': {
      times: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
      actual: [480, 520, 550, 565, 540, 580, 560, 567],
      target: [562, 562, 562, 562, 562, 562, 562, 562],
    },
    '24H': {
      times: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      actual: [380, 750, 1950, 3100, 3850, 4200, 4537],
      target: [400, 800, 2000, 3000, 3750, 4100, 4500],
    },
    '7D': {
      times: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'],
      actual: [4210, 4350, 4420, 4390, 4510, 4530, 4537],
      target: [4400, 4400, 4400, 4400, 4500, 4500, 4500],
    },
    '30D': {
      times: ['W1', 'W2', 'W3', 'W4', 'Current'],
      actual: [28200, 29400, 31100, 30800, 31400],
      target: [29000, 29000, 30000, 30000, 31000],
    },
  };

  const currentChart = productionChartData[chartTimeFrame];

  // SVG Area / Path Calculations
  const chartWidth = 600;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 20;

  const minVal = Math.min(...currentChart.actual, ...currentChart.target) * 0.9;
  const maxVal = Math.max(...currentChart.actual, ...currentChart.target) * 1.08;
  const valRange = maxVal - minVal || 1;

  const pointsActual = currentChart.actual.map((val, idx) => {
    const x = paddingX + (idx / (currentChart.actual.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((val - minVal) / valRange) * (chartHeight - paddingY * 2);
    return { x, y, val, time: currentChart.times[idx], target: currentChart.target[idx] };
  });

  const pointsTarget = currentChart.target.map((val, idx) => {
    const x = paddingX + (idx / (currentChart.target.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((val - minVal) / valRange) * (chartHeight - paddingY * 2);
    return { x, y, val };
  });

  const actualPathD = pointsActual.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = pointsActual[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPathD = `${actualPathD} L ${pointsActual[pointsActual.length - 1].x} ${chartHeight - paddingY} L ${pointsActual[0].x} ${chartHeight - paddingY} Z`;

  const targetPathD = pointsTarget.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Machine status table filtering
  const filteredMachineRows = useMemo(() => {
    return machines.filter((m) => {
      if (tableFilter === 'running' && m.status !== 'running') return false;
      if (tableFilter === 'idle' && m.status !== 'idle') return false;
      if (tableFilter === 'warning' && m.status !== 'warning' && m.status !== 'stopped') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = m.id.toLowerCase().includes(q);
        const matchesName = (m.name || '').toLowerCase().includes(q);
        const matchesPart = (m.workpiece || '').toLowerCase().includes(q);
        const matchesLine = (m.line || '').toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesPart && !matchesLine) return false;
      }
      return true;
    });
  }, [machines, tableFilter, searchQuery]);

  return (
    <section className="section-wrapper">
      {/* Enterprise Control & Header Bar */}
      <div className="overview-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-hero-title" style={{ fontSize: '22px', fontWeight: 800 }}>
              Plant Operations Command Center
            </h1>
            <span className="live-badge-mint">
              <span className="pulse-dot" /> Live Telemetry
            </span>
          </div>
          <p className="page-hero-desc" style={{ marginTop: '2px', marginBottom: 0, fontSize: '13px' }}>
            Real-time CNC telemetry, edge vision QA, predictive health & production cadence · 2,480 tags/sec
          </p>
        </div>

        <div className="overview-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="shift-lead-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'var(--bg-panel)', border: '1px solid var(--border)', padding: '5px 10px', borderRadius: '8px' }}>
            <span className="status-dot-pulse healthy" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Shift A (06:00 - 14:00)</span>
            <span style={{ color: 'var(--text-muted)' }}>· Lead: R. Kumar</span>
          </div>

          <div className="time-filter-pill-group">
            {(['1H', '8H', '24H', '7D', '30D'] as TimeFrameKey[]).map((tf) => (
              <button
                key={tf}
                type="button"
                className={`time-filter-btn ${globalTimeFrame === tf ? 'active' : ''}`}
                onClick={() => setGlobalTimeFrame(tf)}
                title={`Set global timeframe to ${tf}`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-export-theme"
            onClick={() => alert('Exporting full plant telemetry CSV (2,480 tags/sec)...')}
            title="Export shift telemetry log"
          >
            <span>Telemetry Log ↓</span>
          </button>
        </div>
      </div>

      {/* 5 Enterprise KPI Cards Row (Matching Reference Design) */}
      <div className="overview-kpi-row-5" style={{ marginBottom: '18px' }}>
        {/* Card 1: Active Machines */}
        <div
          className="kpi-card-theme"
          onClick={() => setActiveSection('collection')}
          title="Click to view Machine Telemetry"
        >
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <GearIcon size={18} color="#0D9488" />
            </div>
            <span className="kpi-badge-pill green">▲ 91.7% Live</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{machinesOnline}</span>
            <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 600 }}>/ 12</span>
          </div>
          <div className="kpi-label">Active Machines</div>
          <div className="kpi-sub-line font-sm">
            <span><span className="dot-status green pulse" /> 9 Running</span>
            <span><span className="dot-status amber" /> 2 Idle</span>
            <span><span className="dot-status red" /> 1 Maint</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={activeMachinesTimeFrames[globalTimeFrame]}
              timeFrameData={activeMachinesTimeFrames}
              activeTimeFrame={globalTimeFrame}
              onTimeFrameChange={setGlobalTimeFrame}
              color="#0D9488"
              width={160}
              height={26}
              unit="machines"
            />
          </div>
        </div>

        {/* Card 2: Parts Produced */}
        <div
          className="kpi-card-theme"
          onClick={() => setActiveSection('production')}
          title="Click to view Production Cadence"
        >
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <BoxIcon size={18} color="#16A34A" />
            </div>
            <span className="kpi-badge-pill green">▲ +12% Target</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{partsInspected.toLocaleString()}</span>
          </div>
          <div className="kpi-label">Parts Produced (Target: 4,500)</div>
          <div className="kpi-sub-line font-sm">
            <span>Cadence: <strong>567 pcs/hr</strong></span>
            <span>FPY: <strong>98.4%</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={partsProducedTimeFrames[globalTimeFrame]}
              timeFrameData={partsProducedTimeFrames}
              activeTimeFrame={globalTimeFrame}
              onTimeFrameChange={setGlobalTimeFrame}
              color="#16A34A"
              width={160}
              height={26}
              unit="parts"
            />
          </div>
        </div>

        {/* Card 3: Overall OEE */}
        <div
          className="kpi-card-theme"
          onClick={() => setActiveSection('smart_kpi')}
          title="Click to view OEE Performance"
        >
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <ActivityIcon size={18} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">▲ +2.4%</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{oee.toFixed(1)}%</span>
          </div>
          <div className="kpi-label">Overall Plant OEE</div>
          <div className="kpi-sub-line font-sm">
            <span>Avail <strong>88.5%</strong></span>
            <span>Perf <strong>92.1%</strong></span>
            <span>Qual <strong>98.4%</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={oeeTimeFrames[globalTimeFrame]}
              timeFrameData={oeeTimeFrames}
              activeTimeFrame={globalTimeFrame}
              onTimeFrameChange={setGlobalTimeFrame}
              color="#2563EB"
              width={160}
              height={26}
              unit="%"
            />
          </div>
        </div>

        {/* Card 4: Active Alarms */}
        <div
          className="kpi-card-theme"
          onClick={() => setActiveSection('maintenance')}
          title="Click to view Alarms & Maintenance"
        >
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square red">
              <AlertIcon size={18} color="#DC2626" />
            </div>
            <span className="kpi-badge-pill red">● 1 Critical</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular" style={{ color: '#DC2626' }}>3</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Active</span>
          </div>
          <div className="kpi-label">Alarms & Anomalies</div>
          <div className="kpi-sub-line font-sm">
            <span>CNC-07 Spindle Vib</span>
            <span>CNC-03 Cycle</span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>Action Required</span>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>Inspect ↗</span>
          </div>
        </div>

        {/* Card 5: Total Power Load */}
        <div
          className="kpi-card-theme"
          onClick={() => setActiveSection('optimization')}
          title="Click to view Energy & Cost Savings"
        >
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square" style={{ background: '#FEF3C7' }}>
              <ZapIcon size={18} color="#D97706" />
            </div>
            <span className="kpi-badge-pill green">▼ -4.1% Peak</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">14.2</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>kW</span>
          </div>
          <div className="kpi-label">Power & Utility Demand</div>
          <div className="kpi-sub-line font-sm">
            <span>PF: <strong>0.94</strong></span>
            <span>Shift: <strong>118.4 kWh</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={powerTimeFrames[globalTimeFrame]}
              timeFrameData={powerTimeFrames}
              activeTimeFrame={globalTimeFrame}
              onTimeFrameChange={setGlobalTimeFrame}
              color="#D97706"
              width={160}
              height={26}
              unit="kW"
            />
          </div>
        </div>
      </div>

      {/* Mid Split Grid: Production Trend & Alarms (Left) + Shift Operations & DAQ (Right) */}
      <div className="overview-mid-grid" style={{ marginBottom: '18px' }}>
        {/* Left Column */}
        <div className="overview-mid-left">
          {/* Panel 1: Production Cadence & Hourly Output Chart */}
          <div className="overview-panel-card">
            <div className="panel-card-header">
              <div className="panel-title-group">
                <h3 className="panel-card-title">Production Cadence & Hourly Output</h3>
                <div className="trend-legend">
                  <span className="legend-item">
                    <span className="legend-dot blue" />
                    <span>Actual Output ({currentChart.actual[currentChart.actual.length - 1]} pcs)</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-line dashed" />
                    <span>Planned Target ({currentChart.target[0]} pcs)</span>
                  </span>
                </div>
              </div>

              {/* In-chart Timeframe Switcher */}
              <div className="time-filter-pill-group">
                {(['1H', '8H', '24H', '7D', '30D'] as TimeFrameKey[]).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={`time-filter-btn ${chartTimeFrame === tf ? 'active' : ''}`}
                    onClick={() => setChartTimeFrame(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="production-trend-chart-wrap">
              <div className="chart-y-axis-label">Output (Parts / Cycle)</div>
              <div className="svg-chart-container" onMouseLeave={() => setHoveredChartPoint(null)}>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="trend-svg"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="prodTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0.25, 0.5, 0.75].map((pct, i) => {
                    const y = paddingY + pct * (chartHeight - paddingY * 2);
                    return (
                      <line
                        key={i}
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="var(--border)"
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Target line (Dashed) */}
                  <path
                    d={targetPathD}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeDasharray="5 5"
                  />

                  {/* Area fill */}
                  <path d={areaPathD} fill="url(#prodTrendGrad)" />

                  {/* Actual series line */}
                  <path
                    d={actualPathD}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Interactive Points */}
                  {pointsActual.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredChartPoint?.time === pt.time ? 6 : 3.5}
                      fill={hoveredChartPoint?.time === pt.time ? '#00E5AE' : '#2563EB'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() =>
                        setHoveredChartPoint({
                          x: pt.x,
                          y: pt.y,
                          time: pt.time,
                          actual: pt.val,
                          target: pt.target,
                        })
                      }
                    />
                  ))}
                </svg>

                {/* Floating tooltip */}
                {hoveredChartPoint && (
                  <div
                    className="chart-floating-tooltip"
                    style={{
                      left: `${(hoveredChartPoint.x / chartWidth) * 100}%`,
                      top: `${hoveredChartPoint.y - 12}px`,
                    }}
                  >
                    <div className="tooltip-time">{hoveredChartPoint.time}</div>
                    <div className="tooltip-row">
                      <span className="dot-tooltip blue" />
                      <span>Actual: <strong>{hoveredChartPoint.actual} parts</strong></span>
                    </div>
                    <div className="tooltip-row">
                      <span className="dot-tooltip" style={{ background: '#94A3B8' }} />
                      <span>Target: {hoveredChartPoint.target} parts</span>
                    </div>
                    <div style={{ fontSize: '10px', color: hoveredChartPoint.actual >= hoveredChartPoint.target ? '#10B981' : '#EF4444', marginTop: '2px', fontWeight: 600 }}>
                      {hoveredChartPoint.actual >= hoveredChartPoint.target
                        ? `+${hoveredChartPoint.actual - hoveredChartPoint.target} parts ahead`
                        : `${hoveredChartPoint.actual - hoveredChartPoint.target} parts behind`}
                    </div>
                  </div>
                )}
              </div>

              {/* X Axis Time Labels */}
              <div className="chart-x-axis-row">
                {currentChart.times.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 2: Active Alarms & Telemetry Anomalies */}
          <div className="overview-panel-card">
            <div className="panel-card-header">
              <div className="panel-title-group">
                <h3 className="panel-card-title">Active Alarms & Telemetry Anomalies (3)</h3>
                <span className="kpi-badge-pill red">Live SCADA Feed</span>
              </div>
              <button
                type="button"
                className="link-view-all-theme"
                onClick={() => setActiveSection('maintenance')}
              >
                View All in Maintenance →
              </button>
            </div>

            <div className="alarms-mini-table-wrap">
              <table className="alarms-mini-table">
                <thead>
                  <tr>
                    <th>Machine</th>
                    <th>Anomaly & Threshold</th>
                    <th>Severity</th>
                    <th>Reported</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeAlarms.map((alarm) => (
                    <tr
                      key={alarm.id}
                      className="alarm-row-click"
                      onClick={() => setActiveAlarmModal(alarm)}
                    >
                      <td>
                        <div className="alarm-machine-id">{alarm.machineId}</div>
                        <div className="alarm-machine-line">{alarm.line}</div>
                      </td>
                      <td>
                        <div className="alarm-desc-title">{alarm.description}</div>
                        <div className="alarm-desc-metric">{alarm.metric}</div>
                      </td>
                      <td>
                        <span className={`badge-severity ${alarm.severity}`}>
                          <span className={`dot-severity ${alarm.severity === 'critical' ? 'red' : 'amber'}`} />
                          {alarm.severity.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="alarm-time-main">{alarm.timeAgo}</div>
                        <div className="alarm-time-sub">{alarm.timestamp}</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-pulse-ai"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveAlarmModal(alarm);
                          }}
                        >
                          Diagnose →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="overview-mid-right">
          {/* Widget 1: Shift Progress */}
          <div className="overview-panel-card">
            <div className="panel-card-header" style={{ marginBottom: '8px' }}>
              <h3 className="panel-card-title" style={{ fontSize: '14px' }}>Shift A Progress</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>06:00 - 14:00</span>
            </div>
            <div className="widget-shift-subhead">Supervisor: Rajesh Kumar · Line 1-3 Active</div>

            <div className="shift-stat-top">
              <span className="shift-big-pct">84%</span>
              <span className="shift-parts-target">3,800 / 4,500 Target</span>
            </div>

            <div className="shift-progress-track">
              <div className="shift-progress-fill" style={{ width: '84.4%' }} />
            </div>

            <div className="shift-bottom-meta">
              <div className="shift-meta-col">
                <span className="shift-meta-label">Remaining</span>
                <span className="shift-meta-val">700 parts</span>
              </div>
              <div className="shift-meta-col">
                <span className="shift-meta-label">Est. Completion</span>
                <span className="shift-meta-val">13:42 PM</span>
              </div>
              <div className="shift-meta-col">
                <span className="shift-meta-label">Pace</span>
                <span className="shift-meta-val" style={{ color: '#16A34A' }}>+37 ahead</span>
              </div>
            </div>
          </div>

          {/* Widget 2: OEE Radial Composition */}
          <div className="overview-panel-card">
            <div className="panel-card-header" style={{ marginBottom: '4px' }}>
              <h3 className="panel-card-title" style={{ fontSize: '14px' }}>OEE Composition</h3>
              <button
                type="button"
                className="link-view-all-theme"
                style={{ fontSize: '11.5px' }}
                onClick={() => setActiveSection('smart_kpi')}
              >
                Details →
              </button>
            </div>

            <div className="oee-donut-row">
              <div className="oee-donut-chart">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle cx="50" cy="50" r="38" stroke="var(--border)" strokeWidth="10" fill="none" />
                  {/* Availability Arc (88.5%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#10B981"
                    strokeWidth="10"
                    strokeDasharray="210 238"
                    strokeDashoffset="0"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Performance Arc (92.1%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="26"
                    stroke="#2563EB"
                    strokeWidth="8"
                    strokeDasharray="150 163"
                    strokeDashoffset="0"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="donut-center-label">
                  <div className="donut-big-val">{oee.toFixed(1)}%</div>
                  <div className="donut-sub-val">OEE</div>
                </div>
              </div>

              <div className="oee-legend-col">
                <div className="oee-legend-line">
                  <span className="dot-status green" />
                  <span className="oee-legend-name">Availability</span>
                  <span className="oee-legend-pct">88.5%</span>
                </div>
                <div className="oee-legend-line">
                  <span className="dot-status blue" />
                  <span className="oee-legend-name">Performance</span>
                  <span className="oee-legend-pct">92.1%</span>
                </div>
                <div className="oee-legend-line">
                  <span className="dot-status cyan" />
                  <span className="oee-legend-name">Quality</span>
                  <span className="oee-legend-pct">98.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: Industrial DAQ & Protocols */}
          <div className="overview-panel-card">
            <div className="panel-card-header" style={{ marginBottom: '4px' }}>
              <h3 className="panel-card-title" style={{ fontSize: '14px' }}>Edge Connectivity & DAQ</h3>
              <button
                type="button"
                className="link-view-all-theme"
                style={{ fontSize: '11.5px' }}
                onClick={() => setActiveSection('edge_signals')}
              >
                Signals →
              </button>
            </div>

            <div className="conn-status-badge">
              <span className="dot-status green pulse" />
              <span>12/12 Protocols Online (100%)</span>
            </div>

            <div className="conn-protocols-table">
              <div className="conn-row">
                <span className="conn-proto-name">OPC UA (Lines 1 & 2)</span>
                <span className="conn-proto-count">4 Machines</span>
                <span className="conn-proto-status green">✓ Active</span>
              </div>
              <div className="conn-row">
                <span className="conn-proto-name">MTConnect (Cell B)</span>
                <span className="conn-proto-count">4 Machines</span>
                <span className="conn-proto-status green">✓ Active</span>
              </div>
              <div className="conn-row">
                <span className="conn-proto-name">FANUC FOCAS (Line 3)</span>
                <span className="conn-proto-count">2 Machines</span>
                <span className="conn-proto-status green">✓ Active</span>
              </div>
              <div className="conn-row">
                <span className="conn-proto-name">MQTT Sparkplug B</span>
                <span className="conn-proto-count">2 Machines</span>
                <span className="conn-proto-status green">✓ Active</span>
              </div>
            </div>

            <div className="conn-divider" />

            <div className="conn-telemetry-meta">
              <div className="conn-meta-row">
                <span>Telemetry Ingestion:</span>
                <strong>2,480 tags/sec</strong>
              </div>
              <div className="conn-meta-row">
                <span>Gateway Latency:</span>
                <strong>12ms · Edge OK</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Machine Fleet Status Table */}
      <div className="overview-panel-card machine-status-card" style={{ marginBottom: '18px' }}>
        <div className="machine-table-header">
          <div className="machine-table-header-left">
            <h3 className="panel-card-title">Live Machine Fleet Status (12 CNCs)</h3>
            <div className="table-filter-pills">
              <button
                type="button"
                className={`table-filter-pill ${tableFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTableFilter('all')}
              >
                All (12)
              </button>
              <button
                type="button"
                className={`table-filter-pill ${tableFilter === 'running' ? 'active' : ''}`}
                onClick={() => setTableFilter('running')}
              >
                Running (9)
              </button>
              <button
                type="button"
                className={`table-filter-pill ${tableFilter === 'idle' ? 'active' : ''}`}
                onClick={() => setTableFilter('idle')}
              >
                Idle (2)
              </button>
              <button
                type="button"
                className={`table-filter-pill ${tableFilter === 'warning' ? 'active' : ''}`}
                onClick={() => setTableFilter('warning')}
              >
                Maint / Warning (1)
              </button>
            </div>
          </div>

          <div className="machine-table-header-right">
            <div className="table-search-box">
              <input
                type="text"
                placeholder="Search machine, part, line..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              className="table-settings-btn"
              onClick={() => setActiveSection('collection')}
              title="Full Machine Telemetry View"
            >
              ↗
            </button>
          </div>
        </div>

        <div className="machine-table-wrapper">
          <table className="machine-status-table">
            <thead>
              <tr>
                <th>Machine ID & Line</th>
                <th>Status</th>
                <th>Workpiece / Part</th>
                <th>Spindle Speed</th>
                <th>Cycle Time</th>
                <th>Parts Output</th>
                <th>OEE %</th>
                <th style={{ textAlign: 'right' }}>Diagnostics</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachineRows.map((m) => {
                const isAlarm = m.status === 'warning' || m.status === 'stopped';
                const spindleRpm = m.id === 'CNC-07' ? '8,400 RPM (Vib high)' : '12,400 RPM';
                const cycleText = m.plc ? `${m.plc.cycleTime}s / ${m.plc.cycleTarget}s` : '142s / 140s';
                const partsCount = m.id === 'CNC-01' ? '420 / 450' : m.id === 'CNC-06' ? '445 / 450' : '385 / 400';
                const oeeVal = m.id === 'CNC-07' ? '68.4%' : m.status === 'idle' ? '74.2%' : '89.5%';

                return (
                  <tr
                    key={m.id}
                    className={`machine-row ${isAlarm ? 'alarm-highlight-row' : ''}`}
                    onClick={() => openMachineDetail(m.id)}
                  >
                    <td>
                      <div className="machine-id-bold">{m.id}</div>
                      <div className="machine-line-text">{m.name || m.line || 'Aero Precision Bay'}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${m.status}`}>
                        <span className={`dot-pill ${m.status === 'running' ? 'green' : m.status === 'idle' ? 'amber' : 'red'}`} />
                        {m.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="machine-prog-mono">{m.workpiece || 'Motor Housing TI-64'}</span>
                    </td>
                    <td>
                      <span className={`machine-spindle ${isAlarm ? 'text-red font-semibold' : ''}`}>
                        {spindleRpm}
                      </span>
                    </td>
                    <td>
                      <span className="machine-cycle">{cycleText}</span>
                    </td>
                    <td>
                      <span className="machine-parts">{partsCount}</span>
                    </td>
                    <td>
                      <span className={`oee-pill-badge ${parseFloat(oeeVal) >= 85 ? 'green' : parseFloat(oeeVal) >= 70 ? 'amber' : 'red'}`}>
                        {oeeVal}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-kpi-sublink"
                        onClick={(e) => {
                          e.stopPropagation();
                          openMachineDetail(m.id);
                        }}
                      >
                        Inspect ↗
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="machine-table-pagination">
          <span className="pagination-count-text">
            Showing {filteredMachineRows.length} of {machines.length} CNC Machines · Auto-synchronizing live
          </span>
          <button
            type="button"
            className="link-view-all-theme"
            onClick={() => setActiveSection('collection')}
          >
            Open Advanced Machine Telemetry Studio →
          </button>
        </div>
      </div>

      {/* Bottom 3 Grid Cards */}
      <div className="overview-bottom-grid">
        {/* Bottom Card 1: Power & Utility Profile */}
        <div
          className="overview-panel-card bot-widget-card"
          onClick={() => setActiveSection('optimization')}
          title="Click to view Energy & ROI"
        >
          <div className="bot-widget-header">
            <div className="bot-widget-title-wrap">
              <ZapIcon size={16} color="#D97706" />
              <h4 className="bot-widget-title">Power Demand Profile</h4>
            </div>
            <span className="bot-widget-link">Energy ↗</span>
          </div>

          <div className="bot-widget-metric-row">
            <span className="bot-widget-big-metric">14.2 kW</span>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>▼ -4.1% vs peak</span>
          </div>

          <div style={{ marginTop: '6px' }}>
            <InteractiveSparkline
              data={powerTimeFrames[globalTimeFrame]}
              timeFrameData={powerTimeFrames}
              activeTimeFrame={globalTimeFrame}
              onTimeFrameChange={setGlobalTimeFrame}
              color="#D97706"
              width={260}
              height={36}
              unit="kW"
            />
          </div>

          <div className="kpi-sub-line font-sm" style={{ marginTop: '10px' }}>
            <span>PF: 0.94</span>
            <span>Peak: 18.5 kW</span>
            <span>Shift Cost: ₹1,420</span>
          </div>
        </div>

        {/* Bottom Card 2: Top 5 Machines by Output */}
        <div
          className="overview-panel-card bot-widget-card"
          onClick={() => setActiveSection('production')}
          title="Click to view Production Cadence"
        >
          <div className="bot-widget-header">
            <div className="bot-widget-title-wrap">
              <BoxIcon size={16} color="#16A34A" />
              <h4 className="bot-widget-title">Top 5 Machines by Output</h4>
            </div>
            <span className="bot-widget-link">Production ↗</span>
          </div>

          <div className="top-machines-bars">
            {[
              { id: 'CNC-06', count: 445, pct: 98 },
              { id: 'CNC-01', count: 420, pct: 93 },
              { id: 'CNC-03', count: 412, pct: 91 },
              { id: 'CNC-05', count: 390, pct: 86 },
              { id: 'CNC-02', count: 385, pct: 85 },
            ].map((item) => (
              <div key={item.id} className="top-bar-item">
                <span className="top-bar-id">{item.id}</span>
                <div className="top-bar-track">
                  <div className="top-bar-fill" style={{ width: `${item.pct}%` }} />
                </div>
                <span className="top-bar-val">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Card 3: Shift Downtime Distribution */}
        <div
          className="overview-panel-card bot-widget-card"
          onClick={() => setActiveSection('downtime')}
          title="Click to view Downtime Root Cause"
        >
          <div className="bot-widget-header">
            <div className="bot-widget-title-wrap">
              <ClockIcon size={16} color="#EF4444" />
              <h4 className="bot-widget-title">Shift Downtime (38 mins)</h4>
            </div>
            <span className="bot-widget-link">Downtime ↗</span>
          </div>

          <div className="downtime-histogram-wrap">
            <div className="hist-bar-cols">
              <div className="hist-col">
                <div className="bar-slice amber" style={{ height: '70%' }} />
                <span>Tool</span>
              </div>
              <div className="hist-col">
                <div className="bar-slice amber" style={{ height: '48%' }} />
                <span>Setup</span>
              </div>
              <div className="hist-col">
                <div className="bar-slice empty" />
                <span>Matl</span>
              </div>
              <div className="hist-col">
                <div className="bar-slice red" style={{ height: '32%' }} />
                <span>Cool</span>
              </div>
              <div className="hist-col">
                <div className="bar-slice empty" />
                <span>QA</span>
              </div>
            </div>
          </div>

          <div className="kpi-sub-line font-sm" style={{ marginTop: '8px' }}>
            <span>Tool Wear: <strong>16m (42%)</strong></span>
            <span>Setup: <strong>11m (29%)</strong></span>
            <span>Coolant: <strong>7m (18%)</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Alarm Diagnostics Modal / Drawer */}
      {activeAlarmModal && (
        <div
          className="modal-backdrop-theme"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 34, 46, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setActiveAlarmModal(null)}
        >
          <div
            className="modal-dialog-theme"
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '560px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className={`badge-severity ${activeAlarmModal.severity}`} style={{ marginBottom: '6px' }}>
                  <span className={`dot-severity ${activeAlarmModal.severity === 'critical' ? 'red' : 'amber'}`} />
                  {activeAlarmModal.severity.toUpperCase()}
                </span>
                <h3 style={{ margin: '4px 0 2px', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeAlarmModal.machineId} — {activeAlarmModal.description}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Code: {activeAlarmModal.code} · Reported: {activeAlarmModal.timestamp} ({activeAlarmModal.timeAgo})
                </span>
              </div>
              <button
                type="button"
                style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setActiveAlarmModal(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>TELEMETRY ANOMALY READOUT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeAlarmModal.metric}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Signal source: {activeAlarmModal.line} · Accelerometer Channel 2 · Sample rate 10 kHz
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                AI ROOT CAUSE & OPERATOR CHECKLIST
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li>Inspect front spindle ceramic hybrid bearings for micro-pitting.</li>
                <li>Verify high-pressure coolant circulation valve is maintaining ≥ 18 bar.</li>
                <li>Check Tool T05 cutting edge wear baseline before next machining cycle.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-pulse-ai"
                onClick={() => {
                  alert(`Alert ${activeAlarmModal.code} for ${activeAlarmModal.machineId} acknowledged by operator.`);
                  setActiveAlarmModal(null);
                }}
              >
                ✓ Acknowledge Alert
              </button>
              <button
                type="button"
                className="btn-export-theme"
                onClick={() => {
                  openMachineDetail(activeAlarmModal.machineId);
                  setActiveAlarmModal(null);
                }}
              >
                Open Machine Telemetry →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
