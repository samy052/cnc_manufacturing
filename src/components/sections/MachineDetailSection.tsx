'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import { Machine } from '@/types';
import {
  GearIcon,
  ZapIcon,
  ActivityIcon,
  ThermometerIcon,
  ShieldIcon,
  ClockIcon,
} from '@/components/common/Icons';

// Full Industrial CNC G-Code Machining Program
const MASTER_GCODE_PROGRAM = [
  { num: 'N105', code: 'G90 G54 G00 X150.000 Z5.000', comment: 'Rapid traverse to approach clearance plane', op: 'Rapid Traverse' },
  { num: 'N110', code: 'M08 (High Pressure Coolant 18 Bar)', comment: 'Coolant ON', op: 'Coolant Engage' },
  { num: 'N115', code: 'G96 S4850 M03 (Spindle CW)', comment: 'CSS spindle synchronization', op: 'Spindle Spin-up' },
  { num: 'N120', code: 'G01 Z0.000 F0.350', comment: 'Face datum zero reference pass', op: 'Face Datum Zero' },
  { num: 'N125', code: 'G01 X145.200 Z-12.400 F0.280', comment: 'Rough OD turning pass 1', op: 'Rough OD Pass 1' },
  { num: 'N130', code: 'G01 Z-42.500 F0.280 (Cutting Active)', comment: 'Machining OD main journal body', op: 'Rough OD Turning' },
  { num: 'N135', code: 'G02 X150.000 Z-45.000 R2.500', comment: 'Chamfer contour transition', op: 'Chamfer Blend' },
  { num: 'N140', code: 'G01 X152.000 Z-52.100 F0.240', comment: 'Shoulder relief undercut', op: 'Shoulder Undercut' },
  { num: 'N145', code: 'G01 Z-68.200 F0.260', comment: 'Secondary journal pass', op: 'Journal Turning' },
  { num: 'N150', code: 'G03 X154.000 Z-70.200 R1.500', comment: 'Fillet radius interpolation', op: 'Fillet Interpolation' },
  { num: 'N155', code: 'G00 X200.000 Z50.000', comment: 'Rapid clearance retract', op: 'Clearance Retract' },
  { num: 'N160', code: 'M09 (Coolant OFF)', comment: 'Safe exit & blow-off', op: 'Coolant Purge' },
  { num: 'N165', code: 'M01 (Optional Stop)', comment: 'In-process metrology halt', op: 'Metrology Check' },
];

