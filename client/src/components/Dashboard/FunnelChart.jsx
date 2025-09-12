import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FunnelChart = ({ data }) => {
  const chartData = [
    { stage: 'Registered', value: data?.registered || 0 },
    { stage: 'Goal Created', value: data?.goalsCreated || 0 },
    { stage: 'First Deposit', value: data?.firstDeposits || 0 },
  ];

  const cardStyle = { border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: 'white' };

  return (
    <div style={cardStyle}>
      <h2>Funnel</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FunnelChart;