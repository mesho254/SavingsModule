import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoalCreate = () => {
  const [formData, setFormData] = useState({ amount: 0, targetDate: '' });
  const [goals, setGoals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchGoals = async () => {
    try {
      const res = await axios.get('https://savings-module.vercel.app/api/goals');
      setGoals(res.data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://savings-module.vercel.app/api/goals', formData);
      alert('Goal created');
      navigate('/deposit');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const paginatedGoals = goals.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(goals.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const containerStyle = { margin: '20px' };
  const formStyle = { display: 'grid', gap: '10px' };
  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
  };
  const inputStyle = {
    padding: '10px',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  };
  const buttonStyle = {
    padding: '10px',
    background: '#20B2AA',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const formContainerStyle = { maxWidth: '500px', padding: '20px', border: '1px solid #E0E0E0', borderRadius: '8px', margin: '20px auto' };
  const tableContainerStyle = { width: '100%', padding: '20px', border: '1px solid #E0E0E0', borderRadius: '8px' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' };
  const thStyle = { border: '1px solid #E0E0E0', padding: '8px', backgroundColor: '#F5F5F5', textAlign: 'left' };
  const tdStyle = { border: '1px solid #E0E0E0', padding: '8px' };
  const paginationStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' };
  const pageButtonStyle = { padding: '5px 10px', margin: '0 5px', background: '#20B2AA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const selectStyle = { padding: '5px', border: '1px solid #E0E0E0', borderRadius: '4px' };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ textAlign: 'center' }}>Create Goal</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label htmlFor="amount" style={labelStyle}>Target Amount</label>
          <input
            id="amount"
            type="number"
            style={inputStyle}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          <label htmlFor="targetDate" style={labelStyle}>Target Date</label>
          <input
            id="targetDate"
            type="date"
            style={inputStyle}
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            required
          />
          <button type="submit" style={buttonStyle}>Create Goal</button>
        </form>
        {user.goals && (
          <button
            onClick={() => navigate('/ledger')}
            style={{ ...buttonStyle, background: '#FF7F50', marginTop: '10px' }}
          >
            View Ledger
          </button>
        )}
      </div>
      <div style={tableContainerStyle}>
        <h3>Your Goals</h3>
        {goals.length === 0 ? (
          <p>No goals yet.</p>
        ) : (
          <>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>User Name</th>
                  <th style={thStyle}>Target Amount</th>
                  <th style={thStyle}>Current Balance</th>
                  <th style={thStyle}>Target Date</th>
                  <th style={thStyle}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGoals.map((goal) => (
                  <tr key={goal._id}>
                    <td style={tdStyle}>{goal.userId?.name || 'N/A'}</td>
                    <td style={tdStyle}>${goal.amount}</td>
                    <td style={tdStyle}>${goal.currentBalance || 0}</td>
                    <td style={tdStyle}>{new Date(goal.targetDate).toLocaleDateString()}</td>
                    <td style={tdStyle}>{new Date(goal.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={paginationStyle}>
              <div>
                <button
                  style={pageButtonStyle}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  style={pageButtonStyle}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
              <div>
                Rows per page:
                <select style={selectStyle} value={rowsPerPage} onChange={handleRowsPerPageChange}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoalCreate;