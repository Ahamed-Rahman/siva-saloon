import React from 'react';
import Navbar from '../components/Navbar';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import ContactSection from '../pages/ContactSection';
import '../styles/HomePage.css';


const HomePage = () => {
  return (
    <>
      <Navbar />
  <section className="hero-section" id="hero">
  {/* ✅ Video background */}
  <video autoPlay loop muted playsInline className="hero-video">
    <source src="/assets/hero.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div className="hero-overlay">
  <h1 className="hero-title">Welcome to Siva Saloon</h1>
  <p className="hero-subtitle">
    Expert grooming for men. Book your haircut or styling online and walk in with confidence!
  </p>

  {/* ✅ Button to navigate to signup */}
 <button
  className="hero-button"
  onClick={() => {
    const user = localStorage.getItem('user');
    if (user) {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/login';
    }
  }}
>
  Book an Appointment
</button>


</div>

</section>


   <AboutPage id="about" />
<ServicesPage id="services" />
<ContactSection id="contact" />
    </>
  );
};

export default HomePage;
