import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://savings-module.vercel.app/api/auth/login', formData);
      login(res.data);
      navigate(res.data.role === 'admin' ? '/dashboard' : '/goals');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'grid',
    gap: '10px',
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

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <input style={inputStyle} placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
      <input style={inputStyle} placeholder="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
      <button type="submit" style={buttonStyle}>Login</button>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>Don't have an account? <a href="/register">Register</a></p>
    </form>
  );
};

export default Login;