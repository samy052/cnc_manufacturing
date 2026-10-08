export type MachineType = 'CNC' | 'PLC' | 'SCADA';
export type MachineStatus = 'running' | 'warning' | 'idle' | 'stopped';
export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export interface PartEvent {
  type: 'success' | 'incomplete' | 'warning';
  machineId: string;
  workpiece: string;
  message: string;
  timestamp: string;
}

export interface Machine {
  id: string;
  type: MachineType;
  protocol: string;
  status: MachineStatus;
  name?: string;
  line?: string;
  bay?: string;
  model?: string;
  imageUrl?: string;
  workpiece?: string;
  scenario?: string;
  signalsEvidence?: string;
  recommendedAction?: string;
  useCase?: string;
  currentTask?: string;
  cycleProgress?: number;
  cycleState?: 'cutting' | 'tool_change' | 'complete' | 'feed_hold' | 'incomplete';
  partsIncomplete?: number;
  plc?: {
    id: string;
    controllerModel: string;
    cycleTime: number;
    cycleTarget: number;
    program: string;
    step: string;
    diagnostics: 'OK' | 'WARNING';
    ioStatus: {
      clamping: string;
      coolant: string;
      doorInterlock: string;
      toolChanger: string;
    };
  };
  scada?: {
    gatewayId: string;
    tagCount: number;
    sampleRateMs: number;
    feedRate: number;
    powerKw: number;
    coolantPressureBar: number;
    axisLoadPercent: { x: number; y: number; z: number };
  };
  metrics: {
    spindle?: number;
    cycle?: number;
    tags?: number;
    temp: number;
    vib: number;
    partsToday?: number;
    [key: string]: number | undefined;
  };
  hist: {
    spindle?: number[];
    cycle?: number[];
    tags?: number[];
    temp: number[];
    vib: number[];
    [key: string]: number[] | undefined;
  };
}

export interface TagLogItem {
  id: string;
  time: string;
  machineId: string;
  tag: string;
  value: string;
}

export type SectionType =
  | 'overview'
  | 'collection'
  | 'edge_signals'
  | 'vision'
  | 'maintenance'
  | 'downtime'
  | 'traceability'
  | 'production'
  | 'optimization'
  | 'smart_kpi'
  | 'assistant'
  | 'machine_detail';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  text: string;
  tagText?: string;
  timestamp: string;
}

export interface SafetyZone {
  id: string;
  name: string;
  status: 'compliant' | 'checking' | 'alert';
}

export interface PredictedEvent {
  machine: string;
  component: string;
  window: string;
  confidence: number;
}
