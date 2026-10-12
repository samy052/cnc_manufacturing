'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import {
  CameraIcon,
  ShieldIcon,
  AlertIcon,
  CheckIcon,
  ZapIcon,
  ActivityIcon,
  ClockIcon,
  ArrowRightIcon,
  BoxIcon,
  BotIcon,
} from '@/components/common/Icons';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

interface InspectionRecord {
  id: string;
  partId: string;
  time: string;
  timestamp: number;
  result: 'PASS' | 'FAIL';
  defect: string;
  dimension: string;
  confidence: number;
  image: string;
  partType: string;
  isNew?: boolean;
}

interface TrendPoint {
  time: string;
  goodRate: number;
  defectRate: number;
  inspected: number;
  defects: number;
}

interface PartTemplate {
  name: string;
  machineId: string;
  batch: string;
  dimBase: number;
  tol: string;
  image: string;
  box: { left: number; top: number; width: number; height: number };
}

const PASS_PARTS: PartTemplate[] = [
  {
    name: 'Housing Component',
    machineId: 'CNC-04',
    batch: 'BATCH-2026-092',
    dimBase: 25.04,
    tol: '±0.05 mm',
    image: '/inspection_part.jpg',
    box: { left: 34, top: 28, width: 32, height: 44 },
  },
  {
    name: 'Precision Bevel Gear',
    machineId: 'CNC-01',
    batch: 'BATCH-2026-095',
    dimBase: 48.20,
    tol: '±0.04 mm',
    image: '/inspection_part_gear.jpg',
    box: { left: 36, top: 34, width: 32, height: 42 },
  },
  {
    name: 'Turned Cylinder Sleeve',
    machineId: 'CNC-03',
    batch: 'BATCH-2026-098',
    dimBase: 64.50,
    tol: '±0.06 mm',
    image: '/inspection_part_cylinder.jpg',
    box: { left: 38, top: 38, width: 34, height: 40 },
  },
];

const DEFECT_PART: PartTemplate = {
  name: 'Housing Component (Defect)',
  machineId: 'CNC-02',
  batch: 'BATCH-2026-092',
  dimBase: 25.14,
  tol: '±0.05 mm',
  image: '/inspection_part_defect.jpg',
  box: { left: 33, top: 30, width: 34, height: 44 },
};

const INITIAL_RECORDS: InspectionRecord[] = [
  { id: 'rec-1', partId: 'PRT-2452', time: '12:46:21', timestamp: Date.now() - 3000, result: 'PASS', defect: 'None', dimension: '25.04 mm', confidence: 97.3, image: '/inspection_part.jpg', partType: 'Housing Component' },
  { id: 'rec-2', partId: 'PRT-2451', time: '12:46:18', timestamp: Date.now() - 6000, result: 'PASS', defect: 'None', dimension: '48.21 mm', confidence: 98.1, image: '/inspection_part_gear.jpg', partType: 'Precision Bevel Gear' },
  { id: 'rec-3', partId: 'PRT-2450', time: '12:46:14', timestamp: Date.now() - 10000, result: 'FAIL', defect: 'Scratch', dimension: '25.14 mm', confidence: 89.4, image: '/inspection_part_defect.jpg', partType: 'Housing Component' },
  { id: 'rec-4', partId: 'PRT-2449', time: '12:46:11', timestamp: Date.now() - 13000, result: 'PASS', defect: 'None', dimension: '64.52 mm', confidence: 97.8, image: '/inspection_part_cylinder.jpg', partType: 'Turned Cylinder Sleeve' },
  { id: 'rec-5', partId: 'PRT-2448', time: '12:46:08', timestamp: Date.now() - 16000, result: 'PASS', defect: 'None', dimension: '25.05 mm', confidence: 96.9, image: '/inspection_part.jpg', partType: 'Housing Component' },
  { id: 'rec-6', partId: 'PRT-2447', time: '12:46:05', timestamp: Date.now() - 19000, result: 'PASS', defect: 'None', dimension: '48.19 mm', confidence: 98.6, image: '/inspection_part_gear.jpg', partType: 'Precision Bevel Gear' },
  { id: 'rec-7', partId: 'PRT-2446', time: '12:46:01', timestamp: Date.now() - 23000, result: 'PASS', defect: 'None', dimension: '25.04 mm', confidence: 97.5, image: '/inspection_part.jpg', partType: 'Housing Component' },
  { id: 'rec-8', partId: 'PRT-2445', time: '12:45:58', timestamp: Date.now() - 26000, result: 'FAIL', defect: 'Burr', dimension: '25.09 mm', confidence: 91.2, image: '/inspection_part_defect.jpg', partType: 'Housing Component' },
];

const TREND_DATA_8H: TrendPoint[] = [
  { time: '08:00', goodRate: 98.8, defectRate: 1.2, inspected: 310, defects: 4 },
  { time: '09:00', goodRate: 98.5, defectRate: 1.5, inspected: 325, defects: 5 },
  { time: '10:00', goodRate: 98.1, defectRate: 1.9, inspected: 305, defects: 6 },
  { time: '11:00', goodRate: 96.8, defectRate: 3.2, inspected: 318, defects: 10 },
  { time: '12:00', goodRate: 95.4, defectRate: 4.6, inspected: 330, defects: 15 },
  { time: '13:00', goodRate: 97.2, defectRate: 2.8, inspected: 295, defects: 8 },
  { time: '14:00', goodRate: 98.4, defectRate: 1.6, inspected: 312, defects: 5 },
  { time: '15:00', goodRate: 98.2, defectRate: 1.8, inspected: 257, defects: 4 },
];

const DEFECT_TYPES = [
  { name: 'Scratch', count: 18, percent: 40.9, color: '#EF4444' },
  { name: 'Burr', count: 10, percent: 22.7, color: '#6366F1' },
  { name: 'Dimension', count: 8, percent: 18.2, color: '#0EA5E9' },
  { name: 'Dent', count: 5, percent: 11.4, color: '#F59E0B' },
  { name: 'Crack', count: 3, percent: 6.8, color: '#EC4899' },
];

