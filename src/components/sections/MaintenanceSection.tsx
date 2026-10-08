'use client';

import React, { useState, useMemo } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import {
  AlertIcon,
  CheckIcon,
  CoinIcon,
  WrenchIcon,
  ArrowRightIcon,
  ActivityIcon,
} from '@/components/common/Icons';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

export default function MaintenanceSection() {
  const {
    wearPercent,
    predictedEvents,
    machines,
    openMachineDetail,
    sendMessage,
    setActiveSection,
    t,
  } = useFoundry();

  const [activeCategory, setActiveCategory] = useState<'all' | 'tool' | 'vibe' | 'process' | 'optimization'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getTranslatedComponent = (comp: string) => {
    if (comp.toLowerCase().includes('bearing')) return t.maintenance.spindleBearing;
    if (comp.toLowerCase().includes('relay')) return t.maintenance.contactorRelay;
    if (comp.toLowerCase().includes('pump')) return t.maintenance.coolantPump;
    return comp;
  };

  const getDaysNum = (win: string) => win.replace(/[^0-9]/g, '');

  // Filter machines for the Anomaly Matrix
  const filteredMatrixMachines = useMemo(() => {
    return machines.filter((m) => {
      // Category filter
      if (activeCategory === 'tool') {
        const isTool = ['CNC-01', 'CNC-02', 'CNC-10', 'CNC-12'].includes(m.id) ||
          m.scenario?.toLowerCase().includes('tool') ||
          m.scenario?.toLowerCase().includes('hob');
        if (!isTool) return false;
      } else if (activeCategory === 'vibe') {
        const isVibe = ['CNC-03', 'CNC-04', 'CNC-08'].includes(m.id) ||
          m.scenario?.toLowerCase().includes('vibration') ||
          m.scenario?.toLowerCase().includes('chatter');
        if (!isVibe) return false;
      } else if (activeCategory === 'process') {
        const isProcess = ['CNC-05', 'CNC-07', 'CNC-09'].includes(m.id) ||
          m.scenario?.toLowerCase().includes('coolant') ||
          m.scenario?.toLowerCase().includes('resistance') ||
          m.scenario?.toLowerCase().includes('grinding');
        if (!isProcess) return false;
      } else if (activeCategory === 'optimization') {
        const isOpt = ['CNC-06', 'CNC-11'].includes(m.id) ||
          m.scenario?.toLowerCase().includes('performance') ||
          m.scenario?.toLowerCase().includes('energy');
        if (!isOpt) return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = m.id.toLowerCase().includes(query);
        const matchesPart = m.workpiece?.toLowerCase().includes(query) ?? false;
        const matchesScenario = m.scenario?.toLowerCase().includes(query) ?? false;
        const matchesSignals = m.signalsEvidence?.toLowerCase().includes(query) ?? false;
        const matchesAction = m.recommendedAction?.toLowerCase().includes(query) ?? false;
        const matchesUseCase = m.useCase?.toLowerCase().includes(query) ?? false;
        return matchesId || matchesPart || matchesScenario || matchesSignals || matchesAction || matchesUseCase;
      }

      return true;
    });
  }, [machines, activeCategory, searchTerm]);

  const handleAskCopilot = (mId: string, part?: string, scenario?: string) => {
    const prompt = `Give me a full diagnostic breakdown and step-by-step remediation plan for machine ${mId} (Machining ${part || 'Workpiece'}), which flagged scenario: "${scenario || 'Anomaly'}".`;
    sendMessage(prompt);
    setActiveSection('assistant');
  };

  const getScenarioClass = (scenario?: string) => {
    if (!scenario) return '';
    const s = scenario.toLowerCase();
    if (s.includes('vibration') || s.includes('chatter')) return 'vibe';
    if (s.includes('coolant')) return 'coolant';
    if (s.includes('performance') || s.includes('energy')) return 'perf';
    return 'wear';
  };

  const [maintTimeFrame, setMaintTimeFrame] = useState<TimeFrameKey>('8H');

  const healthTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 88, formatted: '88%' },
      { label: '12:20 PM', value: 88, formatted: '88%' },
      { label: '12:30 PM', value: 87, formatted: '87%' },
      { label: '12:40 PM', value: 88, formatted: '88%' },
      { label: '12:50 PM', value: 88, formatted: '88%' },
      { label: '01:00 PM', value: Math.round(wearPercent), formatted: `${Math.round(wearPercent)}%` },
    ],
    '8H': [
      { label: '08:00 AM', value: 92, formatted: '92%' },
      { label: '09:00 AM', value: 91, formatted: '91%' },
      { label: '10:00 AM', value: 89, formatted: '89%' },
      { label: '11:00 AM', value: 88, formatted: '88%' },
      { label: '12:00 PM', value: 88, formatted: '88%' },
      { label: '01:00 PM', value: 88, formatted: '88%' },
      { label: '02:00 PM', value: Math.round(wearPercent), formatted: `${Math.round(wearPercent)}%` },
    ],
    '24H': [
      { label: '00:00', value: 94, formatted: '94%' },
      { label: '04:00', value: 93, formatted: '93%' },
      { label: '08:00', value: 92, formatted: '92%' },
      { label: '12:00', value: 88, formatted: '88%' },
      { label: '16:00', value: 88, formatted: '88%' },
      { label: '20:00', value: 88, formatted: '88%' },
      { label: 'Now', value: Math.round(wearPercent), formatted: `${Math.round(wearPercent)}%` },
    ],
    '7D': [
      { label: 'Thu', value: 95, formatted: '95%' },
      { label: 'Fri', value: 94, formatted: '94%' },
      { label: 'Sat', value: 92, formatted: '92%' },
      { label: 'Sun', value: 91, formatted: '91%' },
      { label: 'Mon', value: 90, formatted: '90%' },
      { label: 'Tue', value: 89, formatted: '89%' },
      { label: 'Today', value: Math.round(wearPercent), formatted: `${Math.round(wearPercent)}%` },
    ],
    '30D': [
      { label: 'W1', value: 96, formatted: '96%' },
      { label: 'W2', value: 94, formatted: '94%' },
      { label: 'W3', value: 91, formatted: '91%' },
      { label: 'W4', value: 89, formatted: '89%' },
      { label: 'Cur', value: Math.round(wearPercent), formatted: `${Math.round(wearPercent)}%` },
    ],
  };

  const mtbfTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 478, formatted: '478h' },
      { label: '12:20 PM', value: 479, formatted: '479h' },
      { label: '12:30 PM', value: 480, formatted: '480h' },
      { label: '12:40 PM', value: 480, formatted: '480h' },
      { label: '12:50 PM', value: 480, formatted: '480h' },
      { label: '01:00 PM', value: 480, formatted: '480h' },
    ],
    '8H': [
      { label: '08:00 AM', value: 460, formatted: '460h' },
      { label: '09:00 AM', value: 465, formatted: '465h' },
      { label: '10:00 AM', value: 470, formatted: '470h' },
      { label: '11:00 AM', value: 475, formatted: '475h' },
      { label: '12:00 PM', value: 478, formatted: '478h' },
      { label: '01:00 PM', value: 480, formatted: '480h' },
      { label: '02:00 PM', value: 480, formatted: '480h' },
    ],
    '24H': [
      { label: '00:00', value: 440, formatted: '440h' },
      { label: '04:00', value: 450, formatted: '450h' },
      { label: '08:00', value: 460, formatted: '460h' },
      { label: '12:00', value: 478, formatted: '478h' },
      { label: '16:00', value: 480, formatted: '480h' },
      { label: 'Now', value: 480, formatted: '480h' },
    ],
    '7D': [
      { label: 'Thu', value: 430, formatted: '430h' },
      { label: 'Fri', value: 440, formatted: '440h' },
      { label: 'Sat', value: 450, formatted: '450h' },
      { label: 'Sun', value: 460, formatted: '460h' },
      { label: 'Mon', value: 470, formatted: '470h' },
      { label: 'Tue', value: 475, formatted: '475h' },
      { label: 'Today', value: 480, formatted: '480h' },
    ],
    '30D': [
      { label: 'W1', value: 410, formatted: '410h' },
      { label: 'W2', value: 430, formatted: '430h' },
      { label: 'W3', value: 455, formatted: '455h' },
      { label: 'W4', value: 475, formatted: '475h' },
      { label: 'Cur', value: 480, formatted: '480h' },
    ],
  };

  const savingsTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: 4.10, formatted: '₹4.10L' },
      { label: '12:20 PM', value: 4.12, formatted: '₹4.12L' },
      { label: '12:30 PM', value: 4.15, formatted: '₹4.15L' },
      { label: '12:40 PM', value: 4.18, formatted: '₹4.18L' },
      { label: '12:50 PM', value: 4.20, formatted: '₹4.20L' },
      { label: '01:00 PM', value: 4.20, formatted: '₹4.20L' },
    ],
    '8H': [
      { label: '08:00 AM', value: 3.10, formatted: '₹3.10L' },
      { label: '09:00 AM', value: 3.35, formatted: '₹3.35L' },
      { label: '10:00 AM', value: 3.60, formatted: '₹3.60L' },
      { label: '11:00 AM', value: 3.85, formatted: '₹3.85L' },
      { label: '12:00 PM', value: 4.05, formatted: '₹4.05L' },
      { label: '01:00 PM', value: 4.18, formatted: '₹4.18L' },
      { label: '02:00 PM', value: 4.20, formatted: '₹4.20L' },
    ],
    '24H': [
      { label: '00:00', value: 2.1, formatted: '₹2.1L' },
      { label: '04:00', value: 2.8, formatted: '₹2.8L' },
      { label: '08:00', value: 3.1, formatted: '₹3.1L' },
      { label: '12:00', value: 3.8, formatted: '₹3.8L' },
      { label: '16:00', value: 4.1, formatted: '₹4.1L' },
      { label: 'Now', value: 4.2, formatted: '₹4.2L' },
    ],
    '7D': [
      { label: 'Thu', value: 2.9, formatted: '₹2.9L' },
      { label: 'Fri', value: 3.2, formatted: '₹3.2L' },
      { label: 'Sat', value: 3.4, formatted: '₹3.4L' },
      { label: 'Sun', value: 3.6, formatted: '₹3.6L' },
      { label: 'Mon', value: 3.8, formatted: '₹3.8L' },
      { label: 'Tue', value: 4.1, formatted: '₹4.1L' },
      { label: 'Today', value: 4.2, formatted: '₹4.2L' },
    ],
    '30D': [
      { label: 'W1', value: 1.8, formatted: '₹1.8L' },
      { label: 'W2', value: 2.5, formatted: '₹2.5L' },
      { label: 'W3', value: 3.2, formatted: '₹3.2L' },
      { label: 'W4', value: 3.9, formatted: '₹3.9L' },
      { label: 'Cur', value: 4.2, formatted: '₹4.2L' },
    ],
  };

  return (
    <section className="section-wrapper">
      {/* Hero Title & Description */}
      <div className="overview-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-hero-title" style={{ fontSize: '22px', fontWeight: 800 }}>
              {t.maintenance.title}
            </h1>
            <span className="live-badge-mint">
              <span className="pulse-dot" /> Prescriptive AI Active
            </span>
          </div>
          <p className="page-hero-desc" style={{ marginTop: '2px', marginBottom: 0, fontSize: '13px' }}>
            {t.maintenance.desc} · 24/7 Vibration, Thermal & Acoustic Anomaly Diagnostics
          </p>
        </div>

        <div className="time-filter-pill-group">
          {(['1H', '8H', '24H', '7D', '30D'] as TimeFrameKey[]).map((tf) => (
            <button
              key={tf}
              type="button"
              className={`time-filter-btn ${maintTimeFrame === tf ? 'active' : ''}`}
              onClick={() => setMaintTimeFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Real Enterprise Predictive Maintenance KPI Cards */}
      <div className="overview-kpi-row-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '18px' }}>
        {/* Card 1: Spindle & Fleet Health Score */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <ActivityIcon size={18} color="#0D9488" />
            </div>
            <span className="kpi-badge-pill green">● Optimal Health</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">{Math.round(wearPercent)}%</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Fleet Index</span>
          </div>
          <div className="kpi-label">Spindle & Tool Fleet Health</div>
          <div className="kpi-sub-line font-sm">
            <span><span className="dot-status green pulse" /> 11 Cells Normal</span>
            <span><span className="dot-status amber" /> 1 Under Observation</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={healthTimeFrames[maintTimeFrame]}
              timeFrameData={healthTimeFrames}
              activeTimeFrame={maintTimeFrame}
              onTimeFrameChange={setMaintTimeFrame}
              color="#0D9488"
              width={180}
              height={26}
              unit="%"
            />
          </div>
        </div>

        {/* Card 2: Active Anomaly Traces */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square red">
              <AlertIcon size={18} color="#DC2626" />
            </div>
            <span className="kpi-badge-pill red">● 1 Critical Alert</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular" style={{ color: '#DC2626' }}>3</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Traces</span>
          </div>
          <div className="kpi-label">Telemetry Anomaly Traces</div>
          <div className="kpi-sub-line font-sm">
            <span>CNC-07: Spindle Vib (12d window)</span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>Zero Breakdown Risk</span>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>Inspect Below ↓</span>
          </div>
        </div>

        {/* Card 3: MTBF Reliability */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <WrenchIcon size={18} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">▲ +14% vs Target</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">480</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Hours</span>
          </div>
          <div className="kpi-label">Mean Time Between Failures (MTBF)</div>
          <div className="kpi-sub-line font-sm">
            <span>Target: <strong>420 hrs</strong></span>
            <span>Zero Unscheduled Stoppages</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={mtbfTimeFrames[maintTimeFrame]}
              timeFrameData={mtbfTimeFrames}
              activeTimeFrame={maintTimeFrame}
              onTimeFrameChange={setMaintTimeFrame}
              color="#2563EB"
              width={180}
              height={26}
              unit="h"
            />
          </div>
        </div>

        {/* Card 4: Cost Savings & Avoided Repairs */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square" style={{ background: '#FEF3C7' }}>
              <CoinIcon size={18} color="#D97706" />
            </div>
            <span className="kpi-badge-pill green">▲ +18% ROI</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">₹4.2</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Lakhs</span>
          </div>
          <div className="kpi-label">Tooling & Scrap Cost Avoidance</div>
          <div className="kpi-sub-line font-sm">
            <span>7 failures avoided · <strong>₹3.1L tooling</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={savingsTimeFrames[maintTimeFrame]}
              timeFrameData={savingsTimeFrames}
              activeTimeFrame={maintTimeFrame}
              onTimeFrameChange={setMaintTimeFrame}
              color="#D97706"
              width={180}
              height={26}
              valuePrefix="₹"
              unit="L"
            />
          </div>
        </div>
      </div>

      {/* NEW: AI Anomaly Detection & Prescriptive Actions Matrix */}
      <div className="anomaly-matrix-section">
        <div className="anomaly-matrix-header">
          <div className="anomaly-matrix-title-group">
            <h2>
              <span className="green-vbar" />
              <span>AI Anomaly Detection & Prescriptive Actions Matrix</span>
            </h2>
            <p>
              Real-time telemetry evidence correlated with root-cause failure scenarios and GenAI actionable remediation across all 12 precision CNC cells.
            </p>
          </div>
          <div className="anomaly-matrix-stats-row">
            <span className="anomaly-stat-badge highlight">
              <span className="badge-dot" />
              12 CNC Cells Monitored
            </span>
            <span className="anomaly-stat-badge">
              100% Prescriptive AI Ready
            </span>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="anomaly-controls-bar">
          <div className="anomaly-search-box">
            <svg
              className="anomaly-search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="anomaly-search-input"
              placeholder="Filter by machine, part, scenario, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="anomaly-filter-pills">
            <button
              type="button"
              className={`anomaly-pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All CNC Cells ({machines.length})
            </button>
            <button
              type="button"
              className={`anomaly-pill-btn ${activeCategory === 'tool' ? 'active' : ''}`}
              onClick={() => setActiveCategory('tool')}
            >
              Tool Health & Wear (4)
            </button>
            <button
              type="button"
              className={`anomaly-pill-btn ${activeCategory === 'vibe' ? 'active' : ''}`}
              onClick={() => setActiveCategory('vibe')}
            >
              Vibration & Chatter (3)
            </button>
            <button
              type="button"
              className={`anomaly-pill-btn ${activeCategory === 'process' ? 'active' : ''}`}
              onClick={() => setActiveCategory('process')}
            >
              Process & Pressure (3)
            </button>
            <button
              type="button"
              className={`anomaly-pill-btn ${activeCategory === 'optimization' ? 'active' : ''}`}
              onClick={() => setActiveCategory('optimization')}
            >
              Cycle & Energy (2)
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="anomaly-table-wrapper">
          <table className="anomaly-table">
            <thead>
              <tr>
                <th style={{ width: '150px' }}>Machine & Part</th>
                <th style={{ width: '180px' }}>Scenario</th>
                <th style={{ width: '280px' }}>Signals / Evidence</th>
                <th style={{ width: '280px' }}>Recommended Action</th>
                <th style={{ width: '160px' }}>Use Case</th>
                <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrixMachines.map((m) => {
                const isWarn = m.status === 'warning' || m.id === 'CNC-07';
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="anomaly-machine-cell">
                        <div className="machine-id-chip">
                          <span className={`machine-id-badge ${isWarn ? 'warn' : ''}`}>
                            {m.id}
                          </span>
                        </div>
                        <span className="workpiece-part-title">
                          {m.workpiece || 'Precision Part'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`scenario-pill ${getScenarioClass(m.scenario)}`}>
                        <span>●</span>
                        <span>{m.scenario || 'Nominal Operation'}</span>
                      </span>
                    </td>

                    <td>
                      <div className="signal-evidence-text">
                        <svg
                          className="signal-evidence-icon"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <span>{m.signalsEvidence || 'All sensor channels within 3σ tolerance'}</span>
                      </div>
                    </td>

                    <td>
                      <div className="recommended-action-text">
                        <svg
                          className="recommended-action-icon"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{m.recommendedAction || 'Continue scheduled machining run'}</span>
                      </div>
                    </td>

                    <td>
                      <span className="use-case-tag">
                        {m.useCase || 'General Anomaly'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="anomaly-actions-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn-table-inspect"
                          onClick={() => openMachineDetail(m.id)}
                          title={`Open ${m.id} telemetry and controller view`}
                        >
                          <span>Inspect</span>
                          <ArrowRightIcon size={11} color="#FFFFFF" />
                        </button>
                        <button
                          type="button"
                          className="btn-table-ai"
                          onClick={() => handleAskCopilot(m.id, m.workpiece, m.scenario)}
                          title={`Ask AI Copilot about ${m.id}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          <span>AI</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Service Schedule List */}
      <div className="activity-card-container" style={{ marginTop: '28px' }}>
        <div className="section-hdr-row">
          <div className="section-hdr-title">
            <span className="green-vbar" />
            <span>{t.maintenance.serviceListTitle}</span>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Sorted by estimated wear window
          </span>
        </div>

        <div className="service-items-list">
          {predictedEvents.map((evt, idx) => {
            const daysCount = parseInt(getDaysNum(evt.window), 10);
            const isSoon = daysCount <= 15;

            return (
              <div key={idx} className="service-card-entry">
                <div className="service-entry-left">
                  <div
                    className="service-icon-squircle"
                    style={{
                      background: isSoon ? '#FEF8E4' : '#E5F8EE',
                    }}
                  >
                    {isSoon ? (
                      <AlertIcon size={20} color="#C6680A" />
                    ) : (
                      <WrenchIcon size={20} color="#108A4F" />
                    )}
                  </div>
                  <div>
                    <div className="service-machine-title">
                      {evt.machine} — {getTranslatedComponent(evt.component)}
                    </div>
                    <div className="service-due-meta">
                      {t.maintenance.serviceIn}{' '}
                      <strong style={{ color: isSoon ? '#C6680A' : 'var(--text-primary)' }}>
                        {daysCount} {t.maintenance.daysRemaining}
                      </strong>{' '}
                      · Confidence: {evt.confidence}%
                    </div>
                  </div>
                </div>

                <div className="service-entry-right">
                  <div className={`status-chip ${isSoon ? 'warning' : 'healthy'}`}>
                    <span>●</span>
                    <span>{isSoon ? t.maintenance.attentionStatus : t.maintenance.healthyStatus}</span>
                  </div>

                  {isSoon ? (
                    <button
                      type="button"
                      className="btn-tech-action"
                      onClick={() =>
                        alert(
                          `Service request scheduled for ${evt.machine} (${getTranslatedComponent(
                            evt.component
                          )}). Technician assigned.`
                        )
                      }
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>{t.maintenance.actionSchedule}</span>
                      <ArrowRightIcon size={12} color="#FFFFFF" />
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        paddingRight: '6px',
                      }}
                    >
                      No Action Required
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

