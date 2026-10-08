'use client';

import React, { useState, useMemo } from 'react';
import { useFoundry } from '@/context/FoundryContext';
import InteractiveSparkline, { TimeFrameKey } from '@/components/common/InteractiveSparkline';

interface MaterialBatch {
  id: string;
  grade: string;
  heatNo: string;
  lotNo: string;
  supplier: string;
  receivedDate: string;
  receivedQtyKg: number;
  usedQtyKg: number;
  status: 'In Use' | 'Completed' | 'In Stock';
  mtcFile: string;
  image: string;
  chemicalComp: { al: string; zn: string; mg: string; cu: string; fe: string };
  mechanicalProps: { yieldStrength: string; tensileStrength: string; elongation: string; hardness: string };
  machines: {
    id: string;
    part: string;
    image: string;
    issuedKg: number;
    usedKg: number;
    progressPct: number;
  }[];
  flow: {
    raw: { id: string; name: string; image: string };
    machine: { id: string; step: string; image: string };
    product: { name: string; image: string };
    quality: { status: 'PASS' | 'HOLD'; detail: string; image: string };
  };
}

const INITIAL_BATCHES: MaterialBatch[] = [
  {
    id: 'RM-AL7075-26001',
    grade: 'Aluminium 7075-T6',
    heatNo: 'HT-00421',
    lotNo: 'LOT-26001',
    supplier: 'Hindalco',
    receivedDate: '12 Sep 2026',
    receivedQtyKg: 500,
    usedQtyKg: 420,
    status: 'In Use',
    mtcFile: 'MTC-00421.pdf',
    image: '/material_rods.jpg',
    chemicalComp: { al: '89.5%', zn: '5.6%', mg: '2.5%', cu: '1.6%', fe: '0.4%' },
    mechanicalProps: { yieldStrength: '503 MPa', tensileStrength: '572 MPa', elongation: '11%', hardness: '150 HB' },
    machines: [
      { id: 'CNC-01', part: 'Aerospace Mounting Flange', image: '/machines/cnc_vmc_5axis.jpg', issuedKg: 120, usedKg: 110, progressPct: 92 },
      { id: 'CNC-09', part: 'EV Gearbox Case', image: '/machines/cnc_turning_lathe.jpg', issuedKg: 150, usedKg: 140, progressPct: 93 },
      { id: 'CNC-11', part: 'Aircraft Spar Beam', image: '/machines/cnc_gantry_profiler.jpg', issuedKg: 100, usedKg: 80, progressPct: 80 },
      { id: 'CNC-12', part: 'Robotic Cell Base', image: '/machines/cnc_robotic_cell.jpg', issuedKg: 50, usedKg: 0, progressPct: 0 },
    ],
    flow: {
      raw: { id: 'RM-AL7075-26001', name: 'Al 7075-T6', image: '/material_rods.jpg' },
      machine: { id: 'CNC-01', step: '5-Axis Finishing', image: '/machines/cnc_vmc_5axis.jpg' },
      product: { name: 'Aerospace Mounting Flange', image: '/inspection_part.jpg' },
      quality: { status: 'PASS', detail: 'Dimension OK', image: '/inspection_part_gear.jpg' },
    },
  },
  {
    id: 'RM-SS316L-26002',
    grade: 'Stainless Steel 316L',
    heatNo: 'HT-11892',
    lotNo: 'LOT-26002',
    supplier: 'Jindal Steel',
    receivedDate: '05 Sep 2026',
    receivedQtyKg: 300,
    usedQtyKg: 300,
    status: 'Completed',
    mtcFile: 'MTC-11892.pdf',
    image: '/material_rods.jpg',
    chemicalComp: { al: '0.0%', zn: '0.0%', mg: '1.2%', cu: '0.5%', fe: '68.0%' },
    mechanicalProps: { yieldStrength: '290 MPa', tensileStrength: '580 MPa', elongation: '50%', hardness: '217 HB' },
    machines: [
      { id: 'CNC-02', part: 'Transmission Drive Shaft', image: '/machines/cnc_turning_lathe.jpg', issuedKg: 160, usedKg: 160, progressPct: 100 },
      { id: 'CNC-08', part: 'Miniature Medical Valve Spool', image: '/machines/cnc_drill_tap.jpg', issuedKg: 140, usedKg: 140, progressPct: 100 },
    ],
    flow: {
      raw: { id: 'RM-SS316L-26002', name: 'SS 316L', image: '/material_rods.jpg' },
      machine: { id: 'CNC-02', step: 'Dual Spindle Turn', image: '/machines/cnc_turning_lathe.jpg' },
      product: { name: 'Transmission Drive Shaft', image: '/inspection_part_cylinder.jpg' },
      quality: { status: 'PASS', detail: 'Surface Ra 0.4µm OK', image: '/part_thumb.jpg' },
    },
  },
  {
    id: 'RM-42CrMo4-26003',
    grade: '42CrMo4 Alloy Steel',
    heatNo: 'HT-55210',
    lotNo: 'LOT-26003',
    supplier: 'Tata Steel',
    receivedDate: '18 Sep 2026',
    receivedQtyKg: 1000,
    usedQtyKg: 620,
    status: 'In Use',
    mtcFile: 'MTC-55210.pdf',
    image: '/material_rods.jpg',
    chemicalComp: { al: '0.02%', zn: '0.0%', mg: '0.7%', cu: '0.2%', fe: '96.5%' },
    mechanicalProps: { yieldStrength: '750 MPa', tensileStrength: '1000 MPa', elongation: '12%', hardness: '280 HB' },
    machines: [
      { id: 'CNC-05', part: 'Differential Pinion Gear', image: '/machines/cnc_mill_turn.jpg', issuedKg: 350, usedKg: 320, progressPct: 91 },
      { id: 'CNC-07', part: 'Heavy Forged Flywheel Hub', image: '/machines/cnc_turning_lathe.jpg', issuedKg: 270, usedKg: 300, progressPct: 82 },
    ],
    flow: {
      raw: { id: 'RM-42CrMo4-26003', name: '42CrMo4 Steel', image: '/material_rods.jpg' },
      machine: { id: 'CNC-05', step: 'Rough OD & Teeth Mill', image: '/machines/cnc_mill_turn.jpg' },
      product: { name: 'Differential Pinion Gear', image: '/inspection_part_gear.jpg' },
      quality: { status: 'PASS', detail: 'Hardness 58 HRC OK', image: '/inspection_part.jpg' },
    },
  },
  {
    id: 'RM-TI6AL4V-26004',
    grade: 'Titanium Grade 5',
    heatNo: 'HT-77123',
    lotNo: 'LOT-26004',
    supplier: 'ATI Metals',
    receivedDate: '22 Sep 2026',
    receivedQtyKg: 200,
    usedQtyKg: 150,
    status: 'In Use',
    mtcFile: 'MTC-77123.pdf',
    image: '/material_rods.jpg',
    chemicalComp: { al: '6.0%', zn: '0.0%', mg: '0.0%', cu: '0.0%', fe: '0.25%' },
    mechanicalProps: { yieldStrength: '880 MPa', tensileStrength: '950 MPa', elongation: '14%', hardness: '330 HB' },
    machines: [
      { id: 'CNC-04', part: 'Turbine Impeller Blade', image: '/machines/cnc_vmc_5axis.jpg', issuedKg: 200, usedKg: 150, progressPct: 75 },
    ],
    flow: {
      raw: { id: 'RM-TI6AL4V-26004', name: 'Ti-6Al-4V Gr.5', image: '/material_rods.jpg' },
      machine: { id: 'CNC-04', step: 'Simultaneous 5-Axis', image: '/machines/cnc_vmc_5axis.jpg' },
      product: { name: 'Turbine Impeller Blade', image: '/inspection_part.jpg' },
      quality: { status: 'PASS', detail: 'Ultrasonic NDT OK', image: '/inspection_part_defect.jpg' },
    },
  },
  {
    id: 'RM-H13-26005',
    grade: 'Tool Steel H13',
    heatNo: 'HT-66231',
    lotNo: 'LOT-26005',
    supplier: 'Bohler',
    receivedDate: '28 Sep 2026',
    receivedQtyKg: 400,
    usedQtyKg: 0,
    status: 'In Stock',
    mtcFile: 'MTC-66231.pdf',
    image: '/material_rods.jpg',
    chemicalComp: { al: '0.0%', zn: '0.0%', mg: '0.4%', cu: '0.1%', fe: '90.2%' },
    mechanicalProps: { yieldStrength: '1650 MPa', tensileStrength: '1990 MPa', elongation: '9%', hardness: '52 HRC' },
    machines: [
      { id: 'CNC-06', part: 'Automotive Light Injection Mold', image: '/machines/cnc_vmc_5axis.jpg', issuedKg: 0, usedKg: 0, progressPct: 0 },
    ],
    flow: {
      raw: { id: 'RM-H13-26005', name: 'Premium H13', image: '/material_rods.jpg' },
      machine: { id: 'CNC-06', step: 'EDM & High Speed Mill', image: '/machines/cnc_vmc_5axis.jpg' },
      product: { name: 'Light Injection Mold Insert', image: '/inspection_part_gear.jpg' },
      quality: { status: 'PASS', detail: 'Quench Certified', image: '/part_thumb.jpg' },
    },
  },
];

