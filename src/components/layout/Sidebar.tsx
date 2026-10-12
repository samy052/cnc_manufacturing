'use client';

import React, { useState } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import { SectionType } from '@/types';

interface NavGroupItem {
  key: string;
  section: SectionType;
  label: string;
  badge?: number | string;
  icon: React.ReactNode;
}

interface NavGroup {
  category: string;
  items: NavGroupItem[];
}

export default function Sidebar() {
  const { activeSection, setActiveSection, isSidebarOpen, closeSidebar, isLive, toggleLive, t, warningMachinesCount } = useFoundry();
  const [selectedKey, setSelectedKey] = useState<string>('overview');

  const handleNavClick = (item: NavGroupItem) => {
    setSelectedKey(item.key);
    setActiveSection(item.section);
    closeSidebar();
  };

  const navGroups: NavGroup[] = [
    {
      category: t.categories.operations,
      items: [
        {
          key: 'overview',
          section: 'overview',
          label: t.nav.overview,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ),
        },
        {
          key: 'production',
          section: 'production',
          label: t.nav.production,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          ),
        },
        {
          key: 'collection',
          section: 'collection',
          label: t.nav.collection,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <path d="M7 10h2l2-3 3 6 2-3h2" />
            </svg>
          ),
        },
      ],
    },
    {
      category: t.categories.quality,
      items: [
        {
          key: 'vision',
          section: 'vision',
          label: t.nav.vision,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          ),
        },
        {
          key: 'traceability',
          section: 'traceability',
          label: t.nav.traceability,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
            </svg>
          ),
        },
      ],
    },
    {
      category: t.categories.maintenance,
      items: [
        {
          key: 'maintenance',
          section: 'maintenance',
          label: t.nav.maintenance,
          badge: warningMachinesCount || 3,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          ),
        },
        {
          key: 'downtime',
          section: 'downtime',
          label: t.nav.downtime,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ),
        },
      ],
    },
    {
      category: t.categories.analytics,
      items: [
        {
          key: 'smart_kpi',
          section: 'smart_kpi',
          label: t.nav.smartKpi,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          ),
        },
        {
          key: 'optimization',
          section: 'optimization',
          label: t.nav.optimization,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          ),
        },
      ],
    },
    {
      category: t.categories.intelligence,
      items: [
        {
          key: 'edge_signals',
          section: 'edge_signals',
          label: t.nav.edgeSignals,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          ),
        },
        {
          key: 'assistant',
          section: 'assistant',
          label: t.nav.assistant,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="9" y1="10" x2="15" y2="10" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="brand">
          <div className="brand-mark-cube">
            {/* 3D Isometric Foundry OS Cube */}
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 25,8.5 14,15 3,8.5" fill="#00E5AE" opacity="0.95" />
              <polygon points="3,8.5 14,15 14,26 3,19.5" fill="#00B88A" />
              <polygon points="14,15 25,8.5 25,19.5 14,26" fill="#008E6A" />
              <path d="M14 15V26M3 8.5L14 15L25 8.5" stroke="#0B222E" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">Foundry OS</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="nav-grouped-wrap">
          {navGroups.map((group) => (
            <div key={group.category} className="nav-group-section">
              <div className="nav-group-title">{group.category}</div>
              <div className="nav-group-items">
                {group.items.map((item) => {
                  const isActive =
                    (activeSection === 'overview' && item.key === 'overview') ||
                    (activeSection === item.section && selectedKey === item.key) ||
                    (activeSection === item.section && !group.items.some(i => i.key === selectedKey));

                  return (
                    <button
                      key={item.key}
                      id={`nav-${item.key}`}
                      className={`nav-btn-theme ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(item)}
                      type="button"
                    >
                      <span className="nav-btn-icon">{item.icon}</span>
                      <span className="nav-btn-label">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="nav-btn-badge">{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Telemetry Status in Sidebar Footer */}
        <div className="sidebar-footer-theme">
          <div className="sidebar-status-pill">
            <span className={`status-dot-pulse ${isLive ? 'online' : 'paused'}`} />
            <div className="status-meta">
              <span className="status-title">{isLive ? t.brand.liveFeed : t.brand.feedPaused}</span>
              <span className="status-desc">2,480 tags/sec · Edge Online</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-sim-btn"
            onClick={toggleLive}
            title={isLive ? t.brand.pauseStream : t.brand.resumeStream}
          >
            {isLive ? t.brand.pauseStream : t.brand.resumeStream}
          </button>
        </div>
      </aside>
    </>
  );
}
