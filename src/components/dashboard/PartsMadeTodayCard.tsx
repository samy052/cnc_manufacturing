'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFoundry } from '@/context/FoundryContext';
import { BoxIcon } from '@/components/common/Icons';
import InteractiveSparkline from '@/components/common/InteractiveSparkline';

export default function PartsMadeTodayCard() {
  const {
    machines,
    partsInspected,
    incompleteParts,
    lastPartEvent,
    language,
    openMachineDetail,
  } = useFoundry();

  // currentIndex:
  // 0 = All Factory Total (pehle 5 second saare factory ka dikhae)
  // 1 = CNC-01 (next 5s)
  // 2 = CNC-02 (next 5s)
  // ...
  // 12 = CNC-12 (next 5s)
  // then loops back to 0
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!showAllModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAllModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAllModal]);

  // Fallback parts distribution for 12 machines (Sum = 4,531 matching live count)
  const fallbackParts: Record<string, number> = {
    'CNC-01': 420,
    'CNC-02': 385,
    'CNC-03': 412,
    'CNC-04': 365,
    'CNC-05': 390,
    'CNC-06': 445,
    'CNC-07': 295,
    'CNC-08': 378,
    'CNC-09': 410,
    'CNC-10': 360,
    'CNC-11': 336,
    'CNC-12': 335,
  };

  // Total steps = 13 (Index 0 is All Factory + Indices 1..12 are 12 machines)
  const TOTAL_STEPS = 13;

  // 5 seconds auto-rotation with hover pause
  useEffect(() => {
    if (isHovered) return; // Pause on hover

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOTAL_STEPS);
      setAnimKey((k) => k + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const handleSelectStep = (index: number) => {
    setCurrentIndex(index);
    setAnimKey((k) => k + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + TOTAL_STEPS) % TOTAL_STEPS);
    setAnimKey((k) => k + 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % TOTAL_STEPS);
    setAnimKey((k) => k + 1);
  };

  const isAllFactory = currentIndex === 0;
  const machineIndex = currentIndex - 1; // 0 to 11
  const currentMachine = !isAllFactory
    ? machines[machineIndex] || machines[0] || {
        id: `CNC-0${currentIndex}`,
        name: 'Machining Center',
        workpiece: 'Precision Component',
        model: 'Industrial CNC',
        status: 'running',
        metrics: { partsToday: 420 },
      }
    : null;

  const currentParts = currentMachine
    ? currentMachine.metrics?.partsToday ?? fallbackParts[currentMachine.id] ?? 420
    : partsInspected;

  const currentIncomplete = currentMachine
    ? currentMachine.partsIncomplete ?? 1
    : incompleteParts;

  const currentWorkpiece = currentMachine?.workpiece || 'Precision Component';
  const machinePercent =
    currentMachine && partsInspected > 0
      ? ((currentParts / partsInspected) * 100).toFixed(1)
      : '100';

  // Overall Yield calculation
  const totalAttempts = partsInspected + incompleteParts;
  const firstPassYield = totalAttempts > 0 ? ((partsInspected / totalAttempts) * 100).toFixed(1) : '98.4';

  // Hourly trend for interactive sparkline hover numbers
  const allFactoryTrend = [
    { label: '08:00 AM', value: Math.round(partsInspected * 0.14) },
    { label: '09:00 AM', value: Math.round(partsInspected * 0.28) },
    { label: '10:00 AM', value: Math.round(partsInspected * 0.44) },
    { label: '11:00 AM', value: Math.round(partsInspected * 0.62) },
    { label: '12:00 PM', value: Math.round(partsInspected * 0.76) },
    { label: '01:00 PM', value: Math.round(partsInspected * 0.89) },
    { label: '02:00 PM', value: partsInspected },
  ];

  const machineTrend = [
    { label: '08:00 AM', value: Math.round(currentParts * 0.12) },
    { label: '09:00 AM', value: Math.round(currentParts * 0.26) },
    { label: '10:00 AM', value: Math.round(currentParts * 0.45) },
    { label: '11:00 AM', value: Math.round(currentParts * 0.64) },
    { label: '12:00 PM', value: Math.round(currentParts * 0.78) },
    { label: '01:00 PM', value: Math.round(currentParts * 0.91) },
    { label: '02:00 PM', value: currentParts },
  ];

  const partsTimeFrames = {
    '1H': [
      { label: '12:10 PM', value: Math.round(currentParts * 0.88) },
      { label: '12:20 PM', value: Math.round(currentParts * 0.91) },
      { label: '12:30 PM', value: Math.round(currentParts * 0.93) },
      { label: '12:40 PM', value: Math.round(currentParts * 0.95) },
      { label: '12:50 PM', value: Math.round(currentParts * 0.98) },
      { label: '01:00 PM', value: currentParts },
    ],
    '8H': isAllFactory ? allFactoryTrend : machineTrend,
    '24H': [
      { label: '00:00', value: Math.round(currentParts * 0.14) },
      { label: '04:00', value: Math.round(currentParts * 0.28) },
      { label: '08:00', value: Math.round(currentParts * 0.46) },
      { label: '12:00', value: Math.round(currentParts * 0.72) },
      { label: '16:00', value: Math.round(currentParts * 0.88) },
      { label: '20:00', value: Math.round(currentParts * 0.96) },
      { label: 'Now', value: currentParts },
    ],
    '7D': [
      { label: 'Thu', value: Math.round(currentParts * 0.92) },
      { label: 'Fri', value: Math.round(currentParts * 0.98) },
      { label: 'Sat', value: Math.round(currentParts * 0.86) },
      { label: 'Sun', value: Math.round(currentParts * 0.72) },
      { label: 'Mon', value: Math.round(currentParts * 1.02) },
      { label: 'Tue', value: Math.round(currentParts * 0.96) },
      { label: 'Today', value: currentParts },
    ],
    '30D': [
      { label: 'W1', value: Math.round(currentParts * 0.82) },
      { label: 'W2', value: Math.round(currentParts * 0.91) },
      { label: 'W3', value: Math.round(currentParts * 0.97) },
      { label: 'W4', value: Math.round(currentParts * 0.94) },
      { label: 'Cur', value: currentParts },
    ],
  };

  // Professional multi-language phrase logic (includes completed and incomplete part counts)
  const getPhraseText = () => {
    if (isAllFactory) {
      if (language === 'hi') {
        return `कारखाने में आज कुल ${partsInspected.toLocaleString('en-IN')} पार्ट्स पूरे बने हैं (${incompleteParts} में एरर/रुकावट)`;
      }
      if (language === 'kn') {
        return `ಇಂದು ಕಾರ್ಖಾನೆಯಲ್ಲಿ ಒಟ್ಟು ${partsInspected.toLocaleString('en-IN')} ಭಾಗಗಳು ತಯಾರಾಗಿವೆ (${incompleteParts} ಅಪೂರ್ಣ/ದೋಷ)`;
      }
      if (language === 'ta') {
        return `இன்று மொத்தம் ${partsInspected.toLocaleString('en-IN')} பாகங்கள் தயாரிக்கப்பட்டுள்ளன (${incompleteParts} பிழை/முழுமையற்றவை)`;
      }
      if (language === 'te') {
        return `ఈరోజు ఫ్యాక్టరీలో మొత్తం ${partsInspected.toLocaleString('en-IN')} భాగాలు తయారయ్యాయి (${incompleteParts} అసంపూర్ణం/లోపాలు)`;
      }
      return `Total plant output: ${partsInspected.toLocaleString('en-IN')} completed parts (${incompleteParts} incomplete/errors)`;
    }

    if (language === 'hi') {
      return `${currentMachine?.id} से ${currentParts.toLocaleString('en-IN')} पार्ट्स बने हैं (${currentIncomplete} एरर/इनकम्पलीट)`;
    }
    if (language === 'kn') {
      return `${currentMachine?.id} ಯಂತ್ರದಿಂದ ${currentParts.toLocaleString('en-IN')} ಭಾಗಗಳು ತಯಾರಾಗಿವೆ (${currentIncomplete} ಅಪೂರ್ಣ)`;
    }
    if (language === 'ta') {
      return `${currentMachine?.id} இயந்திரத்தில் ${currentParts.toLocaleString('en-IN')} பாகங்கள் தயாரிக்கப்பட்டுள்ளன (${currentIncomplete} பிழை)`;
    }
    if (language === 'te') {
      return `${currentMachine?.id} మెషిన్ ద్వారా ${currentParts.toLocaleString('en-IN')} భాగాలు తయారయ్యాయి (${currentIncomplete} అసంపూర్ణం)`;
    }
    return `${currentMachine?.id} produced ${currentParts.toLocaleString('en-IN')} parts (${currentIncomplete} incomplete/held)`;
  };

  const currentCycleProgress = currentMachine?.cycleProgress ?? 50;
  const cycleTargetSec = currentMachine?.plc?.cycleTarget || currentMachine?.plc?.cycleTime || 35;
  const remainingSec = Math.max(1, Math.round((cycleTargetSec * (100 - currentCycleProgress)) / 100));

  return (
    <>
      <div
        className="kpi-card-box parts-made-interactive-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Hover to pause rotation at any machine or factory total"
      >
        {/* Top Header Row */}
        <div className="kpi-top-row">
          <div className="kpi-icon-pill" style={{ background: '#E5F8EE', color: '#138A4D' }}>
            <BoxIcon size={18} color="#138A4D" />
          </div>
          <div className="kpi-card-label">
            Parts Made Today
            <span className={`kpi-card-mode-badge ${isAllFactory ? 'factory' : 'machine'}`}>
              {isAllFactory ? 'All Factory' : currentMachine?.id}
            </span>
          </div>
          <div className="kpi-trend-pill">▲ Real-Time Cadence</div>
        </div>

        {/* Mid Row: Big Number & Interactive Sparkline with Hover Numbers */}
        <div className="kpi-mid-row" style={{ marginBottom: '4px' }}>
          <div className="kpi-big-num tabular">
            {currentParts.toLocaleString('en-IN')}{' '}
            <span className="unit" style={{ fontSize: '13px', marginLeft: '4px' }}>
              {isAllFactory ? 'total parts' : 'parts made'}
            </span>
          </div>
          <InteractiveSparkline
            data={isAllFactory ? allFactoryTrend : machineTrend}
            timeFrameData={partsTimeFrames}
            color="#10B981"
            unit="parts"
            width={150}
            height={30}
          />
        </div>

        {/* Realistic Factory Breakdown: Completed OK vs Incomplete / Errors */}
        <div className="kpi-sub-stats-row">
          <div className="kpi-mini-stat ok" title="Parts that completed full machining cycle and passed QC">
            <span className="mini-stat-dot green" />
            <strong>{currentParts.toLocaleString('en-IN')}</strong>
            <span>Completed (OK)</span>
          </div>
          <div
            className="kpi-mini-stat err"
            title="Parts interrupted due to tool wear, feed hold, clamping error, or out-of-tolerance deviation"
          >
            <span className="mini-stat-dot amber" />
            <strong>{currentIncomplete}</strong>
            <span>Incomplete / Error</span>
          </div>
          <div className="kpi-mini-stat yield">
            <span>{isAllFactory ? `${firstPassYield}% Yield` : `${currentCycleProgress}% Cut`}</span>
          </div>
        </div>

        {/* 5-Sec Rotating Live Showcase Box (All Factory -> CNC-01 -> CNC-02 -> ... -> CNC-12) */}
        <div className={`machine-parts-rotator-box ${isAllFactory ? 'is-all-factory-box' : ''}`}>
          {/* Rotator Header */}
          <div className="rotator-header">
            <div className="rotator-machine-badge">
              {isAllFactory ? (
                <>
                  <span className="status-dot-pulse healthy" />
                  <strong className="machine-id-text" style={{ color: '#047857' }}>
                    Full Plant Total
                  </strong>
                  <span className="rotator-model-name">12 Machines</span>
                </>
              ) : (
                <>
                  <span
                    className={`status-dot-pulse ${
                      currentMachine?.status === 'warning' ? 'warning' : 'healthy'
                    }`}
                  />
                  <strong className="machine-id-text">{currentMachine?.id}</strong>
                  <span className="rotator-model-name">
                    {currentMachine?.model?.split(' ')[0]}
                  </span>
                </>
              )}
            </div>

            <div className="rotator-controls">
              {/* Hover Pause Status Pill */}
              <span className={`pause-status-pill ${isHovered ? 'active' : ''}`}>
                {isHovered ? 'Paused' : 'Auto'}
              </span>

              {/* Prev / Next Arrows */}
              <button
                type="button"
                className="rotator-arrow-btn"
                onClick={handlePrev}
                title="Previous Machine"
              >
                ‹
              </button>
              <span className="rotator-counter-num">
                {isAllFactory ? 'All' : `${currentIndex}/12`}
              </span>
              <button
                type="button"
                className="rotator-arrow-btn"
                onClick={handleNext}
                title="Next Machine"
              >
                ›
              </button>
            </div>
          </div>

          {/* Rotator Body: Main Highlight Sentence */}
          <div className="rotator-body">
            <div className="rotator-parts-sentence">
              <span className="rotator-sentence-lead">{getPhraseText()}</span>
            </div>

            <div className="rotator-workpiece-row">
              {isAllFactory ? (
                <>
                  <span className="workpiece-label">Scope:</span>
                  <strong className="workpiece-val">12 Active CNC & Lathe Lines</strong>
                  <span className="workpiece-share">(100% Plant)</span>
                </>
              ) : (
                <>
                  <span className="workpiece-label">Part:</span>
                  <strong className="workpiece-val" title={currentWorkpiece}>
                    {currentWorkpiece}
                  </strong>
                  <span className="workpiece-share">({machinePercent}% of plant)</span>
                </>
              )}
            </div>

            {/* Active Machine Live Machining Cycle Progress */}
            {!isAllFactory && (
              <div className="machine-live-cycle-box">
                <div className="machine-cycle-meta">
                  <span>
                    {currentMachine?.cycleState === 'feed_hold' ? (
                      <strong style={{ color: '#D97706' }}>⚠️ Feed Hold: Spindle vibration check</strong>
                    ) : currentMachine?.cycleState === 'incomplete' ? (
                      <strong style={{ color: '#DC2626' }}>⚠️ Cycle Interrupted: Part marked incomplete</strong>
                    ) : (
                      <span>
                        ⚙️ Cutting: <strong>{currentCycleProgress}%</strong> ({currentMachine?.plc?.step?.split('(')[0] || 'In progress'})
                      </span>
                    )}
                  </span>
                  <span className="cycle-time-left">
                    {currentMachine?.cycleState === 'cutting' ? `~${remainingSec}s left` : 'Held'}
                  </span>
                </div>
                <div className="machine-cycle-bar-track">
                  <div
                    className="machine-cycle-bar-fill"
                    style={{
                      width: `${currentCycleProgress}%`,
                      background:
                        currentMachine?.cycleState === 'feed_hold'
                          ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                          : currentMachine?.cycleState === 'incomplete'
                          ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                          : 'linear-gradient(90deg, #10B981, #059669)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5-Second Animated Progress Bar (Freezes when hovered) */}
          <div className="rotator-progress-track">
            <div
              key={animKey}
              className={`rotator-progress-fill ${isHovered ? 'paused' : 'running'}`}
            />
          </div>

          {/* Step Selector Pills: [All Factory] + 12 Machine Dots (1 to 12) */}
          <div className="rotator-dots-row">
            {/* Step 0: All Factory */}
            <button
              type="button"
              className={`rotator-dot-pill all-factory-pill ${isAllFactory ? 'active' : ''}`}
              onClick={() => handleSelectStep(0)}
              title={`All Factory: ${partsInspected} completed, ${incompleteParts} incomplete`}
            >
              All
            </button>

            {/* Steps 1..12: Machines */}
            {machines.slice(0, 12).map((m, idx) => {
              const stepIdx = idx + 1;
              const pCount = m.metrics?.partsToday ?? fallbackParts[m.id] ?? 350;
              const isActive = stepIdx === currentIndex;
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`rotator-dot-pill ${isActive ? 'active' : ''} ${
                    m.status === 'warning' ? 'has-warning' : ''
                  }`}
                  onClick={() => handleSelectStep(stepIdx)}
                  title={`${m.id}: ${pCount} OK, ${m.partsIncomplete ?? 0} errors (${m.workpiece || 'Part'})`}
                >
                  <span className="dot-label">{stepIdx}</span>
                </button>
              );
            })}
          </div>

          {/* Live Shopfloor Event Strip inside rotator box */}
          {lastPartEvent && (
            <div className={`live-shopfloor-event-strip ${lastPartEvent.type}`}>
              <span className="event-pulse-dot" />
              <span className="event-time">[{lastPartEvent.timestamp}]</span>
              <span className="event-text" title={lastPartEvent.message}>
                {lastPartEvent.message}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Row: Loop Status + View All Modal Trigger */}
        <div className="kpi-bot-row" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#10B981', fontSize: '10px' }}>●</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {isAllFactory
                ? 'Showing Factory Total · Live cycling'
                : `Showing ${currentMachine?.id} · Machine ${currentIndex} of 12`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-view-all-machines"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAllModal(true);
              }}
            >
              All 12 Machines ↗
            </button>

            {!isAllFactory && currentMachine && (
              <button
                type="button"
                className="btn-inspect-curr-machine"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openMachineDetail(currentMachine.id);
                }}
                title={`Open full ${currentMachine.id} Diagnostics Page`}
              >
                Inspect {currentMachine.id} →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal: All 12 Machines Breakdown (Portaled to document.body) */}
      {showAllModal && mounted && typeof document !== 'undefined' && createPortal(
        <div
          className="parts-modal-overlay"
          onClick={() => setShowAllModal(false)}
          style={{ zIndex: 99999 }}
        >
          <div
            className="parts-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="parts-modal-header">
              <div>
                <h3 className="parts-modal-title">12 Machines Production Breakdown Today</h3>
                <p className="parts-modal-subtitle">
                  Total Plant Output:{' '}
                  <strong style={{ color: '#10B981' }}>
                    {partsInspected.toLocaleString('en-IN')} parts completed
                  </strong>{' '}
                  · <span style={{ color: '#D97706' }}>{incompleteParts} incomplete/errors</span> across 12 lines
                  <span style={{ color: '#10B981', fontWeight: 600, marginLeft: '6px' }}>
                    · Click any machine to open full Diagnostics Page
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="parts-modal-close"
                onClick={() => setShowAllModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="parts-modal-grid">
              {machines.slice(0, 12).map((m, idx) => {
                const stepIdx = idx + 1;
                const count = m.metrics?.partsToday ?? fallbackParts[m.id] ?? 350;
                const isCurrent = stepIdx === currentIndex;
                const pct =
                  partsInspected > 0 ? ((count / partsInspected) * 100).toFixed(1) : '8.3';

                return (
                  <div
                    key={m.id}
                    className={`parts-modal-card ${isCurrent ? 'selected-machine' : ''}`}
                    onClick={() => {
                      setShowAllModal(false);
                      openMachineDetail(m.id);
                    }}
                    title={`Click to view full ${m.id} Diagnostics & Telemetry page`}
                  >
                    <div className="pm-card-top">
                      <div className="pm-id-badge">
                        <span
                          className={`status-dot-pulse ${
                            m.status === 'warning' ? 'warning' : 'healthy'
                          }`}
                        />
                        <strong>{m.id}</strong>
                      </div>
                      <span className="pm-count-badge">{count} OK</span>
                    </div>

                    <div className="pm-workpiece-name">
                      <span style={{ opacity: 0.7 }}>Part:</span>{' '}
                      {m.workpiece || 'Precision Component'}
                    </div>

                    <div className="pm-status-row">
                      <span className="pm-model-info">{m.model || m.name}</span>
                      <span className="pm-incomplete-tag">
                        {m.partsIncomplete ? `⚠️ ${m.partsIncomplete} Incomplete` : '0 Errors'}
                      </span>
                    </div>

                    {/* Live Machining Cycle Progress Bar */}
                    <div className="pm-cycle-progress-wrap">
                      <div className="pm-cycle-text-row">
                        <span>Machining: {m.cycleProgress ?? 50}%</span>
                        <span className="pm-cycle-state-pill">
                          {m.cycleState === 'feed_hold'
                            ? 'Feed Hold'
                            : m.cycleState === 'incomplete'
                            ? 'Error Check'
                            : 'Cutting'}
                        </span>
                      </div>
                      <div className="pm-progress-bg">
                        <div
                          className="pm-progress-fill"
                          style={{
                            width: `${m.cycleProgress ?? 50}%`,
                            background:
                              m.cycleState === 'feed_hold'
                                ? '#F59E0B'
                                : m.cycleState === 'incomplete'
                                ? '#EF4444'
                                : '#10B981',
                          }}
                        />
                      </div>
                    </div>

                    <div className="pm-card-hover-action">
                      <span>Open {m.id} Diagnostics Page →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="parts-modal-footer">
              <div className="pm-footer-hint">
                Real-time factory pacing: Cycles advance realistically (~28s to 52s). Incomplete parts occur when alarms or feed holds are triggered.
              </div>
              <button
                type="button"
                className="btn-modal-done"
                onClick={() => setShowAllModal(false)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
