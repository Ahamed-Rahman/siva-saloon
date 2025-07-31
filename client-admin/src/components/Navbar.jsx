import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      alert('Logged out');
      navigate('/');
    } catch (err) {
      alert('Logout failed');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="Siva Saloon Logo" style={{ cursor: 'pointer' }} />
      </div>

      <ul className="nav-links">
        <li><HashLink smooth to="/#hero">Home</HashLink></li>
        <li><HashLink smooth to="/#about">About</HashLink></li>
        <li><HashLink smooth to="/#services">Services</HashLink></li>
        <li><HashLink smooth to="/#contact">Contact Us</HashLink></li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.displayName || user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="book-btn" onClick={() => navigate('/signup')}>
              Book an Appointment
            </button>
            <button className="book-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
