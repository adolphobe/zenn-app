
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute - Components for protecting routes that require authentication
 * Now with visual alerts to help identify where issues might occur
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Function to show visual alert on screen
  const showAlert = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '80px'; // Position below potential other alerts
    alertDiv.style.left = '20px';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '80%';
    alertDiv.style.wordBreak = 'break-word';
    
    // Set color based on type
    if (type === 'info') {
      alertDiv.style.backgroundColor = '#3b82f6';
    } else if (type === 'success') {
      alertDiv.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
      alertDiv.style.backgroundColor = '#ef4444';
    }
    
    alertDiv.style.color = 'white';
    alertDiv.textContent = message;
    
    // Add to DOM
    document.body.appendChild(alertDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 500);
    }, 5000);
  };
  
  // Log authentication status with visual feedback
  showAlert(`PrivateRoute check: Auth=${isAuthenticated}, Loading=${isLoading}, Path=${location.pathname}`, 'info');
  
  // Step 1: Let's just show the loading state properly with visual feedback
  if (isLoading) {
    showAlert('Carregando estado de autenticação...', 'info');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-3 text-blue-500">Verificando autenticação...</div>
      </div>
    );
  }
  
  // Step 2: If not authenticated, redirect to login with visual feedback
  if (!isAuthenticated) {
    showAlert('Não autenticado, redirecionando para login...', 'error');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Step 3: If authenticated, allow access with visual feedback
  showAlert('Autenticado com sucesso, permitindo acesso', 'success');
  return <Outlet />;
};
