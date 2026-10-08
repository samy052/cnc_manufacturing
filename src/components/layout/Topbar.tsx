'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import { Language, SectionType } from '@/types';
import { GlobeIcon } from '@/components/common/Icons';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
];

const NAVIGATION_SCREENS: { id: SectionType; title: string; category: string; icon: string }[] = [
  { id: 'overview', title: 'Plant Overview', category: 'Operations', icon: '📊' },
  { id: 'production', title: 'Production Analytics', category: 'Operations', icon: '📈' },
  { id: 'collection', title: 'Data Collection & Edge DAQ', category: 'System', icon: '📡' },
  { id: 'vision', title: 'Camera Vision & Quality AI', category: 'Quality', icon: '👁️' },
  { id: 'maintenance', title: 'Predictive Maintenance & Alarms', category: 'Maintenance', icon: '🛠️' },
  { id: 'downtime', title: 'Downtime Pareto & Root Cause', category: 'Operations', icon: '⏱️' },
  { id: 'optimization', title: 'Energy & Feed Optimization', category: 'Analytics', icon: '⚡' },
  { id: 'traceability', title: 'Lot Traceability & Genealogy', category: 'Quality', icon: '🏷️' },
  { id: 'smart_kpi', title: 'Smart Factory KPI Central', category: 'Analytics', icon: '🎯' },
  { id: 'edge_signals', title: 'Edge Signals & High-Speed DAQ', category: 'System', icon: '📉' },
];

