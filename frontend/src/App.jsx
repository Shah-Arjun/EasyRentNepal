// App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Contact from './pages/Contact';
import PropertyDetails from './pages/PropertyDetails';
import MyBookings from './pages/MyBookings';
import AgencyReg from './components/AgencyReg';
import { useAppContext } from './context/AppContext';

import Sidebar from './components/owner/Sidebar';
import Dashboard from './pages/owner/Dashboard';
import AddProperty from './pages/owner/AddProperty';
import ListProperty from './pages/owner/ListProperty';
import Login from './pages/Login';
import Register from './pages/Register';
import MapView from './components/MapView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute';



const App = () => {
  const location = useLocation();
  const { showAgencyReg, isLoggedIn, loading } = useAppContext();


  const isOwnerPath = location.pathname.startsWith('/owner');
  const isAuthPath = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);



  return (
    <main>
      <ToastContainer position="bottom-right" />

      {!isOwnerPath && !isAuthPath && <Header />}

      {showAgencyReg && <AgencyReg />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/listing/:id" element={<PropertyDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Tenant Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Owner Routes with Layout */}
        <Route element={<ProtectedRoute requiredRole="owner" />}>
          <Route path="/owner" element={<Sidebar />}>
            <Route index element={<Dashboard />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="list-property" element={<ListProperty />} />
            <Route path="map" element={<MapView />} />
          </Route>
        </Route>

        {/* Unauthorized / Fallback */}
        <Route path="/unauthorized" element={<div className="p-10 text-center">You don't have permission to access this page.</div>} />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isOwnerPath && !isAuthPath && <Footer />}
    </main>
  );
};

export default App;