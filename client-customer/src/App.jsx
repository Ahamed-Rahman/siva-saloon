import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';
import SelectStylistPage from './pages/SelectStylistPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './pages/Chatbot'; // ✅ Import Chatbot

function App() {
  return (
     <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/services" element={<ServicesPage />} />

      <Route
        path="/select-stylist"
        element={<ProtectedRoute><SelectStylistPage /></ProtectedRoute>}
      />
      <Route
        path="/book"
        element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
      />
      <Route
        path="/payment"
        element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}
      />

      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancelled" element={<PaymentCancelled />} />
    </Routes>
    
      {/* ✅ Chatbot will appear on all pages */}
      <Chatbot />
    </>
  );
}


export default App;
