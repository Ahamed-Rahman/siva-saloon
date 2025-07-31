import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StylistDashboard.css'; // ✅ Add this line

const StylistDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');

  const stylist = JSON.parse(localStorage.getItem('stylistInfo'));
  const stylistId = stylist?._id;

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stylists/bookings/${stylistId}`);
      const uniqueBookings = [];
      const seen = new Set();

      res.data.forEach(b => {
        const key = `${b.userId?._id}-${b.serviceId?._id}-${b.date}-${b.startTime}-${b.endTime}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueBookings.push(b);
        }
      });

      setBookings(uniqueBookings);
      setFilteredBookings(uniqueBookings);
      calculateRevenue(uniqueBookings);
    } catch (err) {
      alert('Error fetching stylist data');
    }
  };

  const calculateRevenue = (data) => {
    let total = 0;
    data.forEach(b => {
      const rawPrice = b?.price || b?.serviceId?.priceMin;
      const price = Number(rawPrice);
      if (!isNaN(price)) total += price;
    });
    setRevenue(total);
  };

  const handleMarkCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/stylists/bookings/complete/${id}`);
      alert('Booking marked as completed');
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  const applyFilter = (status) => {
    setStatusFilter(status);
    if (status === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === status));
    }
  };

  useEffect(() => {
    if (!stylistId) {
      alert('Login required');
      window.location.href = '/stylist/login';
    } else {
      fetchBookings();
    }
  }, []);

  return (
    <div className="stylist-dashboard-container">
      <h2 className="welcome-text">Welcome {stylist.name}</h2>
      <h3 className="revenue-text">Total Revenue: Rs. {revenue.toLocaleString('en-LK')}</h3>

      <h3 className="booking-header">My Bookings</h3>

      <div className="filter-buttons">
        <button onClick={() => applyFilter('All')}>All</button>
        <button onClick={() => applyFilter('Pending')}>Pending</button>
        <button onClick={() => applyFilter('Completed')}>Completed</button>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Fee</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((b) => (
            <tr key={b._id}>
              <td>{b.userId?.fullName || 'N/A'}</td>
              <td>{b.serviceId?.name}</td>
              <td>{b.date}</td>
              <td>{b.startTime} - {b.endTime}</td>
              <td>Rs. {b.price || b.serviceId?.priceMin || '0.00'}</td>
              <td>{b.status}</td>
              <td>
                {b.status !== 'Completed' && (
                  <button onClick={() => handleMarkCompleted(b._id)} className="complete-btn">
                    Mark as Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredBookings.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No bookings found for {statusFilter}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StylistDashboard;
