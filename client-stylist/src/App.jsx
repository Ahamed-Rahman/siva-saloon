import { Routes, Route } from 'react-router-dom';

import StylistLogin from './pages/StylistLogin';
import StylistDashboard from './pages/StylistDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StylistLogin />} />
      <Route path="/dashboard" element={<StylistDashboard />} />
    </Routes>
  );
}

export default App;
