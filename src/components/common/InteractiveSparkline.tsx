'use client';

import React, { useState, useRef, useMemo } from 'react';

export type TimeFrameKey = '1H' | '8H' | '24H' | '7D' | '30D';

export interface SparklinePoint {
  label: string; // e.g. '08:00 AM'
  value: number;
  formatted?: string;
}

export interface InteractiveSparklineProps {
  data: (SparklinePoint | number)[];
  timeFrameData?: Partial<Record<TimeFrameKey, SparklinePoint[]>>;
  defaultTimeFrame?: TimeFrameKey;
  activeTimeFrame?: TimeFrameKey;
  onTimeFrameChange?: (tf: TimeFrameKey) => void;
  showTimeFrameControls?: boolean;
  timeFramePills?: TimeFrameKey[];
  color?: string;
  fillColor?: string;
  width?: number;
  height?: number;
  unit?: string;
  valuePrefix?: string;
  className?: string;
}

const DEFAULT_PILLS: TimeFrameKey[] = ['1H', '8H', '24H', '7D'];

const TIME_FRAME_LABELS: Record<TimeFrameKey, string> = {
  '1H': '1H Live',
  '8H': '8H Shift',
  '24H': '24H Day',
  '7D': '7D Week',
  '30D': '30D Month',
};

export default function InteractiveSparkline({
  data,
  timeFrameData,
  defaultTimeFrame = '8H',
  activeTimeFrame: controlledTimeFrame,
  onTimeFrameChange,
  showTimeFrameControls = true,
  timeFramePills = DEFAULT_PILLS,
  color = '#10B981',
  fillColor,
  width = 160,
  height = 32,
  unit = '',
  valuePrefix = '',
  className = '',
}: InteractiveSparklineProps) {
  const [internalTimeFrame, setInternalTimeFrame] = useState<TimeFrameKey>(defaultTimeFrame);
  const currentTimeFrame = controlledTimeFrame ?? internalTimeFrame;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedData = useMemo<SparklinePoint[]>(() => {
    if (!data) return [];
    return data.map((item, idx) => {
      if (typeof item === 'number') {
        return { label: `Point ${idx + 1}`, value: item };
      }
      return item;
    });
  }, [data]);

  // Generate synthetic points for any timeframe not explicitly provided
  const resolvedData = useMemo<SparklinePoint[]>(() => {
    if (timeFrameData && timeFrameData[currentTimeFrame]) {
      return timeFrameData[currentTimeFrame]!;
    }

    if (currentTimeFrame === '8H' && normalizedData && normalizedData.length > 0) {
      return normalizedData;
    }

    if (!normalizedData || normalizedData.length === 0) return [];

    const lastVal = normalizedData[normalizedData.length - 1]?.value ?? 100;
    const baseVal = normalizedData[0]?.value ?? lastVal;

    switch (currentTimeFrame) {
      case '1H': {
        const times = ['12:10 PM', '12:20 PM', '12:30 PM', '12:40 PM', '12:50 PM', '01:00 PM'];
        return times.map((t, idx) => {
          const ratio = (idx + 1) / times.length;
          const v = Math.round((lastVal * 0.88 + lastVal * 0.12 * ratio) * 10) / 10;
          return { label: t, value: v };
        });
      }
      case '24H': {
        const times = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
        return times.map((t, idx) => {
          const mult = 0.75 + Math.sin(idx) * 0.2 + (idx / times.length) * 0.25;
          const v = Math.round(lastVal * mult * 10) / 10;
          return { label: t, value: v };
        });
      }
      case '7D': {
        const days = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'];
        return days.map((d, idx) => {
          const mult = 0.82 + (idx / days.length) * 0.18 + (idx % 2 === 0 ? 0.05 : -0.03);
          const v = Math.round(lastVal * mult * 10) / 10;
          return { label: d, value: v };
        });
      }
      case '30D': {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'];
        return weeks.map((w, idx) => {
          const mult = 0.78 + (idx / weeks.length) * 0.22;
          const v = Math.round(lastVal * mult * 10) / 10;
          return { label: w, value: v };
        });
      }
      default:
        return normalizedData;
    }
  }, [normalizedData, timeFrameData, currentTimeFrame]);

  if (!resolvedData || resolvedData.length === 0) return null;

  const paddingX = 4;
  const paddingY = 4;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const values = resolvedData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // Calculate coordinates
  const points = resolvedData.map((d, i) => {
    const x = paddingX + (i / Math.max(1, resolvedData.length - 1)) * innerWidth;
    const y = paddingY + innerHeight - ((d.value - minVal) / range) * innerHeight;
    return { x, y, data: d };
  });

  // Build smooth bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  // Area path for subtle gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(width, mouseX));

    // Find closest point by x coordinate
    let closestIdx = 0;
    let closestDist = Infinity;
    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - clampedX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setHoveredIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleSelectTf = (tf: TimeFrameKey, e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalTimeFrame(tf);
    onTimeFrameChange?.(tf);
  };

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  const gradientId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className={`interactive-sparkline-group ${className}`} style={{ width: `${width}px` }}>
      {/* Time Frame Controls Bar */}
      {showTimeFrameControls && (
        <div className="sparkline-tf-header">
          <div className="sparkline-tf-pills">
            {timeFramePills.map((tf) => (
              <button
                key={tf}
                type="button"
                className={`tf-pill ${currentTimeFrame === tf ? 'active' : ''}`}
                onClick={(e) => handleSelectTf(tf, e)}
                title={`Switch graph timeframe to ${tf}`}
              >
                {tf}
              </button>
            ))}
          </div>
          <span className="sparkline-tf-label" title="Active Graph Timeframe">
            {TIME_FRAME_LABELS[currentTimeFrame] || currentTimeFrame}
          </span>
        </div>
      )}

      {/* Interactive SVG Sparkline */}
      <div
        ref={containerRef}
        className="interactive-sparkline-wrap"
        style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="sparkline-svg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gradient fill below line */}
          <path d={areaD} fill={`url(#${gradientId})`} />

          {/* Main curve */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover elements */}
          {activePoint && (
            <>
              {/* Vertical crosshair */}
              <line
                x1={activePoint.x}
                y1={paddingY}
                x2={activePoint.x}
                y2={height - 2}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.65"
              />
              {/* Outer halo */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill={color}
                opacity="0.3"
              />
              {/* Center dot */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="2.5"
                fill="#FFFFFF"
                stroke={color}
                strokeWidth="1.8"
              />
            </>
          )}
        </svg>

        {/* Floating Hover Tooltip */}
        {activePoint && (
          <div
            className="sparkline-tooltip"
            style={{
              left: `${Math.max(14, Math.min(width - 14, activePoint.x))}px`,
            }}
          >
            <span className="sparkline-tooltip-time">{activePoint.data.label}</span>
            <strong className="sparkline-tooltip-val">
              {valuePrefix}
              {activePoint.data.formatted ?? activePoint.data.value.toLocaleString('en-IN')}{' '}
              {unit}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
