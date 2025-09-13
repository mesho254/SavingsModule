import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PendingWithdrawals = () => {
  const { user } = useContext(AuthContext);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [filter, setFilter] = useState(user?.role === 'admin' ? 'all' : 'mine');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const url = `https://savings-module.vercel.app/api/admin/pending${filter === 'mine' ? `?userId=${user._id}` : ''}`;
        const res = await axios.get(url);
        setPendingWithdrawals(res.data);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    fetchPending();
  }, [filter, user?._id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, rowsPerPage]);

  const openModal = (id, action) => {
    setSelectedId(id);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      const endpoint = modalAction === 'approve' ? '/approve' : '/reject';
      await axios.post(`https://savings-module.vercel.app/api/admin${endpoint}`, { transactionId: selectedId });
      setPendingWithdrawals(pendingWithdrawals.filter(p => p._id !== selectedId));
      setShowModal(false);
    } catch (error) {
      alert(error.response.data.message);
      setShowModal(false);
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentWithdrawals = pendingWithdrawals.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(pendingWithdrawals.length / rowsPerPage);

  const cardStyle = { border: '1px solid #E0E0E0', padding: '15px', borderRadius: '8px', background: 'white', width: '100%', margin: '20px 0' };
  const buttonStyle = { padding: '5px 10px', margin: '0 5px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const approveBtn = { ...buttonStyle, background: '#32CD32', color: 'white' };
  const rejectBtn = { ...buttonStyle, background: '#DC143C', color: 'white' };
  const tableWrapperStyle = {
    overflowX: 'auto',
    marginTop: '10px',
  };
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    whiteSpace: 'nowrap',
  };
  const thStyle = { border: '1px solid #E0E0E0', padding: '8px', background: '#F5F5F5' };
  const tdStyle = { border: '1px solid #E0E0E0', padding: '8px' };
  const filterStyle = { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' };
  const filterButtonStyle = { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#20B2AA', color: 'white' };
  const activeFilterButtonStyle = { ...filterButtonStyle, background: '#0F9D58' };
  const paginationStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' };
  const paginationButtonStyle = { padding: '5px 10px', margin: '0 5px', border: '1px solid #E0E0E0', borderRadius: '4px', cursor: 'pointer', background: 'white' };
  const disabledButtonStyle = { ...paginationButtonStyle, cursor: 'not-allowed', opacity: 0.5 };
  const selectStyle = { padding: '5px', border: '1px solid #E0E0E0', borderRadius: '4px' };
  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    zIndex: 1000,
    textAlign: 'center'
  };
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999
  };
  const modalButtonStyle = { padding: '10px 20px', margin: '10px', cursor: 'pointer' };

  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: 'center' }}>Pending Withdrawals</h2>
      <div style={filterStyle}>
        {user?.role === 'admin' && (
          <button
            onClick={() => setFilter('all')}
            style={filter === 'all' ? activeFilterButtonStyle : filterButtonStyle}
          >
            All
          </button>
        )}
        <button
          onClick={() => setFilter('mine')}
          style={filter === 'mine' ? activeFilterButtonStyle : filterButtonStyle}
        >
          My Pending Withdrawals
        </button>
      </div>
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Goal Amount</th>
              <th style={thStyle}>Withdrawal Amount</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentWithdrawals.map((w) => (
              <tr key={w._id}>
                <td style={tdStyle}>{w.userId?.name}</td>
                <td style={tdStyle}>{`Goal: $${w.goalId?.amount} Current Balance: ${w.goalId?.currentBalance}`}</td>
                <td style={tdStyle}>{`$${w.amount}`}</td>
                <td style={tdStyle}>{new Date(w.date).toLocaleString()}</td>
                <td style={tdStyle}>{w.description}</td>
                <td style={tdStyle}>
                  <button onClick={() => openModal(w._id, 'approve')} style={approveBtn}>Approve</button>
                  <button onClick={() => openModal(w._id, 'reject')} style={rejectBtn}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={paginationStyle}>
        <select 
          value={rowsPerPage} 
          onChange={(e) => setRowsPerPage(e.target.value === 'All' ? pendingWithdrawals.length : Number(e.target.value))}
          style={selectStyle}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value="All">All</option>
        </select>
        <div>
          <button 
            style={currentPage === 1 ? disabledButtonStyle : paginationButtonStyle} 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            style={currentPage === totalPages ? disabledButtonStyle : paginationButtonStyle} 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
      {showModal && (
        <>
          <div style={overlayStyle} onClick={() => setShowModal(false)} />
          <div style={modalStyle}>
            <p>Are you sure you want to {modalAction} this withdrawal?</p>
            <button onClick={handleConfirm} style={{ ...modalButtonStyle, background: '#32CD32', color: 'white' }}>Yes</button>
            <button onClick={() => setShowModal(false)} style={{ ...modalButtonStyle, background: '#DC143C', color: 'white' }}>No</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PendingWithdrawals;