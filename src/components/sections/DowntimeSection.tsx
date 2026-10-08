'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import {
  ShieldIcon,
  AlertIcon,
  CheckIcon,
  ZapIcon,
  ClockIcon,
  BoxIcon,
  GearIcon,
  ChartIcon,
} from '@/components/common/Icons';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

interface DowntimeEvent {
  id: string;
  time: string;
  machineId: string;
  reason: string;
  duration: string;
  durationMinutes: number;
  type: 'Planned' | 'Unplanned';
}

interface MachineUtilization {
  id: string;
  running: number;
  idle: number;
  setup: number;
  downtime: number;
}

const MACHINE_UTILIZATION_DATA: MachineUtilization[] = [
  { id: 'CNC-01', running: 76, idle: 14, setup: 6, downtime: 4 },
  { id: 'CNC-02', running: 68, idle: 12, setup: 9, downtime: 11 },
  { id: 'CNC-03', running: 84, idle: 9, setup: 4, downtime: 3 },
  { id: 'CNC-04', running: 72, idle: 16, setup: 7, downtime: 5 },
  { id: 'CNC-05', running: 71, idle: 14, setup: 8, downtime: 7 },
  { id: 'CNC-06', running: 65, idle: 17, setup: 10, downtime: 8 },
  { id: 'CNC-07', running: 62, idle: 15, setup: 8, downtime: 15 },
  { id: 'CNC-08', running: 70, idle: 16, setup: 7, downtime: 7 },
  { id: 'CNC-09', running: 75, idle: 13, setup: 6, downtime: 6 },
  { id: 'CNC-10', running: 70, idle: 14, setup: 7, downtime: 9 },
  { id: 'CNC-11', running: 74, idle: 15, setup: 6, downtime: 5 },
  { id: 'CNC-12', running: 72, idle: 16, setup: 7, downtime: 5 },
];

const DOWNTIME_EVENTS: DowntimeEvent[] = [
  {
    id: 'evt-1',
    time: '10:32 AM',
    machineId: 'CNC-07',
    reason: 'Spindle Vibration',
    duration: '18 min',
    durationMinutes: 18,
    type: 'Unplanned',
  },
  {
    id: 'evt-2',
    time: '11:15 AM',
    machineId: 'CNC-10',
    reason: 'Tool Change',
    duration: '12 min',
    durationMinutes: 12,
    type: 'Planned',
  },
  {
    id: 'evt-3',
    time: '12:04 PM',
    machineId: 'CNC-05',
    reason: 'Material Loading',
    duration: '6 min',
    durationMinutes: 6,
    type: 'Planned',
  },
  {
    id: 'evt-4',
    time: '12:18 PM',
    machineId: 'CNC-02',
    reason: 'Hydraulic Pressure Low',
    duration: '25 min',
    durationMinutes: 25,
    type: 'Unplanned',
  },
];

const DOWNTIME_REASONS = [
  { name: 'Tool Change', percent: 28, minutes: 30, color: '#10B981' },
  { name: 'Material Loading', percent: 22, minutes: 24, color: '#FBBF24' },
  { name: 'Breakdown', percent: 19, minutes: 20, color: '#F97316' },
  { name: 'Setup / Program Change', percent: 14, minutes: 15, color: '#A855F7' },
  { name: 'Operator Delay', percent: 11, minutes: 12, color: '#6366F1' },
  { name: 'Others', percent: 6, minutes: 7, color: '#94A3B8' },
];

const OEE_TREND_7D = [
  { date: '25 Sep', oee: 73.8, availability: 87.2, performance: 84.5, quality: 92.1 },
  { date: '26 Sep', oee: 75.2, availability: 88.0, performance: 85.1, quality: 92.8 },
  { date: '27 Sep', oee: 71.4, availability: 85.5, performance: 83.0, quality: 91.5 },
  { date: '28 Sep', oee: 76.0, availability: 88.5, performance: 85.8, quality: 93.0 },
  { date: '29 Sep', oee: 75.1, availability: 87.8, performance: 85.0, quality: 92.5 },
  { date: '30 Sep', oee: 81.2, availability: 91.0, performance: 88.2, quality: 94.0 },
  { date: '1 Oct', oee: 78.4, availability: 89.2, performance: 86.1, quality: 93.1 },
];

