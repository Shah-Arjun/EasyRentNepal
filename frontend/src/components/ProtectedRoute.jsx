import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/**
 * A component that protects routes based on authentication and user roles.
 * @param {string} requiredRole - The role required to access this route (e.g., 'owner', 'tenant', 'admin')
 */
const ProtectedRoute = ({ requiredRole }) => {
    const { isLoggedIn, userProfile, loading } = useAppContext();
    const location = useLocation();

    // If still loading user data, we might want to return a spinner or simply nothing
    // Wait until loading is false to make the decision
    if (loading) {
        return (
            <div className="flexCenter min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (!isLoggedIn && !token) {
        // Not logged in, redirect to login page with current path as context
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if a specific role is required
    if (requiredRole && userProfile && userProfile.role !== requiredRole) {
        // User does not have the required role, redirect to home
        console.warn(`Access denied. User role '${userProfile.role}' does not match required role '${requiredRole}'.`);
        return <Navigate to="/" replace />;
    }

    // If userProfile is missing but isLoggedIn is true (e.g. while still fetching)
    // we might want to wait. But usually getUserProfile is fast.
    if (isLoggedIn && !userProfile) {
        return (
            <div className="flexCenter min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    // All checks passed, render the children
    return <Outlet />;
};

export default ProtectedRoute;
