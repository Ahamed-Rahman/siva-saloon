import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/AboutPage.css';
import aboutVideo from '../assets/about.mp4';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div id="about" className="about-section">
        <div className="about-video">
          <video src={aboutVideo} autoPlay loop muted playsInline />
        </div>
        <div className="about-content">
          <h2 className="about-heading">Who We Are?</h2>
          <h3 className="about-subheading">Siva Saloon – Styling with Passion Since 2000</h3>
          <p className="about-text">
            At Siva Saloon, we blend tradition with modern grooming to offer the best salon experience for men.
            With over two decades of expertise, our barbers are committed to delivering top-notch haircuts,
            beard styling, and personal care. From casual cuts to refined styles, we’re here to make every visit
            comfortable, stylish, and memorable.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
