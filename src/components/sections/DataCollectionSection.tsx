'use client';

import React, { useState } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import { Machine } from '@/types';
import {
  GearIcon,
  CpuIcon,
  RadioIcon,
  BoxIcon,
  AlertIcon,
  ThermometerIcon,
  ActivityIcon,
  CheckIcon,
  ZapIcon,
  ArrowRightIcon,
} from '@/components/common/Icons';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

export default function DataCollectionSection() {
  const {
    machines,
    filteredMachines,
    machineFilter,
    setMachineFilter,
    warningMachinesCount,
    tagLogs,
    setActiveSection,
    sendMessage,
    openMachineDetail,
    t,
  } = useFoundry();

  // Selected machine for the Deep-Dive PLC & SCADA Inspector Modal
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plc' | 'scada' | 'diagnostics'>('plc');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagFeedback, setDiagFeedback] = useState<string | null>(null);

  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || null;

  const getTemperatureStatus = (temp: number) => {
    if (temp > 43) return { text: t.collection.tempHigh, color: 'var(--accent-amber)' };
    return { text: t.collection.tempNormal, color: 'var(--accent-green)' };
  };

  const getVibrationStatus = (vib: number) => {
    if (vib > 0.8) return { text: t.collection.vibCheck, color: 'var(--accent-amber)' };
    return { text: t.collection.vibSmooth, color: 'var(--accent-green)' };
  };

  const runPlcDiagnostics = () => {
    setIsDiagnosing(true);
    setDiagFeedback(null);
    setTimeout(() => {
      setIsDiagnosing(false);
      if (selectedMachine?.status === 'warning') {
        setDiagFeedback(
          `⚠️ PLC Diagnostics Complete: Controller scan time 4.2ms. Motor drive reports harmonic vibration (0.9 mm/s). Spindle bearing inspection recommended within 12 days.`
        );
      } else {
        setDiagFeedback(
          `✅ PLC Diagnostics Complete: 0 logic faults, all 32 safety interlocks closed, cycle synchronization optimal (scan time 3.8ms).`
        );
      }
    }, 900);
  };

  const handleAskAIAboutMachine = (m: Machine) => {
    const query = `What is the current health and PLC/SCADA status of ${m.id}?`;
    sendMessage(query);
    setActiveSection('assistant');
  };

  // Helper to render mini SVG sparklines for historical metrics
  const renderSparkline = (
    data: number[] | undefined,
    strokeColor: string,
    width = 180,
    height = 36
  ) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Glow point on the latest reading */}
        {data.length > 0 && (
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - min) / range) * (height - 8) - 4}
            r="4"
            fill={strokeColor}
          />
        )}
      </svg>
    );
  };

  // Multi-timeframe controls for Data Collection telemetry
  const [collTimeFrame, setCollTimeFrame] = useState<TimeFrameKey>('8H');

  const fleetOnlineTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 11, formatted: '11/12' },
      { label: '12:20 PM', value: 11, formatted: '11/12' },
      { label: '12:30 PM', value: 11, formatted: '11/12' },
      { label: '12:40 PM', value: 11, formatted: '11/12' },
      { label: '12:50 PM', value: 11, formatted: '11/12' },
      { label: '01:00 PM', value: 11, formatted: '11/12' },
    ],
    '8H': [
      { label: '08:00 AM', value: 12, formatted: '12/12' },
      { label: '09:00 AM', value: 12, formatted: '12/12' },
      { label: '10:00 AM', value: 11, formatted: '11/12' },
      { label: '11:00 AM', value: 11, formatted: '11/12' },
      { label: '12:00 PM', value: 11, formatted: '11/12' },
      { label: '01:00 PM', value: 11, formatted: '11/12' },
      { label: '02:00 PM', value: 11, formatted: '11/12' },
    ],
    '24H': [
      { label: '00:00', value: 12, formatted: '12/12' },
      { label: '04:00', value: 12, formatted: '12/12' },
      { label: '08:00', value: 12, formatted: '12/12' },
      { label: '12:00', value: 11, formatted: '11/12' },
      { label: '16:00', value: 11, formatted: '11/12' },
      { label: '20:00', value: 11, formatted: '11/12' },
      { label: 'Now', value: 11, formatted: '11/12' },
    ],
    '7D': [
      { label: 'Thu', value: 12, formatted: '12/12' },
      { label: 'Fri', value: 12, formatted: '12/12' },
      { label: 'Sat', value: 10, formatted: '10/12' },
      { label: 'Sun', value: 10, formatted: '10/12' },
      { label: 'Mon', value: 12, formatted: '12/12' },
      { label: 'Tue', value: 11, formatted: '11/12' },
      { label: 'Today', value: 11, formatted: '11/12' },
    ],
    '30D': [
      { label: 'W1', value: 12, formatted: '12/12' },
      { label: 'W2', value: 11, formatted: '11/12' },
      { label: 'W3', value: 12, formatted: '12/12' },
      { label: 'W4', value: 11, formatted: '11/12' },
      { label: 'Cur', value: 11, formatted: '11/12' },
    ],
  };

  const ingestRateTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 2420, formatted: '2,420 t/s' },
      { label: '12:20 PM', value: 2450, formatted: '2,450 t/s' },
      { label: '12:30 PM', value: 2465, formatted: '2,465 t/s' },
      { label: '12:40 PM', value: 2480, formatted: '2,480 t/s' },
      { label: '12:50 PM', value: 2480, formatted: '2,480 t/s' },
      { label: '01:00 PM', value: 2480, formatted: '2,480 t/s' },
    ],
    '8H': [
      { label: '08:00 AM', value: 2200, formatted: '2,200 t/s' },
      { label: '09:00 AM', value: 2340, formatted: '2,340 t/s' },
      { label: '10:00 AM', value: 2410, formatted: '2,410 t/s' },
      { label: '11:00 AM', value: 2450, formatted: '2,450 t/s' },
      { label: '12:00 PM', value: 2480, formatted: '2,480 t/s' },
      { label: '01:00 PM', value: 2480, formatted: '2,480 t/s' },
      { label: '02:00 PM', value: 2480, formatted: '2,480 t/s' },
    ],
    '24H': [
      { label: '00:00', value: 1800, formatted: '1,800 t/s' },
      { label: '04:00', value: 1950, formatted: '1,950 t/s' },
      { label: '08:00', value: 2280, formatted: '2,280 t/s' },
      { label: '12:00', value: 2480, formatted: '2,480 t/s' },
      { label: '16:00', value: 2450, formatted: '2,450 t/s' },
      { label: '20:00', value: 2390, formatted: '2,390 t/s' },
      { label: 'Now', value: 2480, formatted: '2,480 t/s' },
    ],
    '7D': [
      { label: 'Thu', value: 2350, formatted: '2,350 t/s' },
      { label: 'Fri', value: 2410, formatted: '2,410 t/s' },
      { label: 'Sat', value: 2100, formatted: '2,100 t/s' },
      { label: 'Sun', value: 2050, formatted: '2,050 t/s' },
      { label: 'Mon', value: 2450, formatted: '2,450 t/s' },
      { label: 'Tue', value: 2480, formatted: '2,480 t/s' },
      { label: 'Today', value: 2480, formatted: '2,480 t/s' },
    ],
    '30D': [
      { label: 'W1', value: 2200, formatted: '2,200 t/s' },
      { label: 'W2', value: 2310, formatted: '2,310 t/s' },
      { label: 'W3', value: 2420, formatted: '2,420 t/s' },
      { label: 'W4', value: 2480, formatted: '2,480 t/s' },
      { label: 'Cur', value: 2480, formatted: '2,480 t/s' },
    ],
  };

  const spindleLoadTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 45.2, formatted: '45.2%' },
      { label: '12:20 PM', value: 46.1, formatted: '46.1%' },
      { label: '12:30 PM', value: 46.5, formatted: '46.5%' },
      { label: '12:40 PM', value: 47.0, formatted: '47.0%' },
      { label: '12:50 PM', value: 46.6, formatted: '46.6%' },
      { label: '01:00 PM', value: 46.8, formatted: '46.8%' },
    ],
    '8H': [
      { label: '08:00 AM', value: 42.0, formatted: '42.0%' },
      { label: '09:00 AM', value: 44.5, formatted: '44.5%' },
      { label: '10:00 AM', value: 45.8, formatted: '45.8%' },
      { label: '11:00 AM', value: 46.2, formatted: '46.2%' },
      { label: '12:00 PM', value: 46.9, formatted: '46.9%' },
      { label: '01:00 PM', value: 46.8, formatted: '46.8%' },
      { label: '02:00 PM', value: 46.8, formatted: '46.8%' },
    ],
    '24H': [
      { label: '00:00', value: 38.5, formatted: '38.5%' },
      { label: '04:00', value: 40.2, formatted: '40.2%' },
      { label: '08:00', value: 44.0, formatted: '44.0%' },
      { label: '12:00', value: 46.8, formatted: '46.8%' },
      { label: '16:00', value: 46.2, formatted: '46.2%' },
      { label: '20:00', value: 45.5, formatted: '45.5%' },
      { label: 'Now', value: 46.8, formatted: '46.8%' },
    ],
    '7D': [
      { label: 'Thu', value: 44.8, formatted: '44.8%' },
      { label: 'Fri', value: 45.5, formatted: '45.5%' },
      { label: 'Sat', value: 42.1, formatted: '42.1%' },
      { label: 'Sun', value: 41.8, formatted: '41.8%' },
      { label: 'Mon', value: 46.0, formatted: '46.0%' },
      { label: 'Tue', value: 46.8, formatted: '46.8%' },
      { label: 'Today', value: 46.8, formatted: '46.8%' },
    ],
    '30D': [
      { label: 'W1', value: 43.5, formatted: '43.5%' },
      { label: 'W2', value: 44.8, formatted: '44.8%' },
      { label: 'W3', value: 46.0, formatted: '46.0%' },
      { label: 'W4', value: 46.8, formatted: '46.8%' },
      { label: 'Cur', value: 46.8, formatted: '46.8%' },
    ],
  };

  const thermalProfileTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 35.8, formatted: '35.8°C' },
      { label: '12:20 PM', value: 36.0, formatted: '36.0°C' },
      { label: '12:30 PM', value: 36.2, formatted: '36.2°C' },
      { label: '12:40 PM', value: 36.4, formatted: '36.4°C' },
      { label: '12:50 PM', value: 36.4, formatted: '36.4°C' },
      { label: '01:00 PM', value: 36.4, formatted: '36.4°C' },
    ],
    '8H': [
      { label: '08:00 AM', value: 31.5, formatted: '31.5°C' },
      { label: '09:00 AM', value: 33.2, formatted: '33.2°C' },
      { label: '10:00 AM', value: 34.8, formatted: '34.8°C' },
      { label: '11:00 AM', value: 35.7, formatted: '35.7°C' },
      { label: '12:00 PM', value: 36.2, formatted: '36.2°C' },
      { label: '01:00 PM', value: 36.4, formatted: '36.4°C' },
      { label: '02:00 PM', value: 36.4, formatted: '36.4°C' },
    ],
    '24H': [
      { label: '00:00', value: 28.2, formatted: '28.2°C' },
      { label: '04:00', value: 29.0, formatted: '29.0°C' },
      { label: '08:00', value: 32.5, formatted: '32.5°C' },
      { label: '12:00', value: 36.4, formatted: '36.4°C' },
      { label: '16:00', value: 36.0, formatted: '36.0°C' },
      { label: '20:00', value: 34.5, formatted: '34.5°C' },
      { label: 'Now', value: 36.4, formatted: '36.4°C' },
    ],
    '7D': [
      { label: 'Thu', value: 35.2, formatted: '35.2°C' },
      { label: 'Fri', value: 35.8, formatted: '35.8°C' },
      { label: 'Sat', value: 33.0, formatted: '33.0°C' },
      { label: 'Sun', value: 32.4, formatted: '32.4°C' },
      { label: 'Mon', value: 35.9, formatted: '35.9°C' },
      { label: 'Tue', value: 36.4, formatted: '36.4°C' },
      { label: 'Today', value: 36.4, formatted: '36.4°C' },
    ],
    '30D': [
      { label: 'W1', value: 34.2, formatted: '34.2°C' },
      { label: 'W2', value: 35.0, formatted: '35.0°C' },
      { label: 'W3', value: 35.9, formatted: '35.9°C' },
      { label: 'W4', value: 36.4, formatted: '36.4°C' },
      { label: 'Cur', value: 36.4, formatted: '36.4°C' },
    ],
  };

  return (
    <section className="section-wrapper">
      {/* Hero Title & Description with Multi-Timeframe Controls */}
      <div className="overview-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-hero-title" style={{ fontSize: '22px', fontWeight: 800 }}>
              {t.collection.title}
            </h1>
            <span className="live-badge-mint">
              <span className="pulse-dot" /> 12/12 Live DAQ Nodes Connected
            </span>
          </div>
          <p className="page-hero-desc" style={{ marginTop: '2px', marginBottom: 0, fontSize: '13px' }}>
            {t.collection.desc} · Sub-second industrial telemetry with PLC cycle timing & SCADA historian
          </p>
        </div>

        <div className="time-filter-pill-group">
          {(['1H', '8H', '24H', '7D', '30D'] as TimeFrameKey[]).map((tf) => (
            <button
              key={tf}
              type="button"
              className={`time-filter-btn ${collTimeFrame === tf ? 'active' : ''}`}
              onClick={() => setCollTimeFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Enterprise Telemetry & DAQ KPI Cards */}
      <div className="overview-kpi-row-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '18px' }}>
        {/* Card 1: Connected Fleet Online */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <RadioIcon size={18} color="#0D9488" />
            </div>
            <span className="kpi-badge-pill green">● 91.7% Fleet Health</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">11 / 12</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>Active Nodes</span>
          </div>
          <div className="kpi-label">
            <span>Connected CNC Fleet</span>
            <span className="kpi-info-icon" title="Active controllers transmitting OPC-UA / MTConnect telemetry">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status amber" />
            <span>1 CNC scheduled for insert inspection</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={fleetOnlineTimeFrames[collTimeFrame].map((d) => d.value)}
              timeFrameData={fleetOnlineTimeFrames}
              activeTimeFrame={collTimeFrame}
              onTimeFrameChange={setCollTimeFrame}
              color="#0D9488"
              width={180}
              height={26}
              unit="nodes"
            />
          </div>
        </div>

        {/* Card 2: Live Ingestion Throughput */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <ActivityIcon size={18} color="#059669" />
            </div>
            <span className="kpi-badge-pill green">● 100ms Ingestion Band</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">2,480</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>tags/sec</span>
          </div>
          <div className="kpi-label">
            <span>Live DAQ Stream Throughput</span>
            <span className="kpi-info-icon" title="Aggregated sensor samples ingested into edge time-series engine">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status green pulse" />
            <span>0 packet drops · 12 controllers synchronized</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={ingestRateTimeFrames[collTimeFrame].map((d) => d.value)}
              timeFrameData={ingestRateTimeFrames}
              activeTimeFrame={collTimeFrame}
              onTimeFrameChange={setCollTimeFrame}
              color="#059669"
              width={180}
              height={26}
              unit="tags/s"
            />
          </div>
        </div>

        {/* Card 3: Fleet Spindle Load */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <ZapIcon size={18} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">● Nominal Cut Band</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">46.8%</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>Mean Load</span>
          </div>
          <div className="kpi-label">
            <span>Fleet Spindle Dynamic Load</span>
            <span className="kpi-info-icon" title="Average current draw and cutting torque across cutting spindles">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status green" />
            <span>Rated safety margin: +33.2% torque headroom</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={spindleLoadTimeFrames[collTimeFrame].map((d) => d.value)}
              timeFrameData={spindleLoadTimeFrames}
              activeTimeFrame={collTimeFrame}
              onTimeFrameChange={setCollTimeFrame}
              color="#2563EB"
              width={180}
              height={26}
              unit="%"
            />
          </div>
        </div>

        {/* Card 4: Fleet Thermal Profile */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <ThermometerIcon size={18} color="#059669" />
            </div>
            <span className="kpi-badge-pill green">● Optimal Chiller Flow</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">36.4°C</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>Mean Core</span>
          </div>
          <div className="kpi-label">
            <span>Fleet Thermal Equilibrium</span>
            <span className="kpi-info-icon" title="Bearing and coolant jacket temperature across all running cells">ⓘ</span>
          </div>
          <div className="kpi-sub-line font-sm">
            <span className="dot-status green" />
            <span>All machines within &lt; 43.0°C thermal limit</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <InteractiveSparkline
              data={thermalProfileTimeFrames[collTimeFrame].map((d) => d.value)}
              timeFrameData={thermalProfileTimeFrames}
              activeTimeFrame={collTimeFrame}
              onTimeFrameChange={setCollTimeFrame}
              color="#059669"
              width={180}
              height={26}
              unit="°C"
            />
          </div>
        </div>
      </div>

      {/* Quick Filter Pills Row */}
      <div className="filter-pill-row">
        <button
          type="button"
          className={`filter-pill-btn ${machineFilter === 'all' ? 'active' : ''}`}
          onClick={() => setMachineFilter('all')}
        >
          <BoxIcon size={14} color="currentColor" />
          <span>
            {t.collection.filterAll} ({machines.length})
          </span>
        </button>

        <button
          type="button"
          className={`filter-pill-btn warning ${machineFilter === 'warning' ? 'active' : ''}`}
          onClick={() => setMachineFilter('warning')}
        >
          <AlertIcon size={14} color="#C6680A" />
          <span>
            {t.collection.filterAttention} ({warningMachinesCount})
          </span>
        </button>

        <div className="streaming-badge">
          <span className="dot-live" />
          <span>12 CNC Machines · Integrated PLC & SCADA Live</span>
        </div>
      </div>

      {/* 12 Machines Grid */}
      <div className="machines-grid">
        {filteredMachines.map((m: Machine) => {
          const isWarning = m.status === 'warning';
          const tempInfo = getTemperatureStatus(m.metrics.temp);
          const vibInfo = getVibrationStatus(m.metrics.vib);
          const spindleRpm = m.metrics.spindle || 4000;
          const progressPercent = Math.min(100, Math.max(20, (spindleRpm / 5500) * 100));

          const plcId = m.plc?.id || 'PLC-L1';
          const cycleTime = m.plc?.cycleTime ?? m.metrics.cycle ?? 34.2;
          const scadaTags = m.scada?.tagCount ?? m.metrics.tags ?? 2450;

          return (
            <div
              key={m.id}
              className="machine-card-box"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedMachineId(m.id);
                setDiagFeedback(null);
              }}
              title={`Click to view integrated PLC (${plcId}) & SCADA Historian for ${m.id}`}
            >
              {/* Machine Card Header */}
              <div className="machine-card-head">
                <div className="machine-avatar-group">
                  <div
                    className="machine-icon-box"
                    style={{
                      background: isWarning ? '#FFF5E6' : '#E7F3FE',
                      color: isWarning ? '#C6680A' : '#1B78C2',
                    }}
                  >
                    <GearIcon size={20} color={isWarning ? '#C6680A' : '#1B78C2'} />
                  </div>
                  <div>
                    <div className="machine-name-bold">{m.id}</div>
                    <div className="machine-sub-label">
                      {m.name || 'Machining Center'} · {m.line || 'Line 1'}
                    </div>
                  </div>
                </div>

                <div className={`status-chip ${isWarning ? 'warning' : 'healthy'}`}>
                  <span>●</span>
                  <span>{isWarning ? t.collection.needsAttention : t.collection.runningGood}</span>
                </div>
              </div>

              {/* CNC Machine Image Thumbnail */}
              {m.imageUrl && (
                <div className="machine-card-thumb-wrap">
                  <img
                    src={m.imageUrl}
                    alt={`${m.id} - ${m.name || 'CNC Machine'}`}
                    className="machine-card-thumb-img"
                    loading="lazy"
                  />
                  <div className="machine-card-thumb-overlay">
                    <span className="thumb-model-tag">{m.model || m.name}</span>
                    <span className="thumb-live-tag">● Live Telemetry</span>
                  </div>
                </div>
              )}

              {/* Spindle / Motor RPM Meter */}
              <div className="meter-card-block">
                <div className="meter-header-row">
                  <span className="meter-title">{t.collection.spindleSpeed}</span>
                  <span className="meter-num-bold tabular">{spindleRpm.toFixed(0)} RPM</span>
                </div>
                <div className="meter-groove">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${progressPercent}%`,
                      background: isWarning
                        ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                        : 'linear-gradient(90deg, #10B981, #059669)',
                    }}
                  />
                </div>
              </div>

              {/* Temperature & Vibration Chips */}
              <div className="machine-stats-pair">
                <div className="stat-chip-box">
                  <span
                    className="stat-chip-lbl"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ThermometerIcon size={12} color="var(--text-muted)" />
                    {t.collection.temperature}
                  </span>
                  <span className="stat-chip-val" style={{ color: tempInfo.color }}>
                    {m.metrics.temp.toFixed(0)}°C · {tempInfo.text}
                  </span>
                </div>

                <div className="stat-chip-box">
                  <span
                    className="stat-chip-lbl"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ActivityIcon size={12} color="var(--text-muted)" />
                    {t.collection.smoothness}
                  </span>
                  <span className="stat-chip-val" style={{ color: vibInfo.color }}>
                    {vibInfo.text}
                  </span>
                </div>
              </div>

              {/* Active Job & Workpiece Strip */}
              <div className="machine-task-strip">
                <div className="task-strip-header">
                  <span className="task-pulse-dot" />
                  <span>Current Task / Part</span>
                </div>
                <div className="task-strip-body">
                  <span className="task-strip-workpiece">{m.workpiece}</span>
                  <div className="task-strip-step">{m.currentTask}</div>
                </div>
              </div>

              {/* Integrated PLC & SCADA Strip (What the user asked to see inside each CNC) */}
              <div className="machine-plc-scada-strip">
                <span className="subsystem-pill">
                  <span className="subsystem-dot plc" />
                  <span>
                    PLC: <strong>{plcId}</strong> ({cycleTime.toFixed(1)}s)
                  </span>
                </span>
                <span className="subsystem-pill">
                  <span className="subsystem-dot scada" />
                  <span>
                    SCADA: <strong>{scadaTags.toLocaleString()} tags</strong>
                  </span>
                </span>
              </div>

              {/* Card Footer Call to Action */}
              <div className="card-inspect-cta">
                <span>Inspect PLC & SCADA Details</span>
                <ArrowRightIcon size={12} color="currentColor" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Machine Inspector Modal Dialog */}
      {selectedMachine && (
        <div
          className="machine-modal-backdrop"
          onClick={() => setSelectedMachineId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="machine-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="machine-modal-header">
              <div className="machine-modal-title-wrap">
                <div
                  className="machine-icon-box"
                  style={{
                    width: 48,
                    height: 48,
                    background:
                      selectedMachine.status === 'warning' ? '#FFF5E6' : '#E7F3FE',
                    color:
                      selectedMachine.status === 'warning' ? '#C6680A' : '#1B78C2',
                  }}
                >
                  <GearIcon size={24} color="currentColor" />
                </div>
                <div>
                  <div className="modal-machine-id">
                    {selectedMachine.id} — {selectedMachine.name}
                  </div>
                  <div className="modal-machine-model">
                    <strong>Model:</strong> {selectedMachine.model || 'High Precision VMC'} ·{' '}
                    <strong>Location:</strong> {selectedMachine.line} ({selectedMachine.bay})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className={`status-chip ${
                    selectedMachine.status === 'warning' ? 'warning' : 'healthy'
                  }`}
                >
                  <span>●</span>
                  <span>
                    {selectedMachine.status === 'warning'
                      ? t.collection.needsAttention
                      : t.collection.runningGood}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-inspect-curr-machine"
                  onClick={() => {
                    openMachineDetail(selectedMachine.id);
                  }}
                  title="Open Dedicated Full-Screen Machine Diagnostics Page"
                >
                  Open Full Page ↗
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedMachineId(null)}
                  title="Close Inspector"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Switcher for All 12 Machines */}
            <div className="modal-machine-nav">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginRight: '4px',
                }}
              >
                Fleet:
              </span>
              {machines.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`modal-nav-pill ${m.id === selectedMachine.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedMachineId(m.id);
                    setDiagFeedback(null);
                  }}
                >
                  {m.id}
                  {m.status === 'warning' && ' ⚠️'}
                </button>
              ))}
            </div>

            {/* Modal Tabs Bar */}
            <div className="modal-tabs-bar">
              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'plc' ? 'active' : ''}`}
                onClick={() => setActiveTab('plc')}
              >
                <CpuIcon size={16} color="currentColor" />
                <span>
                  Integrated PLC Controller ({selectedMachine.plc?.id || 'PLC-L1'})
                </span>
              </button>

              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'scada' ? 'active' : ''}`}
                onClick={() => setActiveTab('scada')}
              >
                <RadioIcon size={16} color="currentColor" />
                <span>
                  SCADA Historian & Sensors ({selectedMachine.scada?.gatewayId || 'SCADA-HIST'})
                </span>
              </button>

              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`}
                onClick={() => setActiveTab('diagnostics')}
              >
                <ZapIcon size={16} color="currentColor" />
                <span>Diagnostics & Workpiece</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="modal-content-scroll">
              {/* CNC Machine Panoramic Hero Banner */}
              {selectedMachine.imageUrl && (
                <div className="modal-machine-hero-wrap">
                  <img
                    src={selectedMachine.imageUrl}
                    alt={selectedMachine.name}
                    className="modal-machine-hero-img"
                  />
                  <div className="modal-machine-hero-overlay">
                    <div className="modal-hero-left">
                      <span className="hero-model-badge">{selectedMachine.model}</span>
                      <span className="hero-bay-badge">
                        {selectedMachine.line} · {selectedMachine.bay}
                      </span>
                    </div>
                    <div className="hero-telemetry-badge">
                      ● Live Machine Visual & Sensors Connected
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: INTEGRATED PLC CONTROLLER */}
              {activeTab === 'plc' && (
                <>
                  <div className="subsystem-explainer-banner plc-banner">
                    <CpuIcon size={20} color="currentColor" />
                    <div>
                      <strong>What is this PLC?</strong> This machine has a dedicated{' '}
                      <strong>{selectedMachine.plc?.controllerModel || 'Siemens S7-1500'}</strong>{' '}
                      controller unit (ID:{' '}
                      <strong>{selectedMachine.plc?.id || 'PLC-L1'}</strong>) that executes the
                      machining cycle, manages the automatic tool changer, and enforces safety
                      interlocks in real-time.
                    </div>
                  </div>

                  {/* PLC Metrics Cards */}
                  <div className="detail-metrics-grid">
                    <div className="detail-metric-card">
                      <span className="d-label">PLC Controller Model</span>
                      <span className="d-val" style={{ fontSize: '14px', wordBreak: 'break-word' }}>
                        {selectedMachine.plc?.controllerModel || 'Fanuc 31i-B5'}
                      </span>
                      <span className="d-sub">Unit ID: {selectedMachine.plc?.id}</span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Cycle Time Execution</span>
                      <span className="d-val tabular" style={{ color: 'var(--accent-teal)' }}>
                        {(selectedMachine.plc?.cycleTime ?? 34.2).toFixed(1)}s
                      </span>
                      <span className="d-sub">
                        Target: {selectedMachine.plc?.cycleTarget.toFixed(1)}s · Optimal
                      </span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Active Part & Program</span>
                      <span className="d-val" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                        {selectedMachine.workpiece}
                      </span>
                      <span className="d-sub" style={{ fontFamily: 'var(--font-mono)' }}>
                        {selectedMachine.plc?.program} · {selectedMachine.plc?.step}
                      </span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">PLC Ladder Scan Time</span>
                      <span className="d-val tabular">4.2 ms</span>
                      <span className="d-sub" style={{ color: '#108A4F' }}>
                        ● Synchronized & Safe
                      </span>
                    </div>
                  </div>

                  {/* Digital I/O Status Table */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
                      PLC Digital I/O & Safety Interlock Circuits
                    </h3>
                    <table className="io-status-table">
                      <thead>
                        <tr>
                          <th>Circuit / Function</th>
                          <th>Hardware Line State</th>
                          <th>Address Tag</th>
                          <th>Safety Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Workpiece Clamping</strong>
                          </td>
                          <td>{selectedMachine.plc?.ioStatus.clamping}</td>
                          <td>
                            <code>%I0.1 (Pressure Switch)</code>
                          </td>
                          <td>
                            <span className="io-badge active">
                              <CheckIcon size={10} color="currentColor" /> CLAMPED (100%)
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Coolant Delivery</strong>
                          </td>
                          <td>{selectedMachine.plc?.ioStatus.coolant}</td>
                          <td>
                            <code>%Q0.3 (Solenoid Valve)</code>
                          </td>
                          <td>
                            <span className="io-badge active">
                              <CheckIcon size={10} color="currentColor" /> ACTIVE
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Enclosure Safety Interlock</strong>
                          </td>
                          <td>{selectedMachine.plc?.ioStatus.doorInterlock}</td>
                          <td>
                            <code>%I0.0 (Safety Guard)</code>
                          </td>
                          <td>
                            <span className="io-badge active">
                              <CheckIcon size={10} color="currentColor" /> LOCKED & SAFE
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Automatic Tool Changer (ATC)</strong>
                          </td>
                          <td>{selectedMachine.plc?.ioStatus.toolChanger}</td>
                          <td>
                            <code>%DB12.DBX4.0</code>
                          </td>
                          <td>
                            <span className="io-badge active">
                              <CheckIcon size={10} color="currentColor" /> READY
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Live PLC Diagnostic Action */}
                  <div
                    style={{
                      background: 'var(--bg-panel-2)',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>
                        PLC Ladder Logic & Interlock Self-Test
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Trigger an on-demand scan of all safety circuits, relays, and axis interlocks.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-tech-action"
                      onClick={runPlcDiagnostics}
                      disabled={isDiagnosing}
                      style={{ padding: '8px 16px', fontSize: '12.5px' }}
                    >
                      {isDiagnosing ? 'Running PLC Scan...' : 'Run Diagnostics Self-Check'}
                    </button>
                  </div>

                  {diagFeedback && (
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: selectedMachine.status === 'warning' ? '#FFF5E6' : '#E5F8EE',
                        border:
                          selectedMachine.status === 'warning'
                            ? '1px solid #FDE4C3'
                            : '1px solid #C4EED5',
                        color:
                          selectedMachine.status === 'warning' ? '#C6680A' : '#108A4F',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {diagFeedback}
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: SCADA HISTORIAN & SENSOR TELEMETRY */}
              {activeTab === 'scada' && (
                <>
                  <div className="subsystem-explainer-banner scada-banner">
                    <RadioIcon size={20} color="currentColor" />
                    <div>
                      <strong>What is SCADA Historian?</strong> The central{' '}
                      <strong>{selectedMachine.scada?.gatewayId || 'SCADA-HIST'}</strong> gateway
                      continuously streams telemetry ({selectedMachine.scada?.tagCount || 2480}{' '}
                      sensor tags) via OPC-UA/MQTT, recording high-frequency time-series history
                      for vibration, heat, spindle power, and feed speeds.
                    </div>
                  </div>

                  {/* SCADA Telemetry Metrics Grid */}
                  <div className="detail-metrics-grid">
                    <div className="detail-metric-card">
                      <span className="d-label">Spindle Motor Speed</span>
                      <span className="d-val tabular" style={{ color: 'var(--accent-teal)' }}>
                        {(selectedMachine.metrics.spindle || 4200).toFixed(0)} RPM
                      </span>
                      <span className="d-sub">Sensor: Hall Effect Encoder</span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Spindle Motor Power</span>
                      <span className="d-val tabular">
                        {selectedMachine.scada?.powerKw || 14.8} kW
                      </span>
                      <span className="d-sub">Load: 64% Nominal</span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Coolant Pressure</span>
                      <span className="d-val tabular">
                        {selectedMachine.scada?.coolantPressureBar || 18.5} bar
                      </span>
                      <span className="d-sub">Flow: 38 L/min High</span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Feed Rate Speed</span>
                      <span className="d-val tabular">
                        {selectedMachine.scada?.feedRate || 1450} mm/min
                      </span>
                      <span className="d-sub">Rapid Traverse: 42 m/min</span>
                    </div>
                  </div>

                  {/* Real-Time Sparkline History Visualization */}
                  <div
                    style={{
                      background: 'var(--bg-panel-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '16px 20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px' }}>
                          Live Rolling Time-Series Telemetry (Last 18 Samples)
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Streamed at 250ms frequency by {selectedMachine.scada?.gatewayId}
                        </div>
                      </div>
                      <div className="cam-live-indicator">
                        <span className="dot-live" />
                        <span>Streaming 4 Hz</span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          background: 'var(--bg-panel)',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '6px',
                          }}
                        >
                          Motor Speed (RPM)
                        </div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 800,
                            marginBottom: '8px',
                          }}
                        >
                          {(selectedMachine.metrics.spindle || 4000).toFixed(0)} RPM
                        </div>
                        {renderSparkline(selectedMachine.hist.spindle, '#1B78C2', 180, 36)}
                      </div>

                      <div
                        style={{
                          background: 'var(--bg-panel)',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '6px',
                          }}
                        >
                          Bearing Temperature (°C)
                        </div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 800,
                            marginBottom: '8px',
                            color:
                              selectedMachine.metrics.temp > 43
                                ? 'var(--accent-amber)'
                                : 'var(--text-primary)',
                          }}
                        >
                          {selectedMachine.metrics.temp.toFixed(1)}°C
                        </div>
                        {renderSparkline(
                          selectedMachine.hist.temp,
                          selectedMachine.metrics.temp > 43 ? '#F59E0B' : '#10B981',
                          180,
                          36
                        )}
                      </div>

                      <div
                        style={{
                          background: 'var(--bg-panel)',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '6px',
                          }}
                        >
                          Vibration Level (mm/s)
                        </div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 800,
                            marginBottom: '8px',
                            color:
                              selectedMachine.metrics.vib > 0.8
                                ? '#C6680A'
                                : 'var(--text-primary)',
                          }}
                        >
                          {selectedMachine.metrics.vib.toFixed(2)} mm/s
                        </div>
                        {renderSparkline(
                          selectedMachine.hist.vib,
                          selectedMachine.metrics.vib > 0.8 ? '#EF4444' : '#10B981',
                          180,
                          36
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Axis Load Balance */}
                  <div
                    style={{
                      background: 'var(--bg-panel-2)',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                      Kinematic Axis Load Balance
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          X-Axis Servomotor Load: {selectedMachine.scada?.axisLoadPercent.x || 48}%
                        </div>
                        <div className="meter-groove">
                          <div
                            className="meter-fill"
                            style={{ width: `${selectedMachine.scada?.axisLoadPercent.x || 48}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Y-Axis Servomotor Load: {selectedMachine.scada?.axisLoadPercent.y || 52}%
                        </div>
                        <div className="meter-groove">
                          <div
                            className="meter-fill"
                            style={{ width: `${selectedMachine.scada?.axisLoadPercent.y || 52}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Z-Axis Spindle Thrust Load: {selectedMachine.scada?.axisLoadPercent.z || 61}%
                        </div>
                        <div className="meter-groove">
                          <div
                            className="meter-fill"
                            style={{ width: `${selectedMachine.scada?.axisLoadPercent.z || 61}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: DIAGNOSTICS & WORKPIECE */}
              {activeTab === 'diagnostics' && (
                <>
                  <div className="subsystem-explainer-banner">
                    <ZapIcon size={20} color="currentColor" />
                    <div>
                      <strong>Predictive Health & Workpiece Telemetry:</strong> Machine learning
                      monitors high-frequency sensor anomalies to flag maintenance weeks before any
                      tool breakage or catastrophic failure occurs.
                    </div>
                  </div>

                  <div className="detail-metrics-grid">
                    <div className="detail-metric-card">
                      <span className="d-label">Health & Safety Grade</span>
                      <span
                        className="d-val"
                        style={{
                          color:
                            selectedMachine.status === 'warning'
                              ? 'var(--accent-amber)'
                              : 'var(--accent-green)',
                        }}
                      >
                        {selectedMachine.status === 'warning' ? 'GRADE B (Check)' : 'GRADE A (Optimal)'}
                      </span>
                      <span className="d-sub">OEE contribution: 91.2%</span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Operating Hours</span>
                      <span className="d-val tabular">1,842 hrs</span>
                      <span className="d-sub">Last full overhaul: 140 days ago</span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Next Routine Service</span>
                      <span
                        className="d-val"
                        style={{
                          color: selectedMachine.id === 'CNC-07' ? '#C6680A' : 'var(--text-primary)',
                        }}
                      >
                        {selectedMachine.id === 'CNC-07'
                          ? '~12 days'
                          : selectedMachine.id === 'CNC-05'
                          ? '~24 days'
                          : '~35+ days'}
                      </span>
                      <span className="d-sub">
                        {selectedMachine.id === 'CNC-07'
                          ? 'Spindle Bearing inspection'
                          : 'Routine lubricant top-up'}
                      </span>
                    </div>

                    <div className="detail-metric-card">
                      <span className="d-label">Sensor Telemetry Health</span>
                      <span className="d-val" style={{ color: '#108A4F' }}>
                        100%
                      </span>
                      <span className="d-sub">0 packet drops on OPC-UA</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="modal-actions-footer">
              <button
                type="button"
                className="filter-pill-btn"
                onClick={() => handleAskAIAboutMachine(selectedMachine)}
                style={{ background: 'var(--bg-panel)', color: 'var(--accent-teal)' }}
              >
                <span>Ask Factory AI about {selectedMachine.id} 💬</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="filter-pill-btn"
                  onClick={() =>
                    alert(
                      `Exported SCADA telemetry stream for ${selectedMachine.id} (${selectedMachine.scada?.tagCount || 2480} tags) to CSV.`
                    )
                  }
                  style={{ background: 'var(--bg-panel)' }}
                >
                  Export Telemetry CSV
                </button>
                <button
                  type="button"
                  className="btn-tech-action"
                  onClick={() => setSelectedMachineId(null)}
                  style={{ padding: '6px 16px', fontSize: '13px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sensor & Controller Activity Feed Card */}
      <div className="activity-card-container">
        <div className="section-hdr-row">
          <div className="section-hdr-title">
            <span className="green-vbar" />
            <span>{t.collection.logTitle}</span>
          </div>
          <div className="cam-live-indicator">
            <span className="dot-live" />
            <span>{t.collection.liveBuffer}</span>
          </div>
        </div>

        <div className="activity-rows-scroll">
          {tagLogs.map((item) => (
            <div key={item.id} className="activity-item-row">
              <div className="activity-item-left">
                <span className="activity-time-pill">{item.time}</span>
                <span className="activity-machine-tag">{item.machineId}</span>
                <span className="activity-status-text">
                  — {item.tag} ({item.value})
                </span>
              </div>
              <span
                style={{
                  color: item.value.toLowerCase().includes('check') || item.value.toLowerCase().includes('warning')
                    ? '#C6680A'
                    : 'var(--accent-teal)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {item.value.toLowerCase().includes('check') || item.value.toLowerCase().includes('warning')
                  ? 'Flagged'
                  : 'Verified'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
