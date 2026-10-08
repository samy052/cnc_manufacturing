'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import {
  BotIcon,
  HelpIcon,
  AlertIcon,
  BoxIcon,
  ZapIcon,
  ArrowRightIcon,
  CheckIcon,
  ActivityIcon,
  ShieldIcon,
  CpuIcon,
} from '@/components/common/Icons';

type CopilotPersona = 'rca' | 'metrology' | 'tooling' | 'sop';

interface DiagnosticTurn {
  id: string;
  role: 'bot' | 'user' | 'system';
  author?: string;
  timestamp: string;
  text: string;
  hasFftChart?: boolean;
  citation?: {
    anomaly: string;
    rootCause: string;
    action: string;
    standard: string;
  };
  opcActionBanner?: string;
}

const INITIAL_CONVERSATION: DiagnosticTurn[] = [
  {
    id: 'turn-init',
    role: 'bot',
    timestamp: '08:41:02',
    text: 'Telemetry ingestion stream active for CNC-07 (5-Axis DMG MORI DMU 50). OPC-UA node ns=2;s=CNC07 transmitting 2,480 tags at 100 Hz. Edge model: Llama-3.3-70B-Instruct-AWQ (Local TensorRT-LLM, zero cloud exfiltration).',
  },
  {
    id: 'turn-user-1',
    role: 'user',
    author: 'Suraj Singh (Lead Machinist)',
    timestamp: '08:42:15',
    text: 'Copilot, CNC-07 spindle vibration alarm just triggered at 8.4 mm/s during rough milling on Batch #2026-092. Check FFT spectral telemetry and advise if we need an immediate emergency stop.',
  },
  {
    id: 'turn-bot-1',
    role: 'bot',
    timestamp: '08:42:18',
    text: 'ALERT EVALUATION: Do NOT initiate a hard emergency stop under heavy roughing load — sudden spindle halt will gouge workpiece PRT-2452 and cause tool tip shock failure. High-resolution FFT vibration spectrum confirms localized Inner Bearing Race Fatigue (BPFI) resonance rather than catastrophic shaft seizure.',
    hasFftChart: true,
    citation: {
      anomaly: 'CNC-07 Spindle RMS 8.4 mm/s (Zone C > 6.0 mm/s limit)',
      rootCause: 'Ball Pass Frequency Inner Ring (BPFI @ 1,420 Hz, 84.2% prob)',
      action: 'Apply 78% Spindle Speed Override (6,400 RPM) & 1,150 mm/min feed rate',
      standard: 'ISO 10816-3 (Group 2 Class B - Severe Vibration Warning)',
    },
  },
  {
    id: 'turn-user-2',
    role: 'user',
    author: 'Suraj Singh (Lead Machinist)',
    timestamp: '08:43:40',
    text: 'What is the calculated Remaining Useful Life (RUL) if we run at 78% override? Can we finish Batch #2026-092 before Shift B handover?',
  },
  {
    id: 'turn-bot-2',
    role: 'bot',
    timestamp: '08:43:43',
    text: 'Weibull hazard rate degradation modeling indicates 14.2 operational hours of remaining bearing fatigue life at 78% speed override before reaching critical raceway spalling (12.0 mm/s). Batch #2026-092 requires 4.8 hours of machining remaining, leaving a safe 9.4-hour margin. You can safely finish the batch before the scheduled 22:00 PM shift lockout (LOTO) maintenance window.',
  },
];