export default function VisionSection() {
  const { isLive, t } = useFoundry();

  // Audio Beep Sound System (Web Audio API)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playIndustrialAlertBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Tone 1: Industrial warning alert pitch (880 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // Tone 2: Higher urgency alert pitch (1180 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1180, now + 0.13);
      gain2.gain.setValueAtTime(0.26, now + 0.13);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.13);
      osc2.stop(now + 0.33);
    } catch (err) {
      console.warn('Audio alert playback suppressed by browser policy:', err);
    }
  }, [soundEnabled]);

  // Selected camera feed & modal state
  const [selectedCam, setSelectedCam] = useState('CAM-04');
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  // Live part counter and inspection details
  const [currentPartNum, setCurrentPartNum] = useState(2452);
  const [totalInspected, setTotalInspected] = useState(2452);
  const [goodPartsCount, setGoodPartsCount] = useState(2408);
  const [defectivePartsCount, setDefectivePartsCount] = useState(44);

  // Active Part template and rotation
  const [partCycleIdx, setPartCycleIdx] = useState(0);
  const [currentImage, setCurrentImage] = useState(PASS_PARTS[0].image);
  const [currentPartType, setCurrentPartType] = useState(PASS_PARTS[0].name);
  const [currentMachineId, setCurrentMachineId] = useState(PASS_PARTS[0].machineId);
  const [currentBatch, setCurrentBatch] = useState(PASS_PARTS[0].batch);
  const [currentTolerance, setCurrentTolerance] = useState(PASS_PARTS[0].tol);
  const [currentDimension, setCurrentDimension] = useState('25.04 mm');

  const [currentResult, setCurrentResult] = useState<'PASS' | 'FAIL'>('PASS');
  const [currentConfidence, setCurrentConfidence] = useState(97.3);
  const [currentDefect, setCurrentDefect] = useState('None');
  const [currentPartTime, setCurrentPartTime] = useState('12:46:21');
  const [isScanning, setIsScanning] = useState(false);
  const [isShutterFlash, setIsShutterFlash] = useState(false);
  const [alertDivertNotice, setAlertDivertNotice] = useState<string | null>(null);

  // Dynamic box position
  const [boxPosition, setBoxPosition] = useState(PASS_PARTS[0].box);

  // Inspection records list & filter
  const [records, setRecords] = useState<InspectionRecord[]>(INITIAL_RECORDS);
  const [tableFilter, setTableFilter] = useState<'all' | 'fail' | 'flag'>('all');
  const [dispositionActionNotice, setDispositionActionNotice] = useState<string | null>(null);

  // Trend Graph Interactive Hover State
  const [activeTrendIdx, setActiveTrendIdx] = useState<number | null>(null);
  const trendSvgRef = useRef<SVGSVGElement | null>(null);

  // Defect Donut Hover State
  const [hoveredDefect, setHoveredDefect] = useState<typeof DEFECT_TYPES[0] | null>(null);

  // Time filter for trend
  const [trendRange, setTrendRange] = useState<'8h' | '24h' | 'week'>('8h');
  const [defectRange, setDefectRange] = useState<'today' | 'yesterday' | 'shift'>('today');

  // Trigger inspection cycle (both automated and manual test trigger)
  const triggerInspection = useCallback((forceDefect: boolean = false) => {
    setIsScanning(true);
    setIsShutterFlash(true);
    setTimeout(() => setIsScanning(false), 500);
    setTimeout(() => setIsShutterFlash(false), 220);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
    const nextNum = currentPartNum + 1;
    setCurrentPartNum(nextNum);
    setTotalInspected((prev) => prev + 1);

    // Defect probability ~12% or forced
    const isDefect = forceDefect || Math.random() < 0.12;

    if (isDefect) {
      // Defective part detected!
      const defectType = Math.random() > 0.4 ? 'Surface Scratch' : 'Burr Flange';
      const conf = +(88 + Math.random() * 5).toFixed(1);
      const dim = (25.12 + Math.random() * 0.06).toFixed(2) + ' mm';

      setCurrentImage(DEFECT_PART.image);
      setCurrentPartType(DEFECT_PART.name);
      setCurrentMachineId(DEFECT_PART.machineId);
      setCurrentBatch(DEFECT_PART.batch);
      setCurrentTolerance(DEFECT_PART.tol);
      setCurrentDimension(dim);
      setCurrentResult('FAIL');
      setCurrentConfidence(conf);
      setCurrentDefect(defectType);
      setCurrentPartTime(timeStr);
      setDefectivePartsCount((d) => d + 1);
      setBoxPosition(DEFECT_PART.box);

      // Play the industrial alert beep sound!
      playIndustrialAlertBeep();

      // Show auto-divert reject notice banner in camera feed
      setAlertDivertNotice(`QUALITY ALERT: Part #PRT-${nextNum} defect caught (${defectType}) · Diverted to reject bin`);
      setTimeout(() => setAlertDivertNotice(null), 3600);

      const newRecord: InspectionRecord = {
        id: 'rec-' + Date.now(),
        partId: `PRT-${nextNum}`,
        time: timeStr,
        timestamp: Date.now(),
        result: 'FAIL',
        defect: defectType,
        dimension: dim,
        confidence: conf,
        image: DEFECT_PART.image,
        partType: DEFECT_PART.name,
        isNew: true,
      };

      setRecords((prev) => [newRecord, ...prev.slice(0, 7)]);
    } else {
      // Normal Pass inspection with rotating part image
      const nextCycleIdx = (partCycleIdx + 1) % PASS_PARTS.length;
      setPartCycleIdx(nextCycleIdx);

      const template = PASS_PARTS[nextCycleIdx];
      const conf = +(96.5 + Math.random() * 3).toFixed(1);
      const dim = (template.dimBase + (Math.random() * 0.04 - 0.02)).toFixed(2) + ' mm';

      setCurrentImage(template.image);
      setCurrentPartType(template.name);
      setCurrentMachineId(template.machineId);
      setCurrentBatch(template.batch);
      setCurrentTolerance(template.tol);
      setCurrentDimension(dim);
      setCurrentResult('PASS');
      setCurrentConfidence(conf);
      setCurrentDefect('None');
      setCurrentPartTime(timeStr);
      setGoodPartsCount((g) => g + 1);
      setBoxPosition(template.box);

      const newRecord: InspectionRecord = {
        id: 'rec-' + Date.now(),
        partId: `PRT-${nextNum}`,
        time: timeStr,
        timestamp: Date.now(),
        result: 'PASS',
        defect: 'None',
        dimension: dim,
        confidence: conf,
        image: template.image,
        partType: template.name,
        isNew: true,
      };

      setRecords((prev) => [newRecord, ...prev.slice(0, 7)]);
    }
  }, [currentPartNum, partCycleIdx, playIndustrialAlertBeep]);

  // Live Simulation Loop (every 4 seconds)
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      triggerInspection();
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive, triggerInspection]);

  // Clear `isNew` flash after 900ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords((prev) => prev.map((r) => ({ ...r, isNew: false })));
    }, 900);
    return () => clearTimeout(timer);
  }, [records]);

  // Live Rates
  const goodPartsRate = totalInspected > 0 ? ((goodPartsCount / totalInspected) * 100).toFixed(1) : '98.2';
  const defectRate = totalInspected > 0 ? ((defectivePartsCount / totalInspected) * 100).toFixed(1) : '1.8';

  // Filtered records for inspection log
  const filteredRecords = useMemo(() => {
    if (tableFilter === 'fail') return records.filter((r) => r.result === 'FAIL');
    if (tableFilter === 'flag') return records.filter((r) => r.defect !== 'None' || r.confidence < 94);
    return records;
  }, [records, tableFilter]);

  // SVG Trend Chart Dimensions
  const chartW = 460;
  const chartH = 170;
  const padLeft = 42;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 26;

  const innerW = chartW - padLeft - padRight;
  const innerH = chartH - padTop - padBottom;

  const getX = (idx: number) => padLeft + (idx / (TREND_DATA_8H.length - 1)) * innerW;
  const getYGood = (val: number) => padTop + innerH - ((val - 90) / 10) * innerH;
  const getYDefect = (val: number) => padTop + innerH - (val / 10) * innerH;

  const goodLinePath = useMemo(() => {
    return TREND_DATA_8H.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = Math.max(padTop, Math.min(padTop + innerH, getYGood(pt.goodRate)));
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, []);

  const defectLinePath = useMemo(() => {
    return TREND_DATA_8H.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = Math.max(padTop, Math.min(padTop + innerH, getYDefect(pt.defectRate)));
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, []);

  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
    if (!trendSvgRef.current) return;
    const rect = trendSvgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const boundedX = Math.max(padLeft, Math.min(padLeft + innerW, mouseX));
    const ratio = (boundedX - padLeft) / innerW;
    const idx = Math.round(ratio * (TREND_DATA_8H.length - 1));
    setActiveTrendIdx(idx);
  };

  const handleChartMouseLeave = () => {
    setActiveTrendIdx(null);
  };

  // Donut chart geometry
  const donutR = 64;
  const donutHole = 42;
  const donutCenter = 85;

  let cumulativeAngle = -90;
  const donutSlices = DEFECT_TYPES.map((item) => {
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
    <section className="section-wrapper qk-page-container">
      {/* ============================================================== */}
      {/* TIER 1: 5 ENTERPRISE QUALITY & INSPECTION KPI CARDS ROW        */}
      {/* ============================================================== */}
      <div className="overview-kpi-row-5 vision-top-kpis" style={{ marginBottom: '16px' }}>
        {/* KPI 1: Metrology Inspection Count & Throughput */}
        <div className="kpi-card-theme compact-vision-kpi">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <BoxIcon size={16} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">▲ 312 PPH Run Rate</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{totalInspected.toLocaleString()}</span>
            <span className="kpi-unit-lbl">Units</span>
          </div>
          <div className="kpi-label">Metrology Inspection Count</div>
          <div className="kpi-sub-line font-sm">
            <span>Shift Target: <strong>3,200</strong></span>
            <span>Conveyor: <strong>0.45 m/s</strong></span>
          </div>
        </div>

        {/* KPI 2: First-Pass Yield & Six-Sigma Cpk */}
        <div className="kpi-card-theme compact-vision-kpi">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <ShieldIcon size={16} color="#16A34A" />
            </div>
            <span className="kpi-badge-pill green">▲ 5.52σ Capability</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{goodPartsRate}%</span>
          </div>
          <div className="kpi-label">First-Pass Yield · Cpk 1.84</div>
          <div className="kpi-sub-line font-sm">
            <span><span className="dot-status green pulse" /> {goodPartsCount.toLocaleString()} In-Spec</span>
            <span>Nom 25.000 ±0.050mm</span>
          </div>
        </div>

        {/* KPI 3: Scrap & Defect Ratio */}
        <div className="kpi-card-theme compact-vision-kpi">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square red">
              <AlertIcon size={16} color="#DC2626" />
            </div>
            <span className="kpi-badge-pill green">▼ -0.4% Scrap</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular" style={{ color: '#DC2626' }}>{defectRate}%</span>
            <span className="kpi-unit-lbl" style={{ color: '#DC2626' }}>17.6k PPM</span>
          </div>
          <div className="kpi-label">Scrap &amp; Defect Quarantine</div>
          <div className="kpi-sub-line font-sm">
            <span>{defectivePartsCount} Intercepted</span>
            <span><strong>0 Escapes to Line</strong></span>
          </div>
        </div>

        {/* KPI 4: Optical Sensor & Strobe Telemetry */}
        <div className="kpi-card-theme compact-vision-kpi">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <ZapIcon size={16} color="#0D9488" />
            </div>
            <span className="kpi-badge-pill green">● 25.4 FPS Live</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">CAM-04</span>
            <span className="kpi-unit-lbl">12.5 MP</span>
          </div>
          <div className="kpi-label">Sony Pregius S Optical SCADA</div>
          <div className="kpi-sub-line font-sm">
            <span>Shutter: <strong>42 µs</strong></span>
            <span>Sensor Temp: <strong>38.4°C</strong></span>
          </div>
        </div>

        {/* KPI 5: Pneumatic Sorter & Diverter Gate */}
        <div className="kpi-card-theme compact-vision-kpi">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <CameraIcon size={16} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">48ms Solenoid #04</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">Chute B</span>
            <span className="kpi-unit-lbl">Armed</span>
          </div>
          <div className="kpi-label">High-Speed Diverter Actuator</div>
          <div className="kpi-sub-line font-sm">
            <span>44 Diverted to Bin #02</span>
            <span>Air: <strong>6.2 Bar</strong></span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER 2: LIVE CAMERA INSPECTION + RECENT INSPECTIONS            */}
      {/* ============================================================== */}
      <div className="qk-top-row-grid">
        {/* Left Column (60%): Live Machine Vision & Digital Metrology */}
        <div className="qk-panel-card qk-cam-inspection-card">
          {/* Card Header Bar */}
          <div className="qk-card-header">
            <div className="qk-hdr-left">
              <div className="qk-cam-icon-box">
                <CameraIcon size={16} color="var(--accent-teal)" />
              </div>
              <h2 className="qk-card-title" style={{ whiteSpace: 'nowrap' }}>{t.vision.liveCamera}</h2>
              <div className="qk-live-pill">
                <span className="qk-pulsing-dot" />
                <span>LIVE 25 FPS</span>
              </div>
            </div>

            <div className="qk-hdr-right">
              <select
                className="qk-dropdown-select-mini"
                value={selectedCam}
                onChange={(e) => setSelectedCam(e.target.value)}
              >
                <option value="CAM-04">CAM-04 · Sorter</option>
                <option value="CAM-02">CAM-02 · Scanner</option>
                <option value="CAM-07">CAM-07 · Sensor</option>
              </select>

              <button
                className={`qk-sound-toggle-btn ${soundEnabled ? 'active' : 'muted'}`}
                title={soundEnabled ? 'Alert Siren: ON (Click to Mute)' : 'Alert Siren: Muted'}
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playIndustrialAlertBeep();
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {soundEnabled ? (
                    <>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </>
                  ) : (
                    <>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </>
                  )}
                </svg>
                <span>{soundEnabled ? 'Audio: ON' : 'Muted'}</span>
              </button>

              <button
                className="qk-test-alert-btn"
                title="Trigger simulated defect and test audible siren"
                onClick={() => triggerInspection(true)}
              >
                <span>⚡ {t.common.testDefect}</span>
              </button>

              <button
                className="qk-icon-btn"
                title="Expand Full View"
                onClick={() => setShowFullImageModal(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card Body: Split (Left: Viewport | Right: Metrology Readout) */}
          <div className="qk-cam-split-body">
            {/* Left Sub-Column: Real-time Camera Feed Viewport */}
            <div className="qk-viewport-container">
              <div
                className={`qk-camera-feed-canvas ${isShutterFlash ? 'qk-shutter-flash' : ''}`}
                style={{
                  backgroundImage: `url('${currentImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Scanline Grid Overlay */}
                <div className="qk-viewport-grid-mesh" />

                {/* Millimeter Ruler Ticks */}
                <div className="qk-ruler-ticks-h">
                  <span>-20mm</span>
                  <span>-10mm</span>
                  <span>0.00 (DATUM A)</span>
                  <span>+10mm</span>
                  <span>+20mm</span>
                </div>

                {/* Industrial Reticle Overlay */}
                <svg className="qk-reticle-crosshair" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                  <circle cx="50" cy="50" r="10" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="0.4" fill="none" />
                  <circle cx="50" cy="50" r="24" stroke="rgba(0, 240, 255, 0.18)" strokeWidth="0.4" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="0.4" fill="none" />
                </svg>

                {/* Animated Laser Beam */}
                <div className={`qk-laser-scanner ${isScanning ? 'fast-pulse' : ''}`} />

                {/* Caliper Tool Dimension Overlay */}
                <div
                  className="qk-caliper-line"
                  style={{
                    left: `${boxPosition.left}%`,
                    top: `${Math.max(6, boxPosition.top - 7)}%`,
                    width: `${boxPosition.width}%`,
                    borderColor: currentResult === 'PASS' ? '#10B981' : '#EF4444',
                  }}
                >
                  <span style={{ fontSize: '8px', color: currentResult === 'PASS' ? '#10B981' : '#EF4444' }}>◀</span>
                  <span
                    className="qk-caliper-tag"
                    style={{
                      borderColor: currentResult === 'PASS' ? '#10B981' : '#EF4444',
                      color: currentResult === 'PASS' ? '#10B981' : '#EF4444',
                    }}
                  >
                    CAL-01: {currentDimension}
                  </span>
                  <span style={{ fontSize: '8px', color: currentResult === 'PASS' ? '#10B981' : '#EF4444' }}>▶</span>
                </div>

                {/* Top-Left Translucent Telemetry HUD */}
                <div className="qk-hud-telemetry-badge">
                  <div className="qk-hud-line">
                    <span className="qk-hud-key">FPS:</span>
                    <span className="qk-hud-val">25.4</span>
                  </div>
                  <div className="qk-hud-line">
                    <span className="qk-hud-key">Exposure:</span>
                    <span className="qk-hud-val">42 µs</span>
                  </div>
                  <div className="qk-hud-line">
                    <span className="qk-hud-key">Lighting:</span>
                    <span className="qk-hud-val">Coaxial 85%</span>
                  </div>
                  <div className="qk-hud-line">
                    <span className="qk-hud-key">Latency:</span>
                    <span className="qk-hud-val">38 ms</span>
                  </div>
                </div>

                {/* Alert Reject Banner when FAIL occurs */}
                {alertDivertNotice && (
                  <div className="qk-divert-banner">
                    <AlertIcon size={14} color="#FFFFFF" />
                    <span>{alertDivertNotice}</span>
                  </div>
                )}

                {/* Dynamic Bounding Box */}
                <div
                  className={`qk-ai-bounding-box ${currentResult === 'PASS' ? 'pass' : 'fail'}`}
                  style={{
                    left: `${boxPosition.left}%`,
                    top: `${boxPosition.top}%`,
                    width: `${boxPosition.width}%`,
                    height: `${boxPosition.height}%`,
                  }}
                >
                  <div className="qk-bbox-tag">
                    {currentResult === 'PASS' ? (
                      <>
                        <CheckIcon size={12} color="#10B981" />
                        <span>GOOD PART ({currentConfidence}%)</span>
                      </>
                    ) : (
                      <>
                        <AlertIcon size={12} color="#EF4444" />
                        <span>DEFECT: {currentDefect.toUpperCase()} ({currentConfidence}%)</span>
                      </>
                    )}
                  </div>
                  <span className="qk-box-corner tl" />
                  <span className="qk-box-corner tr" />
                  <span className="qk-box-corner bl" />
                  <span className="qk-box-corner br" />
                </div>

                {/* Translucent Bottom Bar */}
                <div className="qk-viewport-caption-bar">
                  <span className="qk-caption-text">PE-04 TTL Optical Trigger</span>
                  <span className="qk-caption-meta">
                    Part #{currentPartNum} | {currentPartTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sub-Column: Digital Metrology Certificate */}
            <div className="qk-metrology-panel">
              <div className="qk-details-header">
                <div>
                  <span className="qk-details-title">Digital Metrology Certificate</span>
                  <div className="qk-barcode-sub">
                    <strong>PRT-{currentPartNum}</strong> · {currentPartType}
                  </div>
                </div>
                <span className={`qk-result-pill ${currentResult === 'PASS' ? 'pass' : 'fail'}`}>
                  {currentResult === 'PASS' ? (
                    <>
                      <CheckIcon size={11} color="#108A4F" /> PASS ({currentConfidence}%)
                    </>
                  ) : (
                    <>
                      <AlertIcon size={11} color="#EF4444" /> REJECT ({currentConfidence}%)
                    </>
                  )}
                </span>
              </div>

              {/* GD&T Metrology Cards Grid with Real Tolerance Deviation Tracks */}
              <div className="metrology-specs-container">
                {/* Spec 1: Outer Diameter (OD) */}
                <div className="metrology-spec-card">
                  <div className="spec-row-top">
                    <span className="spec-param-title">Outer Diameter (OD)</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className="spec-cpk-badge">Cpk 1.84</span>
                      <span className={`spec-tag ${currentResult === 'PASS' ? 'pass' : 'fail'}`}>
                        {currentResult === 'PASS' ? 'IN-SPEC' : 'OUT-OF-SPEC'}
                      </span>
                    </div>
                  </div>
                  <div className="spec-row-bottom">
                    <span className="spec-val-mono">Ø {currentDimension}</span>
                    <span className="spec-tol-text">
                      {currentResult === 'PASS' ? 'Δ +0.024 mm' : 'Δ +0.140 mm'}
                    </span>
                  </div>
                  {/* Tolerance Deviation Track Bar */}
                  <div className="tolerance-track-wrap">
                    <div className="tolerance-track-bar">
                      <div className="tolerance-zone-pass" />
                      <div className="tolerance-zone-nom" />
                      <div
                        className={`tolerance-needle ${currentResult === 'PASS' ? '' : 'fail'}`}
                        style={{ left: currentResult === 'PASS' ? '56%' : '88%' }}
                      />
                    </div>
                    <div className="tolerance-labels">
                      <span>-0.050mm</span>
                      <span>25.000 (Nom)</span>
                      <span>+0.050mm</span>
                    </div>
                  </div>
                </div>

                {/* Spec 2: Surface Roughness (Ra) */}
                <div className="metrology-spec-card">
                  <div className="spec-row-top">
                    <span className="spec-param-title">Surface Roughness (Ra)</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className="spec-cpk-badge">Cpk 1.76</span>
                      <span className={`spec-tag ${currentResult === 'PASS' ? 'pass' : 'fail'}`}>
                        {currentResult === 'PASS' ? 'IN-SPEC' : 'ROUGH'}
                      </span>
                    </div>
                  </div>
                  <div className="spec-row-bottom">
                    <span className="spec-val-mono">
                      {currentResult === 'PASS' ? 'Ra 0.82 µm' : 'Ra 2.41 µm'}
                    </span>
                    <span className="spec-tol-text">Limit: 1.20 µm</span>
                  </div>
                  <div className="tolerance-track-wrap">
                    <div className="tolerance-track-bar">
                      <div className="tolerance-zone-pass" style={{ left: '10%', right: '35%' }} />
                      <div className="tolerance-zone-nom" style={{ left: '40%' }} />
                      <div
                        className={`tolerance-needle ${currentResult === 'PASS' ? '' : 'fail'}`}
                        style={{ left: currentResult === 'PASS' ? '42%' : '86%' }}
                      />
                    </div>
                    <div className="tolerance-labels">
                      <span>0.00 µm</span>
                      <span>0.80 (Nom)</span>
                      <span>1.20 Max</span>
                    </div>
                  </div>
                </div>

                {/* Spec 3: Axial Concentricity */}
                <div className="metrology-spec-card">
                  <div className="spec-row-top">
                    <span className="spec-param-title">Axial Concentricity</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className="spec-cpk-badge">Cpk 1.91</span>
                      <span className={`spec-tag ${currentResult === 'PASS' ? 'pass' : 'fail'}`}>
                        {currentResult === 'PASS' ? 'IN-SPEC' : 'RUNOUT'}
                      </span>
                    </div>
                  </div>
                  <div className="spec-row-bottom">
                    <span className="spec-val-mono">
                      {currentResult === 'PASS' ? '0.008 mm' : '0.019 mm'}
                    </span>
                    <span className="spec-tol-text">Limit: 0.015 mm</span>
                  </div>
                  <div className="tolerance-track-wrap">
                    <div className="tolerance-track-bar">
                      <div className="tolerance-zone-pass" style={{ left: '5%', right: '35%' }} />
                      <div className="tolerance-zone-nom" style={{ left: '35%' }} />
                      <div
                        className={`tolerance-needle ${currentResult === 'PASS' ? '' : 'fail'}`}
                        style={{ left: currentResult === 'PASS' ? '36%' : '79%' }}
                      />
                    </div>
                    <div className="tolerance-labels">
                      <span>0.000mm</span>
                      <span>0.008 (Nom)</span>
                      <span>0.015 Max</span>
                    </div>
                  </div>
                </div>

                {/* Spec 4: Visual Surface Defect */}
                <div className="metrology-spec-card">
                  <div className="spec-row-top">
                    <span className="spec-param-title">Surface Quality Check (Sobel)</span>
                    <span className={`spec-tag ${currentResult === 'PASS' ? 'pass' : 'fail'}`}>
                      {currentResult === 'PASS' ? 'CLEAN' : 'FLAGGED'}
                    </span>
                  </div>
                  <div className="spec-row-bottom">
                    <span
                      className="spec-val-mono"
                      style={{ color: currentResult === 'PASS' ? '#10B981' : '#EF4444' }}
                    >
                      {currentDefect}
                    </span>
                    <span className="spec-tol-text">Conf: {currentConfidence}%</span>
                  </div>
                </div>
              </div>

              {/* Pneumatic Chute Diverter Route */}
              <div className="chute-route-box">
                <div className="chute-route-title">Automated Diverter Route:</div>
                <div className="chute-route-val">
                  {currentResult === 'PASS' ? (
                    <span className="text-green">✓ Pneumatic Chute A (Packing Line · Bin #01)</span>
                  ) : (
                    <span className="text-red">⚠ Divert Chute B Solenoid #04 (Quarantine Bin #02)</span>
                  )}
                </div>
              </div>

              {/* Disposition Action Notification if triggered */}
              {dispositionActionNotice && (
                <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 600, padding: '2px 0' }}>
                  {dispositionActionNotice}
                </div>
              )}

              {/* Part Disposition Buttons */}
              <div className="disposition-btn-group">
                <button
                  type="button"
                  className="btn-disp-action accept"
                  onClick={() => {
                    setDispositionActionNotice(`Part PRT-${currentPartNum} manual override: Accepted & released to line.`);
                    setTimeout(() => setDispositionActionNotice(null), 3000);
                  }}
                >
                  ✓ Accept &amp; Release
                </button>
                <button
                  type="button"
                  className="btn-disp-action flag"
                  onClick={() => {
                    setDispositionActionNotice(`Part PRT-${currentPartNum} flagged for CMM lab calibration verification.`);
                    setTimeout(() => setDispositionActionNotice(null), 3000);
                  }}
                >
                  ⚠ Flag CMM Lab
                </button>
                <button
                  type="button"
                  className="btn-disp-action scrap"
                  onClick={() => {
                    setDispositionActionNotice(`Part PRT-${currentPartNum} diverted to Bin #02 scrap audit.`);
                    setTimeout(() => setDispositionActionNotice(null), 3000);
                  }}
                >
                  ✕ Divert Scrap
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Recent Optical Inspections Event Stream */}
        <div className="qk-panel-card qk-recent-inspections-card">
          <div className="qk-card-header">
            <div className="qk-hdr-left">
              <span className="qk-green-bar" />
              <h2 className="qk-card-title">{t.vision.recentCaptures}</h2>
            </div>
            {/* Table Filter Tabs */}
            <div className="qk-table-filter-pills">
              <button
                type="button"
                className={`qk-table-filter-btn ${tableFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTableFilter('all')}
              >
                All ({records.length})
              </button>
              <button
                type="button"
                className={`qk-table-filter-btn ${tableFilter === 'fail' ? 'active' : ''}`}
                onClick={() => setTableFilter('fail')}
              >
                Defects ({records.filter((r) => r.result === 'FAIL').length})
              </button>
              <button
                type="button"
                className={`qk-table-filter-btn ${tableFilter === 'flag' ? 'active' : ''}`}
                onClick={() => setTableFilter('flag')}
              >
                CMM Flag
              </button>
            </div>
          </div>

          <div className="qk-table-container">
            <table className="qk-table">
              <thead>
                <tr>
                  <th style={{ width: '26px', textAlign: 'center' }}>#</th>
                  <th style={{ width: '74px' }}>Part ID</th>
                  <th style={{ width: '66px' }}>Time</th>
                  <th style={{ width: '58px', textAlign: 'center' }}>Result</th>
                  <th style={{ width: '70px' }}>Dim (OD)</th>
                  <th>Route / Defect</th>
                  <th style={{ width: '42px', textAlign: 'center' }}>Snap</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec, idx) => (
                  <tr
                    key={rec.id}
                    className={`${rec.isNew ? (rec.result === 'FAIL' ? 'qk-row-flash-fail' : 'qk-row-flash') : ''} ${rec.result === 'FAIL' ? 'qk-table-row-defect' : ''}`}
                  >
                    <td className="qk-cell-dim" style={{ textAlign: 'center', fontSize: '11px' }}>{idx + 1}</td>
                    <td className="mono-strong" style={{ fontSize: '11px' }}>{rec.partId}</td>
                    <td className="qk-cell-dim tabular" style={{ fontSize: '10.5px' }}>{rec.time}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`qk-mini-pill ${rec.result === 'PASS' ? 'pass' : 'fail'}`}>
                        {rec.result === 'FAIL' && (
                          <span style={{ marginRight: '3px', display: 'inline-flex' }}>
                            <AlertIcon size={10} color="#EF4444" />
                          </span>
                        )}
                        {rec.result}
                      </span>
                    </td>
                    <td className="mono-strong tabular" style={{ fontSize: '11px' }}>
                      {rec.dimension}
                    </td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px' }}>
                      {rec.defect !== 'None' ? (
                        <div className="qk-defect-badge-wrap">
                          <span className="qk-defect-alert-dot" />
                          <span className="qk-defect-highlight">{rec.defect} (Chute B)</span>
                        </div>
                      ) : (
                        <span className="qk-cell-dim">Nominal (Chute A)</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div
                        className={`qk-part-thumb ${rec.result === 'FAIL' ? 'fail' : ''}`}
                        title={`Click to inspect ${rec.partId} (${rec.result})`}
                        onClick={() => {
                          setCurrentImage(rec.image);
                          setShowFullImageModal(true);
                        }}
                      >
                        <img src={rec.image} alt={rec.partId} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SCADA Status Footer Bar */}
          <div className="qk-table-footer-bar">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span className="qk-pulsing-dot" />
              <span>SCADA DAQ Synced @ 25 FPS · Diverter Armed</span>
            </span>
            <span>Logging {filteredRecords.length} / {records.length} Parts</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER 3: MID ROW (Quality Trend | Defect Distribution | Machine) */}
      {/* ============================================================== */}
      <div className="qk-mid-row-grid">
        {/* Col 1: Quality Trend with Hover Numbers */}
        <div className="qk-panel-card qk-chart-card">
          <div className="qk-card-header">
            <h3 className="qk-card-title">Quality Trend</h3>
            <select
              className="qk-dropdown-select-mini"
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value as any)}
            >
              <option value="8h">Last 8 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="week">This Week</option>
            </select>
          </div>

          <div
            className="qk-chart-surface-wrapper"
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
          >
            <svg
              ref={trendSvgRef}
              className="qk-trend-svg"
              viewBox={`0 0 ${chartW} ${chartH}`}
            >
              <defs>
                <linearGradient id="goodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
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
                      x={padLeft - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      fill="var(--text-muted)"
                      fontSize="9.5"
                      fontFamily="var(--font-mono)"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Labels */}
              {TREND_DATA_8H.map((pt, idx) => {
                const x = getX(idx);
                return (
                  <text
                    key={pt.time}
                    x={x}
                    y={chartH - 8}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="9.5"
                    fontFamily="var(--font-mono)"
                  >
                    {pt.time}
                  </text>
                );
              })}

              {/* Good Parts Rate Area & Line (Green) */}
              <path
                d={`${goodLinePath} L ${getX(TREND_DATA_8H.length - 1)},${padTop + innerH} L ${getX(0)},${padTop + innerH} Z`}
                fill="url(#goodGrad)"
              />
              <path
                d={goodLinePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Defect Rate Line (Red) */}
              <path
                d={defectLinePath}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover Hairline and Points */}
              {activeTrendIdx !== null && (
                <g>
                  <line
                    x1={getX(activeTrendIdx)}
                    y1={padTop}
                    x2={getX(activeTrendIdx)}
                    y2={padTop + innerH}
                    stroke="var(--accent-teal)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={getX(activeTrendIdx)}
                    cy={getYGood(TREND_DATA_8H[activeTrendIdx].goodRate)}
                    r="5"
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <circle
                    cx={getX(activeTrendIdx)}
                    cy={getYDefect(TREND_DATA_8H[activeTrendIdx].defectRate)}
                    r="4.5"
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {/* Interactive Floating Tooltip displaying exact numbers on hover */}
            {activeTrendIdx !== null && (
              <div
                className="qk-chart-floating-tooltip"
                style={{
                  left: `${(getX(activeTrendIdx) / chartW) * 100}%`,
                  transform:
                    activeTrendIdx > 4 ? 'translate(-105%, -65%)' : 'translate(10%, -65%)',
                }}
              >
                <div className="qk-tip-header">{TREND_DATA_8H[activeTrendIdx].time} Inspection Summary</div>
                <div className="qk-tip-row">
                  <span className="qk-tip-dot green" />
                  <span className="qk-tip-label">Good Parts Rate:</span>
                  <span className="qk-tip-val tabular font-bold" style={{ color: '#10B981' }}>
                    {TREND_DATA_8H[activeTrendIdx].goodRate}%
                  </span>
                </div>
                <div className="qk-tip-row">
                  <span className="qk-tip-dot red" />
                  <span className="qk-tip-label">Defect Rate:</span>
                  <span className="qk-tip-val tabular font-bold" style={{ color: '#EF4444' }}>
                    {TREND_DATA_8H[activeTrendIdx].defectRate}%
                  </span>
                </div>
                <div className="qk-tip-footer">
                  <span>Inspected: {TREND_DATA_8H[activeTrendIdx].inspected} parts</span>
                  <span>Defects caught: {TREND_DATA_8H[activeTrendIdx].defects}</span>
                </div>
              </div>
            )}
          </div>

          {/* Chart Legend */}
          <div className="qk-chart-legend">
            <div className="qk-legend-item">
              <span className="qk-legend-dot" style={{ background: '#10B981' }} />
              <span>Good Parts Rate (~98%)</span>
            </div>
            <div className="qk-legend-item">
              <span className="qk-legend-dot" style={{ background: '#EF4444' }} />
              <span>Defect Rate (~2%)</span>
            </div>
          </div>
        </div>

        {/* Col 2: Defect Type Distribution with Donut */}
        <div className="qk-panel-card qk-donut-card">
          <div className="qk-card-header">
            <h3 className="qk-card-title">Defect Type Distribution</h3>
            <select
              className="qk-dropdown-select-mini"
              value={defectRange}
              onChange={(e) => setDefectRange(e.target.value as any)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="shift">This Shift</option>
            </select>
          </div>

          <div className="qk-donut-container">
            {/* SVG Donut */}
            <div className="qk-donut-svg-wrapper">
              <svg width="170" height="170" viewBox="0 0 170 170">
                {donutSlices.map((slice) => {
                  const isHovered = hoveredDefect?.name === slice.name;
                  return (
                    <path
                      key={slice.name}
                      d={slice.pathData}
                      fill={slice.color}
                      opacity={hoveredDefect ? (isHovered ? 1 : 0.45) : 0.92}
                      transform={isHovered ? 'scale(1.04)' : 'scale(1)'}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transformOrigin: '85px 85px',
                      }}
                      onMouseEnter={() => setHoveredDefect(slice)}
                      onMouseLeave={() => setHoveredDefect(null)}
                    />
                  );
                })}

                {/* Donut Center Display */}
                <text
                  x={donutCenter}
                  y={donutCenter - 4}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="20"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {hoveredDefect ? hoveredDefect.count : '44'}
                </text>
                <text
                  x={donutCenter}
                  y={donutCenter + 14}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontWeight="600"
                >
                  {hoveredDefect ? `${hoveredDefect.name} (${hoveredDefect.percent}%)` : 'Total Defects'}
                </text>
              </svg>
            </div>

            {/* Slices Legend List with exact numbers */}
            <div className="qk-donut-legend-list">
              {DEFECT_TYPES.map((item) => {
                const isHovered = hoveredDefect?.name === item.name;
                return (
                  <div
                    key={item.name}
                    className={`qk-donut-legend-row ${isHovered ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredDefect(item)}
                    onMouseLeave={() => setHoveredDefect(null)}
                  >
                    <div className="qk-legend-name-group">
                      <span className="qk-legend-circle" style={{ background: item.color }} />
                      <span className="qk-legend-name">{item.name}</span>
                    </div>
                    <div className="qk-legend-nums">
                      <span className="qk-legend-count tabular">{item.count}</span>
                      <span className="qk-legend-pct tabular">({item.percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 3: Machine-wise Quality */}
        <div className="qk-panel-card qk-machine-quality-card">
          <div className="qk-card-header">
            <h3 className="qk-card-title">Machine-wise Quality</h3>
            <a href="#machines" className="qk-link-subtle" onClick={(e) => e.preventDefault()}>
              View All
            </a>
          </div>

          <div className="qk-table-container">
            <table className="qk-table compact">
              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Inspected</th>
                  <th>Good Parts</th>
                  <th>Defect Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono-strong">CNC-01</td>
                  <td className="tabular">1,250</td>
                  <td className="tabular" style={{ color: '#108A4F', fontWeight: 600 }}>99.0%</td>
                  <td className="tabular">1.0%</td>
                  <td>
                    <span className="qk-status-pill green">Normal</span>
                  </td>
                </tr>
                <tr>
                  <td className="mono-strong">CNC-02</td>
                  <td className="tabular">1,180</td>
                  <td className="tabular" style={{ color: '#C6680A', fontWeight: 600 }}>97.1%</td>
                  <td className="tabular" style={{ color: '#C6680A', fontWeight: 600 }}>2.9%</td>
                  <td>
                    <span className="qk-status-pill amber">Warning</span>
                  </td>
                </tr>
                <tr>
                  <td className="mono-strong">CNC-03</td>
                  <td className="tabular">980</td>
                  <td className="tabular" style={{ color: '#108A4F', fontWeight: 600 }}>99.2%</td>
                  <td className="tabular">0.8%</td>
                  <td>
                    <span className="qk-status-pill green">Normal</span>
                  </td>
                </tr>
                <tr>
                  <td className="mono-strong">CNC-04</td>
                  <td className="tabular">2,452</td>
                  <td className="tabular" style={{ color: '#108A4F', fontWeight: 600 }}>98.2%</td>
                  <td className="tabular">1.8%</td>
                  <td>
                    <span className="qk-status-pill blue">Monitoring</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER 4: BOTTOM ROW (AI Quality Insights + System Health)       */}
      {/* ============================================================== */}
      <div className="qk-bottom-row-grid">
        {/* Col 1: AI Quality Insights */}
        <div className="qk-panel-card qk-ai-insights-card">
          <div className="qk-card-header">
            <div className="qk-hdr-left">
              <BotIcon size={18} color="var(--accent-teal)" />
              <h3 className="qk-card-title">AI Quality Insights</h3>
            </div>
            <span className="qk-insight-pill">New Insight</span>
          </div>

          <div className="qk-alert-box-warning">
            <div className="qk-alert-top">
              <div className="qk-alert-icon-wrap">
                <AlertIcon size={18} color="#C6680A" />
              </div>
              <div className="qk-alert-text">
                <h4 className="qk-alert-headline">Defect rate increased between 11:00 - 13:00</h4>
                <p className="qk-alert-sub">
                  Defect rate rose from 1.5% to 4.6% during this period. Primary defect type detected was Surface Scratch (62% of reported defects).
                </p>
              </div>
            </div>

            <div className="qk-recommendation-list">
              <div className="qk-rec-title">Recommended Investigation Steps:</div>
              <div className="qk-rec-item">
                <span className="qk-rec-bullet" />
                <span>Check tooling insert wear on CNC-02 spindle 3 (active cutting cycle &gt; 180 min)</span>
              </div>
              <div className="qk-rec-item">
                <span className="qk-rec-bullet" />
                <span>Inspect incoming raw material batch BATCH-2026-089 for surface scale or oxidation</span>
              </div>
              <div className="qk-rec-item">
                <span className="qk-rec-bullet" />
                <span>Verify optical conveyor belt speed synchronization at sorting station 4</span>
              </div>
              <div className="qk-rec-item">
                <span className="qk-rec-bullet" />
                <span>Review shift handover operator notes from 11:00 transition</span>
              </div>
            </div>

            <div className="qk-alert-actions">
              <button className="qk-btn qk-btn-primary" onClick={() => {}}>
                <span>View Detailed Analysis</span>
                <ArrowRightIcon size={14} color="#FFFFFF" />
              </button>
            </div>
          </div>
        </div>

        {/* Col 2: Camera & System Health */}
        <div className="qk-panel-card qk-sys-health-card">
          <div className="qk-card-header">
            <div className="qk-hdr-left">
              <ShieldIcon size={18} color="#108A4F" />
              <h3 className="qk-card-title">Camera & System Health</h3>
            </div>
            <span className="qk-health-pill-green">
              <CheckIcon size={12} color="#108A4F" />
              <span>All Systems Normal</span>
            </span>
          </div>

          {/* 2-Column Health Checklist */}
          <div className="qk-health-checklist-grid">
            <div className="qk-health-item">
              <div className="qk-health-left">
                <span className="qk-check-circle ok">
                  <CheckIcon size={11} color="#108A4F" />
                </span>
                <span className="qk-health-name">Camera Connection</span>
              </div>
              <span className="qk-health-status-text">Connected (GigE Vision)</span>
            </div>

            <div className="qk-health-item">
              <div className="qk-health-left">
                <span className="qk-check-circle ok">
                  <CheckIcon size={11} color="#108A4F" />
                </span>
                <span className="qk-health-name">AI Inference Model</span>
              </div>
              <span className="qk-health-status-text">Active (v2.1.0 ONNX)</span>
            </div>

            <div className="qk-health-item">
              <div className="qk-health-left">
                <span className="qk-check-circle ok">
                  <CheckIcon size={11} color="#108A4F" />
                </span>
                <span className="qk-health-name">Image Processing</span>
              </div>
              <span className="qk-health-status-text">Running (38ms)</span>
            </div>

            <div className="qk-health-item">
              <div className="qk-health-left">
                <span className="qk-check-circle ok">
                  <CheckIcon size={11} color="#108A4F" />
                </span>
                <span className="qk-health-name">Inspection Lighting</span>
              </div>
              <span className="qk-health-status-text">Optimal (5500K Ring)</span>
            </div>

            <div className="qk-health-item">
              <div className="qk-health-left">
                <span className="qk-check-circle ok">
                  <CheckIcon size={11} color="#108A4F" />
                </span>
                <span className="qk-health-name">PLC Trigger Line</span>
              </div>
              <span className="qk-health-status-text">Synchronized</span>
            </div>

            <div className="qk-health-item">
              <div className="qk-health-left">
                <span className="qk-check-circle ok">
                  <CheckIcon size={11} color="#108A4F" />
                </span>
                <span className="qk-health-name">Data Storage & Buffer</span>
              </div>
              <span className="qk-health-status-text">Online (14.2 GB / 2 TB)</span>
            </div>
          </div>

          {/* Bottom Hardware Telemetry Strip */}
          <div className="qk-hardware-telemetry-row">
            <div className="qk-hw-tile">
              <span className="qk-hw-label">Last Calibration</span>
              <span className="qk-hw-val">Today, 06:00 AM</span>
            </div>
            <div className="qk-hw-tile">
              <span className="qk-hw-label">Sensor Temperature</span>
              <span className="qk-hw-val tabular">42°C (Optimal &lt; 55°C)</span>
            </div>
            <div className="qk-hw-tile">
              <span className="qk-hw-label">Inference Latency</span>
              <span className="qk-hw-val tabular">38 ms</span>
            </div>
            <div className="qk-hw-tile">
              <span className="qk-hw-label">Frame Rate</span>
              <span className="qk-hw-val tabular">25 FPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FULL VIEW MODAL (Optical Inspection Drill-Down)                */}
      {/* ============================================================== */}
      {showFullImageModal && (
        <div className="qk-modal-backdrop" onClick={() => setShowFullImageModal(false)}>
          <div className="qk-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="qk-modal-header">
              <div className="qk-hdr-left">
                <CameraIcon size={18} color="var(--accent-teal)" />
                <h3 className="qk-card-title">High-Resolution Optical Inspection · Part #{currentPartNum}</h3>
              </div>
              <button className="qk-icon-btn" onClick={() => setShowFullImageModal(false)}>
                ✕
              </button>
            </div>
            <div className="qk-modal-body">
              <img src={currentImage} alt="Inspection Part" className="qk-modal-img" />
              <div className="qk-modal-meta">
                <div>
                  <strong>Part:</strong> PRT-{currentPartNum}
                </div>
                <div>
                  <strong>Status:</strong> {currentResult} ({currentConfidence}%)
                </div>
                <div>
                  <strong>Part Type:</strong> {currentPartType}
                </div>
                <div>
                  <strong>Dimensions:</strong> {currentDimension} ({currentTolerance})
                </div>
                <div>
                  <strong>Camera:</strong> {selectedCam} · 1080p Optical Sensor
                </div>
                <div>
                  <strong>Machine ID:</strong> {currentMachineId}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
