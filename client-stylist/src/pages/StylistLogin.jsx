import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/StylistLogin.css'; // ✅ Add this line

const StylistLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/stylists/login', form);
      localStorage.setItem('stylistToken', res.data.token);
      localStorage.setItem('stylistInfo', JSON.stringify(res.data.stylist));
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="stylist-login-container">
      <div className="login-box">
        <h2>Stylist Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            required
          /><br />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
          /><br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default StylistLogin;