export default function MaterialTraceabilitySection() {
  const { openMachineDetail } = useFoundry();

  const [activeTab, setActiveTab] = useState<'overview' | 'lots' | 'consumption' | 'traceability' | 'analysis' | 'reports'>('overview');
  const [batches, setBatches] = useState<MaterialBatch[]>(INITIAL_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('RM-AL7075-26001');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('All Grades');
  const [filterMachine, setFilterMachine] = useState('All Machines');
  const [filterStatus, setFilterStatus] = useState('All Status');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMtcModal, setShowMtcModal] = useState(false);

  // New Batch Form State
  const [newBatch, setNewBatch] = useState({
    id: `RM-AL7075-${Math.floor(26000 + Math.random() * 900)}`,
    grade: 'Aluminium 7075-T6',
    heatNo: 'HT-00984',
    lotNo: 'LOT-26010',
    supplier: 'Hindalco',
    receivedQtyKg: 500,
  });

  const selectedBatch = useMemo(() => {
    return batches.find((b) => b.id === selectedBatchId) || batches[0];
  }, [batches, selectedBatchId]);

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.grade.toLowerCase().includes(q) ||
        b.heatNo.toLowerCase().includes(q) ||
        b.supplier.toLowerCase().includes(q);

      const matchGrade = filterGrade === 'All Grades' || b.grade === filterGrade;
      const matchStatus = filterStatus === 'All Status' || b.status === filterStatus;
      const matchMachine =
        filterMachine === 'All Machines' ||
        b.machines.some((m) => m.id === filterMachine);

      return matchSearch && matchGrade && matchStatus && matchMachine;
    });
  }, [batches, searchQuery, filterGrade, filterStatus, filterMachine]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterGrade('All Grades');
    setFilterMachine('All Machines');
    setFilterStatus('All Status');
  };

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MaterialBatch = {
      id: newBatch.id,
      grade: newBatch.grade,
      heatNo: newBatch.heatNo,
      lotNo: newBatch.lotNo,
      supplier: newBatch.supplier,
      receivedDate: '01 Oct 2026',
      receivedQtyKg: Number(newBatch.receivedQtyKg) || 400,
      usedQtyKg: 0,
      status: 'In Stock',
      mtcFile: `${newBatch.heatNo}.pdf`,
      image: '/material_rods.jpg',
      chemicalComp: { al: '90.1%', zn: '5.5%', mg: '2.4%', cu: '1.5%', fe: '0.3%' },
      mechanicalProps: { yieldStrength: '505 MPa', tensileStrength: '575 MPa', elongation: '11%', hardness: '150 HB' },
      machines: [
        { id: 'CNC-01', part: 'Aerospace Mounting Flange', image: '/machines/cnc_vmc_5axis.jpg', issuedKg: 0, usedKg: 0, progressPct: 0 },
      ],
      flow: {
        raw: { id: newBatch.id, name: newBatch.grade, image: '/material_rods.jpg' },
        machine: { id: 'CNC-01', step: 'Allocated Queue', image: '/machines/cnc_vmc_5axis.jpg' },
        product: { name: 'Precision Prototype', image: '/inspection_part.jpg' },
        quality: { status: 'PASS', detail: 'Lot Sample Verified', image: '/inspection_part_gear.jpg' },
      },
    };
    setBatches([created, ...batches]);
    setSelectedBatchId(created.id);
    setShowAddModal(false);
  };

  return (
    <div className="section-wrapper mt-page-container">
      {/* 1. Header Bar matching screenshot */}
      <div className="mt-header-row">
        <div>
          <h1 className="page-hero-title" style={{ margin: 0 }}>Material Traceability</h1>
          <p className="page-hero-desc" style={{ margin: '4px 0 0 0' }}>
            Track raw material to finished product across machines, processes and quality
          </p>
        </div>

        <button
          type="button"
          className="mt-btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Material Batch</span>
        </button>
      </div>

      {/* 2. Sub-Nav Pill Tabs matching screenshot */}
      <div className="mt-subnav-row">
        <button
          type="button"
          className={`mt-nav-pill ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="9" height="9" rx="2" />
            <rect x="13" y="2" width="9" height="9" rx="2" />
            <rect x="2" y="13" width="9" height="9" rx="2" />
            <rect x="13" y="13" width="9" height="9" rx="2" />
          </svg>
          <span>Overview</span>
        </button>

        <button
          type="button"
          className={`mt-nav-pill ${activeTab === 'lots' ? 'active' : ''}`}
          onClick={() => setActiveTab('lots')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
          </svg>
          <span>Material Lots</span>
        </button>

        <button
          type="button"
          className={`mt-nav-pill ${activeTab === 'consumption' ? 'active' : ''}`}
          onClick={() => setActiveTab('consumption')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Machine Consumption</span>
        </button>

        <button
          type="button"
          className={`mt-nav-pill ${activeTab === 'traceability' ? 'active' : ''}`}
          onClick={() => setActiveTab('traceability')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>Product Traceability</span>
        </button>

        <button
          type="button"
          className={`mt-nav-pill ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Batch Analysis</span>
        </button>

        <button
          type="button"
          className={`mt-nav-pill ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>Reports</span>
        </button>
      </div>

      {/* 3. Top Row: 5 Enterprise KPI Metric Cards */}
      <div className="overview-kpi-row-5" style={{ marginBottom: '18px' }}>
        {/* KPI 1: Total Material Batches */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square mint">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">▲ +12% Inbound</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">28</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Batches</span>
          </div>
          <div className="kpi-label">Material Lots Tracked</div>
          <div className="kpi-sub-line font-sm">
            <span>MTC Certified: <strong>100%</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={[
                { label: '08:00', value: 24, formatted: '24' },
                { label: '10:00', value: 26, formatted: '26' },
                { label: '12:00', value: 27, formatted: '27' },
                { label: '13:00', value: 28, formatted: '28' },
              ]}
              timeFrameData={{
                '1H': [
                  { label: '12:10', value: 27, formatted: '27' },
                  { label: '12:30', value: 28, formatted: '28' },
                  { label: '13:00', value: 28, formatted: '28' },
                ],
                '8H': [
                  { label: '08:00', value: 24, formatted: '24' },
                  { label: '10:00', value: 26, formatted: '26' },
                  { label: '12:00', value: 27, formatted: '27' },
                  { label: '13:00', value: 28, formatted: '28' },
                ],
                '24H': [
                  { label: '00:00', value: 22, formatted: '22' },
                  { label: '08:00', value: 24, formatted: '24' },
                  { label: 'Now', value: 28, formatted: '28' },
                ],
                '7D': [
                  { label: 'Thu', value: 23, formatted: '23' },
                  { label: 'Fri', value: 25, formatted: '25' },
                  { label: 'Today', value: 28, formatted: '28' },
                ],
                '30D': [
                  { label: 'W1', value: 18, formatted: '18' },
                  { label: 'W2', value: 22, formatted: '22' },
                  { label: 'Cur', value: 28, formatted: '28' },
                ],
              }}
              activeTimeFrame="8H"
              color="#10B981"
              width={160}
              height={26}
              unit="lots"
            />
          </div>
        </div>

        {/* KPI 2: Material Issued */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">▲ +8% Issued</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">3,420</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>kg</span>
          </div>
          <div className="kpi-label">Material Issued To Shop Floor</div>
          <div className="kpi-sub-line font-sm">
            <span>In-Process: <strong>1,490 kg</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={[
                { label: '08:00', value: 2800, formatted: '2.8k' },
                { label: '10:00', value: 3100, formatted: '3.1k' },
                { label: '12:00', value: 3350, formatted: '3.3k' },
                { label: '13:00', value: 3420, formatted: '3.4k' },
              ]}
              timeFrameData={{
                '1H': [
                  { label: '12:10', value: 3350, formatted: '3.3k' },
                  { label: '12:30', value: 3390, formatted: '3.4k' },
                  { label: '13:00', value: 3420, formatted: '3.4k' },
                ],
                '8H': [
                  { label: '08:00', value: 2800, formatted: '2.8k' },
                  { label: '10:00', value: 3100, formatted: '3.1k' },
                  { label: '12:00', value: 3350, formatted: '3.3k' },
                  { label: '13:00', value: 3420, formatted: '3.4k' },
                ],
                '24H': [
                  { label: '00:00', value: 1200, formatted: '1.2k' },
                  { label: '08:00', value: 2800, formatted: '2.8k' },
                  { label: 'Now', value: 3420, formatted: '3.4k' },
                ],
                '7D': [
                  { label: 'Thu', value: 3100, formatted: '3.1k' },
                  { label: 'Fri', value: 3300, formatted: '3.3k' },
                  { label: 'Today', value: 3420, formatted: '3.4k' },
                ],
                '30D': [
                  { label: 'W1', value: 21000, formatted: '21k' },
                  { label: 'W2', value: 22800, formatted: '22.8k' },
                  { label: 'Cur', value: 24200, formatted: '24.2k' },
                ],
              }}
              activeTimeFrame="8H"
              color="#2563EB"
              width={160}
              height={26}
              unit="kg"
            />
          </div>
        </div>

        {/* KPI 3: Finished Tracked Parts */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">▲ +15% Output</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">4,731</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Parts</span>
          </div>
          <div className="kpi-label">Serialized Finished Parts</div>
          <div className="kpi-sub-line font-sm">
            <span>Heat & Lot Traced: <strong>100%</strong></span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <InteractiveSparkline
              data={[
                { label: '08:00', value: 4100, formatted: '4.1k' },
                { label: '10:00', value: 4350, formatted: '4.3k' },
                { label: '12:00', value: 4620, formatted: '4.6k' },
                { label: '13:00', value: 4731, formatted: '4.7k' },
              ]}
              timeFrameData={{
                '1H': [
                  { label: '12:10', value: 4620, formatted: '4.6k' },
                  { label: '12:30', value: 4690, formatted: '4.7k' },
                  { label: '13:00', value: 4731, formatted: '4.7k' },
                ],
                '8H': [
                  { label: '08:00', value: 4100, formatted: '4.1k' },
                  { label: '10:00', value: 4350, formatted: '4.3k' },
                  { label: '12:00', value: 4620, formatted: '4.6k' },
                  { label: '13:00', value: 4731, formatted: '4.7k' },
                ],
                '24H': [
                  { label: '00:00', value: 1200, formatted: '1.2k' },
                  { label: '08:00', value: 4100, formatted: '4.1k' },
                  { label: 'Now', value: 4731, formatted: '4.7k' },
                ],
                '7D': [
                  { label: 'Thu', value: 4200, formatted: '4.2k' },
                  { label: 'Fri', value: 4500, formatted: '4.5k' },
                  { label: 'Today', value: 4731, formatted: '4.7k' },
                ],
                '30D': [
                  { label: 'W1', value: 28000, formatted: '28k' },
                  { label: 'W2', value: 30500, formatted: '30.5k' },
                  { label: 'Cur', value: 31400, formatted: '31.4k' },
                ],
              }}
              activeTimeFrame="8H"
              color="#0D9488"
              width={160}
              height={26}
              unit="parts"
            />
          </div>
        </div>

        {/* KPI 4: Reject Rate */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">▼ -0.4% Scrap</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular" style={{ color: '#DC2626' }}>1.9%</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Scrap</span>
          </div>
          <div className="kpi-label">Material Defect Scrap Rate</div>
          <div className="kpi-sub-line font-sm">
            <span>Quarantined: <strong>89 parts</strong></span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Zero Escapes</span>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>NDT Passed</span>
          </div>
        </div>

        {/* KPI 5: Active Material Grades */}
        <div className="kpi-card-theme">
          <div className="kpi-card-top-split">
            <div className="kpi-icon-square" style={{ background: '#FEF3C7' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="kpi-badge-pill green">● 8 Active</span>
          </div>
          <div className="kpi-val-line">
            <span className="kpi-big-value tabular">8</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Grades</span>
          </div>
          <div className="kpi-label">Aerospace & Medical Alloys</div>
          <div className="kpi-sub-line font-sm">
            <span>Al 7075, SS 316L, Ti-6Al-4V</span>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>100% Verified</span>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>MTC PDF ↗</span>
          </div>
        </div>
      </div>

      {/* 4. Search & Filter Bar matching screenshot */}
      <div className="mt-filter-bar">
        <div className="mt-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="mt-search-input"
            placeholder="Search material batch, heat number, machine, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdown 1: Material Grade */}
        <div className="mt-dropdown-group">
          <span className="mt-drop-label">Grade:</span>
          <select
            className="mt-select"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option>All Grades</option>
            <option>Aluminium 7075-T6</option>
            <option>Stainless Steel 316L</option>
            <option>42CrMo4 Alloy Steel</option>
            <option>Titanium Grade 5</option>
            <option>Tool Steel H13</option>
          </select>
        </div>

        {/* Dropdown 2: Machine */}
        <div className="mt-dropdown-group">
          <span className="mt-drop-label">Machine:</span>
          <select
            className="mt-select"
            value={filterMachine}
            onChange={(e) => setFilterMachine(e.target.value)}
          >
            <option>All Machines</option>
            <option>CNC-01</option>
            <option>CNC-02</option>
            <option>CNC-04</option>
            <option>CNC-05</option>
            <option>CNC-07</option>
            <option>CNC-09</option>
            <option>CNC-11</option>
            <option>CNC-12</option>
          </select>
        </div>

        {/* Dropdown 3: Status */}
        <div className="mt-dropdown-group">
          <span className="mt-drop-label">Status:</span>
          <select
            className="mt-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>In Use</option>
            <option>Completed</option>
            <option>In Stock</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="mt-date-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>01 Oct 2026 - 01 Oct 2026</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <button
          type="button"
          className="mt-btn-reset"
          onClick={handleResetFilters}
          title="Reset search and filters"
        >
          Reset
        </button>
      </div>

      {/* 5. Middle Row: Material Batches Table (Left 70%) & Batch Details Card (Right 30%) */}
      <div className="mt-middle-grid">
        {/* Left: Material Batches Table */}
        <div className="mt-card mt-table-card">
          <div className="mt-card-header">
            <div className="mt-header-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <h2 className="mt-card-title">Material Batches</h2>
              <p className="mt-card-subtitle">All raw material batches received and their usage across machines</p>
            </div>
          </div>

          <div className="mt-table-wrap">
            <table className="mt-table">
              <thead>
                <tr>
                  <th style={{ width: '32px' }}>
                    <input type="checkbox" className="mt-checkbox" aria-label="Select all batches" />
                  </th>
                  <th>Batch ID</th>
                  <th>Material Grade</th>
                  <th>Heat No.</th>
                  <th>Supplier</th>
                  <th>Received Qty</th>
                  <th>Used Qty</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => {
                  const isSelected = batch.id === selectedBatch.id;
                  const remaining = batch.receivedQtyKg - batch.usedQtyKg;
                  return (
                    <tr
                      key={batch.id}
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => setSelectedBatchId(batch.id)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="mt-checkbox"
                          checked={isSelected}
                          onChange={() => setSelectedBatchId(batch.id)}
                          aria-label={`Select ${batch.id}`}
                        />
                      </td>
                      <td>
                        <strong className="mt-batch-id-text">{batch.id}</strong>
                      </td>
                      <td>{batch.grade}</td>
                      <td>
                        <span className="mt-mono-tag">{batch.heatNo}</span>
                      </td>
                      <td>{batch.supplier}</td>
                      <td>{batch.receivedQtyKg} kg</td>
                      <td>{batch.usedQtyKg} kg</td>
                      <td>
                        <strong style={{ color: remaining > 0 ? 'inherit' : 'var(--text-muted)' }}>
                          {remaining} kg
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`mt-status-badge ${
                            batch.status === 'In Use'
                              ? 'in-use'
                              : batch.status === 'Completed'
                              ? 'completed'
                              : 'in-stock'
                          }`}
                        >
                          {batch.status === 'In Use' && <span className="mt-badge-dot" />}
                          {batch.status === 'In Stock' && <span className="mt-badge-dot purple" />}
                          {batch.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="mt-actions-cell">
                          <button
                            type="button"
                            className="mt-btn-view"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBatchId(batch.id);
                            }}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="mt-btn-dots"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMtcModal(true);
                            }}
                            title="Certificate & Logs"
                          >
                            ⋮
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

        {/* Right: Batch Details Panel matching screenshot */}
        <div className="mt-card mt-details-card">
          <div className="mt-details-header">
            <h3 className="mt-details-title">Batch Details</h3>
            <span
              className={`mt-status-badge ${
                selectedBatch.status === 'In Use'
                  ? 'in-use'
                  : selectedBatch.status === 'Completed'
                  ? 'completed'
                  : 'in-stock'
              }`}
            >
              {selectedBatch.status === 'In Use' && <span className="mt-badge-dot" />}
              {selectedBatch.status}
            </span>
          </div>

          <div className="mt-details-id-row">
            <div className="mt-details-batch-id">{selectedBatch.id}</div>
            <div className="mt-details-grade">{selectedBatch.grade}</div>
          </div>

          {/* Batch Thumbnail image matching screenshot */}
          <div className="mt-details-image-wrap">
            <img
              src={selectedBatch.image || '/material_rods.jpg'}
              alt={selectedBatch.grade}
              className="mt-details-image"
            />
          </div>

          {/* Metadata Key-Value List matching screenshot */}
          <div className="mt-details-kv-list">
            <div className="mt-kv-row">
              <span className="mt-k">Heat Number</span>
              <span className="mt-v mono">{selectedBatch.heatNo}</span>
            </div>
            <div className="mt-kv-row">
              <span className="mt-k">Lot Number</span>
              <span className="mt-v mono">{selectedBatch.lotNo}</span>
            </div>
            <div className="mt-kv-row">
              <span className="mt-k">Supplier</span>
              <span className="mt-v font-bold">{selectedBatch.supplier}</span>
            </div>
            <div className="mt-kv-row">
              <span className="mt-k">Received Date</span>
              <span className="mt-v">{selectedBatch.receivedDate}</span>
            </div>
            <div className="mt-kv-row">
              <span className="mt-k">Received Quantity</span>
              <span className="mt-v font-bold">{selectedBatch.receivedQtyKg} kg</span>
            </div>
            <div className="mt-kv-row">
              <span className="mt-k">Used Quantity</span>
              <span className="mt-v">
                {selectedBatch.usedQtyKg} kg ({Math.round((selectedBatch.usedQtyKg / selectedBatch.receivedQtyKg) * 100)}%)
              </span>
            </div>
            <div className="mt-kv-row">
              <span className="mt-k">Remaining Quantity</span>
              <span className="mt-v font-bold">{selectedBatch.receivedQtyKg - selectedBatch.usedQtyKg} kg</span>
            </div>
            <div className="mt-kv-row">
              <span className="mt-k">Material Certificate</span>
              <button
                type="button"
                className="mt-mtc-link"
                onClick={() => setShowMtcModal(true)}
                title="View Mill Test Certificate"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>{selectedBatch.mtcFile}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Row: Usage Across Machines (Left 58%) & Manufacturing Flow (Right 42%) */}
      <div className="mt-bottom-grid">
        {/* Usage Across Machines */}
        <div className="mt-card mt-usage-card">
          <div className="mt-card-header">
            <div className="mt-header-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div>
              <h2 className="mt-card-title">Usage Across Machines</h2>
              <p className="mt-card-subtitle">Which machines are using this material batch</p>
            </div>
          </div>

          <div className="mt-machines-flow-row">
            {selectedBatch.machines.map((m, idx) => (
              <React.Fragment key={m.id}>
                <div
                  className="mt-machine-item-card"
                  onClick={() => openMachineDetail(m.id)}
                  title={`Inspect ${m.id} details`}
                >
                  <div className="mt-m-item-head">
                    <div className="mt-m-icon-box">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                      </svg>
                    </div>
                    <div>
                      <div className="mt-m-id">{m.id}</div>
                      <div className="mt-m-part" title={m.part}>{m.part}</div>
                    </div>
                  </div>

                  <div className="mt-m-thumb-wrap">
                    <img src={m.image} alt={m.id} className="mt-m-thumb" />
                  </div>

                  <div className="mt-m-usage-stats">
                    <div className="mt-m-stat-row">
                      <span>Issued: <strong>{m.issuedKg} kg</strong></span>
                    </div>
                    <div className="mt-m-stat-row">
                      <span>Used: <strong>{m.usedKg} kg</strong></span>
                      <span className="mt-m-pct">{m.progressPct}%</span>
                    </div>
                    <div className="mt-m-bar-bg">
                      <div
                        className="mt-m-bar-fill"
                        style={{
                          width: `${m.progressPct}%`,
                          background: m.progressPct > 0 ? '#10B981' : '#CBD5E1',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {idx < selectedBatch.machines.length - 1 && (
                  <div className="mt-flow-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Manufacturing Flow */}
        <div className="mt-card mt-flow-card">
          <div className="mt-card-header">
            <div className="mt-header-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <h2 className="mt-card-title">Manufacturing Flow</h2>
              <p className="mt-card-subtitle">From raw material to finished product</p>
            </div>
          </div>

          <div className="mt-process-flow-row">
            {/* Step 1: Raw Material */}
            <div className="mt-process-step">
              <div className="mt-step-head">
                <div className="mt-step-icon-box blue">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div>
                  <div className="mt-step-title">Raw Material</div>
                  <div className="mt-step-sub">{selectedBatch.flow.raw.id}</div>
                  <div className="mt-step-tag">{selectedBatch.flow.raw.name}</div>
                </div>
              </div>
              <div className="mt-step-thumb-wrap">
                <img src={selectedBatch.flow.raw.image} alt="Raw Material" className="mt-step-thumb" />
              </div>
            </div>

            <div className="mt-flow-arrow">→</div>

            {/* Step 2: CNC Machining */}
            <div className="mt-process-step">
              <div className="mt-step-head">
                <div className="mt-step-icon-box purple">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                  </svg>
                </div>
                <div>
                  <div className="mt-step-title">CNC Machining</div>
                  <div className="mt-step-sub">{selectedBatch.flow.machine.id}</div>
                  <div className="mt-step-tag">{selectedBatch.flow.machine.step}</div>
                </div>
              </div>
              <div className="mt-step-thumb-wrap">
                <img src={selectedBatch.flow.machine.image} alt="CNC Machining" className="mt-step-thumb" />
              </div>
            </div>

            <div className="mt-flow-arrow">→</div>

            {/* Step 3: Finished Product */}
            <div className="mt-process-step">
              <div className="mt-step-head">
                <div className="mt-step-icon-box cyan">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  </svg>
                </div>
                <div>
                  <div className="mt-step-title">Finished Product</div>
                  <div className="mt-step-sub" title={selectedBatch.flow.product.name}>
                    {selectedBatch.flow.product.name}
                  </div>
                </div>
              </div>
              <div className="mt-step-thumb-wrap">
                <img src={selectedBatch.flow.product.image} alt="Finished Product" className="mt-step-thumb" />
              </div>
            </div>

            <div className="mt-flow-arrow">→</div>

            {/* Step 4: Quality Check */}
            <div className="mt-process-step">
              <div className="mt-step-head">
                <div className="mt-step-icon-box green">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="mt-step-title">Quality Check</div>
                  <span className="mt-pass-pill">PASS</span>
                  <div className="mt-step-tag" style={{ color: '#059669' }}>{selectedBatch.flow.quality.detail}</div>
                </div>
              </div>
              <div className="mt-step-thumb-wrap">
                <img src={selectedBatch.flow.quality.image} alt="Quality Inspection" className="mt-step-thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: + Add Material Batch */}
      {showAddModal && (
        <div className="mt-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="mt-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="mt-modal-head">
              <h3>Register New Raw Material Batch</h3>
              <button type="button" className="mt-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddBatchSubmit} className="mt-modal-form">
              <div className="mt-form-row">
                <div className="mt-form-group">
                  <label>Batch ID</label>
                  <input
                    type="text"
                    required
                    value={newBatch.id}
                    onChange={(e) => setNewBatch({ ...newBatch, id: e.target.value })}
                  />
                </div>
                <div className="mt-form-group">
                  <label>Material Grade</label>
                  <select
                    value={newBatch.grade}
                    onChange={(e) => setNewBatch({ ...newBatch, grade: e.target.value })}
                  >
                    <option>Aluminium 7075-T6</option>
                    <option>Stainless Steel 316L</option>
                    <option>42CrMo4 Alloy Steel</option>
                    <option>Titanium Grade 5</option>
                    <option>Tool Steel H13</option>
                  </select>
                </div>
              </div>

              <div className="mt-form-row">
                <div className="mt-form-group">
                  <label>Heat Number (Mill Certificate)</label>
                  <input
                    type="text"
                    required
                    value={newBatch.heatNo}
                    onChange={(e) => setNewBatch({ ...newBatch, heatNo: e.target.value })}
                  />
                </div>
                <div className="mt-form-group">
                  <label>Lot Number</label>
                  <input
                    type="text"
                    required
                    value={newBatch.lotNo}
                    onChange={(e) => setNewBatch({ ...newBatch, lotNo: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-form-row">
                <div className="mt-form-group">
                  <label>Supplier / Vendor</label>
                  <input
                    type="text"
                    required
                    value={newBatch.supplier}
                    onChange={(e) => setNewBatch({ ...newBatch, supplier: e.target.value })}
                  />
                </div>
                <div className="mt-form-group">
                  <label>Received Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={newBatch.receivedQtyKg}
                    onChange={(e) => setNewBatch({ ...newBatch, receivedQtyKg: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-modal-foot">
                <button type="button" className="mt-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="mt-btn-primary">Register Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Mill Test Certificate (MTC) Viewer */}
      {showMtcModal && (
        <div className="mt-modal-overlay" onClick={() => setShowMtcModal(false)}>
          <div className="mt-modal-dialog mtc-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="mt-modal-head">
              <div>
                <h3>Mill Test Certificate (EN 10204 Type 3.1)</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Batch: {selectedBatch.id} · Heat: {selectedBatch.heatNo} · Supplier: {selectedBatch.supplier}
                </p>
              </div>
              <button type="button" className="mt-modal-close" onClick={() => setShowMtcModal(false)}>✕</button>
            </div>

            <div className="mtc-body">
              <div className="mtc-section-title">Chemical Composition (Weight %)</div>
              <div className="mtc-spec-grid">
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Al</span>
                  <span className="mtc-val">{selectedBatch.chemicalComp.al}</span>
                </div>
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Zn</span>
                  <span className="mtc-val">{selectedBatch.chemicalComp.zn}</span>
                </div>
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Mg</span>
                  <span className="mtc-val">{selectedBatch.chemicalComp.mg}</span>
                </div>
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Cu</span>
                  <span className="mtc-val">{selectedBatch.chemicalComp.cu}</span>
                </div>
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Fe</span>
                  <span className="mtc-val">{selectedBatch.chemicalComp.fe}</span>
                </div>
              </div>

              <div className="mtc-section-title" style={{ marginTop: '14px' }}>Mechanical Properties</div>
              <div className="mtc-spec-grid mechanical">
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">0.2% Yield Strength</span>
                  <span className="mtc-val ok">{selectedBatch.mechanicalProps.yieldStrength}</span>
                </div>
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Tensile Strength</span>
                  <span className="mtc-val ok">{selectedBatch.mechanicalProps.tensileStrength}</span>
                </div>
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Elongation (A5)</span>
                  <span className="mtc-val ok">{selectedBatch.mechanicalProps.elongation}</span>
                </div>
                <div className="mtc-spec-cell">
                  <span className="mtc-elem">Brinell Hardness</span>
                  <span className="mtc-val ok">{selectedBatch.mechanicalProps.hardness}</span>
                </div>
              </div>

              <div className="mtc-signature-box">
                <div className="mtc-sign-item">
                  <span className="mtc-sign-label">Quality Assurance Officer:</span>
                  <strong>Dr. M. Sridhar (ASNT Level III Metrology)</strong>
                </div>
                <div className="mtc-sign-item">
                  <span className="mtc-sign-label">Verification Status:</span>
                  <span className="mt-pass-pill">VERIFIED & APPROVED</span>
                </div>
              </div>
            </div>

            <div className="mt-modal-foot">
              <button type="button" className="mt-btn-primary" onClick={() => setShowMtcModal(false)}>
                Download Verified PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
