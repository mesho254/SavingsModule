import React from 'react';

const NudgeList = ({ data }) => {
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
      <h2>Nudge List (No Deposits in 21 Days)</h2>
      <table style={tableStyle}>
        <thead>
          <tr><th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Days Since Last</th></tr>
        </thead>
        <tbody>
          {data?.map((n, i) => (
            <tr key={i}><td style={tdStyle}>{n.name}</td><td style={tdStyle}>{n.email}</td><td style={tdStyle}>{Math.floor(n.daysSinceLast)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NudgeList;