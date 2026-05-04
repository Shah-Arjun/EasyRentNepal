import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';



const roleHomeMap = {
  tenant: '/',
  owner: '/owner',
};



const normalizeRoles = (requiredRole, allowedRoles) => {
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    return allowedRoles;
  }

  if (typeof requiredRole === 'string' && requiredRole.trim()) {
    return [requiredRole.trim()];
  }

  return null;
};




const ProtectedRoute = ({ requiredRole = null, allowedRoles = null }) => {
  const { isLoggedIn, userProfile, authLoading } = useAppContext();
  const location = useLocation();
  
  // Use currentActiveRole if available, otherwise extract from role array
  const userRole = userProfile?.currentActiveRole || 
    (Array.isArray(userProfile?.role) ? userProfile?.role?.[0] : userProfile?.role);
  
  const permittedRoles = normalizeRoles(requiredRole, allowedRoles);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }


  // if not logged in or no user profile, redirect to login
  if (!isLoggedIn || !userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  // if user role is missing, redirect to unauthorized
  if (!userRole) {
    return <Navigate to="/unauthorized" replace />;
  }


  // if OTP verification is required and user hasn't verified, redirect to OTP page
  if (!userProfile.isOtpVerified) {
    return (
      <Navigate
        to="/verify-otp"
        state={{ from: location, email: userProfile.email }}
        replace
      />
    );
  }


  // if user role is not in permitted roles, redirect to their home page or unauthorized
  if (permittedRoles && !permittedRoles.includes(userRole)) {
    return <Navigate to={roleHomeMap[userRole] || '/unauthorized'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;