// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ requiredRole = null }) => {
  const { isLoggedIn, isOwner, userProfile, authLoading } = useAppContext();
  const location = useLocation();


  // Still loading user data → show loader
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  
  // Not logged in → redirect to login with return path
  if (!isLoggedIn || !userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based check
  if (requiredRole) {
    const userRole = userProfile?.role || (isOwner ? 'owner' : 'tenant');

    if (requiredRole === 'owner' && userRole !== 'owner') {
      return <Navigate to="/listing" replace />;
      // Or to a better "unauthorized" page: <Navigate to="/unauthorized" replace />
    }

  }

  return <Outlet />;
};

export default ProtectedRoute;