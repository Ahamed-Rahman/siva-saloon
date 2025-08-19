import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import '../styles/ServicesPage.css';
import { useNavigate } from 'react-router-dom';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('user'); // or check token later

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services', err);
      }
    };
    fetchServices();
  }, []);

  const handleServiceClick = (service) => {
    if (!isLoggedIn) {
      alert('Please login or signup to book.');
      return;
    }
    // Pass selected service to next screen
    navigate(`/select-stylist?service=${service._id}`);
  };

  return (
    <div id="services" className="services-page">
      <h2 className="s1">Our Amazing Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} onClick={handleServiceClick} />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
