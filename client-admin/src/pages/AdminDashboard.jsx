import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import '../styles/AdminDashboard.css';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admins/revenue');
        setTotalRevenue(res.data.totalRevenue || 0);
        setMonthlyData(res.data.monthlyRevenue || {});
      } catch (err) {
        alert('Failed to fetch revenue');
      }
    };

    fetchRevenue();
  }, []);

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Revenue (Rs.)',
        data: Object.values(monthlyData),
        backgroundColor: 'rgba(255,255,255, 0.7)',
      }
    ]
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="ssidebar">
        <div className="ssidebar-buttons">
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

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h2>Welcome Admin</h2>
        <div className="revenue-box">
          <h3>Total Revenue:</h3>
          <p>Rs. {totalRevenue.toLocaleString('en-LK')}</p>
        </div>

        <div className="chart-container">
          <h4>Monthly Revenue Overview</h4>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
