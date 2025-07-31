import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminSignup.css'; // ✅ Import the CSS

const AdminSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/admins/signup', form);
      alert('Signup successful! You can now login.');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
     <div className="admin-signup-container">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required /><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default AdminSignup;
