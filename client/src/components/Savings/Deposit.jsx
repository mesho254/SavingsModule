import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
  const [formData, setFormData] = useState({ amount: 0, goalId: '', description: '' });
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  const fetchGoals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/goals');
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
      await axios.post('http://localhost:5000/api/transactions/deposit', formData);
      alert('Deposit processed');
      navigate('/ledger');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleGoalChange = (e) => {
    setFormData({ ...formData, goalId: e.target.value });
  };

  const containerStyle = { maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' };
  const formStyle = { display: 'grid', gap: '10px' };
  const inputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  };
  const selectStyle = {
    ...inputStyle,
    padding: '10px',
  };
  const buttonStyle = {
    padding: '10px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>Make Deposit</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          style={inputStyle}
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <label htmlFor="goalId">Goal</label>
        <select
          id="goalId"
          style={selectStyle}
          value={formData.goalId}
          onChange={handleGoalChange}
        >
          <option value="">No goal (optional)</option>
          {goals.map((goal) => (
            <option key={goal._id} value={goal._id}>
              Goal: ${goal.amount} by {new Date(goal.targetDate).toLocaleDateString()}
            </option>
          ))}
        </select>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          style={inputStyle}
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button type="submit" style={buttonStyle}>Deposit</button>
      </form>
    </div>
  );
};

export default Deposit;