import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SelectStylistPage.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const SelectStylistPage = () => {
  const [stylists, setStylists] = useState([]);
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stylists');
        setStylists(res.data);
      } catch (err) {
        console.error('Failed to load stylists', err);
      }
    };
    fetchStylists();
  }, []);

  const handleStylistClick = (stylistId) => {
    navigate(`/book?stylist=${stylistId}&service=${serviceId}`);
  };

  return (
    <div className="select-stylist-page">
        <div className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft />
      </div>
      
      <h2>Select Your Stylist</h2>
      <div className="stylist-grid">
        {stylists.map((s) => (
          <div key={s._id} className="stylist-card" onClick={() => handleStylistClick(s._id)}>
            <img src={`/assets/${s.image}`} alt={s.name} />
            <h3>{s.name}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectStylistPage;
