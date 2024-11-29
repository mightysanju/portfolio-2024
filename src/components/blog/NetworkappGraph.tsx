import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const data = [
  { name: 'Average Time (Minutes)', Human: 4.75, NetworkApp: 0.27 },
  { name: 'Speed Multiplier', Human: 1, NetworkApp: 17.72 }
];

const PerformanceChart: React.FC = () => {
  // Custom tooltip to enhance readability
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          className="bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-700 text-white"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="font-bold text-gray-200">{payload[0].payload.name}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  // Custom label for bars
  const renderBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text 
        x={x + width + 10} 
        y={y + 12} 
        fill="white" 
        textAnchor="start" 
        className="text-sm font-semibold"
      >
        {value}
      </text>
    );
  };

  return (
    //max-w-3xl
    <div className="w-full  mx-auto p-6 bg-gray-900 rounded-3xl shadow-2xl relative overflow-hidden border-4 border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-200 flex items-center justify-center">
        Performance Comparison
        <Zap 
          className="text-green-400 ml-2" 
          size={24} 
          fill="currentColor"
        />
      </h2>

      <ResponsiveContainer width="100%" height={100}>
        <BarChart 
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
        >
          <XAxis 
            type="number"
            hide={true}
          />
          <YAxis 
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            className="text-sm text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="Human" 
            fill="#4299E1" 
            barSize={10}
            radius={[0, 12, 12, 0]}
            label={renderBarLabel}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`human-${index}`} 
                fill="#4299E1" 
                style={{ mixBlendMode: 'screen' }}
              />
            ))}
          </Bar>
          <Bar 
            dataKey="NetworkApp" 
            fill="#48BB78" 
            barSize={10}
            radius={[0, 12, 12, 0]}
            label={renderBarLabel}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`network-${index}`} 
                fill="#48BB78" 
                style={{ mixBlendMode: 'screen' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Performance insight */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400 flex items-center justify-center">
          <Zap 
            className="text-green-400 mr-2" 
            size={20} 
            fill="currentColor"
          />
          <span className="text-green-400 font-bold">NetworkApp</span> is{' '}
          <span className="text-yellow-400 font-bold ml-1 mr-1">{(17.72 / 1).toFixed(1)}x faster</span>{' '}
          than human performance
          <Zap 
            className="text-green-400 ml-2" 
            size={20} 
            fill="currentColor"
          />
        </p>
      </div>
    </div>
  );
};

export default PerformanceChart;