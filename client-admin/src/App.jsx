import { Routes, Route } from 'react-router-dom';

import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import AdminManageServices from './pages/AdminManageServices';
import AdminAddStylist from './pages/AdminAddStylist';
import AdminManageStylists from './pages/AdminManageStylists';
import AdminManageBookings from './pages/AdminManageBookings';
import ManageFeedbacks from './pages/ManageFeedbacks';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminSignup />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
     
      <Route path="/services" element={<AdminManageServices />} />
      <Route path="/kk" element={<AdminAddStylist />} />
      <Route path="/stylists" element={<AdminManageStylists />} />
      <Route path="/bookings" element={<AdminManageBookings />} />
              <Route path="/feedbacks" element={<ManageFeedbacks />} />
    </Routes>
  );
}

export default App;
