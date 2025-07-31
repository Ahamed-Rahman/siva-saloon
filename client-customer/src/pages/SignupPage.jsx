// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import axios from 'axios';
import signupVideo from '../assets/signup.mp4';

import Navbar from '../components/Navbar';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      // ✅ 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const firebaseUser = userCredential.user;

      // ✅ 2. Set display name
      await updateProfile(firebaseUser, { displayName: form.fullName });

      // ✅ 3. Save to MongoDB
      await axios.post('http://localhost:5000/api/users/firebase', {
        uid: firebaseUser.uid,
        fullName: form.fullName,
        email: form.email
      });

      // ✅ 4. Store locally
      localStorage.setItem('user', JSON.stringify(firebaseUser));
      alert('Signup successful!');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <div className="signup-video-container">
  <video autoPlay loop muted playsInline className="signup-video">
    <source src={signupVideo} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

        <div className="signup-form-box">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
            <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
            <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
            <input name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} required />
            <button type="submit">Signup</button>
          </form>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
