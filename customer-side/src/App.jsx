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
import PublicLayout from './components/layout/PublicLayout';
import { Toaster as SonnerToaster } from "sonner";

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
        <Route element={<PublicLayout />}>
          <Route path="/:slug?" element={<Home />} />
          <Route path="/:slug?/about" element={<About />} />
          <Route path="/:slug?/services" element={<Services />} />
          <Route path="/:slug?/prices" element={<Prices />} />
          <Route path="/:slug?/login" element={<Login />} />
          <Route path="/:slug?/register" element={<Register />} />
        </Route>

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
      <SonnerToaster position="top-right" richColors />
      <AppContent />
    </Router>
  );
}

export default App;