const TOP_MACHINES_BY_DOWNTIME = [
  { rank: 1, machineId: 'CNC-07', minutes: 48, color: '#F43F5E', percentWidth: 100, reason: 'Spindle Bearing Heat' },
  { rank: 2, machineId: 'CNC-02', minutes: 35, color: '#F97316', percentWidth: 73, reason: 'Hydraulic Line Pressure' },
  { rank: 3, machineId: 'CNC-10', minutes: 28, color: '#FBBF24', percentWidth: 58, reason: 'Carousel Tool Jam' },
  { rank: 4, machineId: 'CNC-05', minutes: 22, color: '#FDE047', percentWidth: 46, reason: 'Raw Material Feed Waiting' },
  { rank: 5, machineId: 'CNC-11', minutes: 18, color: '#FEF08A', percentWidth: 38, reason: 'Coolant Refill & Clean' },
];

export default function DowntimeSection() {
  const { machines } = useFoundry();

  // Sub-Navigation Tab Filter
  const [activeTab, setActiveTab] = useState<'overview' | 'machine' | 'downtime' | 'shift' | 'trends'>('overview');

  // Filter Dropdowns
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedShift, setSelectedShift] = useState('all');
  const [utilizationFilter, setUtilizationFilter] = useState('today');
  const [trendMetric, setTrendMetric] = useState<'oee' | 'availability' | 'performance' | 'quality'>('oee');
  const [rankingFilter, setRankingFilter] = useState('duration');

  // Hover states for graphs (User rule: show numbers on hover)
  const [hoveredMachineBar, setHoveredMachineBar] = useState<MachineUtilization | null>(null);
  const [hoveredBarPos, setHoveredBarPos] = useState<{ x: number; y: number } | null>(null);

  const [hoveredReason, setHoveredReason] = useState<typeof DOWNTIME_REASONS[0] | null>(null);

  const [activeTrendIdx, setActiveTrendIdx] = useState<number | null>(null);
  const trendSvgRef = useRef<SVGSVGElement | null>(null);

  // Modal / Drill-down for Event
  const [selectedEvent, setSelectedEvent] = useState<DowntimeEvent | null>(null);

  // OEE Trend SVG Geometry
  const trendW = 380;
  const trendH = 175;
  const padLeft = 38;
  const padRight = 32;
  const padTop = 32; // extra room for 78.4% callout badge
  const padBottom = 26;

  const innerW = trendW - padLeft - padRight;
  const innerH = trendH - padTop - padBottom;

  const getTrendX = (idx: number) => padLeft + (idx / (OEE_TREND_7D.length - 1)) * innerW;
  const getTrendY = (val: number) => padTop + innerH - (val / 100) * innerH;

  const oeeLinePath = useMemo(() => {
    return OEE_TREND_7D.reduce((acc, pt, idx) => {
      const val = pt[trendMetric] as number;
      const x = getTrendX(idx);
      const y = getTrendY(val);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [trendMetric]);

  const handleTrendMouseMove = (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
    if (!trendSvgRef.current) return;
    const rect = trendSvgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const boundedX = Math.max(padLeft, Math.min(padLeft + innerW, mouseX));
    const ratio = (boundedX - padLeft) / innerW;
    const idx = Math.round(ratio * (OEE_TREND_7D.length - 1));
    setActiveTrendIdx(idx);
  };

  const handleTrendMouseLeave = () => {
    setActiveTrendIdx(null);
  };

  // Donut chart geometry (Radius 64, Hole 42)
  const donutR = 64;
  const donutHole = 42;
  const donutCenter = 85;

  let cumulativeAngle = -90;
  const donutSlices = DOWNTIME_REASONS.map((item) => {
    const angle = (item.percent / 100) * 360;
    const startA = cumulativeAngle;
    const endA = cumulativeAngle + angle;
    cumulativeAngle = endA;

    const startRad = (startA * Math.PI) / 180;
    const endRad = (endA * Math.PI) / 180;

    const x1Outer = donutCenter + donutR * Math.cos(startRad);
    const y1Outer = donutCenter + donutR * Math.sin(startRad);
    const x2Outer = donutCenter + donutR * Math.cos(endRad);
    const y2Outer = donutCenter + donutR * Math.sin(endRad);

    const x1Inner = donutCenter + donutHole * Math.cos(endRad);
    const y1Inner = donutCenter + donutHole * Math.sin(endRad);
    const x2Inner = donutCenter + donutHole * Math.cos(startRad);
    const y2Inner = donutCenter + donutHole * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1Outer} ${y1Outer}`,
      `A ${donutR} ${donutR} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
      `L ${x1Inner} ${y1Inner}`,
      `A ${donutHole} ${donutHole} 0 ${largeArc} 0 ${x2Inner} ${y2Inner}`,
      'Z',
    ].join(' ');

    return {
      ...item,
      pathData,
    };
  });

  return (
    <section className="section-wrapper oe-page-container">
      {/* ============================================================== */}
      {/* HEADER & SUB-NAV ROW                                           */}
      {/* ============================================================== */}
      <div className="oe-header-block">
        <div>
          <h1 className="page-hero-title" style={{ fontSize: '20px', marginBottom: '3px' }}>
            Downtime & OEE Analytics
          </h1>
          <p className="page-hero-desc" style={{ fontSize: '13px', margin: 0 }}>
            Understand machine utilization, downtime reasons, and overall equipment effectiveness
          </p>
        </div>
      </div>

      {/* Sub-Navigation & Filters Bar */}
      <div className="oe-controls-bar">
        {/* Left Pill Group */}
        <div className="oe-pill-group">
          <button
            type="button"
            className={`oe-nav-pill ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`oe-nav-pill ${activeTab === 'machine' ? 'active' : ''}`}
            onClick={() => setActiveTab('machine')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Machine Wise</span>
          </button>

          <button
            type="button"
            className={`oe-nav-pill ${activeTab === 'downtime' ? 'active' : ''}`}
            onClick={() => setActiveTab('downtime')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Downtime Analysis</span>
          </button>

          <button
            type="button"
            className={`oe-nav-pill ${activeTab === 'shift' ? 'active' : ''}`}
            onClick={() => setActiveTab('shift')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Shift Analysis</span>
          </button>

          <button
            type="button"
            className={`oe-nav-pill ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span>OEE Trends</span>
          </button>
        </div>

        {/* Right Filter Dropdowns */}
        <div className="oe-filters-group">
          <div className="oe-dropdown-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="oe-select-icon-left">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <select
              className="oe-filter-select with-left-icon"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="today">Today, 1 Oct 2026</option>
              <option value="yesterday">Yesterday, 30 Sep 2026</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="oe-dropdown-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="oe-select-icon-left">
              <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            </svg>
            <select
              className="oe-filter-select with-left-icon"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="all">All Shifts</option>
              <option value="shift-a">Shift A (06:00 - 14:00)</option>
              <option value="shift-b">Shift B (14:00 - 22:00)</option>
              <option value="shift-c">Shift C (22:00 - 06:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ROW 1: THE 4 OEE COMPONENT METRIC CARDS                        */}
      {/* ============================================================== */}
      <div className="overview-kpi-row-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '18px' }}>
        {/* Card 1: Factory OEE */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">▲ +2.1% OEE</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">78.4%</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>/ 85% Target</span>
          </div>
          <div className="kpi-label">Factory Overall OEE</div>
          <div className="kpi-sub-line font-sm">
            <span>Availability: <strong>89.2%</strong> · Perf: <strong>86.1%</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={[
                { label: '08:00', value: 76.5, formatted: '76.5%' },
                { label: '10:00', value: 77.2, formatted: '77.2%' },
                { label: '12:00', value: 78.1, formatted: '78.1%' },
                { label: '13:00', value: 78.4, formatted: '78.4%' },
              ]}
              timeFrameData={{
                '1H': [
                  { label: '12:10', value: 78.0, formatted: '78.0%' },
                  { label: '12:30', value: 78.2, formatted: '78.2%' },
                  { label: '13:00', value: 78.4, formatted: '78.4%' },
                ],
                '8H': [
                  { label: '08:00', value: 76.5, formatted: '76.5%' },
                  { label: '10:00', value: 77.2, formatted: '77.2%' },
                  { label: '12:00', value: 78.1, formatted: '78.1%' },
                  { label: '13:00', value: 78.4, formatted: '78.4%' },
                ],
                '24H': [
                  { label: '00:00', value: 74.5, formatted: '74.5%' },
                  { label: '08:00', value: 76.5, formatted: '76.5%' },
                  { label: 'Now', value: 78.4, formatted: '78.4%' },
                ],
                '7D': [
                  { label: 'Thu', value: 75.8, formatted: '75.8%' },
                  { label: 'Fri', value: 77.0, formatted: '77.0%' },
                  { label: 'Today', value: 78.4, formatted: '78.4%' },
                ],
                '30D': [
                  { label: 'W1', value: 75.2, formatted: '75.2%' },
                  { label: 'W2', value: 76.8, formatted: '76.8%' },
                  { label: 'Cur', value: 78.4, formatted: '78.4%' },
                ],
              }}
              activeTimeFrame="8H"
              color="#16A34A"
              width={180}
              height={26}
              unit="%"
            />
          </div>
        </div>

        {/* Card 2: Availability */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <GearIcon size={18} color="#0D9488" />
            </div>
            <span className="kpi-badge-pill green">▲ +1.3% Avail</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">89.2%</span>
          </div>
          <div className="kpi-label">Machine Availability</div>
          <div className="kpi-sub-line font-sm">
            <span>Uptime: <strong>19.2 / 21.5 hrs</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={[
                { label: '08:00', value: 87.8, formatted: '87.8%' },
                { label: '10:00', value: 88.5, formatted: '88.5%' },
                { label: '12:00', value: 89.0, formatted: '89.0%' },
                { label: '13:00', value: 89.2, formatted: '89.2%' },
              ]}
              timeFrameData={{
                '1H': [
                  { label: '12:10', value: 89.0, formatted: '89.0%' },
                  { label: '12:30', value: 89.1, formatted: '89.1%' },
                  { label: '13:00', value: 89.2, formatted: '89.2%' },
                ],
                '8H': [
                  { label: '08:00', value: 87.8, formatted: '87.8%' },
                  { label: '10:00', value: 88.5, formatted: '88.5%' },
                  { label: '12:00', value: 89.0, formatted: '89.0%' },
                  { label: '13:00', value: 89.2, formatted: '89.2%' },
                ],
                '24H': [
                  { label: '00:00', value: 86.5, formatted: '86.5%' },
                  { label: '08:00', value: 87.8, formatted: '87.8%' },
                  { label: 'Now', value: 89.2, formatted: '89.2%' },
                ],
                '7D': [
                  { label: 'Thu', value: 88.0, formatted: '88.0%' },
                  { label: 'Fri', value: 88.8, formatted: '88.8%' },
                  { label: 'Today', value: 89.2, formatted: '89.2%' },
                ],
                '30D': [
                  { label: 'W1', value: 87.5, formatted: '87.5%' },
                  { label: 'W2', value: 88.4, formatted: '88.4%' },
                  { label: 'Cur', value: 89.2, formatted: '89.2%' },
                ],
              }}
              activeTimeFrame="8H"
              color="#0D9488"
              width={180}
              height={26}
              unit="%"
            />
          </div>
        </div>

        {/* Card 3: Performance */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <ZapIcon size={18} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">▲ +0.8% Perf</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">86.1%</span>
          </div>
          <div className="kpi-label">Performance Efficiency</div>
          <div className="kpi-sub-line font-sm">
            <span>Cycle Time: <strong>42s (Target 40s)</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={[
                { label: '08:00', value: 84.8, formatted: '84.8%' },
                { label: '10:00', value: 85.5, formatted: '85.5%' },
                { label: '12:00', value: 86.0, formatted: '86.0%' },
                { label: '13:00', value: 86.1, formatted: '86.1%' },
              ]}
              timeFrameData={{
                '1H': [
                  { label: '12:10', value: 85.9, formatted: '85.9%' },
                  { label: '12:30', value: 86.0, formatted: '86.0%' },
                  { label: '13:00', value: 86.1, formatted: '86.1%' },
                ],
                '8H': [
                  { label: '08:00', value: 84.8, formatted: '84.8%' },
                  { label: '10:00', value: 85.5, formatted: '85.5%' },
                  { label: '12:00', value: 86.0, formatted: '86.0%' },
                  { label: '13:00', value: 86.1, formatted: '86.1%' },
                ],
                '24H': [
                  { label: '00:00', value: 83.5, formatted: '83.5%' },
                  { label: '08:00', value: 84.8, formatted: '84.8%' },
                  { label: 'Now', value: 86.1, formatted: '86.1%' },
                ],
                '7D': [
                  { label: 'Thu', value: 85.0, formatted: '85.0%' },
                  { label: 'Fri', value: 85.6, formatted: '85.6%' },
                  { label: 'Today', value: 86.1, formatted: '86.1%' },
                ],
                '30D': [
                  { label: 'W1', value: 84.5, formatted: '84.5%' },
                  { label: 'W2', value: 85.3, formatted: '85.3%' },
                  { label: 'Cur', value: 86.1, formatted: '86.1%' },
                ],
              }}
              activeTimeFrame="8H"
              color="#2563EB"
              width={180}
              height={26}
              unit="%"
            />
          </div>
        </div>

        {/* Card 4: Quality */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square" style={{ background: '#FEF3C7' }}>
              <ShieldIcon size={18} color="#D97706" />
            </div>
            <span className="kpi-badge-pill green">▲ +1.6% Yield</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">93.1%</span>
          </div>
          <div className="kpi-label">Quality First-Pass Yield</div>
          <div className="kpi-sub-line font-sm">
            <span>Good Parts: <strong>4,731 / 5,080</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={[
                { label: '08:00', value: 92.1, formatted: '92.1%' },
                { label: '10:00', value: 92.6, formatted: '92.6%' },
                { label: '12:00', value: 93.0, formatted: '93.0%' },
                { label: '13:00', value: 93.1, formatted: '93.1%' },
              ]}
              timeFrameData={{
                '1H': [
                  { label: '12:10', value: 93.0, formatted: '93.0%' },
                  { label: '12:30', value: 93.0, formatted: '93.0%' },
                  { label: '13:00', value: 93.1, formatted: '93.1%' },
                ],
                '8H': [
                  { label: '08:00', value: 92.1, formatted: '92.1%' },
                  { label: '10:00', value: 92.6, formatted: '92.6%' },
                  { label: '12:00', value: 93.0, formatted: '93.0%' },
                  { label: '13:00', value: 93.1, formatted: '93.1%' },
                ],
                '24H': [
                  { label: '00:00', value: 91.2, formatted: '91.2%' },
                  { label: '08:00', value: 92.1, formatted: '92.1%' },
                  { label: 'Now', value: 93.1, formatted: '93.1%' },
                ],
                '7D': [
                  { label: 'Thu', value: 92.4, formatted: '92.4%' },
                  { label: 'Fri', value: 92.8, formatted: '92.8%' },
                  { label: 'Today', value: 93.1, formatted: '93.1%' },
                ],
                '30D': [
                  { label: 'W1', value: 91.8, formatted: '91.8%' },
                  { label: 'W2', value: 92.5, formatted: '92.5%' },
                  { label: 'Cur', value: 93.1, formatted: '93.1%' },
                ],
              }}
              activeTimeFrame="8H"
              color="#D97706"
              width={180}
              height={26}
              unit="%"
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ROW 2: MID SECTION (Machine Utilization + Downtime Events)     */}
      {/* ============================================================== */}
      <div className="oe-mid-grid">
        {/* Left: Machine Utilization & Downtime Stacked Chart */}
        <div className="oe-panel-card oe-utilization-card">
          <div className="oe-card-header">
            <div className="oe-hdr-left">
              <div className="oe-icon-badge green">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#108A4F" strokeWidth="2.5">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h2 className="oe-card-title">Machine Utilization & Downtime</h2>
            </div>

            <div className="oe-hdr-right">
              {/* Legend matching screenshot */}
              <div className="oe-legend-inline">
                <span className="oe-leg-item">
                  <span className="oe-dot green" /> Running
                </span>
                <span className="oe-leg-item">
                  <span className="oe-dot yellow" /> Idle
                </span>
                <span className="oe-leg-item">
                  <span className="oe-dot orange" /> Setup
                </span>
                <span className="oe-leg-item">
                  <span className="oe-dot red" /> Downtime
                </span>
              </div>

              <select
                className="oe-dropdown-select-mini"
                value={utilizationFilter}
                onChange={(e) => setUtilizationFilter(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>

          {/* Stacked Bar Chart for 12 Machines */}
          <div className="oe-stacked-chart-container">
            {/* Y-Axis Labels */}
            <div className="oe-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Grid & Bars Container */}
            <div className="oe-bars-surface">
              {/* Horizontal Gridlines */}
              <div className="oe-gridline" style={{ top: '0%' }} />
              <div className="oe-gridline" style={{ top: '25%' }} />
              <div className="oe-gridline" style={{ top: '50%' }} />
              <div className="oe-gridline" style={{ top: '75%' }} />
              <div className="oe-gridline" style={{ top: '100%' }} />

              {/* 12 Machine Stacked Columns */}
              <div className="oe-columns-row">
                {MACHINE_UTILIZATION_DATA.map((mach) => {
                  const isHovered = hoveredMachineBar?.id === mach.id;
                  return (
                    <div
                      key={mach.id}
                      className={`oe-bar-column ${isHovered ? 'active' : ''}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredMachineBar(mach);
                        setHoveredBarPos({ x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      onMouseLeave={() => {
                        setHoveredMachineBar(null);
                        setHoveredBarPos(null);
                      }}
                    >
                      <div className="oe-stacked-bar">
                        {/* Red: Downtime (top) */}
                        <div
                          className="oe-bar-segment red"
                          style={{ height: `${mach.downtime}%` }}
                        />
                        {/* Orange: Setup */}
                        <div
                          className="oe-bar-segment orange"
                          style={{ height: `${mach.setup}%` }}
                        />
                        {/* Yellow: Idle */}
                        <div
                          className="oe-bar-segment yellow"
                          style={{ height: `${mach.idle}%` }}
                        />
                        {/* Green: Running (bottom) */}
                        <div
                          className="oe-bar-segment green"
                          style={{ height: `${mach.running}%` }}
                        />
                      </div>
                      <span className="oe-x-label">{mach.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Floating Tooltip showing exact numbers on hover */}
            {hoveredMachineBar && (
              <div
                className="oe-floating-bar-tooltip"
                style={{
                  left: `${((MACHINE_UTILIZATION_DATA.findIndex((m) => m.id === hoveredMachineBar.id) + 0.5) / 12) * 100}%`,
                }}
              >
                <div className="oe-tip-title">{hoveredMachineBar.id} Shift Utilization</div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot green" />
                  <span>Running:</span>
                  <strong className="tabular">{hoveredMachineBar.running}%</strong>
                  <span className="oe-tip-hours">({((hoveredMachineBar.running / 100) * 21.5).toFixed(1)} hrs)</span>
                </div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot yellow" />
                  <span>Idle:</span>
                  <strong className="tabular">{hoveredMachineBar.idle}%</strong>
                  <span className="oe-tip-hours">({((hoveredMachineBar.idle / 100) * 21.5).toFixed(1)} hrs)</span>
                </div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot orange" />
                  <span>Setup:</span>
                  <strong className="tabular">{hoveredMachineBar.setup}%</strong>
                  <span className="oe-tip-hours">({((hoveredMachineBar.setup / 100) * 21.5).toFixed(1)} hrs)</span>
                </div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot red" />
                  <span>Downtime:</span>
                  <strong className="tabular" style={{ color: '#EF4444' }}>{hoveredMachineBar.downtime}%</strong>
                  <span className="oe-tip-hours">({((hoveredMachineBar.downtime / 100) * 21.5).toFixed(1)} hrs)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Current Downtime Events List */}
        <div className="oe-panel-card oe-events-card">
          <div className="oe-card-header">
            <div className="oe-hdr-left">
              <div className="oe-icon-badge-red-ring">
                <span className="oe-ring-circle" />
              </div>
              <h2 className="oe-card-title">Current Downtime Events</h2>
            </div>
            <button
              className="oe-btn-subtle"
              type="button"
              onClick={() => setActiveTab('downtime')}
            >
              View All
            </button>
          </div>

          <div className="oe-events-list">
            {DOWNTIME_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="oe-event-row"
                onClick={() => setSelectedEvent(evt)}
              >
                <div className="oe-evt-left">
                  <span className={`oe-evt-status-dot ${evt.type === 'Unplanned' ? 'red' : 'yellow'}`} />
                  <span className="oe-evt-time tabular">{evt.time}</span>
                  <span className="oe-evt-mach mono-strong">{evt.machineId}</span>
                  <span className="oe-evt-reason">{evt.reason}</span>
                </div>

                <div className="oe-evt-right">
                  <span className="oe-evt-duration tabular">{evt.duration}</span>
                  <span className={`oe-evt-pill ${evt.type === 'Unplanned' ? 'unplanned' : 'planned'}`}>
                    {evt.type}
                  </span>
                  <span className="oe-evt-chevron">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ROW 3: BOTTOM SECTION (3 Columns Grid)                         */}
      {/* ============================================================== */}
      <div className="oe-bottom-grid">
        {/* Col 1: Downtime Reason Analysis Donut */}
        <div className="oe-panel-card oe-reason-card">
          <div className="oe-card-header">
            <div className="oe-hdr-left">
              <div className="oe-icon-badge blue-circle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 12 2" />
                </svg>
              </div>
              <h3 className="oe-card-title">Downtime Reason Analysis</h3>
            </div>
          </div>

          <div className="oe-donut-layout">
            {/* SVG Donut */}
            <div className="oe-donut-svg-box">
              <svg width="170" height="170" viewBox="0 0 170 170">
                {donutSlices.map((slice) => {
                  const isHovered = hoveredReason?.name === slice.name;
                  return (
                    <path
                      key={slice.name}
                      d={slice.pathData}
                      fill={slice.color}
                      opacity={hoveredReason ? (isHovered ? 1 : 0.45) : 0.95}
                      transform={isHovered ? 'scale(1.04)' : 'scale(1)'}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transformOrigin: '85px 85px',
                      }}
                      onMouseEnter={() => setHoveredReason(slice)}
                      onMouseLeave={() => setHoveredReason(null)}
                    />
                  );
                })}

                {/* Donut Center Display */}
                <text
                  x={donutCenter}
                  y={donutCenter - 4}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="21"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {hoveredReason ? `${hoveredReason.minutes}m` : '1.8 hrs'}
                </text>
                <text
                  x={donutCenter}
                  y={donutCenter + 14}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontWeight="600"
                >
                  {hoveredReason ? hoveredReason.name : 'Total Downtime'}
                </text>
              </svg>
            </div>

            {/* Reason Legend Table with exact % and minutes */}
            <div className="oe-reason-legend-list">
              {DOWNTIME_REASONS.map((reason) => {
                const isHovered = hoveredReason?.name === reason.name;
                return (
                  <div
                    key={reason.name}
                    className={`oe-reason-row ${isHovered ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredReason(reason)}
                    onMouseLeave={() => setHoveredReason(null)}
                  >
                    <div className="oe-reason-name-wrap">
                      <span className="oe-reason-dot" style={{ background: reason.color }} />
                      <span className="oe-reason-label">{reason.name}</span>
                    </div>
                    <div className="oe-reason-metrics">
                      <span className="oe-reason-pct tabular">{reason.percent}%</span>
                      <span className="oe-reason-min tabular">{reason.minutes} min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 2: OEE Trend (Last 7 Days) */}
        <div className="oe-panel-card oe-trend-card">
          <div className="oe-card-header">
            <div className="oe-hdr-left">
              <div className="oe-icon-badge green">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#108A4F" strokeWidth="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <h3 className="oe-card-title">OEE Trend (Last 7 Days)</h3>
            </div>
            <select
              className="oe-dropdown-select-mini"
              value={trendMetric}
              onChange={(e) => setTrendMetric(e.target.value as any)}
            >
              <option value="oee">OEE</option>
              <option value="availability">Availability</option>
              <option value="performance">Performance</option>
              <option value="quality">Quality</option>
            </select>
          </div>

          <div
            className="oe-trend-surface-wrapper"
            onMouseMove={handleTrendMouseMove}
            onMouseLeave={handleTrendMouseLeave}
          >
            <svg
              ref={trendSvgRef}
              className="oe-trend-svg"
              viewBox={`0 0 ${trendW} ${trendH}`}
            >
              <defs>
                <linearGradient id="oeeFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Gridlines */}
              {[100, 75, 50, 25, 0].map((val, i) => {
                const y = padTop + (i / 4) * innerH;
                return (
                  <g key={val}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={padLeft + innerW}
                      y2={y}
                      stroke="var(--border)"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={padLeft - 6}
                      y={y + 3.5}
                      textAnchor="end"
                      fill="var(--text-muted)"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* X Date Labels */}
              {OEE_TREND_7D.map((pt, idx) => {
                const x = getTrendX(idx);
                return (
                  <text
                    key={pt.date}
                    x={x}
                    y={trendH - 8}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                  >
                    {pt.date}
                  </text>
                );
              })}

              {/* Shaded Area */}
              <path
                d={`${oeeLinePath} L ${getTrendX(OEE_TREND_7D.length - 1)},${padTop + innerH} L ${getTrendX(0)},${padTop + innerH} Z`}
                fill="url(#oeeFillGrad)"
              />

              {/* Main Line */}
              <path
                d={oeeLinePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots on line */}
              {OEE_TREND_7D.map((pt, idx) => {
                const val = pt[trendMetric] as number;
                const x = getTrendX(idx);
                const y = getTrendY(val);
                const isLast = idx === OEE_TREND_7D.length - 1;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={isLast ? 4 : 3}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth={isLast ? 2 : 1.5}
                  />
                );
              })}

              {/* Callout Badge for Latest Day: 78.4% */}
              <g transform={`translate(${getTrendX(6) - 18}, ${getTrendY(OEE_TREND_7D[6].oee) - 26})`}>
                <rect
                  x="0"
                  y="0"
                  width="38"
                  height="18"
                  rx="4"
                  fill="#0B1210"
                />
                <text
                  x="19"
                  y="12"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  78.4%
                </text>
              </g>

              {/* Hover Crosshair and Dot */}
              {activeTrendIdx !== null && (
                <g>
                  <line
                    x1={getTrendX(activeTrendIdx)}
                    y1={padTop}
                    x2={getTrendX(activeTrendIdx)}
                    y2={padTop + innerH}
                    stroke="var(--accent-teal)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={getTrendX(activeTrendIdx)}
                    cy={getTrendY(OEE_TREND_7D[activeTrendIdx][trendMetric] as number)}
                    r="5"
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {/* Floating Tooltip displaying exact numbers on hover */}
            {activeTrendIdx !== null && (
              <div
                className="oe-floating-trend-tooltip"
                style={{
                  left: `${(getTrendX(activeTrendIdx) / trendW) * 100}%`,
                  transform: activeTrendIdx > 4 ? 'translate(-105%, -65%)' : 'translate(10%, -65%)',
                }}
              >
                <div className="oe-tip-title">{OEE_TREND_7D[activeTrendIdx].date} OEE Summary</div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot green" />
                  <span>OEE:</span>
                  <strong className="tabular" style={{ color: '#10B981' }}>{OEE_TREND_7D[activeTrendIdx].oee}%</strong>
                </div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot blue" />
                  <span>Availability:</span>
                  <strong className="tabular">{OEE_TREND_7D[activeTrendIdx].availability}%</strong>
                </div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot purple" />
                  <span>Performance:</span>
                  <strong className="tabular">{OEE_TREND_7D[activeTrendIdx].performance}%</strong>
                </div>
                <div className="oe-tip-line">
                  <span className="oe-tip-dot red" />
                  <span>Quality:</span>
                  <strong className="tabular">{OEE_TREND_7D[activeTrendIdx].quality}%</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Col 3: Top Machines by Downtime */}
        <div className="oe-panel-card oe-top-machines-card">
          <div className="oe-card-header">
            <div className="oe-hdr-left">
              <div className="oe-icon-badge-red-circle">
                <ClockIcon size={14} color="#EF4444" />
              </div>
              <h3 className="oe-card-title">Top Machines by Downtime</h3>
            </div>

            <select
              className="oe-dropdown-select-mini"
              value={rankingFilter}
              onChange={(e) => setRankingFilter(e.target.value)}
            >
              <option value="duration">By Duration</option>
              <option value="frequency">By Frequency</option>
              <option value="cost">By Lost Cost</option>
            </select>
          </div>

          <div className="oe-ranked-list">
            {TOP_MACHINES_BY_DOWNTIME.map((item) => (
              <div
                key={item.rank}
                className="oe-ranked-row"
                title={`${item.machineId}: ${item.minutes} minutes downtime due to ${item.reason}`}
              >
                <span className="oe-rank-num tabular">{item.rank}</span>
                <span className="oe-rank-mach mono-strong">{item.machineId}</span>
                <div className="oe-rank-bar-wrap">
                  <div
                    className="oe-rank-bar-fill"
                    style={{
                      width: `${item.percentWidth}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="oe-rank-minutes tabular">{item.minutes} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* EVENT DRILL-DOWN MODAL                                         */}
      {/* ============================================================== */}
      {selectedEvent && (
        <div className="qk-modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="qk-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="qk-modal-header">
              <div className="qk-hdr-left">
                <span className={`oe-evt-status-dot ${selectedEvent.type === 'Unplanned' ? 'red' : 'yellow'}`} />
                <h3 className="qk-card-title">
                  {selectedEvent.machineId} · {selectedEvent.reason}
                </h3>
              </div>
              <button className="qk-icon-btn" onClick={() => setSelectedEvent(null)}>
                ✕
              </button>
            </div>
            <div className="qk-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Machine ID:</span>{' '}
                  <strong className="mono">{selectedEvent.machineId}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Event Time:</span>{' '}
                  <strong className="tabular">{selectedEvent.time}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Duration:</span>{' '}
                  <strong className="tabular">{selectedEvent.duration}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Category:</span>{' '}
                  <span className={`oe-evt-pill ${selectedEvent.type === 'Unplanned' ? 'unplanned' : 'planned'}`}>
                    {selectedEvent.type}
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-panel-2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Resolution Notes:</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Maintenance team dispatched at 10:34 AM. Sensor accelerometer telemetry confirmed vibration peak at 0.92 mm/s. Spindle bearing re-lubricated and cutting tool seated. Normal operation resumed.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
