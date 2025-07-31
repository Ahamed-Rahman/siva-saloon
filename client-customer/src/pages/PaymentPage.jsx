// src/pages/PaymentPage.jsx
import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


// ✅ Your Stripe publishable key
const stripePromise = loadStripe('pk_test_51Rhbf5CcvfMW55deh69PAEzchQTFHfHfyu6jsBSNdZwSbv5xTTnkCzA2cggWD0fMTxRAcDXPMoFr6VMhnx4SbdXL00FIRMX1w4');

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = location.state;

    if (!data || !data.bookingData) {
      alert('Booking details not found.');
      return navigate('/');
    }

    const { serviceName, amount, bookingData } = data;

    const handlePayment = async () => {
      const stripe = await stripePromise;

      try {
        // ✅ Save bookingData to localStorage temporarily in case redirect wipes state
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

        const res = await axios.post('http://localhost:5000/api/payments/create-session', {
  serviceName,
  amount,
  bookingData, // 👈 send this to backend
});


        const sessionId = res.data.id;
        if (!sessionId) {
          alert('Failed to get Stripe session.');
          return;
        }

        await stripe.redirectToCheckout({ sessionId });
      } catch (err) {
        console.error('❌ Payment API error:', err);
        alert('Payment failed. Please try again.');
      }
    };

    handlePayment();
  }, [location, navigate]);

  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h2>Redirecting to payment...</h2>
    </div>
  );
};

export default PaymentPage;
