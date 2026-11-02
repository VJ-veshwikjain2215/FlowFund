import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#FFFFFF', '#B4C5FF', '#2563EB', '#003EA8'];

const BufferPieChart = ({ tax = 0, medical = 0, emergency = 0, safe = 0, height = 250 }) => {
  const data = [
    { name: 'Tax Buffer', value: Number(tax) },
    { name: 'Medical', value: Number(medical) },
    { name: 'Emergency', value: Number(emergency) },
    { name: 'Safe Spend', value: Number(safe) }
  ].filter(d => d.value > 0);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={10}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={80} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              background: '#1C1B1B', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '1rem', 
              backdropFilter: 'blur(20px)' 
            }}
            itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontDisplay: 'Manrope' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BufferPieChart;
