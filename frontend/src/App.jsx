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
import AgencyReg from './components/AgencyReg';
import { useAppContext } from './context/AppContext';

import Sidebar from './components/owner/Sidebar';
import TenantDashboardLayout from './layout/TenantDashboardLayout';
import OwnerDashboard from './pages/owner/Dashboard';
import AddProperty from './pages/owner/AddProperty';
import EditProperty from './pages/owner/EditProperty';
import ListProperty from './pages/owner/ListProperty';
import Login from './pages/Login';
import Register from './pages/Register';
import MapView from './components/MapView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyOtp from './components/VerifyOtp';
import TenantDashboard from './pages/tenant/Dashboard';
import Bookings from './pages/tenant/Bookings';
import Watchlist from './pages/tenant/Watchlist';
// import Payments from './pages/tenant/Payments';
import Profile from './pages/shared/Profile';
import OwnerBookings from './pages/owner/Bookings';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtpForReset from './pages/VerifyOtpForReset';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  const location = useLocation();
  const { showAgencyReg, isLoggedIn, userProfile, navigate } = useAppContext();

  const isOwnerPath = location.pathname.startsWith('/owner');
  const isTenantPath = location.pathname.startsWith('/tenant');
  const isAuthPath =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/verify-otp' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/verify-reset-otp' ||
    location.pathname === '/reset-password' ||
    isTenantPath;

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
        <Route path="/"           element={<Home />} />
        <Route path="/listing"    element={<Listing />} />
        <Route path="/listing/:id" element={<PropertyDetails />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:id"   element={<BlogDetails />} />
        <Route path="/contact"    element={<Contact />} />

        {/* Protected Tenant Routes */}
        <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
          <Route path="/tenant" element={<TenantDashboardLayout />}>
            <Route index                element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"     element={<TenantDashboard />} />
            <Route path="bookings"      element={<Bookings />} />
            <Route path="watchlist"     element={<Watchlist />} />
            {/* <Route path="payments"      element={<Payments />} /> */}
            <Route path="profile"       element={<Profile />} />
          </Route>
        </Route>

        {/* Auth Routes */}
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyOtpForReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Owner Routes with Layout */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner" element={<Sidebar />}>
            <Route index                    element={<OwnerDashboard />} />
            <Route path="add-property"      element={<AddProperty />} />
            <Route path="edit-property/:id" element={<EditProperty />} />
            <Route path="list-property"     element={<ListProperty />} />
            <Route path="bookings"          element={<OwnerBookings />} />
            <Route path="map"               element={<MapView />} />
            <Route path="profile"           element={<Profile />} />
          </Route>
        </Route>

        {/* Unauthorized / Fallback */}
        <Route
          path="/unauthorized"
          element={
            <div className="p-10 text-center">
              You don't have permission to access this page.
            </div>
          }
        />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isOwnerPath && !isAuthPath && <Footer />}
    </main>
  );
};

export default App;