import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 
import FunnelChart from './FunnelChart';
import TrendChart from './TrendChart';
import TopSavers from './TopSavers';
import NudgeList from './NudgeList';
import AdminTransactions from './AdminTransactions';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState({});
  const [filter, setFilter] = useState(user?.role === 'admin' ? 'all' : 'mine');

  useEffect(() => {
    const fetchAnalytics = async () => {  
      try {
        const url = `https://savings-module.vercel.app/api/analytics${filter === 'mine' ? `?userId=${user._id}` : ''}`;
        const res = await axios.get(url);
        setAnalytics(res.data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    fetchAnalytics();
  }, [filter, user?._id]);

  const dashboardStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '20px' };
  const cardStyle = { border: '1px solid #E0E0E0', padding: '15px', borderRadius: '8px', background: 'white' };
  const filterStyle = { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' };
  const buttonStyle = { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#20B2AA', color: 'white' };
  const activeButtonStyle = { ...buttonStyle, background: '#0F9D58' };

  return (
    <div style={dashboardStyle}>
      <h1 style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Analytics Dashboard</h1>
      <div style={{ ...filterStyle, gridColumn: '1 / -1' }}>
        {user?.role === 'admin' && (
          <button
            onClick={() => setFilter('all')}
            style={filter === 'all' ? activeButtonStyle : buttonStyle}
          >
            All
          </button>
        )}
        <button
          onClick={() => setFilter('mine')}
          style={filter === 'mine' ? activeButtonStyle : buttonStyle}
        >
          My Analytics
        </button>
      </div>
      <div style={cardStyle}>
        <h2>Totals</h2>
        <p>Total Deposits: ${analytics.totals?.deposits || 0}</p>
        <p>Total Withdrawals: ${analytics.totals?.withdrawals || 0}</p>
      </div>
      <FunnelChart data={analytics.funnel} />
      <TrendChart data={analytics.dailyDeposits} />
      <TopSavers data={analytics.topSavers} />
      <NudgeList data={analytics.nudgeList} />
      <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
        <p>Active Parents: {analytics.activeParents}</p>
        <p>Deposit Success Rate: {analytics.depositSuccessRate?.toFixed(2)}%</p>
        <p>Avg Deposit Size: ${analytics.avgDepositSize?.toFixed(2)}</p>
        <p>Avg Frequency: {analytics.avgFrequency}</p>
        <p>Withdrawal Ratio: {analytics.withdrawalRatio?.toFixed(2)}</p>
      </div>
      
      {user?.role === 'admin' && (
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <AdminTransactions />
        </div>
      )}
    </div>
  );
};

export default Dashboard;