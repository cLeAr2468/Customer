import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/header';
import Home from './components/layout/home';
import About from './components/layout/about';
import Services from './components/layout/services';
import Prices from './components/layout/prices';
import Register from './components/layout/register';
import Login from './components/layout/Login';
import Dashboard from './components/layout/Dashboard';
import Payment from './components/layout/payment';
import Profile from './components/layout/Profile';
import History from './components/layout/History';

function AppContent() {
  const location = useLocation();

  const exactHideRoutes = ['/register', '/login'];
  const prefixHideRoutes = ['/dashboard'];

  const shouldHideHeader =
    exactHideRoutes.includes(location.pathname) ||
    prefixHideRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen">
      {!shouldHideHeader && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/payment" element={<Payment />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/history" element={<History />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;