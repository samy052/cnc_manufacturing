'use client';

import React from 'react';
import { useFoundry } from '@/context/FoundryContext';
import {
  ZapIcon,
  ClockIcon,
  RefreshIcon,
  ShieldIcon,
  CoinIcon,
  ActivityIcon,
} from '@/components/common/Icons';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

export default function OptimizationSection() {
  const { t } = useFoundry();
  const [optTimeFrame, setOptTimeFrame] = React.useState<TimeFrameKey>('8H');

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

  const practicalTips = [
    {
      icon: <ZapIcon size={20} color="#1B78C2" />,
      bg: '#E7F3FE',
      badge: '12% Less Scrap',
      title: 'Optimal Cutting Speed',
      desc: 'Capping CNC-07 speed at 195 mm/min reduces metal edge defects by 12% without slowing overall daily output.',
    },
    {
      icon: <ClockIcon size={20} color="#108A4F" />,
      bg: '#E5F8EE',
      badge: 'Saves 40 Mins',
      title: 'Night Shift Coolant Balance',
      desc: 'Keeping coolant tanks at steady 33°C during night hours prevents part shrinkage and avoids morning recalibration delays.',
    },
    {
      icon: <RefreshIcon size={20} color="#793AC8" />,
      bg: '#F4EDFD',
      badge: '18% Less Downtime',
      title: 'Batch Tool Grouping',
      desc: 'Sequencing production batches by tool type rather than invoice date saved 18% in machine changeover downtime.',
    },
    {
      icon: <ShieldIcon size={20} color="#C6680A" />,
      bg: '#FEF8E4',
      badge: 'Zero Surprises',
      title: 'Early Spindle Warning',
      desc: 'Minor vibration warnings appear 6 to 12 days ahead, giving technicians ample time to grease or service without stopping production.',
    },
  ];

  return (
    <section className="section-wrapper">
      {/* Hero Title & Description */}
      <div className="overview-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-hero-title" style={{ fontSize: '22px', fontWeight: 800 }}>
              {t.optimization.title}
            </h1>
            <span className="live-badge-mint">
              <span className="pulse-dot" /> Cost & Energy Engine
            </span>
          </div>
          <p className="page-hero-desc" style={{ marginTop: '2px', marginBottom: 0, fontSize: '13px' }}>
            {t.optimization.desc} · Peak Demand Management & Scrap Elimination
          </p>
        </div>

        <div className="time-filter-pill-group">
          {(['1H', '8H', '24H', '7D', '30D'] as TimeFrameKey[]).map((tf) => (
            <button
              key={tf}
              type="button"
              className={`time-filter-btn ${optTimeFrame === tf ? 'active' : ''}`}
              onClick={() => setOptTimeFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Enterprise KPI Cards */}
      <div className="overview-kpi-row-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '18px' }}>
        {/* Card 1: Total Cost Savings */}
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
          <div className="kpi-label">Cumulative Monthly Cost Savings</div>
          <div className="kpi-sub-line font-sm">
            <span>Target: <strong>₹3.8 Lakhs</strong> · 7 Repairs Avoided</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={savingsTimeFrames[optTimeFrame]}
              timeFrameData={savingsTimeFrames}
              activeTimeFrame={optTimeFrame}
              onTimeFrameChange={setOptTimeFrame}
              color="#D97706"
              width={180}
              height={26}
              valuePrefix="₹"
              unit="L"
            />
          </div>
        </div>

        {/* Card 2: Peak Power Demand */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <ZapIcon size={18} color="#2563EB" />
            </div>
            <span className="kpi-badge-pill green">▼ -18.4% Peak</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">14.2</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>kW</span>
          </div>
          <div className="kpi-label">Plant Peak Power Load</div>
          <div className="kpi-sub-line font-sm">
            <span>Power Factor: <strong>0.94</strong> · Baseline: 18.5 kW</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={powerTimeFrames[optTimeFrame]}
              timeFrameData={powerTimeFrames}
              activeTimeFrame={optTimeFrame}
              onTimeFrameChange={setOptTimeFrame}
              color="#2563EB"
              width={180}
              height={26}
              unit="kW"
            />
          </div>
        </div>

        {/* Card 3: Scrap Waste Reduction */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <ShieldIcon size={18} color="#16A34A" />
            </div>
            <span className="kpi-badge-pill green">▼ -15% Scrap</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">2.9%</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Waste Rate</span>
          </div>
          <div className="kpi-label">Material Scrap Reduction</div>
          <div className="kpi-sub-line font-sm">
            <span>Down from 4.1% · <strong>410 kg saved</strong></span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Saved ₹1.1 Lakhs</span>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>Zero Waste Target</span>
          </div>
        </div>

        {/* Card 4: Changeover Time Saved */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <ClockIcon size={18} color="#0D9488" />
            </div>
            <span className="kpi-badge-pill green">▼ -45% Downtime</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">40</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Mins / Shift</span>
          </div>
          <div className="kpi-label">Batch Setup & Changeover Saved</div>
          <div className="kpi-sub-line font-sm">
            <span>Tool grouping algorithm deployed</span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>+8% Output Capacity</span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>18% faster setups</span>
          </div>
        </div>
      </div>

      {/* Section 1: AI Practical Tips */}
      <div className="section-hdr-row">
        <div className="section-hdr-title">
          <span className="green-vbar" />
          <span>{t.optimization.tipsTitle}</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: 700 }}>
          ● 4 Active Recommendations
        </span>
      </div>

      <div className="tips-grid-box">
        {practicalTips.map((tip, idx) => (
          <div key={idx} className="tip-card-item">
            <div
              className="tip-icon-squircle"
              style={{ background: tip.bg }}
            >
              {tip.icon}
            </div>
            <div className="tip-content-info">
              <div className="tip-header-row">
                <span className="tip-title-bold">{tip.title}</span>
                <span className="tip-benefit-pill">{tip.badge}</span>
              </div>
              <p className="tip-text-body">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2: Before vs. After Improvements */}
      <div className="comparison-card-panel">
        <div className="section-hdr-row" style={{ marginBottom: '16px' }}>
          <div className="section-hdr-title">
            <span className="green-vbar" />
            <span>{t.optimization.savingsTitle}</span>
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Measured over last 30 days
          </span>
        </div>

        {/* Metric 1: Scrap Rate */}
        <div className="comp-metric-row">
          <div className="comp-label-top">
            <span className="comp-label-text">{t.optimization.scrapRate}</span>
            <span className="comp-pct-badge">▼ 15% Less Waste</span>
          </div>
          <div className="comp-bar-wrapper">
            <div className="comp-bar-track">
              <div className="comp-bar-fill-old" style={{ width: '65%' }} />
            </div>
            <div className="comp-bar-track">
              <div className="comp-bar-fill-new" style={{ width: '45%' }} />
            </div>
          </div>
          <div className="comp-legend-row">
            <span>{t.optimization.beforeText}: 4.1% defective scrap</span>
            <span style={{ color: '#108A4F', fontWeight: 700 }}>
              {t.optimization.afterText}: 2.9%
            </span>
          </div>
        </div>

        {/* Metric 2: Average Cycle Time */}
        <div className="comp-metric-row">
          <div className="comp-label-top">
            <span className="comp-label-text">{t.optimization.avgCycleTime}</span>
            <span className="comp-pct-badge">▲ 8% Faster Cycle</span>
          </div>
          <div className="comp-bar-wrapper">
            <div className="comp-bar-track">
              <div className="comp-bar-fill-old" style={{ width: '85%' }} />
            </div>
            <div className="comp-bar-track">
              <div className="comp-bar-fill-new" style={{ width: '74%' }} />
            </div>
          </div>
          <div className="comp-legend-row">
            <span>{t.optimization.beforeText}: 41.2 seconds per part</span>
            <span style={{ color: '#108A4F', fontWeight: 700 }}>
              {t.optimization.afterText}: 37.9 seconds
            </span>
          </div>
        </div>

        {/* Metric 3: Unplanned Downtime */}
        <div className="comp-metric-row">
          <div className="comp-label-top">
            <span className="comp-label-text">{t.optimization.unplannedDowntime}</span>
            <span className="comp-pct-badge">▼ 45% Downtime Cut</span>
          </div>
          <div className="comp-bar-wrapper">
            <div className="comp-bar-track">
              <div className="comp-bar-fill-old" style={{ width: '78%' }} />
            </div>
            <div className="comp-bar-track">
              <div className="comp-bar-fill-new" style={{ width: '38%' }} />
            </div>
          </div>
          <div className="comp-legend-row">
            <span>{t.optimization.beforeText}: 6.4 hours / week</span>
            <span style={{ color: '#108A4F', fontWeight: 700 }}>
              {t.optimization.afterText}: 3.5 hours / week
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