export default function Topbar() {
  const {
    activeSection,
    setActiveSection,
    toggleSidebar,
    clockTime,
    theme,
    toggleTheme,
    warningMachinesCount,
    isLive,
    toggleLive,
    language,
    setLanguage,
    machines,
    openMachineDetail,
  } = useFoundry();

  // Dropdown states
  const [selectedPlant, setSelectedPlant] = useState('Plant 01');
  const [selectedLine, setSelectedLine] = useState('Plant 01 > Heavy Bay > Line 2');
  const [selectedShift, setSelectedShift] = useState('Shift A (06:00 - 14:00)');
  const [selectedDate, setSelectedDate] = useState('Today');

  // Popover controls
  type PopoverType = 'plant' | 'line' | 'shift' | 'date' | 'alarms' | 'profile' | 'search' | 'lang' | null;
  const [activePopover, setActivePopover] = useState<PopoverType>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const topbarRef = useRef<HTMLElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (topbarRef.current && !topbarRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActivePopover(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActivePopover((prev) => (prev === 'search' ? null : 'search'));
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto focus search input when search popover opens
  useEffect(() => {
    if (activePopover === 'search') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [activePopover]);

  const togglePopover = (name: PopoverType) => {
    setActivePopover((prev) => (prev === name ? null : name));
  };

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return {
        machines: machines.slice(0, 6),
        screens: NAVIGATION_SCREENS.slice(0, 4),
        alarms: [
          { id: 'CNC-07', text: 'Spindle vibration above threshold (8.4 mm/s)', severity: 'Critical', line: 'Line 2' },
          { id: 'CNC-03', text: 'Cycle time increased 48.2s (Baseline 41.5s)', severity: 'Warning', line: 'Line 1' },
          { id: 'CNC-09', text: 'Coolant temperature high 38.2°C (Limit 35°C)', severity: 'Warning', line: 'Line 3' },
        ],
      };
    }

    const filteredMachines = machines.filter(
      (m) =>
        (m.id?.toLowerCase() || '').includes(q) ||
        (m.name?.toLowerCase() || '').includes(q) ||
        (m.line?.toLowerCase() || '').includes(q) ||
        (m.workpiece?.toLowerCase() || '').includes(q) ||
        (m.model?.toLowerCase() || '').includes(q)
    );

    const filteredScreens = NAVIGATION_SCREENS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );

    const alarmsList = [
      { id: 'CNC-07', text: 'Spindle vibration above threshold (8.4 mm/s)', severity: 'Critical', line: 'Line 2' },
      { id: 'CNC-03', text: 'Cycle time increased 48.2s (Baseline 41.5s)', severity: 'Warning', line: 'Line 1' },
      { id: 'CNC-09', text: 'Coolant temperature high 38.2°C (Limit 35°C)', severity: 'Warning', line: 'Line 3' },
      { id: 'CNC-02', text: 'Tool wear threshold at 72% (Life remaining: 48m)', severity: 'Info', line: 'Line 1' },
    ].filter((a) => a.id.toLowerCase().includes(q) || a.text.toLowerCase().includes(q) || a.line.toLowerCase().includes(q));

    return {
      machines: filteredMachines,
      screens: filteredScreens,
      alarms: alarmsList,
    };
  }, [searchQuery, machines]);

  return (
    <header className="topbar-theme" ref={topbarRef}>
      {/* Mobile Drawer Toggle */}
      <button
        className="menu-btn-theme"
        onClick={toggleSidebar}
        aria-label="Toggle navigation drawer"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Topbar Left Controls */}
      <div className="topbar-left-controls">
        {/* Plant selector */}
        <div className="topbar-popover-wrap">
          <button
            type="button"
            className={`topbar-select-pill ${activePopover === 'plant' ? 'active' : ''}`}
            onClick={() => togglePopover('plant')}
            aria-label="Select Plant"
            title="Switch Manufacturing Facility"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="topbar-pill-icon">
              <path d="M2 20h20M6 20V8l6-4v16M14 20v-8l4-3v11" />
            </svg>
            <span className="pill-val">{selectedPlant}</span>
            <span className="select-arrow">▾</span>
          </button>

          {activePopover === 'plant' && (
            <div className="topbar-dropdown-menu">
              <div className="dropdown-header">Manufacturing Facilities</div>
              <button
                type="button"
                className={`dropdown-item ${selectedPlant === 'Plant 01' ? 'selected' : ''}`}
                onClick={() => { setSelectedPlant('Plant 01'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Plant 01 (Chennai Aerospace)</span>
                  <span className="item-sub">12 High-Speed CNCs · 98.2% Line Availability</span>
                </div>
                {selectedPlant === 'Plant 01' && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`dropdown-item ${selectedPlant === 'Plant 02' ? 'selected' : ''}`}
                onClick={() => { setSelectedPlant('Plant 02'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Plant 02 (Bangalore Precision)</span>
                  <span className="item-sub">8 5-Axis VMCs · Active Batch #P02-841</span>
                </div>
                {selectedPlant === 'Plant 02' && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`dropdown-item ${selectedPlant === 'Plant 03' ? 'selected' : ''}`}
                onClick={() => { setSelectedPlant('Plant 03'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Plant 03 (Pune Heavy Stamping)</span>
                  <span className="item-sub">16 Presses & Cells · Live Stream Standby</span>
                </div>
                {selectedPlant === 'Plant 03' && <span className="check-mark">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Line breadcrumb selector */}
        <div className="topbar-popover-wrap hide-on-mobile">
          <button
            type="button"
            className={`topbar-select-pill ${activePopover === 'line' ? 'active' : ''}`}
            onClick={() => togglePopover('line')}
            aria-label="Select Bay and Line"
            title="Filter by Bay or Production Line"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="topbar-pill-icon">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M9 6h7a3 3 0 0 1 3 3v2" />
              <path d="M9 18h4a3 3 0 0 0 3-3v-4" />
              <polyline points="13 8 16 11 19 8" />
            </svg>
            <span className="pill-val">Heavy Bay &gt; Line 2</span>
            <span className="select-arrow">▾</span>
          </button>

          {activePopover === 'line' && (
            <div className="topbar-dropdown-menu">
              <div className="dropdown-header">Production Cells & Bays</div>
              <button
                type="button"
                className={`dropdown-item ${selectedLine === 'Plant 01 > Heavy Bay > Line 2' ? 'selected' : ''}`}
                onClick={() => { setSelectedLine('Plant 01 > Heavy Bay > Line 2'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Plant 01 &gt; Heavy Bay &gt; Line 2</span>
                  <span className="item-sub">CNC-04 to CNC-08 · Crankshafts & Blocks</span>
                </div>
                {selectedLine === 'Plant 01 > Heavy Bay > Line 2' && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`dropdown-item ${selectedLine === 'Plant 01 > Aero Bay > Line 1' ? 'selected' : ''}`}
                onClick={() => { setSelectedLine('Plant 01 > Aero Bay > Line 1'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Plant 01 &gt; Aero Bay &gt; Line 1</span>
                  <span className="item-sub">CNC-01 to CNC-03 · Titanium Impellers</span>
                </div>
                {selectedLine === 'Plant 01 > Aero Bay > Line 1' && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`dropdown-item ${selectedLine === 'Plant 01 > Robotic Cell > Line 3' ? 'selected' : ''}`}
                onClick={() => { setSelectedLine('Plant 01 > Robotic Cell > Line 3'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Plant 01 &gt; Robotic Cell &gt; Line 3</span>
                  <span className="item-sub">CNC-09 to CNC-12 · High-Precision Finishing</span>
                </div>
                {selectedLine === 'Plant 01 > Robotic Cell > Line 3' && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`dropdown-item ${selectedLine === 'All Lines' ? 'selected' : ''}`}
                onClick={() => { setSelectedLine('All Lines'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">All Lines (Bay 1-3 Consolidated)</span>
                  <span className="item-sub">Aggregated Real-time Plant Stream</span>
                </div>
                {selectedLine === 'All Lines' && <span className="check-mark">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Shift selector */}
        <div className="topbar-popover-wrap hide-on-tablet">
          <button
            type="button"
            className={`topbar-select-pill ${activePopover === 'shift' ? 'active' : ''}`}
            onClick={() => togglePopover('shift')}
            aria-label="Select Shift"
            title="Filter by Work Shift"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="topbar-pill-icon">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="pill-val">Shift A</span>
            <span className="select-arrow">▾</span>
          </button>

          {activePopover === 'shift' && (
            <div className="topbar-dropdown-menu">
              <div className="dropdown-header">Work Shift Roster</div>
              <button
                type="button"
                className={`dropdown-item ${selectedShift.startsWith('Shift A') ? 'selected' : ''}`}
                onClick={() => { setSelectedShift('Shift A (06:00 - 14:00)'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Shift A (06:00 - 14:00) · Active</span>
                  <span className="item-sub">Suraj Singh (Lead) · 84.4% Target Progress</span>
                </div>
                {selectedShift.startsWith('Shift A') && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`dropdown-item ${selectedShift.startsWith('Shift B') ? 'selected' : ''}`}
                onClick={() => { setSelectedShift('Shift B (14:00 - 22:00)'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Shift B (14:00 - 22:00) · Upcoming</span>
                  <span className="item-sub">Rajesh Verma (Lead) · Tool Swap Scheduled</span>
                </div>
                {selectedShift.startsWith('Shift B') && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`dropdown-item ${selectedShift.startsWith('Shift C') ? 'selected' : ''}`}
                onClick={() => { setSelectedShift('Shift C (22:00 - 06:00)'); setActivePopover(null); }}
              >
                <div className="item-main">
                  <span className="item-title">Shift C (22:00 - 06:00) · Night Window</span>
                  <span className="item-sub">Kiran Das (Lead) · Automated Lights-out Run</span>
                </div>
                {selectedShift.startsWith('Shift C') && <span className="check-mark">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Date selector */}
        <div className="topbar-popover-wrap hide-on-mobile">
          <button
            type="button"
            className={`topbar-select-pill date-pill ${activePopover === 'date' ? 'active' : ''}`}
            onClick={() => togglePopover('date')}
            aria-label="Select Date Range"
            title="Select Reporting Interval"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="topbar-pill-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="pill-val">{selectedDate}</span>
            <span className="select-arrow">▾</span>
          </button>

          {activePopover === 'date' && (
            <div className="topbar-dropdown-menu">
              <div className="dropdown-header">Historical Timeframe</div>
              {['Today', 'Yesterday', 'Last 7 Days', 'This Month'].map((dt) => (
                <button
                  key={dt}
                  type="button"
                  className={`dropdown-item ${selectedDate === dt ? 'selected' : ''}`}
                  onClick={() => { setSelectedDate(dt); setActivePopover(null); }}
                >
                  <div className="item-main">
                    <span className="item-title">{dt}</span>
                  </div>
                  {selectedDate === dt && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Data Badge with Pulse Ring */}
        <button
          type="button"
          className={`topbar-live-badge ${isLive ? 'active' : 'paused'}`}
          onClick={toggleLive}
          title={isLive ? 'High-speed MQTT 100 Hz active. Click to pause telemetry stream.' : 'Telemetry paused. Click to resume real-time ingestion.'}
        >
          <span className="live-dot-wrap">
            <span className="live-dot" />
            {isLive && <span className="live-pulse-ring" />}
          </span>
          <span className="live-label">{isLive ? 'Live Data' : 'Data Paused'}</span>
        </button>
      </div>

      {/* Center Search / Command Palette Trigger */}
      <div className="topbar-center-search">
        <button
          type="button"
          className="topbar-search-trigger"
          onClick={() => togglePopover('search')}
          aria-label="Search machines, alarms, lots"
          title="Quick Search & Jump (⌘K)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="search-placeholder">Search CNCs...</span>
          <kbd className="search-shortcut">⌘K</kbd>
        </button>

        {/* Global Search Popover / Modal */}
        {activePopover === 'search' && (
          <div className="topbar-search-modal">
            <div className="search-input-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type machine ID (e.g. CNC-07), alarm, line, or dashboard screen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-palette-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="search-results-container">
              {/* CNC Machines Results */}
              {searchResults.machines.length > 0 && (
                <div className="search-group">
                  <div className="group-title">
                    <span>CNC Machines & Workcells</span>
                    <span className="group-count">{searchResults.machines.length} matched</span>
                  </div>
                  <div className="group-items">
                    {searchResults.machines.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className="search-item machine-item"
                        onClick={() => {
                          openMachineDetail(m.id);
                          setActivePopover(null);
                        }}
                      >
                        <div className="item-id-badge">{m.id}</div>
                        <div className="item-details">
                          <div className="item-name-row">
                            <span className="item-name">{m.name}</span>
                            <span className={`status-pill status-${m.status}`}>{m.status.toUpperCase()}</span>
                          </div>
                          <div className="item-sub-row">
                            <span>{m.line}</span>
                            <span>•</span>
                            <span>Part: {m.workpiece}</span>
                            <span>•</span>
                            <span>{m.model}</span>
                          </div>
                        </div>
                        <span className="item-action-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Alarms Results */}
              {searchResults.alarms.length > 0 && (
                <div className="search-group">
                  <div className="group-title">
                    <span>Active Alarms & Telemetry Events</span>
                    <span className="group-count">{searchResults.alarms.length} items</span>
                  </div>
                  <div className="group-items">
                    {searchResults.alarms.map((a, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="search-item alarm-item"
                        onClick={() => {
                          openMachineDetail(a.id);
                          setActivePopover(null);
                        }}
                      >
                        <span className={`severity-tag severity-${a.severity.toLowerCase()}`}>{a.severity}</span>
                        <div className="item-details">
                          <div className="item-name-row">
                            <span className="item-name"><strong>{a.id}</strong> — {a.text}</span>
                          </div>
                          <div className="item-sub-row">
                            <span>{a.line}</span>
                            <span>•</span>
                            <span>Click to open machine diagnostic inspect</span>
                          </div>
                        </div>
                        <span className="item-action-arrow">Inspect</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Screens */}
              {searchResults.screens.length > 0 && (
                <div className="search-group">
                  <div className="group-title">
                    <span>Platform Navigation Hubs</span>
                    <span className="group-count">{searchResults.screens.length} screens</span>
                  </div>
                  <div className="group-items-grid">
                    {searchResults.screens.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`screen-item-chip ${activeSection === s.id ? 'active' : ''}`}
                        onClick={() => {
                          setActiveSection(s.id);
                          setActivePopover(null);
                        }}
                      >
                        <span className="screen-icon">{s.icon}</span>
                        <div className="screen-info">
                          <span className="screen-title">{s.title}</span>
                          <span className="screen-cat">{s.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.machines.length === 0 && searchResults.alarms.length === 0 && searchResults.screens.length === 0 && (
                <div className="search-empty">
                  <p>No matching machines, alarms, or screens found for &ldquo;{searchQuery}&rdquo;</p>
                  <span>Try searching for &quot;CNC-01&quot;, &quot;Vibration&quot;, &quot;Line 2&quot;, or &quot;Vision&quot;</span>
                </div>
              )}
            </div>

            <div className="search-modal-footer">
              <div className="shortcut-tips">
                <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
                <span><kbd>ESC</kbd> to close</span>
                <span><kbd>ENTER</kbd> to jump</span>
              </div>
              <div className="quick-filter-chips">
                <span className="filter-label">Quick Jumps:</span>
                <button type="button" onClick={() => { openMachineDetail('CNC-07'); setActivePopover(null); }}>CNC-07 (Critical)</button>
                <button type="button" onClick={() => { setActiveSection('maintenance'); setActivePopover(null); }}>Alarms Hub</button>
                <button type="button" onClick={() => { setActiveSection('downtime'); setActivePopover(null); }}>Downtime Pareto</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Topbar Right Controls */}
      <div className="topbar-right-controls">
        {/* Clock & Sync status */}
        <div className="topbar-clock-col hide-on-mobile">
          <div className="topbar-clock-text tabular">
            <span className="clock-val">{clockTime}</span>
            <span className="clock-tz">IST</span>
          </div>
          <div className="topbar-sync-text">
            <span className={`sync-indicator ${isLive ? 'sync-live' : 'sync-paused'}`} />
            <span>{isLive ? 'Synced 1 sec ago (100 Hz)' : 'Stream paused'}</span>
          </div>
        </div>

        {/* SCADA Notifications Bell Popover */}
        <div className="topbar-notif-wrap topbar-popover-wrap">
          <button
            type="button"
            className={`topbar-icon-btn ${activePopover === 'alarms' ? 'active' : ''}`}
            onClick={() => togglePopover('alarms')}
            aria-label="Active SCADA Alarms"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="topbar-notif-badge">{warningMachinesCount || 3}</span>
          </button>

          {/* Active SCADA Alarms Drawer Popover */}
          {activePopover === 'alarms' && (
            <div className="topbar-alarms-popover">
              <div className="alarms-popover-header">
                <div>
                  <div className="alarms-popover-title">Active SCADA Alarms</div>
                  <div className="alarms-popover-sub">1 Critical · 2 Warnings · Real-time Priority Queue</div>
                </div>
                <span className="alarms-live-tag">LIVE DAQ</span>
              </div>

              <div className="alarms-popover-list">
                {/* Alarm 1: CNC-07 */}
                <div className="alarm-popover-card critical">
                  <div className="alarm-card-top">
                    <span className="alarm-badge critical">CRITICAL</span>
                    <span className="alarm-time">3m ago</span>
                  </div>
                  <div className="alarm-card-machine">CNC-07 · Line 2 (Heavy Bay)</div>
                  <div className="alarm-card-msg">
                    Spindle vibration above threshold: <strong>8.4 mm/s</strong> (Limit: 6.0 mm/s)
                  </div>
                  <div className="alarm-card-telemetry">
                    <span>Spindle Load: 78%</span>
                    <span>•</span>
                    <span>Bearing Temp: 64.2°C</span>
                  </div>
                  <div className="alarm-card-actions">
                    <button
                      type="button"
                      className="alarm-btn-inspect"
                      onClick={() => {
                        openMachineDetail('CNC-07');
                        setActivePopover(null);
                      }}
                    >
                      Inspect CNC-07 →
                    </button>
                    <button
                      type="button"
                      className="alarm-btn-action"
                      onClick={() => {
                        setActiveSection('maintenance');
                        setActivePopover(null);
                      }}
                    >
                      AI Diagnostics
                    </button>
                  </div>
                </div>

                {/* Alarm 2: CNC-03 */}
                <div className="alarm-popover-card warning">
                  <div className="alarm-card-top">
                    <span className="alarm-badge warning">WARNING</span>
                    <span className="alarm-time">9m ago</span>
                  </div>
                  <div className="alarm-card-machine">CNC-03 · Line 1 (Aero Bay)</div>
                  <div className="alarm-card-msg">
                    Cycle time drift: <strong>48.2s</strong> (Baseline: 41.5s, +16.1%)
                  </div>
                  <div className="alarm-card-actions">
                    <button
                      type="button"
                      className="alarm-btn-inspect"
                      onClick={() => {
                        openMachineDetail('CNC-03');
                        setActivePopover(null);
                      }}
                    >
                      Inspect CNC-03 →
                    </button>
                  </div>
                </div>

                {/* Alarm 3: CNC-09 */}
                <div className="alarm-popover-card warning">
                  <div className="alarm-card-top">
                    <span className="alarm-badge warning">WARNING</span>
                    <span className="alarm-time">15m ago</span>
                  </div>
                  <div className="alarm-card-machine">CNC-09 · Line 3 (Robotic Cell)</div>
                  <div className="alarm-card-msg">
                    Coolant temperature high: <strong>38.2°C</strong> (Threshold: 35.0°C)
                  </div>
                  <div className="alarm-card-actions">
                    <button
                      type="button"
                      className="alarm-btn-inspect"
                      onClick={() => {
                        openMachineDetail('CNC-09');
                        setActivePopover(null);
                      }}
                    >
                      Inspect CNC-09 →
                    </button>
                  </div>
                </div>
              </div>

              <div className="alarms-popover-footer">
                <button
                  type="button"
                  className="view-all-alarms-btn"
                  onClick={() => {
                    setActiveSection('maintenance');
                    setActivePopover(null);
                  }}
                >
                  View All Alarms & Predictive Health Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language selector popover */}
        <div className="topbar-popover-wrap hide-on-mobile">
          <button
            type="button"
            className={`topbar-lang-pill-theme ${activePopover === 'lang' ? 'active' : ''}`}
            onClick={() => togglePopover('lang')}
            aria-label="Select Interface Language"
            title="Change Platform Language"
          >
            <GlobeIcon size={14} color="var(--text-secondary)" />
            <span className="lang-label">
              {language.toUpperCase()}
            </span>
            <span className="select-arrow-mini">▾</span>
          </button>

          {activePopover === 'lang' && (
            <div className="topbar-dropdown-menu lang-menu">
              <div className="dropdown-header">Interface Language</div>
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`dropdown-item ${language === item.code ? 'selected' : ''}`}
                  onClick={() => {
                    setLanguage(item.code);
                    setActivePopover(null);
                  }}
                >
                  <div className="item-main">
                    <span className="item-title">{item.label}</span>
                    <span className="item-sub">{item.native}</span>
                  </div>
                  {language === item.code && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle button */}
        <button
          className="topbar-theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Switch UI Theme"
          type="button"
          title={`Switch Theme (${theme === 'dark' ? 'Light' : 'Dark'} mode)`}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* User Profile with Operator Shift Console Popover */}
        <div className="topbar-popover-wrap">
          <button
            type="button"
            className={`topbar-user-profile ${activePopover === 'profile' ? 'active' : ''}`}
            onClick={() => togglePopover('profile')}
            aria-label="Operator & Shift Profile Console"
            title="Suraj Singh · Senior Plant Operator"
          >
            <div className="user-avatar-teal">
              <span>SS</span>
              <span className="operator-presence-dot" />
            </div>
            <div className="user-meta hide-on-mobile">
              <div className="user-name-row">
                <span className="user-name">Suraj Singh</span>
                <span className="select-arrow-mini">▾</span>
              </div>
              <span className="user-role">Plant Operator · Shift A</span>
            </div>
          </button>

          {/* Operator Profile Popover Console */}
          {activePopover === 'profile' && (
            <div className="topbar-profile-popover">
              <div className="profile-popover-header">
                <div className="profile-badge-avatar">SS</div>
                <div className="profile-badge-meta">
                  <div className="profile-badge-name">Suraj Singh</div>
                  <div className="profile-badge-role">Lead CNC Machinist & Line Lead</div>
                  <div className="profile-badge-id">Badge ID: #OP-48291 · Heavy Bay</div>
                </div>
              </div>

              <div className="profile-stats-grid">
                <div className="profile-stat-box">
                  <div className="stat-label">Assigned Station</div>
                  <div className="stat-val">Heavy Bay · Line 2</div>
                  <div className="stat-sub">5 Active CNCs</div>
                </div>
                <div className="profile-stat-box">
                  <div className="stat-label">Shift Duration</div>
                  <div className="stat-val">06:00 - 14:00</div>
                  <div className="stat-sub">Shift A (5h 12m elapsed)</div>
                </div>
                <div className="profile-stat-box">
                  <div className="stat-label">Shift Production</div>
                  <div className="stat-val">3,800 / 4,500</div>
                  <div className="stat-sub">84.4% Target met</div>
                </div>
                <div className="profile-stat-box">
                  <div className="stat-label">Safety Compliance</div>
                  <div className="stat-val" style={{ color: '#10B981' }}>100% Green</div>
                  <div className="stat-sub">Zero LOTO breaches</div>
                </div>
              </div>

              <div className="profile-actions-list">
                <button
                  type="button"
                  className="profile-action-btn"
                  onClick={() => {
                    setActiveSection('overview');
                    setActivePopover(null);
                  }}
                >
                  <span className="action-icon">📊</span>
                  <div className="action-info">
                    <span className="action-title">Plant Overview Dashboard</span>
                    <span className="action-sub">View master shop floor monitoring</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="profile-action-btn"
                  onClick={() => {
                    setActiveSection('downtime');
                    setActivePopover(null);
                  }}
                >
                  <span className="action-icon">📝</span>
                  <div className="action-info">
                    <span className="action-title">Shift Handover & Downtime Log</span>
                    <span className="action-sub">Prepare shift B transition report</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="profile-action-btn"
                  onClick={() => {
                    setActiveSection('collection');
                    setActivePopover(null);
                  }}
                >
                  <span className="action-icon">📡</span>
                  <div className="action-info">
                    <span className="action-title">Edge Gateway Diagnostics</span>
                    <span className="action-sub">Node: BLR-P01-GATEWAY (12ms ping)</span>
                  </div>
                </button>
              </div>

              <div className="profile-popover-footer">
                <div className="system-stamp">
                  <span>Foundry OS v2.4.8 Enterprise</span>
                  <span>•</span>
                  <span>OPC-UA v1.04</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
