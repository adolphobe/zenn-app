
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PrivateRoute - Protects routes that require authentication
 * Logs instead of redirecting when not authenticated
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();

  console.log(`[PrivateRoute] Checking auth at ${location.pathname}, isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}`);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("[PrivateRoute] Still loading auth state...");
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Log auth status but don't redirect
  if (!isAuthenticated) {
    console.error(`[PrivateRoute] AUTHENTICATION ERROR: User not authenticated at ${location.pathname}`);
    console.error("[PrivateRoute] TECHNICAL DETAILS: Would normally redirect to /login but redirection is disabled");
    console.error("[PrivateRoute] AUTH STATE:", { isAuthenticated, isLoading, path: location.pathname });
    
    // Return a message instead of redirecting
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 max-w-lg">
          <p className="font-bold">Authentication Required</p>
          <p>You need to be logged in to access this page. Check console for technical details.</p>
          <p className="mt-2 text-sm">Not redirecting to login page due to debugging mode.</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected layout with sidebar
  console.log(`[PrivateRoute] User is authenticated, rendering protected content at ${location.pathname}`);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      
      {/* Mobile menu toggle button */}
      {isMobile && !sidebarOpen && (
        <button 
          onClick={openSidebar}
          className="fixed bottom-4 right-4 z-40 p-2 rounded-md bg-gray-500/50 text-white shadow-md hover:bg-gray-600/70 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}
      
      <main 
        className={cn(
          "transition-all duration-300 p-4 md:p-6 lg:p-8 flex-grow",
          sidebarOpen 
            ? isMobile ? "ml-0" : "md:ml-64" 
            : isMobile ? "ml-0" : "md:ml-20",
          "flex justify-center"
        )}
      >
        <div className="w-full max-w-6xl"> 
          <Outlet />
        </div>
      </main>
    </div>
  );
};
