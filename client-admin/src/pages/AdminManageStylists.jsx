import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminManageStylists.css';
import { useNavigate } from 'react-router-dom';

const specializations = [
  "Hair Cut", "Beard Trim", "Man’s Shave", "Fire Hair Cut", "Head Massage",
  "Hair Steamer", "Hair Colouring", "Hair Steting", "Facial", "Manicure",
  "Pedicure", "Piercing", "Belly Button Piercing", "Tattoo"
];

const AdminManageStylists = () => {
  const [stylists, setStylists] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    description: '',
    image: '',
    specialization: [],
  });

  const navigate = useNavigate();

  const fetchStylists = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stylists');
      setStylists(res.data);
    } catch (err) {
      console.error('Error fetching stylists');
    }
  };

  useEffect(() => {
    fetchStylists();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...form.specialization, value]
      : form.specialization.filter((s) => s !== value);
    setForm({ ...form, specialization: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/stylists', form);
      alert('Stylist added');
      setForm({ name: '', email: '', password: '', description: '', image: '', specialization: [] });
      fetchStylists();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding stylist');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stylist?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/stylists/${id}`);
      fetchStylists();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-stylist-container">
      {/* Sidebar */}
      <div className="sqidebar">
        <div className="sqidebar-buttons">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/services')}>Manage Services</button>
          <button onClick={() => navigate('/stylists')}>Manage Stylists</button>
          <button onClick={() => navigate('/bookings')}>Manage Bookings</button>
        </div>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="stylist-main">
        <h2>Add New Stylist</h2>
        <form onSubmit={handleSubmit} className="stylist-form">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="image" placeholder="Image (e.g., siva.jpg)" value={form.image} onChange={handleChange} required />

          <h4>Specializations</h4>
          <div className="checkbox-group">
            {specializations.map((item, i) => (
              <label key={i} className="checkbox-item">
                <input
                  type="checkbox"
                  value={item}
                  checked={form.specialization.includes(item)}
                  onChange={handleCheckboxChange}
                />
                {item}
              </label>
            ))}
          </div>
          <button type="submit">Add Stylist</button>
        </form>

        <h3>All Stylists</h3>
        <table className="stylist-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Image</th>
              <th>Specialization</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stylists.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.image}</td>
                <td>{s.specialization?.join(', ')}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageStylists;
