import React from 'react';
import { 
  ResponsiveContainer, LineChart, BarChart, PieChart, AreaChart,
  Line, Bar, Pie, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import type { ChartConfig } from '../../types';

interface BaseChartProps extends ChartConfig {
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--brand-primary)',
  'var(--brand-secondary)', 
  'var(--brand-accent)',
  'var(--brand-success)',
  'var(--brand-warning)',
  'var(--brand-error)'
];

const BaseChart: React.FC<BaseChartProps> = ({
  type,
  data,
  xAxis = 'name',
  yAxis = 'value',
  colors = DEFAULT_COLORS,
  title,
  legend = true,
  width,
  height = 300,
  className
}) => {
  const chartColors = colors.length > 0 ? colors : DEFAULT_COLORS;

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg p-3">
          <p className="text-[var(--text-primary)] font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border-color)"
              opacity={0.3}
            />
            <XAxis 
              dataKey={xAxis}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-color)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-color)' }}
            />
            <Tooltip content={customTooltip} />
            {legend && <Legend />}
            <Line 
              type="monotone" 
              dataKey={yAxis}
              stroke={chartColors[0]}
              strokeWidth={2}
              dot={{ fill: chartColors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartColors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border-color)"
              opacity={0.3}
            />
            <XAxis 
              dataKey={xAxis}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-color)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-color)' }}
            />
            <Tooltip content={customTooltip} />
            {legend && <Legend />}
            <Bar 
              dataKey={yAxis}
              fill={chartColors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors[index % chartColors.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            {legend && <Legend />}
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border-color)"
              opacity={0.3}
            />
            <XAxis 
              dataKey={xAxis}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-color)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-color)' }}
            />
            <Tooltip content={customTooltip} />
            {legend && <Legend />}
            <Area
              type="monotone"
              dataKey={yAxis}
              stroke={chartColors[0]}
              fill={chartColors[0]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 text-center">
          {title}
        </h3>
      )}
      <ResponsiveContainer width={width || '100%'} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default BaseChart;