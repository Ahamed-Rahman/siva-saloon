import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminManageBookings.css';

const AdminManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admins/bookings');

        const seen = new Set();
        const uniqueBookings = [];

        res.data.forEach((b) => {
          const key = `${b.userId?._id}-${b.serviceId?._id}-${b.date}-${b.startTime}-${b.endTime}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueBookings.push(b);
          }
        });

        setBookings(uniqueBookings);
      } catch (err) {
        alert('Failed to load bookings');
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="admin-bookings-container">
      {/* Sidebar */}
      <div className="syidebar">
        <div className="syidebar-buttons">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/services')}>Manage Services</button>
          <button onClick={() => navigate('/stylists')}>Manage Stylists</button>
          <button onClick={() => navigate('/bookings')}>Manage Bookings</button>
        </div>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="bookings-main">
        <h2>All Bookings</h2>
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Stylist</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.userId?.fullName || 'N/A'}</td>
                <td>{b.stylistId?.name || 'N/A'}</td>
                <td>{b.serviceId?.name || 'N/A'}</td>
                <td>{b.date}</td>
                <td>{b.startTime} - {b.endTime}</td>
                <td>Rs. {b.price || b.serviceId?.price || 'N/A'}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageBookings;
