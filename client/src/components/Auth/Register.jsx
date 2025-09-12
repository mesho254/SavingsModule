import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'parent' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data);
      navigate('/goals');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'grid',
    gap: '10px',
  };
  const inputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  };
  const buttonStyle = {
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  const selectStyle = { ...inputStyle };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
      <input style={inputStyle} placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      <input style={inputStyle} placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
      <input style={inputStyle} placeholder="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
      <select style={selectStyle} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
        <option value="parent">Parent</option>
      </select>
      <button type="submit" style={buttonStyle}>Register</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </form>
  );
};

export default Register;