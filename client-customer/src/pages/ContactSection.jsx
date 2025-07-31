import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      alert('Message sent successfully!');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    }
  };


  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h4>CONTACT INFO</h4>
          <h2>Get In Touch</h2>
          <p>
            Feel free to reach out to us for bookings, questions, or feedback.
            We're happy to help!
          </p>

          <div className="info-block">
            <h5>Address</h5>
            <p>Kandy, Sri Lanka</p>
          </div>

          <div className="info-block">
            <h5>Phone</h5>
            <p>077-1234567</p>
          </div>

          <div className="info-block">
            <h5>e-Mail</h5>
            <p>info@sivasaloon.lk</p>
          </div>
        </div>

     <div className="contact-form">
          <h3>Contact Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
            </div>
            <div className="form-row">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" />
            </div>
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" rows="4" required></textarea>
            <button type="submit">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