export default function AssistantSection() {
  const { machines, openMachineDetail, t } = useFoundry();
  const [activePersona, setActivePersona] = useState<CopilotPersona>('rca');
  const [messages, setMessages] = useState<DiagnosticTurn[]>(INITIAL_CONVERSATION);
  const [inputVal, setInputVal] = useState('');
  const [selectedMachineContext, setSelectedMachineContext] = useState<string>('CNC-07');
  const [isTyping, setIsTyping] = useState(false);
  const [opcExecutionSuccess, setOpcExecutionSuccess] = useState<string | null>(null);
  const [cmmsSuccess, setCmmsSuccess] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });

    const userTurn: DiagnosticTurn = {
      id: 'turn-' + Date.now(),
      role: 'user',
      author: 'Suraj Singh (Lead Machinist)',
      timestamp: timeStr,
      text: queryText,
    };

    setMessages((prev) => [...prev, userTurn]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateIndustrialResponse(queryText, selectedMachineContext);
      const botTurn: DiagnosticTurn = {
        id: 'turn-' + (Date.now() + 1),
        role: 'bot',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        text: botResponse.text,
        citation: botResponse.citation,
      };
      setMessages((prev) => [...prev, botTurn]);
    }, 600);
  };

  const generateIndustrialResponse = (q: string, machineId: string) => {
    const qLower = q.toLowerCase();
    if (qLower.includes('vibrat') || qLower.includes('spindle') || qLower.includes('bearing') || qLower.includes('cnc-07')) {
      return {
        text: `CNC-07 telemetry analysis: Spindle vibration is currently stabilized at 4.9 mm/s following harmonic damping. Bearing housing temperature is 61.4°C (thermal gradient: +0.2°C/min). Recommended: maintain current 78% feed override until batch completion.`,
        citation: {
          anomaly: 'CNC-07 Spindle Radial Vibration',
          rootCause: 'Inner Bearing Race BPFI Harmonic (84.2%)',
          action: 'Inspect bearing grease reservoir at shift handoff; replace SKF 7014 cartridge',
          standard: 'ISO 10816-3 (Group 2 Machines)',
        },
      };
    }
    if (qLower.includes('tool') || qLower.includes('wear') || qLower.includes('t05')) {
      return {
        text: `Tool T05 (16mm Carbide Endmill) remaining useful life is estimated at 38 minutes (Flank wear VB = 0.24mm vs 0.30mm threshold). Cutting resistance has increased by +14% over the last 18 cycles. Recommend auto-indexing to backup Tool Pocket #08 at cycle #420.`,
        citation: {
          anomaly: 'Tool T05 Flank Wear VB Drift',
          rootCause: 'Abrasive flank wear on TiAlN coating',
          action: 'Pre-stage Tool T05 replacement in carousel Pocket #08',
          standard: 'ISO 3685 Tool Life Testing Standards',
        },
      };
    }
    if (qLower.includes('summary') || qLower.includes('shift') || qLower.includes('handoff')) {
      return {
        text: `Shift A Executive Handoff Report:\n• Total Output: 2,453 / 3,200 parts (76.6% target achieved)\n• First Pass Yield: 98.24% (44 parts quarantined to Bin #02)\n• Critical Machine Status: CNC-07 under 78% speed override for spindle bearing maintenance; all other 11 CNCs nominal.\n• Open Work Orders: #WO-8941 scheduled for 22:00 PM LOTO shutdown.`,
        citation: {
          anomaly: 'Plant-wide Shift A Production Telemetry',
          rootCause: 'Minor cycle time dilation on CNC-07 due to vibration override',
          action: 'Transfer pending batch schedule to Shift B operator team',
          standard: 'ISA-95 Enterprise-Control Integration',
        },
      };
    }
    return {
      text: `Context evaluation for ${machineId}: Live PLC tags are operating within nominal 6-Sigma boundaries. Edge neural model reports zero safety zone breaches and 99.8% vector similarity to standard manufacturing operating procedures.`,
    };
  };

  const handleApplyOpcOverride = () => {
    setOpcExecutionSuccess(
      '⚡ [OPC-UA CONFIRMED] Node ns=2;s=CNC07.Spindle.SpeedOverride set to 78% · Acknowledged by Siemens Sinumerik 840D sl in 18ms. Spindle stabilized at 6,400 RPM (Vibration 4.9 mm/s · ISO Zone B).'
    );
    setTimeout(() => setOpcExecutionSuccess(null), 8000);
  };

  const handleDispatchCmms = () => {
    setCmmsSuccess(
      '🛠️ [CMMS WORK ORDER ISSUED] Ticket #WO-8941 dispatched to Mechanical Maintenance (Priority: HIGH). Replacement cartridge: SKF 7014-CE/HCP4A. Assigned technician: R. Sharma.'
    );
    setTimeout(() => setCmmsSuccess(null), 8000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'turn-reset',
        role: 'system',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        text: 'Diagnostic session reset. Ready for live shop floor queries.',
      },
    ]);
  };

  return (
    <section className="section-wrapper">
      {/* Hero Header with Industrial Status Bar */}
      <div className="section-header-modern">
        <div>
          <div className="hero-badge-tag">
            <span className="dot-live" />
            <span>Industrial RAG Engine · Llama 3.3 70B &amp; Factory Knowledge Graph</span>
          </div>
          <h1 className="page-hero-title">Factory AI Copilot &amp; Autonomous Diagnostics</h1>
          <p className="page-hero-desc">
            Mission-critical generative intelligence trained on Fanuc &amp; Siemens PLC telemetry, ISO 230 metrology standards, and 1,480+ machine shop engineering manuals.
          </p>
        </div>

        <div className="ai-system-status-pill">
          <div className="ai-status-row">
            <span className="ai-status-k">Telemetry Context:</span>
            <span className="ai-status-v">12 CNCs (Live 100 Hz OPC-UA)</span>
          </div>
          <div className="ai-status-row">
            <span className="ai-status-k">Knowledge Base:</span>
            <span className="ai-status-v">1,482 SOPs · 99.8% Index Sync</span>
          </div>
        </div>
      </div>

      {/* Copilot Persona Selector Bar */}
      <div className="copilot-persona-bar">
        <button
          type="button"
          className={`copilot-persona-btn ${activePersona === 'rca' ? 'active' : ''}`}
          onClick={() => setActivePersona('rca')}
        >
          <span>🛠️ Predictive Maintenance &amp; RCA</span>
        </button>
        <button
          type="button"
          className={`copilot-persona-btn ${activePersona === 'metrology' ? 'active' : ''}`}
          onClick={() => setActivePersona('metrology')}
        >
          <span>🔬 Metrology &amp; Defect Analysis</span>
        </button>
        <button
          type="button"
          className={`copilot-persona-btn ${activePersona === 'tooling' ? 'active' : ''}`}
          onClick={() => setActivePersona('tooling')}
        >
          <span>⚡ Spindle &amp; Tool Wear Dynamics</span>
        </button>
        <button
          type="button"
          className={`copilot-persona-btn ${activePersona === 'sop' ? 'active' : ''}`}
          onClick={() => setActivePersona('sop')}
        >
          <span>📋 Shift Handover &amp; ISO SOPs</span>
        </button>
      </div>

      <div className="assistant-layout-grid-modern">
        {/* Left Column: Industrial Chat Console */}
        <div className="assistant-console-panel">
          {/* Console Header */}
          <div className="assistant-console-hdr">
            <div className="console-identity">
              <div className="console-bot-avatar">
                <BotIcon size={18} color="#FFFFFF" />
              </div>
              <div className="console-title-wrap">
                <div className="console-title-row">
                  <span className="console-name">Factory AI Copilot</span>
                  <span className="console-model-badge">Llama-3.3-70B · TensorRT</span>
                  <span className="console-live-tag">
                    <span className="dot-live" /> Connected
                  </span>
                </div>
                <div className="console-sub">Live shop floor telemetry ingestion active</div>
              </div>
            </div>

            <div className="console-hdr-actions">
              {/* Machine Context Dropdown */}
              <div className="ai-context-dropdown-wrap">
                <span className="context-label">Context Target:</span>
                <select
                  value={selectedMachineContext}
                  onChange={(e) => setSelectedMachineContext(e.target.value)}
                  className="ai-context-select"
                >
                  <option value="CNC-07">CNC-07 (Spindle Anomaly · Line 2)</option>
                  <option value="CNC-03">CNC-03 (Cycle Time Drift · Line 1)</option>
                  <option value="CNC-09">CNC-09 (Coolant Alert · Line 3)</option>
                  <option value="CAM-04">Camera Sorter CAM-04 (Quality Vision)</option>
                  <option value="ALL">Entire Facility (All 12 CNCs)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearChat}
                className="console-clear-btn"
                title="Reset active diagnostic session"
              >
                Clear Log
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          <div className="ai-active-context-bar">
            <div className="context-bar-left">
              <span className="context-badge-icon">🎯</span>
              <span>Focus Machine: <strong>{selectedMachineContext === 'ALL' ? 'Plant-wide Fleet' : selectedMachineContext}</strong></span>
              <span className="bar-separator">•</span>
              <span>Active Shift: <strong>Shift A (06:00 - 14:00)</strong></span>
              <span className="bar-separator">•</span>
              <span>Operator: <strong>Suraj Singh (Lead Machinist)</strong></span>
            </div>
            <button
              type="button"
              className="quick-ctx-action"
              onClick={() => {
                if (selectedMachineContext !== 'ALL') openMachineDetail(selectedMachineContext);
              }}
            >
              {selectedMachineContext !== 'ALL' ? `Inspect ${selectedMachineContext} Telemetry →` : 'View Fleet Overview →'}
            </button>
          </div>

          {/* Messages Body */}
          <div className="assistant-messages-body-modern">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.role}`}>
                {msg.role === 'bot' && (
                  <div className="chat-avatar bot-avatar">
                    <BotIcon size={14} color="#00A389" />
                  </div>
                )}

                <div className={`chat-bubble-card-modern ${msg.role}`}>
                  {msg.role === 'bot' && (
                    <div className="chat-bubble-meta-header">
                      <span className="bubble-source-tag">COPILOT ENGINE</span>
                      <span className="bubble-timestamp">{msg.timestamp}</span>
                      <span className="rag-verified-tag">
                        <CheckIcon size={11} color="#10B981" /> RAG Telemetry Grounded
                      </span>
                    </div>
                  )}

                  <div className="chat-bubble-content">
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>

                    {/* Inline FFT Frequency Spectrum Graph for Root-Cause Diagnostic */}
                    {msg.hasFftChart && (
                      <div className="fft-spectrum-card">
                        <div className="fft-header-row">
                          <span className="fft-title">
                            <span>📈</span> CNC-07 High-Frequency FFT Spectrum (0 - 2,000 Hz)
                          </span>
                          <span className="fft-iso-badge">ISO 10816 Zone C: 8.4 mm/s</span>
                        </div>
                        <div className="fft-svg-container">
                          <svg viewBox="0 0 400 95" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                            {/* Grid lines */}
                            <line x1="0" y1="20" x2="400" y2="20" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
                            <line x1="0" y1="45" x2="400" y2="45" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
                            <line x1="0" y1="70" x2="400" y2="70" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />

                            {/* ISO Warning Threshold Line (6.0 mm/s) */}
                            <line x1="0" y1="35" x2="400" y2="35" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" />
                            <text x="290" y="31" fill="#F59E0B" fontSize="8" fontFamily="monospace">ISO Limit (6.0 mm/s)</text>

                            {/* Frequency Harmonic Curve */}
                            <path
                              d="M 10,85 Q 25,82 30,55 Q 35,84 60,82 Q 70,80 75,60 Q 80,82 120,83 Q 160,84 190,83 Q 230,82 245,83 Q 270,82 284,18 Q 295,84 330,83 Q 360,82 390,85"
                              fill="none"
                              stroke="#00F0FF"
                              strokeWidth="1.5"
                            />

                            {/* 1X (137 Hz) */}
                            <circle cx="30" cy="55" r="3" fill="#38BDF8" />
                            <text x="20" y="50" fill="#94A3B8" fontSize="7.5" fontFamily="monospace">1X (137Hz)</text>

                            {/* 2X Harmonic (274 Hz) */}
                            <circle cx="75" cy="60" r="3" fill="#38BDF8" />
                            <text x="68" y="54" fill="#94A3B8" fontSize="7.5" fontFamily="monospace">2X</text>

                            {/* BPFI Peak (1,420 Hz @ 8.4 mm/s) */}
                            <circle cx="284" cy="18" r="4" fill="#EF4444" />
                            <text x="215" y="14" fill="#EF4444" fontSize="8" fontWeight="bold" fontFamily="monospace">
                              BPFI Peak: 1,420 Hz (8.4 mm/s)
                            </text>
                          </svg>
                        </div>
                        <div className="fft-footer-legend">
                          <span>Resolution: 1.25 Hz · Hanning Window</span>
                          <span>Ingestion: 100 Hz OPC-UA Fast Ring</span>
                        </div>
                      </div>
                    )}

                    {/* Rich simulated AI Diagnostic block for bot messages */}
                    {msg.citation && (
                      <div className="chat-telemetry-citation">
                        <div className="citation-header">
                          <span className="citation-icon">📊</span>
                          <span>Live Ingestion Telemetry Citations</span>
                        </div>
                        <div className="citation-grid">
                          <div className="citation-item">
                            <span className="c-key">Active Anomaly:</span>
                            <span className="c-val warning">{msg.citation.anomaly}</span>
                          </div>
                          <div className="citation-item">
                            <span className="c-key">Root Cause Prob:</span>
                            <span className="c-val">{msg.citation.rootCause}</span>
                          </div>
                          <div className="citation-item">
                            <span className="c-key">Recommended Action:</span>
                            <span className="c-val">{msg.citation.action}</span>
                          </div>
                          <div className="citation-item">
                            <span className="c-key">Standard Ref:</span>
                            <span className="c-val">{msg.citation.standard}</span>
                          </div>
                        </div>

                        <div className="citation-actions">
                          <button
                            type="button"
                            className="btn-cite-action primary"
                            onClick={handleApplyOpcOverride}
                          >
                            ⚡ Apply 78% Spindle Override via OPC-UA
                          </button>
                          <button
                            type="button"
                            className="btn-cite-action"
                            onClick={handleDispatchCmms}
                          >
                            🛠️ Dispatch Work Order #WO-8941
                          </button>
                        </div>

                        {opcExecutionSuccess && (
                          <div className="opc-action-confirmed-banner">
                            <span>{opcExecutionSuccess}</span>
                          </div>
                        )}

                        {cmmsSuccess && (
                          <div className="opc-action-confirmed-banner" style={{ color: '#0EA5E9', borderColor: 'rgba(14, 165, 233, 0.4)', background: 'rgba(14, 165, 233, 0.1)' }}>
                            <span>{cmmsSuccess}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="chat-user-meta">
                      <span>{msg.author || 'Suraj Singh'} · {msg.timestamp}</span>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="chat-avatar user-avatar">
                    <span>SS</span>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bot">
                <div className="chat-avatar bot-avatar">
                  <BotIcon size={14} color="#00A389" />
                </div>
                <div className="chat-bubble-card-modern bot" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}>
                  <span className="dot-live" />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ingesting OPC-UA telemetry &amp; querying shop manuals...</span>
                </div>
              </div>
            )}
            <div ref={logEndRef} />
          </div>

          {/* Input Tray */}
          <div className="assistant-input-tray-modern">
            <div className="input-prompt-pills">
              <span className="quick-prompt-label">Quick Prompts:</span>
              {activePersona === 'rca' && (
                <>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery(`What is causing high spindle vibration on ${selectedMachineContext}?`)}
                  >
                    Diagnose {selectedMachineContext}
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('Explain the 1,420 Hz BPFI peak and ISO 10816-3 limits')}
                  >
                    BPFI Harmonic Limits
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('Estimate remaining useful life before bearing replacement')}
                  >
                    Estimate Remaining RUL
                  </button>
                </>
              )}
              {activePersona === 'metrology' && (
                <>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('Analyze CAM-04 vision sorter false reject rate')}
                  >
                    Audit Vision Sorter Rejects
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('What is the current Cpk capability for housing outer diameter?')}
                  >
                    Inspect Cpk Capability
                  </button>
                </>
              )}
              {activePersona === 'tooling' && (
                <>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('Predict remaining tool life for Tool T05 across Line 2')}
                  >
                    Tool T05 Wear Life
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('Analyze spindle torque vs feed rate drift on roughing operations')}
                  >
                    Spindle Torque vs Feed
                  </button>
                </>
              )}
              {activePersona === 'sop' && (
                <>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('Summarize today shift A production, scrap rate, and downtime Pareto')}
                  >
                    Shift A Summary
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-btn"
                    onClick={() => handleSendQuery('Retrieve SOP-MNT-402: Emergency Spindle Bearing Replacement guidelines')}
                  >
                    SOP-MNT-402 LOTO Steps
                  </button>
                </>
              )}
            </div>

            <div className="input-field-wrapper">
              <span className="input-prefix-icon">💬</span>
              <input
                type="text"
                className="assistant-text-field-modern"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuery(inputVal);
                }}
                placeholder="Ask anything in natural language (e.g. 'Why is CNC-07 vibrating?' or 'Draft shift handoff log')..."
              />
              <button
                type="button"
                className="assistant-submit-btn-modern"
                onClick={() => handleSendQuery(inputVal)}
              >
                Send Request →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real Industrial Diagnostics & Prompt Cards */}
        <div className="assistant-sidebar-cards">
          {/* Card 1: Active SCADA Telemetry Anomalies Requiring AI Diagnosis */}
          <div className="copilot-action-card">
            <div className="action-card-header">
              <div className="action-card-title-wrap">
                <span className="card-badge-dot red" />
                <h3 className="action-card-title">Active Telemetry Anomalies</h3>
              </div>
              <span className="action-card-badge">3 Alarms</span>
            </div>
            <p className="action-card-sub">Real-time alerts detected by high-speed edge telemetry</p>

            <div className="anomaly-items-list">
              <div className="anomaly-item-box critical">
                <div className="anomaly-item-top">
                  <span className="anomaly-mach">CNC-07 · Line 2</span>
                  <span className="anomaly-sev critical">CRITICAL</span>
                </div>
                <div className="anomaly-name">Spindle Vibration 8.4 mm/s (&gt;6.0 limit)</div>
                <div className="anomaly-metric">RMS Acceleration: 1.42g · Bearing Temp: 64.2°C</div>
                <button
                  type="button"
                  className="anomaly-ai-btn"
                  onClick={() => handleSendQuery('Provide root cause diagnosis and recommended mitigation for CNC-07 spindle vibration exceeding 8.4 mm/s')}
                >
                  <BotIcon size={12} color="currentColor" />
                  <span>Run AI Root-Cause Diagnostic →</span>
                </button>
              </div>

              <div className="anomaly-item-box warning">
                <div className="anomaly-item-top">
                  <span className="anomaly-mach">CNC-03 · Line 1</span>
                  <span className="anomaly-sev warning">WARNING</span>
                </div>
                <div className="anomaly-name">Cycle Time Anomaly (+16.1% vs Baseline)</div>
                <div className="anomaly-metric">Cycle: 48.2s (Baseline: 41.5s) · Step: Rough Milling</div>
                <button
                  type="button"
                  className="anomaly-ai-btn"
                  onClick={() => handleSendQuery('Analyze G-code feed rate and cutting resistance causing cycle time delay on CNC-03')}
                >
                  <BotIcon size={12} color="currentColor" />
                  <span>Analyze Feed &amp; Tool Wear →</span>
                </button>
              </div>

              <div className="anomaly-item-box warning">
                <div className="anomaly-item-top">
                  <span className="anomaly-mach">CNC-09 · Line 3</span>
                  <span className="anomaly-sev warning">WARNING</span>
                </div>
                <div className="anomaly-name">Coolant Temperature High (38.2°C)</div>
                <div className="anomaly-metric">Limit: 35.0°C · Flow Rate: 18.2 L/min</div>
                <button
                  type="button"
                  className="anomaly-ai-btn"
                  onClick={() => handleSendQuery('Diagnose coolant thermal spike on CNC-09 and check heat exchanger pump telemetry')}
                >
                  <BotIcon size={12} color="currentColor" />
                  <span>Check Heat Exchanger Health →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Standard Operating Procedure (SOP) Library */}
          <div className="copilot-action-card">
            <div className="action-card-header">
              <div className="action-card-title-wrap">
                <span className="card-badge-dot green" />
                <h3 className="action-card-title">Factory SOP &amp; Manuals Library</h3>
              </div>
              <span className="action-card-badge">1,482 Docs</span>
            </div>
            <p className="action-card-sub">Instant retrieval across OEM specifications and calibration logs</p>

            <div className="sop-quick-list">
              <button
                type="button"
                className="sop-doc-item"
                onClick={() => handleSendQuery('Retrieve SOP-MNT-402: Emergency Spindle Bearing Replacement and LOTO guidelines')}
              >
                <div className="sop-doc-icon">📖</div>
                <div className="sop-doc-info">
                  <div className="sop-doc-title">SOP-MNT-402: Spindle Bearing Overhaul</div>
                  <div className="sop-doc-meta">DMG MORI DMU 50 · Rev 4.2 · Updated Oct 2026</div>
                </div>
                <span className="sop-doc-arrow">→</span>
              </button>

              <button
                type="button"
                className="sop-doc-item"
                onClick={() => handleSendQuery('Retrieve SOP-QLT-108: Optical Vision Camera Calibration & Lighting Thresholds')}
              >
                <div className="sop-doc-icon">📐</div>
                <div className="sop-doc-info">
                  <div className="sop-doc-title">SOP-QLT-108: Vision Sorter Calibration</div>
                  <div className="sop-doc-meta">Keyence CV-X Optical System · Rev 2.1</div>
                </div>
                <span className="sop-doc-arrow">→</span>
              </button>

              <button
                type="button"
                className="sop-doc-item"
                onClick={() => handleSendQuery('Retrieve SOP-SAF-001: Autonomous Cell Safety Zone Lockout & E-Stop Protocols')}
              >
                <div className="sop-doc-icon">🛡️</div>
                <div className="sop-doc-info">
                  <div className="sop-doc-title">SOP-SAF-001: Safety Zone E-Stop Lockout</div>
                  <div className="sop-doc-meta">OSHA 1910.147 Compliant · Plant 01 Protocol</div>
                </div>
                <span className="sop-doc-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Card 3: RAG Knowledge Base Architecture Status */}
          <div className="copilot-action-card rag-spec-card">
            <div className="action-card-header">
              <div className="action-card-title-wrap">
                <span className="card-badge-dot teal" />
                <h3 className="action-card-title">Autonomous Knowledge Graph</h3>
              </div>
              <span className="rag-status-badge">Operational</span>
            </div>

            <div className="rag-stats-metrics-grid">
              <div className="rag-stat-tile">
                <div className="rag-stat-lbl">Vector Embeddings</div>
                <div className="rag-stat-val">284,912</div>
                <div className="rag-stat-sub">Dense HNSW index</div>
              </div>
              <div className="rag-stat-tile">
                <div className="rag-stat-lbl">Real-time PLC Tags</div>
                <div className="rag-stat-val">2,480 /sec</div>
                <div className="rag-stat-sub">OPC-UA + MTConnect</div>
              </div>
              <div className="rag-stat-tile">
                <div className="rag-stat-lbl">Mean Query Latency</div>
                <div className="rag-stat-val">240 ms</div>
                <div className="rag-stat-sub">NVIDIA TensorRT-LLM</div>
              </div>
              <div className="rag-stat-tile">
                <div className="rag-stat-lbl">Citation Accuracy</div>
                <div className="rag-stat-val">99.4%</div>
                <div className="rag-stat-sub">Grounded telemetry</div>
              </div>
            </div>

            <div className="rag-footer-note">
              <span>Security: ISO 27001 On-Prem Edge Appliance · Zero Cloud Exfiltration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
