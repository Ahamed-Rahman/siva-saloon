import React from 'react';
import '../styles/ServicesPage.css';

const ServiceCard = ({ service, onClick }) => {
  return (
    <div className="service-card" onClick={() => onClick(service)}>
      <img src={`/assets/${service.image}`} alt={service.name} />
      <div className="service-info">
        <h3>{service.name}</h3>
        <p>{service.price}</p>
        <p>{service.durationMin} - {service.durationMax} min</p>
      </div>
    </div>
  );
};

export default ServiceCard;
