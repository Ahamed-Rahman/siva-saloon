// ✅ Updated: src/pages/PaymentSuccess.jsx
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasFinalized = useRef(false); // ✅ Ref to prevent multiple API calls

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      alert('Missing payment session ID');
      return navigate('/');
    }

    // ✅ Prevent double call
    if (hasFinalized.current) return;
    hasFinalized.current = true;

    const finalizeBooking = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/payments/finalize', {
          sessionId,
        });

        console.log('✅ Booking confirmed:', res.data);
        alert('Booking saved successfully!');
        localStorage.removeItem('pendingBooking'); // ✅ optional cleanup
      } catch (err) {
        console.error('❌ Error finalizing booking:', err);
        alert('Booking confirmation failed.');
      }
    };

    finalizeBooking();
  }, [navigate, searchParams]);

  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h2>✅ Payment Successful!</h2>
      <p>Your appointment has been confirmed.</p>
      <a href="/">Go to Home</a>
    </div>
  );
};

export default PaymentSuccess;
