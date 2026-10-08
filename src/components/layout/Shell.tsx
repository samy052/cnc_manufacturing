'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import OverviewSection from '@/components/sections/OverviewSection';
import DataCollectionSection from '@/components/sections/DataCollectionSection';
import EdgeSignalsSection from '@/components/sections/EdgeSignalsSection';
import VisionSection from '@/components/sections/VisionSection';
import MaintenanceSection from '@/components/sections/MaintenanceSection';
import DowntimeSection from '@/components/sections/DowntimeSection';
import OptimizationSection from '@/components/sections/OptimizationSection';
import SmartFactoryKpiSection from '@/components/sections/SmartFactoryKpiSection';
import AssistantSection from '@/components/sections/AssistantSection';
import MachineDetailSection from '@/components/sections/MachineDetailSection';
import MaterialTraceabilitySection from '@/components/sections/MaterialTraceabilitySection';
import ProductionSection from '@/components/sections/ProductionSection';
import FloatingAiAssistant from '@/components/common/FloatingAiAssistant';
import { useFoundry } from '@/context/FoundryContext';

export default function Shell() {
  const { activeSection } = useFoundry();

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'collection' && <DataCollectionSection />}
          {activeSection === 'edge_signals' && <EdgeSignalsSection />}
          {activeSection === 'vision' && <VisionSection />}
          {activeSection === 'maintenance' && <MaintenanceSection />}
          {activeSection === 'downtime' && <DowntimeSection />}
          {activeSection === 'traceability' && <MaterialTraceabilitySection />}
          {activeSection === 'production' && <ProductionSection />}
          {activeSection === 'optimization' && <OptimizationSection />}
          {activeSection === 'smart_kpi' && <SmartFactoryKpiSection />}
          {activeSection === 'assistant' && <AssistantSection />}
          {activeSection === 'machine_detail' && <MachineDetailSection />}
        </main>
      </div>

      {/* Floating RAG AI Assistant Widget in Bottom-Right Corner */}
      <FloatingAiAssistant />
    </div>
  );
}
