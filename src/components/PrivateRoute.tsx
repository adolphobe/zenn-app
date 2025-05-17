
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading indicator if authentication state is still being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If authenticated, allow access to protected routes
  if (isAuthenticated) {
    console.log('User is authenticated, rendering protected route');
    return <Outlet />;
  }
  
  // If not authenticated and authentication check is complete, redirect to login
  console.log('User is not authenticated, redirecting to login from', location.pathname);
  return <Navigate to="/login" state={{ from: location }} replace />;
};