export default function MachineDetailSection() {
  const {
    machines,
    selectedMachineId,
    setSelectedMachineId,
    setActiveSection,
    sendMessage,
    isLive,
    t,
  } = useFoundry();

  // Find active machine or fallback to CNC-05 / first machine
  const machine = useMemo(() => {
    return machines.find((m) => m.id === selectedMachineId) || machines[0] || null;
  }, [machines, selectedMachineId]);

  const [diagnosticsState, setDiagnosticsState] = useState<'idle' | 'running' | 'done'>('idle');
  const [activeTab, setActiveTab] = useState<'telemetry' | 'gcode' | 'tools' | 'events'>('telemetry');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  // Operator remediation interactive states
  const [toolReplaced, setToolReplaced] = useState(false);
  const [alarmAcknowledged, setAlarmAcknowledged] = useState(false);

  // Determine warning state (CNC-07 is the alerted machine, recoverable via tool replacement)
  const isWarning = (machine?.status === 'warning' || machine?.id === 'CNC-07') && !toolReplaced;

  // Realistic mock data base values based on the machine
  const baseRpm = machine?.metrics?.spindle || (isWarning ? 3305 : 4850);
  const baseTemp = isWarning ? 44.4 : (machine?.metrics?.temp || 38.2);
  const baseVib = isWarning ? 0.91 : (toolReplaced ? 0.36 : (machine?.metrics?.vib || 0.38));
  const baseFeed = isWarning ? 980 : 1260; // 80% safety derate when warning active
  const baseLoad = isWarning ? 78 : 62; // High motor load from worn tool friction
  const partsToday = machine?.metrics?.partsToday || (isWarning ? 299 : 448);
  const partsIncomplete = isWarning ? 4 : (machine?.partsIncomplete || 0);

  // Real-time continuous live streaming states
  const [activeLineIdx, setActiveLineIdx] = useState(5); // Default to N130 cutting pass
  const [cycleElapsed, setCycleElapsed] = useState(13.8);
  const [liveX, setLiveX] = useState(145.154);
  const [liveZ, setLiveZ] = useState(-50.948);
  const [liveRpm, setLiveRpm] = useState(baseRpm);
  const [liveFeed, setLiveFeed] = useState(baseFeed);
  const [liveLoad, setLiveLoad] = useState(baseLoad);
  const [liveVib, setLiveVib] = useState(baseVib);
  const [liveTemp, setLiveTemp] = useState(baseTemp);
  const targetCycle = 42.0;

  // Reset demo remediation when switching machine
  useEffect(() => {
    setToolReplaced(false);
    setAlarmAcknowledged(false);
  }, [machine?.id]);

  // Sync when selected machine or state changes
  useEffect(() => {
    setLiveRpm(baseRpm);
    setLiveVib(baseVib);
    setLiveTemp(baseTemp);
    setLiveFeed(baseFeed);
    setLiveLoad(baseLoad);
  }, [machine?.id, baseRpm, baseVib, baseTemp, baseFeed, baseLoad]);

  // Continuous live data generator loop (runs when isLive !== false)
  useEffect(() => {
    if (isLive === false) return;

    let subTick = 0;
    const interval = setInterval(() => {
      subTick += 1;

      // 1. Elapsed cycle progression
      setCycleElapsed((prev) => {
        const next = prev + 0.2;
        if (next >= targetCycle) {
          return 0.2;
        }
        return Number(next.toFixed(1));
      });

      // 2. Continuous telemetry fluctuation (realistic CNC controller noise)
      setLiveRpm((prev) => {
        const delta = (Math.random() - 0.49) * 14;
        return Math.round(Math.max(baseRpm - 25, Math.min(baseRpm + 25, prev + delta)));
      });

      setLiveFeed((prev) => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.round(Math.max(baseFeed - 15, Math.min(baseFeed + 15, prev + delta)));
      });

      setLiveLoad((prev) => {
        const delta = (Math.random() - 0.5) * 1.6;
        return Math.round(Math.max(baseLoad - 4, Math.min(baseLoad + 4, prev + delta)));
      });

      setLiveVib((prev) => {
        const delta = (Math.random() - 0.5) * 0.02;
        return Number(Math.max(baseVib - 0.02, Math.min(baseVib + 0.02, prev + delta)).toFixed(2));
      });

      setLiveTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.04;
        return Number(Math.max(baseTemp - 0.2, Math.min(baseTemp + 0.2, prev + delta)).toFixed(1));
      });

      // 3. Servo coordinates interpolation (live moving tool)
      setLiveX((prev) => {
        const delta = (Math.random() - 0.5) * 0.012;
        return Number((prev + delta).toFixed(3));
      });

      setLiveZ((prev) => {
        const step = -0.048;
        let nextZ = prev + step;
        if (nextZ < -68.0) nextZ = 2.0;
        return Number(nextZ.toFixed(3));
      });

      // 4. Advance G-code line buffer every ~1.8 seconds (9 sub-ticks)
      if (subTick % 9 === 0) {
        setActiveLineIdx((prev) => (prev + 1) % MASTER_GCODE_PROGRAM.length);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isLive, baseRpm, baseVib, baseTemp, baseFeed, baseLoad, targetCycle]);

  // Compute 8 visible lines in buffer window centered around current execution block
  const visibleLines = useMemo(() => {
    const total = MASTER_GCODE_PROGRAM.length;
    const windowSize = 8;
    let startIndex = activeLineIdx - 3;
    if (startIndex < 0) startIndex += total;

    const lines = [];
    for (let i = 0; i < windowSize; i++) {
      const idx = (startIndex + i) % total;
      const item = MASTER_GCODE_PROGRAM[idx];
      const isActive = idx === activeLineIdx;

      let dynamicCode = item.code;
      if (isActive) {
        if (item.code.includes('Z-42.500') || item.code.includes('Z-12.400') || item.code.includes('Z-68.200') || item.code.includes('Z0.000')) {
          dynamicCode = `G01 X${liveX >= 0 ? '+' : ''}${liveX.toFixed(3)} Z${liveZ.toFixed(3)} F${(liveFeed / 4464).toFixed(3)} ${isWarning ? '(Cutting Active - Throttled 80%)' : '(Cutting Active)'}`;
        } else if (item.code.includes('S4850')) {
          dynamicCode = `G96 S${liveRpm} M03 (Spindle CW ${liveRpm} RPM)`;
        } else if (item.code.includes('X150.000 Z-45.000')) {
          dynamicCode = `G02 X${liveX.toFixed(3)} Z${liveZ.toFixed(3)} R2.500 ${isWarning ? '(Safety Derate Active)' : ''}`;
        }
      }

      lines.push({
        num: item.num,
        code: dynamicCode,
        comment: isWarning && isActive ? `${item.comment} [DERATE 80%]` : item.comment,
        active: isActive,
        op: item.op,
      });
    }
    return lines;
  }, [activeLineIdx, liveX, liveZ, liveFeed, liveRpm, isWarning]);

  // Simulated Tool Magazine
  const toolMagazine = [
    { pocket: 'T01', name: 'Sandvik CoroTurn Prime', type: 'Rough OD', wear: 32, cuts: '420 / 600', status: 'Healthy', notes: 'Normal insert wear' },
    { pocket: 'T02', name: 'Walter Tiger-tec Silver', type: 'Finish Turning', wear: 48, cuts: '380 / 800', status: 'Healthy', notes: 'Flank condition optimal' },
    { pocket: 'T03', name: 'Iscar HeliMill 25mm', type: 'Facing Endmill', wear: 76, cuts: '610 / 800', status: 'Monitor', notes: 'Minor crater wear' },
    { pocket: 'T04', name: 'Seco Feedmax Solid Carbide', type: 'Deep Hole Drill', wear: 22, cuts: '180 / 900', status: 'Healthy', notes: 'Good margin clearance' },
    {
      pocket: 'T05',
      name: 'Kennametal Top Notch',
      type: 'Grooving & Rough Insert',
      wear: toolReplaced ? 4 : (isWarning ? 88 : 45),
      cuts: toolReplaced ? '12 / 800' : (isWarning ? '710 / 800' : '360 / 800'),
      status: toolReplaced ? 'Optimal' : (isWarning ? 'Replace Soon' : 'Healthy'),
      notes: isWarning ? 'CRITICAL: Severe flank wear inducing 240Hz spindle harmonics' : 'Replaced with fresh carbide insert',
    },
    { pocket: 'T06', name: 'Guhring Spiral Flute Tap', type: 'M12 Threading', wear: 15, cuts: '120 / 750', status: 'Healthy', notes: 'Thread profile sharp' },
    { pocket: 'T07', name: 'Mitsubishi Ball End Mill', type: '3D Contouring', wear: 54, cuts: '430 / 800', status: 'Healthy', notes: 'Contour profile verified' },
    { pocket: 'T08', name: 'Renishaw OMP40-2 Probe', type: 'Optical Metrology', wear: 5, cuts: 'Calibrated', status: 'Optimal', notes: 'Transmitter 94%' },
  ];

  // Telemetry Sparkline points showing progressive vibration climb for Machine 7
  const sparklineData = isWarning
    ? [0.38, 0.42, 0.45, 0.52, 0.61, 0.72, 0.79, 0.84, 0.88, 0.89, 0.92, 0.90, 0.93, 0.91, 0.92, 0.91, 0.90, liveVib]
    : (machine?.hist?.vib?.length ? machine.hist.vib : [0.35, 0.38, 0.40, 0.39, 0.42, 0.41, 0.38, 0.43, 0.45, 0.41, 0.39, 0.42, 0.44, 0.40, 0.38, 0.41, 0.43, 0.38]);

  const handleRunDiagnostics = () => {
    setDiagnosticsState('running');
    setTimeout(() => {
      setDiagnosticsState('done');
    }, 1200);
  };

  const handleAskAiAboutThisMachine = () => {
    if (!machine) return;
    const prompt = `Give me a full diagnostic health summary, current telemetry check, and recommended maintenance action for machine ${machine.id} (${machine.model || machine.name}).`;
    sendMessage(prompt);
    setActiveSection('assistant');
  };

  if (!machine) {
    return (
      <div className="section-wrapper">
        <p>Machine not found.</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setActiveSection('overview')}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="section-wrapper machine-detail-page">
      {/* Top Breadcrumb & Action Bar */}
      <div className="md-top-bar">
        <div className="md-breadcrumb-group">
          <button
            type="button"
            className="md-back-btn"
            onClick={() => setActiveSection('overview')}
            title="Return to Factory Dashboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <span className="md-crumb-sep">/</span>
          <span className="md-crumb-link" onClick={() => setActiveSection('collection')}>Machines Status</span>
          <span className="md-crumb-sep">/</span>
          <span className="md-crumb-current">{machine.id} ({machine.name || machine.model})</span>
        </div>

        <div className="md-header-actions">
          <button
            type="button"
            className="md-action-btn md-btn-diagnostics"
            onClick={handleRunDiagnostics}
            disabled={diagnosticsState === 'running'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>{diagnosticsState === 'running' ? 'Scanning PLC & Drives...' : 'Run Diagnostics'}</span>
          </button>

          <button
            type="button"
            className="md-action-btn md-btn-ai"
            onClick={handleAskAiAboutThisMachine}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Ask AI About {machine.id}</span>
          </button>
        </div>
      </div>

      {/* Diagnostics Alert Banner (if manually run) */}
      {diagnosticsState === 'done' && (
        <div className={`md-diag-banner ${isWarning ? 'warning' : 'success'} animate-fade-in`}>
          <div className="md-diag-badge">
            {isWarning ? 'PLC DIAGNOSTIC ALERT' : 'PLC DIAGNOSTICS PASSED'}
          </div>
          <div className="md-diag-msg">
            {isWarning
              ? `Spindle vibration at ${liveVib.toFixed(2)} mm/s exceeds ISO 10816 0.80 mm/s threshold. Resonant FFT peak at 240Hz detected on B-Axis bearing. Primary trigger: Pocket T05 insert wear (88%). Adaptive feedrate derated to 80% (980 mm/min) to prevent part scrap.`
              : `All 32 safety interlocks validated. Controller scan time 3.4ms. Tool wear within specification. Zero axis backlash detected.`}
          </div>
          <button
            type="button"
            className="md-diag-dismiss"
            onClick={() => setDiagnosticsState('idle')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Industrial Active Alarm Banner (Shown whenever Machine 7 or warning machine is viewed) */}
      {isWarning && !alarmAcknowledged && (
        <div className="md-active-alarm-banner animate-fade-in">
          <div className="md-alarm-header">
            <div className="md-alarm-title-group">
              <span className="md-alarm-pill">
                <span className="md-alarm-blink-dot" />
                ACTIVE FAULT · ALARM #W-2077
              </span>
              <span className="md-alarm-code">ISO 10816 CLASS II THRESHOLD VIOLATION</span>
              <span className="md-alarm-timestamp">Shift B · Live OPC-UA / SCADA Feed</span>
            </div>
            <div className="md-alarm-badge-severity">SEVERITY: HIGH (ACTION REQUIRED)</div>
          </div>

          <div className="md-alarm-body">
            <div className="md-alarm-main-desc">
              <strong>⚠️ Bearing Harmonic Vibration Exceeded:</strong> Spindle vibration peaked at{' '}
              <strong className="highlight-err">{liveVib.toFixed(2)} mm/s RMS</strong> (Upper Safety Limit: 0.80 mm/s). Controller FFT telemetry detected a resonant harmonic vibration spike at 240Hz on the B-Axis main spindle bearing.
            </div>

            <div className="md-alarm-root-cause-grid">
              <div className="md-alarm-rc-item">
                <span className="rc-label">Root Cause Diagnostic</span>
                <span className="rc-val">Pocket T05 Insert Wear at 88% + Bearing Radial Preload Fatigue</span>
              </div>
              <div className="md-alarm-rc-item">
                <span className="rc-label">Autonomous Safety Interlock</span>
                <span className="rc-val">Safety Feed Throttled to 80% (980 mm/min) · 4 Parts Held</span>
              </div>
              <div className="md-alarm-rc-item">
                <span className="rc-label">Quality Risk</span>
                <span className="rc-val">Chamfer & OD Surface Roughness Ra &gt; 3.2µm (Chatter Marks Risk)</span>
              </div>
            </div>
          </div>

          <div className="md-alarm-actions">
            <button
              type="button"
              className="md-alarm-btn btn-ai"
              onClick={handleAskAiAboutThisMachine}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Ask Factory AI: Root Cause & Fix</span>
            </button>

            <button
              type="button"
              className="md-alarm-btn btn-action"
              onClick={() => setToolReplaced(true)}
              title="Simulate replacing worn tool T05 and resetting vibration"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <span>Replace Tool T05 & Recalibrate (Reset 88% → 4%)</span>
            </button>

            <button
              type="button"
              className="md-alarm-btn btn-diag"
              onClick={handleRunDiagnostics}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span>Run Controller Scan</span>
            </button>

            <button
              type="button"
              className="md-alarm-btn btn-ack"
              onClick={() => setAlarmAcknowledged(true)}
            >
              <span>Acknowledge Alarm (Keep 80% Throttled)</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Notification if Tool was replaced */}
      {toolReplaced && (
        <div className="md-diag-banner success animate-fade-in" style={{ marginBottom: '4px' }}>
          <div className="md-diag-badge">REPAIRED & CALIBRATED</div>
          <div className="md-diag-msg">
            ✅ Tool T05 replaced with fresh Kennametal carbide insert. Vibration normalized from 0.91 mm/s to 0.36 mm/s. Spindle load returned to nominal 62%. Feedrate override restored to 100% (1,260 mm/min).
          </div>
          <button
            type="button"
            className="md-diag-dismiss"
            onClick={() => setToolReplaced(false)}
            title="Re-trigger warning test"
          >
            ↺ Re-test Warning
          </button>
        </div>
      )}

      {/* Fast Machine Switcher Strip (All 12 Machines) */}
      <div className="md-switcher-strip">
        <span className="md-switcher-label">Switch Machine:</span>
        <div className="md-switcher-pills">
          {machines.slice(0, 12).map((m) => {
            const isSel = m.id === machine.id;
            const mWarn = m.status === 'warning' || (m.id === 'CNC-07' && !toolReplaced);
            return (
              <button
                key={m.id}
                type="button"
                className={`md-switch-pill ${isSel ? 'active' : ''} ${mWarn ? 'warning-pill' : ''}`}
                onClick={() => setSelectedMachineId(m.id)}
              >
                <span className={`md-pill-dot ${mWarn ? 'warn' : 'ok'}`} />
                <span className="md-pill-id">{m.id}</span>
                <span className="md-pill-output">{m.metrics?.partsToday ?? 350}</span>
                {mWarn && <span className="md-pill-tag-alert">⚠️ VIB ALARM</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Machine Profile Card */}
      <div className="md-hero-card">
        <div className="md-hero-left">
          <div className="md-machine-thumb-wrap">
            <img
              src={machine.imageUrl || '/machines/cnc_vmc_5axis.jpg'}
              alt={machine.name || machine.id}
              className="md-machine-thumb-img"
            />
            <div className="md-thumb-overlay-badge">
              {machine.type} 5-Axis
            </div>
          </div>

          <div className="md-hero-info">
            <div className="md-id-row">
              <h1 className="md-machine-title">{machine.id}</h1>
              <span className={`md-status-chip ${isWarning ? 'warning' : 'running'}`}>
                <span className="md-live-pulse-dot" />
                {isWarning ? 'ATTENTION REQUIRED · SPINDLE VIB' : 'RUNNING · IN CYCLE'}
              </span>
            </div>

            <div className="md-model-name">
              {machine.model || machine.name || 'High Precision CNC Machining Center'}
            </div>

            <div className="md-meta-tags">
              <span className="md-tag-pill">
                <strong>Bay:</strong> {machine.bay || 'Heavy Machining Bay'}
              </span>
              <span className="md-tag-pill">
                <strong>Line:</strong> {machine.line || 'Line 2 · Cell B'}
              </span>
              <span className="md-tag-pill">
                <strong>Controller:</strong> {machine.plc?.controllerModel || (isWarning ? 'Okuma OSP-P300LA Controller' : 'Fanuc 31i-B5 CNC')}
              </span>
              <span className="md-tag-pill">
                <strong>Protocol:</strong> {machine.protocol || 'OPC-UA / Modbus TCP'}
              </span>
              <span className="md-tag-pill">
                <strong>Gateway:</strong> {machine.scada?.gatewayId || 'SCADA-HIST / L2-GW'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Machine Quick Production Gauge */}
        <div className="md-hero-right">
          <div className="md-kpi-summary-box">
            <div className="md-kpi-title">Today's Completed</div>
            <div className="md-kpi-val ok">{partsToday} <span className="md-kpi-unit">parts</span></div>
            <div className="md-kpi-sub">
              {partsIncomplete > 0 ? (
                <span className="md-kpi-sub-warn">⚠️ {partsIncomplete} Incomplete / Quarantined</span>
              ) : (
                <span style={{ color: '#10B981', fontWeight: 600 }}>0 Cycle Interruptions</span>
              )}
            </div>
          </div>

          <div className="md-kpi-summary-box">
            <div className="md-kpi-title">Calculated Machine OEE</div>
            <div className={`md-kpi-val ${isWarning ? 'warn' : 'oee'}`}>
              {isWarning ? '64.2%' : '88.5%'}
            </div>
            <div className="md-kpi-sub">
              {isWarning ? (
                <span style={{ color: '#D97706', fontWeight: 600 }}>Target: 85.0% (-20.8% Deficit · Throttled)</span>
              ) : (
                <span>Target: 85.0% (+3.5%)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Prescriptive Intelligence Card (Based on Spreadsheet Knowledge Matrix) */}
      <div className="md-prescriptive-card animate-fade-in">
        <div className="md-prescriptive-head">
          <div className="md-prescriptive-title-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <h3>AI Prescriptive Intelligence · {machine.id}</h3>
          </div>
          <span className="md-prescriptive-usecase-badge">
            {machine.useCase || 'Autonomous Anomaly Detection'}
          </span>
        </div>

        <div className="md-prescriptive-grid">
          {/* Box 1: Workpiece Part */}
          <div className="md-prescriptive-box">
            <span className="md-prescriptive-box-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              Workpiece Part
            </span>
            <span className="md-prescriptive-box-val">
              {machine.workpiece || 'Precision Component'}
            </span>
          </div>

          {/* Box 2: Detected Scenario */}
          <div className="md-prescriptive-box">
            <span className="md-prescriptive-box-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Detected Scenario
            </span>
            <span className="md-prescriptive-box-val" style={{ color: isWarning ? '#DC2626' : 'inherit' }}>
              {machine.scenario || 'Nominal Operation'}
            </span>
          </div>

          {/* Box 3: Sensor Signals / Evidence */}
          <div className="md-prescriptive-box">
            <span className="md-prescriptive-box-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Signals / Telemetry Evidence
            </span>
            <span className="md-prescriptive-box-val signal">
              {machine.signalsEvidence || 'All operational signals within nominal baselines'}
            </span>
          </div>

          {/* Box 4: Recommended Action */}
          <div className="md-prescriptive-box">
            <span className="md-prescriptive-box-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              GenAI Recommended Action
            </span>
            <span className="md-prescriptive-box-val action">
              {machine.recommendedAction || 'Maintain standard spindle feed and scheduled cycle'}
            </span>
          </div>
        </div>

        <div className="md-prescriptive-footer">
          <div className="md-prescriptive-note">
            <span>●</span>
            <span>Live SCADA 250ms correlated with PLC step execution. GenAI confidence: 96.8%</span>
          </div>

          <div className="md-prescriptive-actions">
            <button
              type="button"
              className="md-action-btn md-btn-ai"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={handleAskAiAboutThisMachine}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Ask AI About This Scenario</span>
            </button>

            <button
              type="button"
              className="md-action-btn"
              style={{ fontSize: '12px', padding: '6px 12px', background: 'var(--bg-panel-2)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onClick={() => setActiveSection('maintenance')}
            >
              <span>View All 12 in Maintenance Matrix →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: 4 Key Real-Time Telemetry Cards */}
      <div className="overview-kpi-row-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '18px' }}>
        {/* Metric 1: Spindle Velocity & Load */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <GearIcon size={18} color="#0D9488" />
            </div>
            <span className={`kpi-badge-pill ${isWarning ? 'red' : 'green'}`}>
              {isWarning ? '● High Motor Strain' : '● SCADA 100ms Live'}
            </span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{liveRpm.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>RPM</span>
          </div>
          <div className="kpi-label">
            <span>Spindle Velocity & Cutting Load</span>
            <span className="kpi-info-icon" title="Continuous spindle rotational speed and dynamic motor load">ⓘ</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>
              <span>Spindle Motor Load</span>
              <span style={{ color: isWarning ? '#D97706' : 'inherit', fontWeight: isWarning ? 700 : 500 }}>
                {liveLoad}% / 100% {isWarning ? '(High Strain)' : ''}
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'var(--bg-main, #f1f5f9)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${liveLoad}%`,
                  height: '100%',
                  background: isWarning ? '#F59E0B' : '#10B981',
                  borderRadius: '999px',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
          <div className="kpi-sub-line font-sm" style={{ marginTop: '8px' }}>
            <span className={`dot-status ${isWarning ? 'amber pulse' : 'green'}`} />
            <span>{isWarning ? '⚠️ 240Hz bearing resonance detected' : 'Rated max: 6,000 RPM · 15.5 kW motor'}</span>
          </div>
        </div>

        {/* Metric 2: Programmed Feed Rate */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <ZapIcon size={18} color="#2563EB" />
            </div>
            <span className={`kpi-badge-pill ${isWarning ? 'red' : 'green'}`}>
              {isWarning ? '● Auto-Derate 80%' : '● Override 100%'}
            </span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{liveFeed.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>mm/min</span>
          </div>
          <div className="kpi-label">
            <span>Programmed Tool Feed Rate</span>
            <span className="kpi-info-icon" title="Interpolated linear cutting velocity across 3-axis servo contour">ⓘ</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>
              <span>Rapid Traverse</span>
              <span>{isWarning ? '25.6 m/min Throttled' : '32.0 m/min Max'}</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'var(--bg-main, #f1f5f9)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.round((liveFeed / 1600) * 100)}%`,
                  height: '100%',
                  background: isWarning ? '#F59E0B' : '#3B82F6',
                  borderRadius: '999px',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
          <div className="kpi-sub-line font-sm" style={{ marginTop: '8px' }}>
            <span className={`dot-status ${isWarning ? 'amber' : 'green'}`} />
            <span>{isWarning ? 'Throttled for vibration protection' : 'Interpolation: Linear 3-Axis Contour'}</span>
          </div>
        </div>

        {/* Metric 3: Bearing Harmonic Vibration */}
        <div className="kpi-card-theme" style={isWarning ? { borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.02)' } : {}}>
          <div className="kpi-card-top-split">
            <div className={`kpi-icon-square ${isWarning ? 'red' : 'mint'}`}>
              <ActivityIcon size={18} color={isWarning ? '#DC2626' : '#059669'} />
            </div>
            <span className={`kpi-badge-pill ${isWarning ? 'red' : 'green'}`}>
              {isWarning ? '● CRITICAL EXCEEDED' : '● ISO 10816 Normal'}
            </span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular" style={isWarning ? { color: '#DC2626' } : {}}>{liveVib.toFixed(2)}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>mm/s RMS</span>
          </div>
          <div className="kpi-label">
            <span>Bearing Harmonic Vibration</span>
            <span className="kpi-info-icon" title="Piezoelectric vibration sensor monitoring spindle bearing resonance">ⓘ</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>
              <span>ISO 10816 Limit</span>
              <span style={{ color: isWarning ? '#DC2626' : 'inherit', fontWeight: isWarning ? 700 : 500 }}>
                0.80 mm/s {isWarning ? '(+0.11 mm/s Violation)' : ''}
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'var(--bg-main, #f1f5f9)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (liveVib / 1.2) * 100)}%`,
                  height: '100%',
                  background: isWarning ? '#EF4444' : '#10B981',
                  borderRadius: '999px',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
          <div className="kpi-sub-line font-sm" style={{ marginTop: '8px' }}>
            <span className={`dot-status ${isWarning ? 'red pulse' : 'green'}`} />
            <span>{isWarning ? '⚠️ ISO Limit Breached · Immediate service' : 'Piezoelectric Accelerometer DK Active'}</span>
          </div>
        </div>

        {/* Metric 4: Spindle Bearing Temp & Coolant */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <ThermometerIcon size={18} color="#059669" />
            </div>
            <span className={`kpi-badge-pill ${isWarning ? 'red' : 'green'}`}>
              {isWarning ? '● Temp Elevated' : '● Chiller Active'}
            </span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular" style={isWarning ? { color: '#D97706' } : {}}>{liveTemp.toFixed(1)}°C</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>/ 18.2 Bar</span>
          </div>
          <div className="kpi-label">
            <span>Bearing Temp & Coolant Pressure</span>
            <span className="kpi-info-icon" title="Bearing thermistor and high-pressure flood coolant delivery">ⓘ</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>
              <span>Oil Chiller Temp</span>
              <span>{isWarning ? '27.4°C (Pump 100%)' : '24.5°C Steady'}</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'var(--bg-main, #f1f5f9)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: isWarning ? '68%' : '48%',
                  height: '100%',
                  background: isWarning ? '#F59E0B' : '#06B6D4',
                  borderRadius: '999px',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
          <div className="kpi-sub-line font-sm" style={{ marginTop: '8px' }}>
            <span className={`dot-status ${isWarning ? 'amber' : 'green'}`} />
            <span>{isWarning ? '⚠️ Chiller running at max flow capacity' : 'Coolant reservoir: 88% full · pH 8.9'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs for Deep Inspector */}
      <div className="md-tabs-row">
        <button
          type="button"
          className={`md-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <span>Live G-Code & Active Part</span>
          {isWarning && <span className="md-tab-badge warn">Throttled</span>}
        </button>
        <button
          type="button"
          className={`md-tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          <span>Tool Life & Magazine (8 Pockets)</span>
          {isWarning && <span className="md-tab-badge err">1 Urgent</span>}
        </button>
        <button
          type="button"
          className={`md-tab-btn ${activeTab === 'gcode' ? 'active' : ''}`}
          onClick={() => setActiveTab('gcode')}
        >
          <span>Axis Coordinates & I/O Interlocks</span>
          {isWarning && <span className="md-tab-badge warn">1 Advisory</span>}
        </button>
        <button
          type="button"
          className={`md-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <span>Shift Logs & Alarms History</span>
          {isWarning && <span className="md-tab-badge warn">4 Events</span>}
        </button>
      </div>

      {/* Tab 1: Live G-Code & Active Part */}
      {activeTab === 'telemetry' && (
        <div className="md-tab-content-grid">
          {/* Active Workpiece Card */}
          <div className="md-panel-card">
            <div className="md-panel-head">
              <h3>Active Workpiece Machining</h3>
              <span className={`md-head-badge ${isWarning ? 'badge-warn' : ''}`}>
                {isWarning ? '⚠️ THROTTLED (CHATTER RISK)' : 'In Progress'}
              </span>
            </div>

            <div className="md-workpiece-box">
              <div className="md-wp-title">{machine.workpiece || 'Heavy Forged Flywheel Hub'}</div>
              <div className="md-wp-spec">Specification: Aerospace Grade 4140 Alloy · Heat-Treated Core</div>

              {/* Quality Callout when in Warning */}
              {isWarning && (
                <div className="md-wp-alert-callout">
                  <span className="md-wp-alert-icon">⚠️</span>
                  <div className="md-wp-alert-text">
                    <strong>Quality Hold Notice:</strong> Spindle harmonic vibration amplitude (0.91 mm/s) exceeds ISO 10816 limit. 4 workpiece units routed to quarantine for surface finish (Ra &gt; 3.2µm) CMM inspection.
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="md-cycle-progress-section">
                <div className="md-cycle-info-row">
                  <span>Cycle Progress: Step {String((activeLineIdx % 12) + 1).padStart(2, '0')} / 12 ({MASTER_GCODE_PROGRAM[activeLineIdx]?.op || 'Heavy Rough Turn'})</span>
                  <span className="md-cycle-time-left" style={{ color: isWarning ? '#D97706' : '#10B981' }}>
                    ~{Math.max(1, Math.round(targetCycle - cycleElapsed))}s remaining in cycle
                  </span>
                </div>
                <div className="md-cycle-bar-bg">
                  <div
                    className="md-cycle-bar-fill"
                    style={{
                      width: `${Math.min(100, (cycleElapsed / targetCycle) * 100).toFixed(1)}%`,
                      background: isWarning ? 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Part Quality Matrix */}
              <div className="md-wp-metrics-row">
                <div className="md-wp-m-item">
                  <div className="md-wp-m-label">Target Cycle Time</div>
                  <div className="md-wp-m-val">{targetCycle.toFixed(1)} sec</div>
                </div>
                <div className="md-wp-m-item">
                  <div className="md-wp-m-label">Current Cycle Elapsed</div>
                  <div className="md-wp-m-val">{cycleElapsed.toFixed(1)} sec</div>
                </div>
                <div className="md-wp-m-item">
                  <div className="md-wp-m-label">Dimensional Tolerance</div>
                  <div className="md-wp-m-val" style={{ color: isWarning ? '#DC2626' : 'inherit' }}>
                    {isWarning ? '±0.019 mm (⚠️ Drift Risk)' : '±0.005 mm (OK)'}
                  </div>
                </div>
                <div className="md-wp-m-item">
                  <div className="md-wp-m-label">Batch Target</div>
                  <div className="md-wp-m-val">500 pcs</div>
                </div>
              </div>
            </div>

            {/* Live Vibration Spectrum Sparkline with Tooltip */}
            <div className="md-vibe-trend-box">
              <div className="md-trend-head">
                <span>Vibration Trend (Last 18 Cycles)</span>
                <span className="md-trend-curr" style={{ color: isWarning ? '#DC2626' : undefined }}>
                  {liveVib.toFixed(2)} mm/s {isWarning ? '(EXCEEDED)' : ''}
                </span>
              </div>
              <div className="md-sparkline-wrap">
                <svg viewBox="0 0 400 80" className="md-sparkline-svg">
                  <defs>
                    <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isWarning ? '#EF4444' : '#10B981'} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={isWarning ? '#EF4444' : '#10B981'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* ISO Limit Line */}
                  <line x1="0" y1="28" x2="400" y2="28" stroke="#EF4444" strokeDasharray="4 4" strokeWidth="1.5" />
                  <text x="310" y="24" fill="#EF4444" fontSize="10" fontWeight="700">0.80 mm/s Limit</text>

                  {/* Area */}
                  <path
                    d={`M 0,80 ${sparklineData
                      .map((v, i) => `L ${(i / (sparklineData.length - 1)) * 400},${80 - (v / 1.2) * 70}`)
                      .join(' ')} L 400,80 Z`}
                    fill="url(#vibGrad)"
                  />

                  {/* Line */}
                  <path
                    d={`M 0,${80 - (sparklineData[0] / 1.2) * 70} ${sparklineData
                      .map((v, i) => `L ${(i / (sparklineData.length - 1)) * 400},${80 - (v / 1.2) * 70}`)
                      .join(' ')}`}
                    fill="none"
                    stroke={isWarning ? '#EF4444' : '#10B981'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Hover interactive dots */}
                  {sparklineData.map((val, idx) => {
                    const cx = (idx / (sparklineData.length - 1)) * 400;
                    const cy = 80 - (val / 1.2) * 70;
                    const isExceed = val > 0.80;
                    return (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r={isExceed ? '5' : '4'}
                        fill={isExceed ? '#EF4444' : '#10B981'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="md-hover-dot"
                        onMouseEnter={() => setHoveredPoint({ x: cx, y: cy, val, label: `Cycle ${idx + 1}` })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </svg>

                {hoveredPoint && (
                  <div
                    className="md-chart-tooltip"
                    style={{
                      left: `${(hoveredPoint.x / 400) * 100}%`,
                      top: `${hoveredPoint.y - 12}px`,
                    }}
                  >
                    <strong>{hoveredPoint.label}:</strong> {hoveredPoint.val.toFixed(2)} mm/s
                    {hoveredPoint.val > 0.80 && ' (OVER LIMIT)'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CNC Live G-Code Terminal */}
          <div className="md-panel-card">
            <div className="md-panel-head">
              <h3>Live G-Code Interpreter Stream</h3>
              <span className="md-code-program-tag">{machine.plc?.program || 'O2077_FLYWHEEL.NC'}</span>
            </div>

            <div className="md-terminal-container">
              <div className="md-terminal-bar">
                <span className="md-term-dot" />
                <span className="md-term-dot" />
                <span className="md-term-dot" />
                <span className="md-term-title">
                  CNC Controller: {machine.plc?.controllerModel || (isWarning ? 'Okuma OSP-P300LA' : 'Fanuc 31i-B5')}
                </span>
                {isWarning ? (
                  <span className="md-term-status-chip warn">
                    <span className="md-term-live-dot warn" />
                    <span>⚠️ ALARM W-2077 · FEED DERATE (80%)</span>
                  </span>
                ) : (
                  <span className="md-term-status-chip">
                    <span className="md-term-live-dot" />
                    <span>LIVE STREAM</span>
                  </span>
                )}
              </div>

              {/* Digital Readout (DRO) Strip */}
              <div className="md-terminal-dro">
                <div className="md-dro-item">
                  <span className="md-dro-lbl">POS X</span>
                  <span className="md-dro-val">{liveX >= 0 ? '+' : ''}{liveX.toFixed(3)}<small>mm</small></span>
                </div>
                <div className="md-dro-item">
                  <span className="md-dro-lbl">POS Z</span>
                  <span className="md-dro-val">{liveZ >= 0 ? '+' : ''}{liveZ.toFixed(3)}<small>mm</small></span>
                </div>
                <div className="md-dro-item">
                  <span className="md-dro-lbl">FEED</span>
                  <span className="md-dro-val" style={{ color: isWarning ? '#FCD34D' : undefined }}>
                    {liveFeed.toLocaleString('en-IN')}<small>mm/min {isWarning ? '(DERATED)' : ''}</small>
                  </span>
                </div>
                <div className="md-dro-item">
                  <span className="md-dro-lbl">SPINDLE</span>
                  <span className="md-dro-val">{liveRpm.toLocaleString('en-IN')}<small>RPM</small></span>
                </div>
                <div className="md-dro-item">
                  <span className="md-dro-lbl">MOTOR LOAD</span>
                  <span className="md-dro-val" style={{ color: isWarning ? '#F87171' : undefined }}>
                    {liveLoad}%<small>{isWarning ? '(HIGH)' : ''}</small>
                  </span>
                </div>
              </div>

              <div className="md-terminal-body">
                {visibleLines.map((line, idx) => (
                  <div
                    key={`${line.num}-${idx}`}
                    className={`md-gcode-row ${line.active ? (isWarning ? 'active-executing warn' : 'active-executing') : ''}`}
                  >
                    <span className="md-line-num">{line.num}</span>
                    <span className="md-line-code">{line.code}</span>
                    <span className="md-line-comment">; {line.comment}</span>
                    {line.active && (
                      isWarning ? (
                        <span className="md-exec-pill warn">⚠️ THROTTLED</span>
                      ) : (
                        <span className="md-exec-pill">RUNNING</span>
                      )
                    )}
                  </div>
                ))}
              </div>
              <div className="md-terminal-foot">
                <span style={{ color: isWarning ? '#FCD34D' : undefined }}>
                  Feed Hold Override: {isWarning ? '80% (Auto Safety Throttled)' : '100% (Normal)'}
                </span>
                <span>Active Op: {MASTER_GCODE_PROGRAM[activeLineIdx]?.op || 'Contouring'}</span>
                <span style={{ color: isWarning ? '#F87171' : undefined }}>
                  Buffer: {isWarning ? 'ALARM ACTIVE · 240Hz Peak Logged' : 'Optimal (250 blocks pre-read)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tool Life & Magazine */}
      {activeTab === 'tools' && (
        <div className="md-panel-card">
          <div className="md-panel-head">
            <h3>Automated Tool Changer (ATC) Magazine & Wear Tracking</h3>
            <span className={`md-head-badge ${isWarning ? 'badge-warn' : ''}`}>
              {isWarning ? 'Active: T05 (Critical Wear 88%)' : 'Active: T05 (Roughing)'}
            </span>
          </div>

          <div className="md-table-wrap">
            <table className="md-table">
              <thead>
                <tr>
                  <th>Pocket</th>
                  <th>Tool Description</th>
                  <th>Operation Type</th>
                  <th>Cuts Done / Expected</th>
                  <th>Wear Percentage</th>
                  <th>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {toolMagazine.map((tool) => {
                  const isT05 = tool.pocket === 'T05';
                  return (
                    <tr
                      key={tool.pocket}
                      className={isT05 ? (isWarning ? 'active-tool-row md-tool-cause-row' : 'active-tool-row') : ''}
                    >
                      <td>
                        <span className="md-pocket-tag">{tool.pocket}</span>
                      </td>
                      <td>
                        <strong>{tool.name}</strong>
                        {isWarning && isT05 && tool.notes && (
                          <div className="md-tool-cause-notice">⚠️ {tool.notes}</div>
                        )}
                      </td>
                      <td>{tool.type}</td>
                      <td>{tool.cuts}</td>
                      <td>
                        <div className="md-wear-bar-cell">
                          <div className="md-wear-bar-bg">
                            <div
                              className="md-wear-bar-fill"
                              style={{
                                width: `${tool.wear}%`,
                                background:
                                  tool.wear > 80 ? '#EF4444' : tool.wear > 60 ? '#F59E0B' : '#10B981',
                              }}
                            />
                          </div>
                          <span
                            className="md-wear-pct"
                            style={{ color: tool.wear > 80 ? '#EF4444' : undefined }}
                          >
                            {tool.wear}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span
                            className={`md-tool-badge ${
                              tool.status === 'Replace Soon'
                                ? 'badge-err'
                                : tool.status === 'Monitor'
                                ? 'badge-warn'
                                : 'badge-ok'
                            }`}
                          >
                            {tool.status}
                          </span>
                          {isWarning && isT05 && (
                            <button
                              type="button"
                              className="md-inline-swap-btn"
                              onClick={() => setToolReplaced(true)}
                              title="Simulate physical insert change and sensor reset"
                            >
                              Swap Insert (Reset 88% → 4%)
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Axis Coordinates & Interlocks */}
      {activeTab === 'gcode' && (
        <div className="md-tab-content-grid">
          {/* Axis Coordinates */}
          <div className="md-panel-card">
            <div className="md-panel-head">
              <h3>Servo Axis Real-Time Absolute Positions</h3>
              <span className="md-head-badge">Heidenhain Scales Active</span>
            </div>

            <div className="md-axes-grid">
              <div className="md-axis-card">
                <div className="md-axis-letter">X</div>
                <div className="md-axis-pos">{liveX >= 0 ? '+' : ''}{liveX.toFixed(3)} <span className="md-unit">mm</span></div>
                <div className="md-axis-load">Servo Load: {liveLoad}% · Temp: {liveTemp.toFixed(1)}°C</div>
              </div>
              <div className="md-axis-card">
                <div className="md-axis-letter">Y</div>
                <div className="md-axis-pos">-38.120 <span className="md-unit">mm</span></div>
                <div className="md-axis-load">Servo Load: 28% · Temp: 34.8°C</div>
              </div>
              <div className="md-axis-card">
                <div className="md-axis-letter">Z</div>
                <div className="md-axis-pos">{liveZ >= 0 ? '+' : ''}{liveZ.toFixed(3)} <span className="md-unit">mm</span></div>
                <div className="md-axis-load" style={{ color: isWarning ? '#D97706' : undefined, fontWeight: isWarning ? 600 : undefined }}>
                  Servo Load: {isWarning ? '79% (High Load Alert)' : '58%'} · Temp: {(liveTemp + 1.2).toFixed(1)}°C
                </div>
              </div>
              <div className="md-axis-card">
                <div className="md-axis-letter">B</div>
                <div className="md-axis-pos">+45.000 <span className="md-unit">deg</span></div>
                <div className="md-axis-load">Rotary Index: Locked (Hydraulic Brake)</div>
              </div>
            </div>
          </div>

          {/* Safety Interlocks */}
          <div className="md-panel-card">
            <div className="md-panel-head">
              <h3>PLC I/O & Safety Interlock Status</h3>
              <span className={`md-head-badge ${isWarning ? 'badge-warn' : ''}`}>
                {isWarning ? '30 / 32 Normal · 2 Advisories' : '32 / 32 Safe'}
              </span>
            </div>

            <div className="md-interlocks-list">
              <div className="md-io-row">
                <span className="md-io-name">Chamber Door Safety Lock</span>
                <span className="md-io-status ok">LOCKED & SECURED</span>
              </div>
              <div className="md-io-row">
                <span className="md-io-name">Chuck / Hydraulic Clamping</span>
                <span className="md-io-status ok">18.5 BAR CLAMPED</span>
              </div>
              <div className="md-io-row">
                <span className="md-io-name">Spindle Vibration Accelerometer (B-Axis)</span>
                <span
                  className="md-io-status"
                  style={{
                    color: isWarning ? '#EF4444' : '#10B981',
                    fontWeight: 700,
                  }}
                >
                  {isWarning ? '⚠️ 0.91 mm/s (THRESHOLD EXCEEDED > 0.80)' : '0.38 mm/s (NORMAL)'}
                </span>
              </div>
              <div className="md-io-row">
                <span className="md-io-name">Tool Life Wear Interlock</span>
                <span
                  className="md-io-status"
                  style={{
                    color: isWarning ? '#F59E0B' : '#10B981',
                    fontWeight: 700,
                  }}
                >
                  {isWarning ? '⚠️ POCKET T05 AT 88% WEAR (SWAP REQUIRED)' : 'NOMINAL (<60% WEAR)'}
                </span>
              </div>
              <div className="md-io-row">
                <span className="md-io-name">Adaptive Feedrate Limiter</span>
                <span
                  className="md-io-status"
                  style={{
                    color: isWarning ? '#F59E0B' : '#10B981',
                    fontWeight: 700,
                  }}
                >
                  {isWarning ? '⚠️ SAFETY DERATE ENGAGED (80% SPEED)' : 'NORMAL (100% OVERRIDE)'}
                </span>
              </div>
              <div className="md-io-row">
                <span className="md-io-name">Chip Conveyor Reverse Guard</span>
                <span className="md-io-status ok">RUNNING NORMAL</span>
              </div>
              <div className="md-io-row">
                <span className="md-io-name">Spindle Chiller Circulation</span>
                <span className="md-io-status ok">FLOW 14.2 L/MIN (100% PUMP)</span>
              </div>
              <div className="md-io-row">
                <span className="md-io-name">Emergency Stop Circuit</span>
                <span className="md-io-status ok">CLOSED (HEALTHY)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Shift Logs & Alarms */}
      {activeTab === 'events' && (
        <div className="md-panel-card">
          <div className="md-panel-head">
            <h3>Recent Machine Events & Telemetry Logs</h3>
            <span className={`md-head-badge ${isWarning ? 'badge-warn' : ''}`}>
              {isWarning ? '⚠️ 4 Active Events & Alarms' : 'Live Plant Sync'}
            </span>
          </div>

          <div className="md-events-list">
            {isWarning ? (
              <>
                <div className="md-event-item warning-item">
                  <div className="md-ev-time">13:14:02</div>
                  <div className="md-ev-type warn">VIBRATION</div>
                  <div className="md-ev-text">
                    <strong>[ALARM W-2077]</strong> Harmonic vibration peaked at 0.91 mm/s on B-Axis spindle bearing during heavy roughing pass (ISO limit: 0.80 mm/s).
                  </div>
                </div>
                <div className="md-event-item warning-item">
                  <div className="md-ev-time">13:11:45</div>
                  <div className="md-ev-type warn">PLC DERATE</div>
                  <div className="md-ev-text">
                    <strong>[AUTO-PROTECT]</strong> Adaptive controller clamped feedrate override from 1,260 mm/min to 980 mm/min (80%) to suppress chatter marks.
                  </div>
                </div>
                <div className="md-event-item warning-item">
                  <div className="md-ev-time">12:58:30</div>
                  <div className="md-ev-type warn">QUALITY</div>
                  <div className="md-ev-text">
                    <strong>[QUARANTINE]</strong> 4 completed workpiece units held for CMM metrology inspection due to high roughness (Ra &gt; 3.2µm) risk.
                  </div>
                </div>
                <div className="md-event-item warning-item">
                  <div className="md-ev-time">12:45:10</div>
                  <div className="md-ev-type warn">ATC WEAR</div>
                  <div className="md-ev-text">
                    <strong>[TOOL LIFE]</strong> Pocket T05 insert wear exceeded critical 85% threshold (currently 88%). Tool swap dispatched to maintenance.
                  </div>
                </div>
                <div className="md-event-item">
                  <div className="md-ev-time">12:20:10</div>
                  <div className="md-ev-type info">SCADA</div>
                  <div className="md-ev-text">
                    Spindle bearing thermal reading reached 44.4°C. Oil chiller boosted flow to 100% capacity.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="md-event-item">
                  <div className="md-ev-time">13:14:02</div>
                  <div className="md-ev-type info">INFO</div>
                  <div className="md-ev-text">Cycle complete for Part #448. Metrology verification passed within ±0.005mm tolerance.</div>
                </div>
                <div className="md-event-item">
                  <div className="md-ev-time">13:11:45</div>
                  <div className="md-ev-type notice">PLC</div>
                  <div className="md-ev-text">Tool pocket #05 engaged. Automatic feedrate compensation active.</div>
                </div>
                <div className="md-event-item">
                  <div className="md-ev-time">12:20:10</div>
                  <div className="md-ev-type info">SCADA</div>
                  <div className="md-ev-text">Coolant pressure normalized at 18.2 Bar after filter purge cycle.</div>
                </div>
                <div className="md-event-item">
                  <div className="md-ev-time">11:45:00</div>
                  <div className="md-ev-type notice">OPC-UA</div>
                  <div className="md-ev-text">Shift A telemetry snapshot synchronised with Foundry OS Cloud.</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
