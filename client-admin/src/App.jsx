import { Routes, Route } from 'react-router-dom';

import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddService from './pages/AdminAddService';
import AdminManageServices from './pages/AdminManageServices';
import AdminAddStylist from './pages/AdminAddStylist';
import AdminManageStylists from './pages/AdminManageStylists';
import AdminManageBookings from './pages/AdminManageBookings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminSignup />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/add-service" element={<AdminAddService />} />
      <Route path="/services" element={<AdminManageServices />} />
      <Route path="/kk" element={<AdminAddStylist />} />
      <Route path="/stylists" element={<AdminManageStylists />} />
      <Route path="/bookings" element={<AdminManageBookings />} />
    </Routes>
  );
}

export default App;
