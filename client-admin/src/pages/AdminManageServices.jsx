import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminManageServices.css';
import { useNavigate } from 'react-router-dom';

const AdminManageServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', durationMin: '', durationMax: '', image: '' });
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      fetchServices();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/services', form);
      setForm({ name: '', price: '', durationMin: '', durationMax: '', image: '' });
      fetchServices();
    } catch (err) {
      alert('Failed to add service');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Please login as admin.');
      window.location.href = '/admin/login';
    } else {
      fetchServices();
    }
  }, []);

  return (
    <div className="admin-services-container">
      {/* Sidebar */}
      <div className="seidebar">
        <div className="seidebar-buttons">
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

      {/* Main content */}
      <div className="services-main">
        <h2>Manage Services</h2>

        <form onSubmit={handleAdd} className="service-form">
          <input name="name" placeholder="Service Name" onChange={handleChange} value={form.name} required />
          <input name="price" placeholder="Price" type="number" onChange={handleChange} value={form.price} required />
          <input name="durationMin" placeholder="Min Duration (min)" type="number" onChange={handleChange} value={form.durationMin} required />
          <input name="durationMax" placeholder="Max Duration (min)" type="number" onChange={handleChange} value={form.durationMax} required />
          <input name="image" placeholder="Image file (e.g. haircut.jpg)" onChange={handleChange} value={form.image} required />
          <button type="submit">Add Service</button>
        </form>

        <h3>All Services</h3>
        <table className="service-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>Rs. {s.price}</td>
                <td>{s.durationMin} - {s.durationMax} mins</td>
                <td>{s.image}</td>
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

export default AdminManageServices;
