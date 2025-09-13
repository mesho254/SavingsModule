import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, NavLink } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import GoalCreate from './components/Savings/GoalCreate';
import Deposit from './components/Savings/Deposit';
import Withdrawal from './components/Savings/Withdrawal';
import Ledger from './components/Savings/Ledger';
import Dashboard from './components/Dashboard/Dashboard';
import PendingWithdrawals from './components/Dashboard/PendingWithdrawals'; 
import { FaMoneyCheckAlt, FaSignOutAlt, FaChartBar, FaBullseye, FaPlusCircle, FaMinusCircle, FaReceipt, FaChartPie } from 'react-icons/fa';
import Logo from './assets/logo.JPG';

const App = () => {
  const { user, loading, logout } = useContext(AuthContext);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>Loading...</div>;

  const navStyle = { display: 'flex', background: '#F5F5F5', padding: '10px', justifyContent: 'space-around' };
  const linkStyle = { textDecoration: 'none', color: '#20B2AA', padding: '5px 10px' };
  const topLinkStyle = ({ isActive }) => ({
    ...linkStyle,
    color: isActive ? '#191970' : '#20B2AA',
    fontWeight: isActive ? 'bold' : 'normal'
  });
  const sidebarStyle = {
    width: '220px',
    background: '#191970',
    color: 'white',
    padding: '20px',
    height: '100vh',
    position: 'fixed',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  };
  const sidebarLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background 0.3s',
  };
  const sidebarLinkHover = {
    background: '#FF7F50',
  };
  const sidebarNavStyle = ({ isActive }) => ({
    ...sidebarLinkStyle,
    backgroundColor: isActive ? sidebarLinkHover.background : 'transparent'
  });
  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#DC143C',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    width: '100%',
    borderRadius: '5px',
    marginTop: '20px',
  };
  const mainStyle = { marginLeft: user && user.role === 'admin' ? '250px' : '0', padding: '20px' };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = sidebarLinkHover.background;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = e.currentTarget.classList.contains('active') ? sidebarLinkHover.background : 'transparent';
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {user && user.role === 'admin' && (
          <nav style={sidebarStyle}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Panel</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <NavLink
                  to="/dashboard"
                  style={sidebarNavStyle}
                  className="sidebar-link"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <FaChartBar /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/pending"
                  style={sidebarNavStyle}
                  className="sidebar-link"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <FaMoneyCheckAlt /> Pending Withdrawals
                </NavLink>
              </li>
            </ul>
            <button
              onClick={logout}
              style={logoutButtonStyle}
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        )}
        <div style={{ flex: 1, ...mainStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/" style={linkStyle}>
            <img src={Logo} alt="NISS Smart" style={{ height: '40px', width: 'auto' }} />
          </Link> 

          <h1>Savings Module</h1>
          {user && 
            <h2>Welcome, {user ? user.name : ''}</h2>
          }
          </div>
          {user && <nav style={navStyle}>
           
            <NavLink to="/goals" style={topLinkStyle}>
              <FaBullseye /> Goals
            </NavLink>
            <NavLink to="/deposit" style={topLinkStyle}>
              <FaPlusCircle /> Deposit
            </NavLink>
            <NavLink to="/withdrawal" style={topLinkStyle}>
              <FaMinusCircle /> Withdraw
            </NavLink>
            <NavLink to="/ledger" style={topLinkStyle}>
              <FaReceipt /> Ledger
            </NavLink>
            {user.role === 'admin' && <NavLink to="/dashboard" style={topLinkStyle}>
              <FaChartPie /> Analytics
            </NavLink>}
            <button onClick={logout} style={{ background: '#DC143C', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
          </nav>}
          <Routes>
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/goals" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/goals" />} />
            <Route path="/goals" element={user ? <GoalCreate /> : <Navigate to="/login" />} />
            <Route path="/deposit" element={user ? <Deposit /> : <Navigate to="/login" />} />
            <Route path="/withdrawal" element={user ? <Withdrawal /> : <Navigate to="/login" />} />
            <Route path="/ledger" element={user ? <Ledger /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user && user.role === 'admin' ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/pending" element={user && user.role === 'admin' ? <PendingWithdrawals /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/goals" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;