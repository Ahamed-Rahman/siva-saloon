// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setStatus({
        type: 'success',
        msg: 'Password reset email sent. Please check your inbox (and spam).',
      });
      setEmail('');
    } catch (err) {
      // Friendly messages for common Firebase errors
      let msg = 'Something went wrong. Please try again.';
      if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email.';
      if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
      if (err.code === 'auth/too-many-requests')
        msg = 'Too many attempts. Please wait a bit and try again.';
      setStatus({ type: 'error', msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-form-box">
          <h2 className="login-text">Forgot Password</h2>
          <p style={{ marginBottom: 12 }}>
            Enter your account email. We’ll send a link to reset your password.
          </p>
          <form className="login-input-form" onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>

          {status.msg && (
            <div
              style={{
                marginTop: 10,
                color: status.type === 'error' ? '#b00020' : '#0a6',
                fontSize: 14,
              }}
            >
              {status.msg}
            </div>
          )}

          <p style={{ marginTop: 16 }}>
            <a href="/login">Back to Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
