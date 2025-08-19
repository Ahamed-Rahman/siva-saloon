import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageFeedbacks.css';

const ManageFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/reviews');
        setFeedbacks(data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };
    fetch();
  }, []);

  return (
 <div className="admin-services-container">

     {/* Sidebar */}
    
  <div className="ssidebar">
        <div className="ssidebar-buttons">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/services')}>Manage Services</button>
          <button onClick={() => navigate('/stylists')}>Manage Stylists</button>
          <button onClick={() => navigate('/bookings')}>Manage Bookings</button>
           <button onClick={() => navigate('/feedbacks')}>

           Manage Feedbacks
         </button>
        </div>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }}>
          Logout
        </button>
      </div>
      

    <div className="feedbacks-page">
        
      <h2>💬 Manage Feedbacks</h2>
      <div className="feedback-cards">
        {feedbacks.length === 0 && <p>No feedbacks yet.</p>}
        {feedbacks.map((fb) => (
          <div key={fb._id} className="feedback-card">
            <div className="card-header">
              <div className="user-icon">👤</div>
              <div>
                <div className="user-name">{fb.userFullName}</div>
                <div className="service-name">Service: {fb.serviceName}</div>
                <div className="date">📅 {new Date(fb.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="rating">
              {[...Array(fb.rating)].map((_, i) => (
                <span key={i} className="star">⭐</span>
              ))}
            </div>
            <p className="comment">{fb.comment}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default ManageFeedbacks;
