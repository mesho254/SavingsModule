import React from 'react';

const TopSavers = ({ data }) => {
  const cardStyle = { border: '1px solid #E0E0E0', padding: '15px', borderRadius: '8px', background: 'white' };
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    overflowX: 'auto',
    display: 'block',
    whiteSpace: 'nowrap',
  };
  const thStyle = { border: '1px solid #E0E0E0', padding: '8px', background: '#F5F5F5' };
  const tdStyle = { border: '1px solid #E0E0E0', padding: '8px' };

  return (
    <div style={cardStyle}>
      <h2>Top 5 Consistent Savers</h2>
      <table style={tableStyle}>
        <thead>
          <tr><th style={thStyle}>Name</th><th style={thStyle}>Frequency</th><th style={thStyle}>Total Saved</th></tr>
        </thead>
        <tbody>
          {data?.map((s, i) => (
            <tr key={i}><td style={tdStyle}>{s.name}</td><td style={tdStyle}>{s.frequency}</td><td style={tdStyle}>${s.totalSaved}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopSavers;