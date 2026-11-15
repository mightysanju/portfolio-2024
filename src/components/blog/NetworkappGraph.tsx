import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Avg handling time (min)', Manual: 4.75, NetworkApp: 0.27 },
  { name: 'Throughput multiplier (x)', Manual: 1.0, NetworkApp: 17.72 }
];

const PerformanceChart: React.FC = () => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#07080d] rounded-[8px] p-3 border border-white/[0.08] text-xs font-mono tabular-nums">
          <p className="text-[#eef0f5] font-medium mb-1.5">{payload[0].payload.name}</p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
              <span className="text-[#a3a9b8]">{entry.name}:</span>
              <span className="text-[#eef0f5]">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-5 bg-[#0b0d14] rounded-[10px] border border-white/[0.08]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-medium text-[#eef0f5]">
            Benchmark comparison: Manual vs. Network App
          </h4>
          <p className="text-xs text-[#7a8296] font-mono tabular-nums">
            PILOT SAMPLE: 149 SIM RECORDS
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#a3a9b8]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#7a8296]" />
            <span>Manual</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#3b82f6]" />
            <span>Network App</span>
          </span>
        </div>
      </div>

      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 4, right: 24, left: 16, bottom: 4 }}
          >
            <CartesianGrid stroke="rgba(238, 240, 245, 0.06)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#7a8296', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={{ stroke: 'rgba(238, 240, 245, 0.08)' }}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={165}
              tick={{ fill: '#a3a9b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(238, 240, 245, 0.03)' }}
            />
            <Bar dataKey="Manual" fill="#7a8296" barSize={10} radius={[0, 3, 3, 0]} />
            <Bar dataKey="NetworkApp" fill="#3b82f6" barSize={10} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#7a8296] tabular-nums">
        <span>SPEEDUP: 17.72x</span>
        <span className="text-[#4cc38a]">AHT REDUCTION: 94.36%</span>
      </div>
    </div>
  );
};

export default PerformanceChart;
