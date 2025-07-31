import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const specializations = [
  "Hair Cut", "Beard Trim", "Man’s Shave", "Fire Hair Cut", "Head Massage",
  "Hair Steamer", "Hair Colouring", "Hair Steting", "Facial", "Manicure",
  "Pedicure", "Piercing", "Belly Button Piercing", "Tattoo"
];

const AdminAddStylist = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    specialization: []
  });
    const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedSpecializations = checked
      ? [...form.specialization, value]
      : form.specialization.filter((s) => s !== value);

    setForm({ ...form, specialization: updatedSpecializations });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/stylists', form);
      alert('Stylist added successfully');
      setForm({ name: '', description: '', image: '', specialization: [] });
    } catch (err) {
      alert('Failed to add stylist');
      console.error(err);
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
    navigate('login');
  }}>
    Logout
  </button>
</div>

    <div style={{ padding: '40px', maxWidth: '700px', margin: 'auto' }}>
      <h2>Add New Stylist</h2>

          
  
      

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Stylist Name" value={form.name} onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Short Description" value={form.description} onChange={handleChange} required /><br />
        <input name="image" placeholder="Image File (e.g., siva.jpg)" value={form.image} onChange={handleChange} required /><br />

        <h4>Select Specializations:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {specializations.map((item, index) => (
            <label key={index}>
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

        <br />
        <button type="submit">Add Stylist</button>
      </form>
    </div>
    </div>
    
    
  );
};

export default AdminAddStylist;
