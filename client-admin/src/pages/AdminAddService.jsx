import React, { useState } from 'react';
import axios from 'axios';

const AdminAddService = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    durationMin: '',
    durationMax: '',
    image: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/services', form);
      alert(res.data.message);
      setForm({ name: '', price: '', durationMin: '', durationMax: '', image: '' });
    } catch (err) {
      alert('Failed to create service');
    }
  };

  return (
  <div className="admin-services-container">

 {/* Sidebar */}
<div className="sidebar">
  <div className="sidebar-buttons">
    <button onClick={() => navigate('/dashboard')}>Dashboard</button><br /><br />
    <button onClick={() => navigate('/services')}>Manage Services</button><br /><br />
    <button onClick={() => navigate('/stylists')}>Manage Stylists</button><br /><br />
    <button onClick={() => navigate('/bookings')}>Manage Bookings</button><br /><br />
  </div>

  <button className="logout-btn" onClick={() => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  }}>
    Logout
  </button>
</div>


    
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Add New Service</h2>

           {/* Sidebar */}
   
      

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Service Name" value={form.name} onChange={handleChange} required /><br />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required /><br />
        <input name="durationMin" placeholder="Duration Min" type="number" value={form.durationMin} onChange={handleChange} /><br />
        <input name="durationMax" placeholder="Duration Max" type="number" value={form.durationMax} onChange={handleChange} /><br />
        <input name="image" placeholder="Image File Name (e.g. haircut.jpg)" value={form.image} onChange={handleChange} /><br />
        <button type="submit">Add Service</button>
      </form>
    </div>
    </div>
    
  );
};

export default AdminAddService;
