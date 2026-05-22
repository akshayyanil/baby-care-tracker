import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BabyProfile from './pages/BabyProfile';
import Activities from './pages/Activities';
import GrowthTracker from './pages/GrowthTracker';
import Reminders from './pages/Reminders';
import Vaccinations from './pages/Vaccinations';
import Navbar from './components/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/babies" element={<PrivateRoute><BabyProfile /></PrivateRoute>} />
        <Route path="/activities" element={<PrivateRoute><Activities /></PrivateRoute>} />
        <Route path="/growth" element={<PrivateRoute><GrowthTracker /></PrivateRoute>} />
        <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
        <Route path="/vaccinations" element={<PrivateRoute><Vaccinations /></PrivateRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
