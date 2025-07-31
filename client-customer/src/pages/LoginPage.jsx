// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import loginVideo from '../assets/signup.mp4'; // or path to your hero.mp4

import Navbar from '../components/Navbar';
import '../styles/loginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const firebaseUser = userCredential.user;

      localStorage.setItem('user', JSON.stringify(firebaseUser));
      alert('Login successful');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
    <div className="login-container">
     <div className="login-video-container">
  <video autoPlay loop muted playsInline className="login-video">
    <source src={loginVideo} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

      <div className="login-form-box">
        <h2 className="login-text">Login</h2>
        <form className="login-input-form" onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>Don’t have an account? <a href="/signup">Signup</a></p>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
