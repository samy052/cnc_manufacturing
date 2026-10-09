'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useFoundry } from '@/context/FoundryContext';
import {
  ZapIcon,
  ShieldIcon,
  ActivityIcon,
  CheckIcon,
  AlertIcon,
  RadioIcon,
  CpuIcon,
  RefreshIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@/components/common/Icons';

type DrilldownType = 'oee' | 'network' | 'industry5' | 'ai' | null;

export default function SmartFactoryKpiSection() {
  const { sendMessage, setActiveSection } = useFoundry();
  const [drilldown, setDrilldown] = useState<DrilldownType>(null);

  const handleAskAi = (promptText: string) => {
    sendMessage(promptText);
    setActiveSection('assistant');
  };

  // Network 8 KPI Cards Data
  const networkCards = [
    {
      title: 'Latency',
      unit: 'ms',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      iconBg: '#EBF4FF',
      fourG: '28.4 ms',
      fiveG: '3.1 ms',
      delta: '↓ 89% lower',
      deltaPositive: true,
      fourGPct: 85,
      fiveGPct: 15,
    },
    {
      title: 'Jitter',
      unit: 'ms',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      iconBg: '#EBF4FF',
      fourG: '8.2 ms',
      fiveG: '0.7 ms',
      delta: '↓ 91% lower',
      deltaPositive: true,
      fourGPct: 82,
      fiveGPct: 12,
    },
    {
      title: 'Packet Loss',
      unit: '%',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#793AC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10h-10z" />
        </svg>
      ),
      iconBg: '#F4EDFD',
      fourG: '1.8%',
      fiveG: '0.08%',
      delta: '↓ 96% lower',
      deltaPositive: true,
      fourGPct: 75,
      fiveGPct: 6,
    },
    {
      title: 'Throughput',
      unit: 'Mbps',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      iconBg: '#EBF4FF',
      fourG: '45 Mbps',
      fiveG: '850 Mbps',
      delta: '↑ 18.9x higher',
      deltaPositive: true,
      fourGPct: 10,
      fiveGPct: 95,
    },
    {
      title: 'Network Reliability',
      unit: '%',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      iconBg: '#ECFDF5',
      fourG: '98.2%',
      fiveG: '99.99%',
      delta: '↑ +1.79% higher',
      deltaPositive: true,
      fourGPct: 60,
      fiveGPct: 99,
    },
    {
      title: 'Availability / Uptime',
      unit: '%',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      ),
      iconBg: '#E6FFFA',
      fourG: '98.5%',
      fiveG: '99.99%',
      delta: '↑ +1.49% higher',
      deltaPositive: true,
      fourGPct: 65,
      fiveGPct: 99,
    },
    {
      title: 'Handover Time',
      unit: '',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <polyline points="16 3 21 3 21 8" />
          <line x1="4" y1="20" x2="21" y2="3" />
          <polyline points="21 16 21 21 16 21" />
          <line x1="15" y1="15" x2="21" y2="21" />
          <line x1="4" y1="4" x2="9" y2="9" />
        </svg>
      ),
      iconBg: '#EBF4FF',
      fourG: '2.4 sec',
      fiveG: '< 100 ms',
      delta: '↓ 96% faster',
      deltaPositive: true,
      fourGPct: 85,
      fiveGPct: 10,
    },
    {
      title: 'Device Density',
      unit: 'devices/cell',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      ),
      iconBg: '#EBF4FF',
      fourG: '100',
      fiveG: '1000+',
      delta: '↑ 10x higher',
      deltaPositive: true,
      fourGPct: 15,
      fiveGPct: 95,
    },
  ];

  // Hourly mini bar sparkline for OEE card
  const hourlyBars = [45, 60, 52, 70, 65, 85, 78, 92, 88, 95, 89, 94];

  return (
    <section className="section-wrapper modern-factory-page">
      {/* ========================================================
          1. TOP HERO HEADER WITH 4G vs 5G BANNER IMAGE
          ======================================================== */}
      <div className="modern-hero-card">
        <div className="modern-hero-left">
          <div className="modern-hero-title-row">
            <div className="modern-title-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
                <path d="M7.76 7.76a6 6 0 0 1 8.48 0" />
                <circle cx="12" cy="12" r="2" />
                <path d="M12 14v8" />
                <path d="M8 22h8" />
              </svg>
            </div>
            <h1 className="modern-hero-title">Industry 4.0 &amp; 5.0 Manufacturing Intelligence &amp; KPIs</h1>
          </div>
          <p className="modern-hero-subtitle">
            Compare network performance, manufacturing efficiency, and next-generation Industry 5.0 outcomes.
          </p>

          <div className="modern-hero-pills-row">
            <span className="modern-pill pill-blue">
              4G/5G = Connectivity Technology
            </span>
            <span className="modern-pill pill-amber">
              ⚙️ Industry 4.0 = Connected Automation
            </span>
            <span className="modern-pill pill-teal">
              🔄 Industry 5.0 = Human, Sustainable &amp; Resilient Manufacturing
            </span>
            <span className="modern-pill pill-green-live">
              <span className="pulsing-live-dot" />
              Live Telemetry Synced
            </span>
          </div>
        </div>

        {/* Banner Graphic on the Right */}
        <div className="modern-hero-right-banner">
          <img
            src="/smart_factory_banner.png"
            alt="4G vs 5G Smart Factory Cellular Network"
            className="modern-banner-img"
          />
        </div>
      </div>

      {/* ========================================================
          2. NETWORK PERFORMANCE — 4G vs PRIVATE 5G
          ======================================================== */}
      <div className="modern-card modern-network-card">
        <div className="modern-card-hdr-row">
          <div className="modern-hdr-left">
            <div className="modern-hdr-icon-box text-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <circle cx="12" cy="20" r="1" />
              </svg>
            </div>
            <div>
              <div className="modern-hdr-title-flex">
                <h2 className="modern-hdr-title">Network Performance — 4G vs Private 5G</h2>
                <span className="modern-info-icon" title="Evaluated across plant cells">ⓘ</span>
              </div>
              <p className="modern-hdr-sub">
                Key network metrics for industrial connectivity. (Demo telemetry — replace with live network data)
              </p>
            </div>
          </div>

          <div className="modern-hdr-right-tools">
            <div className="modern-legend-group">
              <span className="legend-item"><span className="legend-dot dot-blue" /> 4G / LTE</span>
              <span className="legend-item"><span className="legend-dot dot-green" /> Private 5G (URLLC)</span>
            </div>
            <button
              type="button"
              className="modern-hdr-btn"
              onClick={() => setDrilldown('network')}
            >
              View Network Trends →
            </button>
          </div>
        </div>

        {/* 8 Horizontal KPI Cards Grid */}
        <div className="modern-net-grid">
          {networkCards.map((card, idx) => (
            <div key={idx} className="modern-net-metric-card" onClick={() => setDrilldown('network')}>
              <div className="net-card-top">
                <div className="net-card-icon-box" style={{ background: card.iconBg }}>
                  {card.icon}
                </div>
                <div className="net-card-title-wrap">
                  <span className="net-card-name">{card.title}</span>
                  {card.unit && <span className="net-card-unit">({card.unit})</span>}
                </div>
              </div>

              {/* Dual Values Display with explicit 4G / 5G tags */}
              <div className="net-dual-val-row">
                <div className="net-val-pill val-4g">
                  <span className="net-pill-tag">4G</span>
                  <span className="net-pill-data">{card.fourG}</span>
                </div>
                <span className="net-vs-text">vs</span>
                <div className="net-val-pill val-5g">
                  <span className="net-pill-tag">5G</span>
                  <span className="net-pill-data">{card.fiveG}</span>
                </div>
              </div>

              {/* Dual Visual Comparison Bars */}
              <div className="net-bar-pair">
                <div className="net-bar-track">
                  <div className="net-bar-fill bar-blue" style={{ width: `${card.fourGPct}%` }} />
                </div>
                <div className="net-bar-track">
                  <div className="net-bar-fill bar-green" style={{ width: `${card.fiveGPct}%` }} />
                </div>
              </div>

              {/* Delta Badge */}
              <div className="net-card-bottom">
                <span className="net-delta-pill">{card.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. MIDDLE ROW: INDUSTRY 4.0 vs INDUSTRY 5.0
          ======================================================== */}
      <div className="modern-middle-grid">
        {/* LEFT CARD: INDUSTRY 4.0 (OPERATIONAL MANUFACTURING KPIs) */}
        <div className="modern-card modern-ind4-card">
          <div className="modern-card-hdr-row">
            <div className="modern-hdr-left">
              <div className="modern-hdr-icon-box text-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div>
                <h2 className="modern-hdr-title">Industry 4.0 — Operational Manufacturing KPIs</h2>
                <p className="modern-hdr-sub">Machine efficiency, production, quality and reliability metrics.</p>
              </div>
            </div>
            <button
              type="button"
              className="modern-hdr-btn"
              onClick={() => setDrilldown('oee')}
            >
              View Details →
            </button>
          </div>

          <div className="modern-ind4-content-row">
            {/* OEE Donut Gauge (Left Side) */}
            <div className="modern-oee-showcase" onClick={() => setDrilldown('oee')}>
              <div className="modern-oee-top-title">OEE</div>

              <div className="modern-oee-radial-wrap">
                <svg width="150" height="150" viewBox="0 0 160 160" className="modern-donut-svg">
                  <circle cx="80" cy="80" r="62" stroke="#E2E8F0" strokeWidth="12" fill="none" />
                  {/* Availability Arc (Blue) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    stroke="#1D4ED8"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="390"
                    strokeDashoffset="70"
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                  />
                  {/* Performance Arc (Teal) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    stroke="#059669"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="390"
                    strokeDashoffset="120"
                    strokeLinecap="round"
                    transform="rotate(30 80 80)"
                  />
                </svg>
                <div className="modern-oee-center-text">
                  <span className="oee-big-num">87.4%</span>
                  <span className="oee-center-lbl">OEE</span>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="modern-oee-legend-stack">
                <div className="oee-leg-item">
                  <span className="leg-dot dot-darkblue" />
                  <div>
                    <span className="leg-name">Availability</span>
                    <span className="leg-val">92.1%</span>
                  </div>
                </div>
                <div className="oee-leg-item">
                  <span className="leg-dot dot-teal" />
                  <div>
                    <span className="leg-name">Performance</span>
                    <span className="leg-val">96.2%</span>
                  </div>
                </div>
                <div className="oee-leg-item">
                  <span className="leg-dot dot-purple" />
                  <div>
                    <span className="leg-name">Quality</span>
                    <span className="leg-val">98.6%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Mini Production Sparkline */}
              <div className="modern-oee-spark-row">
                {hourlyBars.map((h, i) => (
                  <div key={i} className="spark-col-bar" style={{ height: `${h * 0.32}px` }} title={`Shift Hour ${i + 8}:00`} />
                ))}
              </div>
            </div>

            {/* 3x3 Metric Grid (Right Side) */}
            <div className="modern-ind4-kpis-grid">
              {/* Row 1 */}
              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-green">✓</span>
                  <span className="subcard-title">FPY / FTR</span>
                </div>
                <div className="subcard-value font-mono">98.4%</div>
                <div className="subcard-meta">Defective rate: 1.6%</div>
              </div>

              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-blue">🎯</span>
                  <span className="subcard-title">MTBF</span>
                </div>
                <div className="subcard-value font-mono">184 hrs</div>
                <div className="subcard-meta">Target: &gt;160 hrs</div>
              </div>

              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-amber">⏱️</span>
                  <span className="subcard-title">MTTR</span>
                </div>
                <div className="subcard-value font-mono">22 min</div>
                <div className="subcard-meta">Target: &lt;30 min</div>
              </div>

              {/* Row 2 */}
              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-teal">⚡</span>
                  <span className="subcard-title">Machine Utilization</span>
                </div>
                <div className="subcard-value font-mono">89.2%</div>
                <div className="subcard-mini-bar-track">
                  <div className="subcard-mini-bar-fill bar-green" style={{ width: '89.2%' }} />
                </div>
              </div>

              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-blue">🔄</span>
                  <span className="subcard-title">Cycle Time</span>
                </div>
                <div className="subcard-value font-mono">48.2 sec</div>
                <div className="subcard-mini-curve">〰️ nominal</div>
              </div>

              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-red">🛑</span>
                  <span className="subcard-title">Downtime (Today)</span>
                </div>
                <div className="subcard-value font-mono">42 min</div>
                <div className="subcard-meta text-red">↑ 12%</div>
              </div>

              {/* Row 3 */}
              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-blue">📦</span>
                  <span className="subcard-title">Throughput</span>
                </div>
                <div className="subcard-value font-mono">4,531 <small style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>parts/day</small></div>
              </div>

              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-teal">📊</span>
                  <span className="subcard-title">Target vs Actual</span>
                </div>
                <div className="subcard-value font-mono">94.6%</div>
                <div className="subcard-mini-bar-track">
                  <div className="subcard-mini-bar-fill bar-blue" style={{ width: '94.6%' }} />
                </div>
              </div>

              <div className="modern-kpi-subcard">
                <div className="subcard-top">
                  <span className="subcard-icon-box bg-light-green">🍃</span>
                  <span className="subcard-title">Specific Energy</span>
                </div>
                <div className="subcard-value font-mono">1.95 <small style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>kWh / part</small></div>
                <div className="subcard-meta">Baseline: 4G LTE</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: INDUSTRY 5.0 (HUMAN, SUSTAINABLE & RESILIENT) */}
        <div className="modern-card modern-ind5-card">
          <div className="modern-card-hdr-row">
            <div className="modern-hdr-left">
              <div className="modern-hdr-icon-box text-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div>
                <h2 className="modern-hdr-title">Industry 5.0 — Human, Sustainable &amp; Resilient Manufacturing</h2>
                <p className="modern-hdr-sub">Human-centricity, sustainability and resilience metrics enabled by next-gen connectivity.</p>
              </div>
            </div>
            <button
              type="button"
              className="modern-hdr-btn"
              onClick={() => setDrilldown('industry5')}
            >
              View Details →
            </button>
          </div>

          {/* 3 Categories Columns Side-by-Side */}
          <div className="modern-ind5-three-cols">
            {/* Column 1: Human-Centric */}
            <div className="ind5-cat-col">
              <div className="ind5-col-header text-amber-orange">
                <span className="col-header-icon">👥</span>
                <span className="col-header-title">Human-Centric</span>
              </div>

              <div className="ind5-subcards-list">
                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Operator Safety Index</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">99.8%</span>
                    <span className="ind5-pill-badge badge-soft-green">Optimal</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Ergonomic Risk</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">Low</span>
                    <span className="ind5-pill-badge badge-soft-green">ISO 11228</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Operator Workload</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono">72%</span>
                    <span className="ind5-pill-badge badge-soft-blue">Nominal</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Human-Machine Collaboration</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-teal">96%</span>
                    <span className="ind5-pill-badge badge-soft-teal">Cobot Paired</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Safety Incidents</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">0</span>
                    <span className="ind5-pill-badge badge-soft-green">0 incidents</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Training / Skill Readiness</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono">94%</span>
                    <span className="ind5-pill-badge badge-soft-blue">Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Sustainability */}
            <div className="ind5-cat-col">
              <div className="ind5-col-header text-green">
                <span className="col-header-icon">🍃</span>
                <span className="col-header-title">Sustainability</span>
              </div>

              <div className="ind5-subcards-list">
                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Specific Energy (SEC)</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">1.38 kWh/part</span>
                    <span className="ind5-pill-badge badge-soft-green">↓ 29.2%</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Carbon Footprint</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">0.42 kg CO₂e</span>
                    <span className="ind5-pill-badge badge-soft-green">↓ 20.4%</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Material Waste</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">1.2%</span>
                    <span className="ind5-pill-badge badge-soft-green">Lean Target</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Scrap Rate</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono">1.6%</span>
                    <span className="ind5-pill-badge badge-soft-blue">&lt; 2.0% Goal</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Water Consumption</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-teal">0.18 L/part</span>
                    <span className="ind5-pill-badge badge-soft-teal">Recycled</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Coolant &amp; Swarf Circularity</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">94.6%</span>
                    <span className="ind5-pill-badge badge-soft-green">Circular OT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Resilience */}
            <div className="ind5-cat-col">
              <div className="ind5-col-header text-blue">
                <span className="col-header-icon">🛡️</span>
                <span className="col-header-title">Resilience</span>
              </div>

              <div className="ind5-subcards-list">
                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Recovery Time</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">14 min</span>
                    <span className="ind5-pill-badge badge-soft-green">MTTR Bound</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Production Flexibility</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-blue">91%</span>
                    <span className="ind5-pill-badge badge-soft-blue">High Agility</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Supply Chain Risk</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">Low</span>
                    <span className="ind5-pill-badge badge-soft-green">Buffer OK</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Machine Dependency</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono">Balanced</span>
                    <span className="ind5-pill-badge badge-soft-blue">Multi-cell</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Changeover Time</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-green">14 min</span>
                    <span className="ind5-pill-badge badge-soft-green">↓ 81% faster</span>
                  </div>
                </div>

                <div className="ind5-subcard">
                  <span className="ind5-subcard-title">Recovery Readiness</span>
                  <div className="ind5-subcard-val-row">
                    <span className="ind5-subcard-val font-mono text-teal">96%</span>
                    <span className="ind5-pill-badge badge-soft-teal">Hot Standby</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. LOWER ROW: 4G -> 5G IMPACT vs AI MANUFACTURING INSIGHT
          ======================================================== */}
      <div className="modern-lower-grid">
        {/* LEFT: 4G -> 5G MANUFACTURING IMPACT (1.3fr) */}
        <div className="modern-card modern-impact-card">
          <div className="modern-card-hdr-row">
            <div className="modern-hdr-left">
              <div className="modern-hdr-icon-box text-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div>
                <h2 className="modern-hdr-title">4G → 5G Manufacturing Impact</h2>
                <p className="modern-hdr-sub">Potential impact enabled by improved connectivity, edge computing and automation.</p>
              </div>
            </div>
            <button
              type="button"
              className="modern-hdr-btn"
              onClick={() => handleAskAi('Explain detailed use cases of 4G to 5G private wireless transition in CNC machining')}
            >
              View Use Cases →
            </button>
          </div>

          <div className="modern-impact-strip-grid">
            {/* Item 1 */}
            <div className="modern-imp-box">
              <div className="imp-box-top">
                <span className="imp-icon text-teal">〰️</span>
                <span className="imp-title">Machine Telemetry</span>
              </div>
              <div className="imp-from">Polling (4G)</div>
              <div className="imp-arrow">→</div>
              <div className="imp-to-badge">Real-time (5G)</div>
            </div>

            {/* Item 2 */}
            <div className="modern-imp-box">
              <div className="imp-box-top">
                <span className="imp-icon text-blue">📷</span>
                <span className="imp-title">Quality Inspection</span>
              </div>
              <div className="imp-from">Post-process</div>
              <div className="imp-arrow">→</div>
              <div className="imp-to-badge">Inline Edge AI</div>
            </div>

            {/* Item 3 */}
            <div className="modern-imp-box">
              <div className="imp-box-top">
                <span className="imp-icon text-blue">🦾</span>
                <span className="imp-title">Robot / Cobot</span>
              </div>
              <div className="imp-from">Limited coordination</div>
              <div className="imp-arrow">→</div>
              <div className="imp-to-badge">Real-time sync</div>
            </div>

            {/* Item 4 */}
            <div className="modern-imp-box">
              <div className="imp-box-top">
                <span className="imp-icon text-purple">🧠</span>
                <span className="imp-title">AI Inference</span>
              </div>
              <div className="imp-from">Cloud dependent</div>
              <div className="imp-arrow">→</div>
              <div className="imp-to-badge">Edge inference</div>
            </div>

            {/* Item 5 */}
            <div className="modern-imp-box">
              <div className="imp-box-top">
                <span className="imp-icon text-amber">⚡</span>
                <span className="imp-title">Data Latency Impact</span>
              </div>
              <div className="imp-from-to-txt"><strong>28.4 ms</strong> → <strong>3.1 ms</strong></div>
              <div className="imp-delta-pill">↓ 89% faster</div>
            </div>

            {/* Item 6 */}
            <div className="modern-imp-box">
              <div className="imp-box-top">
                <span className="imp-icon text-green">⏱️</span>
                <span className="imp-title">Production Response</span>
              </div>
              <div className="imp-from-to-txt"><strong>Minutes</strong> → <strong>Seconds</strong></div>
              <div className="imp-delta-pill">↓ 10x faster</div>
            </div>
          </div>
        </div>

        {/* RIGHT: AI MANUFACTURING INSIGHT (1fr) */}
        <div className="modern-card modern-ai-card">
          <div className="modern-card-hdr-row">
            <div className="modern-hdr-left">
              <div className="modern-hdr-icon-box text-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                  <line x1="16" y1="16" x2="16.01" y2="16" />
                </svg>
              </div>
              <div>
                <h2 className="modern-hdr-title">AI Manufacturing Insight</h2>
              </div>
            </div>
            <span className="modern-rag-badge">Powered by RAG AI</span>
          </div>

          <div className="modern-ai-insights-list">
            <div className="ai-insight-item">
              <span className="ai-bullet-icon text-green">💡</span>
              <p className="ai-bullet-text">
                Network latency has improved by 89%, but <strong>OEE improvement is only 2.3%</strong>.
                The primary production constraint is machine downtime rather than network latency.
              </p>
            </div>

            <div className="ai-insight-item">
              <span className="ai-bullet-icon text-blue">⚙️</span>
              <p className="ai-bullet-text">
                Energy consumption per part has reduced by 29.2% with edge AI sleep modes.
                Maintain current configuration across all CNC machines.
              </p>
            </div>

            <div className="ai-insight-item">
              <span className="ai-bullet-icon text-amber">⚠️</span>
              <p className="ai-bullet-text">
                CNC-07 shows increased cycle time and spindle load.
                Recommendation: Inspect tool T-08 before next shift.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          5. BOTTOM ROW: STRATEGIC DIMENSION BENCHMARK
          ======================================================== */}
      <div className="modern-card modern-benchmark-table-card">
        <div className="modern-card-hdr-row">
          <div className="modern-hdr-left">
            <div className="modern-hdr-icon-box text-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M12 3v18" />
                <path d="m3 7 9-4 9 4" />
                <path d="M6 13h-3l3-6" />
                <path d="M21 13h-3l3-6" />
                <circle cx="4.5" cy="15.5" r="2.5" />
                <circle cx="19.5" cy="15.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h2 className="modern-hdr-title">Strategic Dimension Benchmark</h2>
            </div>
          </div>
          <button
            type="button"
            className="modern-hdr-btn"
            onClick={() => handleAskAi('Provide full strategic dimension maturity benchmark between 4G and Private 5G for factory operations')}
          >
            View Full Analysis →
          </button>
        </div>

        <div className="modern-table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Industrial Dimension</th>
                <th style={{ width: '32%' }}>4G Connected Manufacturing (Legacy)</th>
                <th style={{ width: '30%' }}>Private 5G Enabled Manufacturing</th>
                <th style={{ width: '16%' }}>Potential Improvement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Connectivity</strong></td>
                <td>4G LTE / Wi-Fi (25–40 ms)</td>
                <td>Private 5G URLLC (&lt; 4 ms)</td>
                <td><span className="modern-table-pill">↑ 8-10x lower latency</span></td>
              </tr>
              <tr>
                <td><strong>Machine Telemetry</strong></td>
                <td>Polling / delayed data</td>
                <td>Real-time high-frequency telemetry</td>
                <td><span className="modern-table-pill">Real-time visibility</span></td>
              </tr>
              <tr>
                <td><strong>Quality Inspection</strong></td>
                <td>Post-process / batch CMM</td>
                <td>Inline 5G Edge AI camera (4K, 90 FPS)</td>
                <td><span className="modern-table-pill">Immediate defect detection</span></td>
              </tr>
              <tr>
                <td><strong>Workforce Role</strong></td>
                <td>Operator responds to alarms</td>
                <td>Cobot supervisors with AI copilot</td>
                <td><span className="modern-table-pill">Zero ergonomic strain</span></td>
              </tr>
              <tr>
                <td><strong>Energy &amp; Sustainability</strong></td>
                <td>Utility-level monitoring</td>
                <td>Real-time part-level energy &amp; carbon</td>
                <td><span className="modern-table-pill">20–30% energy reduction</span></td>
              </tr>
              <tr>
                <td><strong>Production Flexibility</strong></td>
                <td>Manual fixture &amp; NC tool setup (75 min)</td>
                <td>Dynamic cobot recalibration (14 min)</td>
                <td><span className="modern-table-pill">80% faster changeover</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          DRILL-DOWN MODAL
          ======================================================== */}
      {drilldown && (
        <div className="kpi-modal-overlay" onClick={() => setDrilldown(null)}>
          <div className="kpi-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="kpi-modal-header">
              <div>
                <span className="smart-section-eyebrow">KPI Drill-down &amp; Machine Audit</span>
                <h3 className="kpi-modal-title">
                  {drilldown === 'oee' && 'OEE & Machine-wise Breakdown'}
                  {drilldown === 'network' && 'Network Latency, Jitter & Telemetry Trends'}
                  {drilldown === 'industry5' && 'Industry 5.0 ESG & Operator Health'}
                </h3>
              </div>
              <button
                type="button"
                className="kpi-modal-close-btn"
                onClick={() => setDrilldown(null)}
              >
                ✕
              </button>
            </div>

            <div className="kpi-modal-body">
              {drilldown === 'oee' && (
                <div>
                  <div className="smart-drilldown-kpi-row">
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Availability</span>
                      <span className="smart-drill-val text-blue">92.1%</span>
                      <span className="smart-drill-sub">Operating: 442 / 480 mins</span>
                    </div>
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Performance</span>
                      <span className="smart-drill-val text-teal">96.2%</span>
                      <span className="smart-drill-sub">Speed ratio: nominal</span>
                    </div>
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Quality</span>
                      <span className="smart-drill-val text-green">98.6%</span>
                      <span className="smart-drill-sub">120 / 121 Passed</span>
                    </div>
                    <div className="smart-drill-metric-box bg-highlight-teal">
                      <span className="smart-drill-lbl">OEE Score</span>
                      <span className="smart-drill-val text-green font-bold">87.4%</span>
                      <span className="smart-drill-sub">Grade A (World-Class &gt; 85%)</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginTop: '20px', marginBottom: '10px' }}>
                    Machine-wise OEE Distribution
                  </h4>
                  <div className="smart-table-wrapper">
                    <table className="smart-table">
                      <thead>
                        <tr>
                          <th>Cell ID</th>
                          <th>Machine Name</th>
                          <th>Availability</th>
                          <th>Performance</th>
                          <th>Quality</th>
                          <th>OEE</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>CNC-01</strong></td>
                          <td>DMG MORI NMV 5000</td>
                          <td>94.2%</td>
                          <td>97.8%</td>
                          <td>99.4%</td>
                          <td><strong className="text-teal">91.4%</strong></td>
                          <td><span className="smart-tag tag-green">Optimal</span></td>
                        </tr>
                        <tr>
                          <td><strong>CNC-09</strong></td>
                          <td>GF Mikron MILL E 700</td>
                          <td>95.1%</td>
                          <td>97.4%</td>
                          <td>99.5%</td>
                          <td><strong className="text-teal">92.1%</strong></td>
                          <td><span className="smart-tag tag-green">Optimal</span></td>
                        </tr>
                        <tr>
                          <td><strong>CNC-07</strong></td>
                          <td>DMG MORI DMU 65</td>
                          <td>84.1%</td>
                          <td>96.0%</td>
                          <td>96.1%</td>
                          <td><strong className="text-amber">79.8%</strong></td>
                          <td><span className="smart-tag tag-amber">Vibration Check</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {drilldown === 'network' && (
                <div>
                  <div className="smart-drilldown-kpi-row">
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">4G LTE Latency</span>
                      <span className="smart-drill-val text-amber">28.4 ms</span>
                      <span className="smart-drill-sub">Jitter: 8.2 ms • Packet Loss: 1.8%</span>
                    </div>
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Private 5G Latency</span>
                      <span className="smart-drill-val text-blue font-bold">3.1 ms</span>
                      <span className="smart-drill-sub">Jitter: 0.7 ms • Packet Loss: 0.08%</span>
                    </div>
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Latency Reduction</span>
                      <span className="smart-drill-val text-green font-bold">▼ 89.1%</span>
                      <span className="smart-drill-sub">Deterministic sub-5ms bound</span>
                    </div>
                  </div>
                </div>
              )}

              {drilldown === 'industry5' && (
                <div>
                  <div className="smart-drilldown-kpi-row">
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Specific Energy</span>
                      <span className="smart-drill-val text-green">1.38 kWh/part</span>
                      <span className="smart-drill-sub">▼ 29.2% vs 4G baseline</span>
                    </div>
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Carbon Footprint</span>
                      <span className="smart-drill-val text-green">0.42 kg CO₂e</span>
                      <span className="smart-drill-sub">Scope 1 &amp; 2 ESG compliance</span>
                    </div>
                    <div className="smart-drill-metric-box">
                      <span className="smart-drill-lbl">Cobot Safety</span>
                      <span className="smart-drill-val text-teal font-bold">99.8%</span>
                      <span className="smart-drill-sub">0 Proximity incidents in 45 days</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="kpi-modal-footer">
              <button
                type="button"
                className="btn-view-details"
                onClick={() => setDrilldown(null)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
