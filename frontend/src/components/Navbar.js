import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🍼 BabyCare</Link>
      <ul className="navbar-links">
        <li><Link to="/" className={isActive('/')}>🏠 Dashboard</Link></li>
        <li><Link to="/babies" className={isActive('/babies')}>👶 Babies</Link></li>
        <li><Link to="/activities" className={isActive('/activities')}>📋 Activities</Link></li>
        <li><Link to="/growth" className={isActive('/growth')}>📈 Growth</Link></li>
        <li><Link to="/reminders" className={isActive('/reminders')}>🔔 Reminders</Link></li>
        <li><Link to="/vaccinations" className={isActive('/vaccinations')}>💉 Vaccines</Link></li>
        <li>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout ({user?.name})
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
