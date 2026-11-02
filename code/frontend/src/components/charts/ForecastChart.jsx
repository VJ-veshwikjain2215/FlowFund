import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const ForecastChart = ({ data, height = 300 }) => {
  const chartData = data?.map((val, i) => ({
    name: `M${i + 1}`,
    value: val
  })) || [];

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B4C5FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#B4C5FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="12 12" stroke="rgba(255,255,255,0.02)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.1)"
            fontSize={8}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ stroke: 'rgba(180, 197, 255, 0.2)', strokeWidth: 2 }}
            contentStyle={{
              background: '#1C1B1B',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1.5rem',
              backdropFilter: 'blur(20px)',
              padding: '1.5rem'
            }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900', fontFamily: 'Manrope' }}
            formatter={(value) => formatCurrency(value)}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#B4C5FF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#forecastFill)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
