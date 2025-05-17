
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import FloatingBackgroundElements from '@/components/login/background/FloatingBackgroundElements';
import AuthFormContainer from '@/components/login/AuthFormContainer';
import AuthImageSidebar from '@/components/login/AuthImageSidebar';
import LoadingAuth from '@/components/login/LoadingAuth';

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from || "/dashboard";

  // Debug log with console feedback
  console.log(`[LOGIN] Página de login renderizada: Auth=${isAuthenticated}, Loading=${isLoading}, From=${from}, State=${JSON.stringify(location.state)}`);

  // Redirect after authentication
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log(`[LOGIN] Usuário autenticado, redirecionando para: ${from}`);
      // Add a small delay to ensure the logs are seen before redirect
      const redirectTimer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Display loading state while checking authentication
  if (isLoading) {
    return <LoadingAuth />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      <FloatingBackgroundElements />
      
      {/* Left column: Login/Signup Form */}
      <AuthFormContainer redirectPath={from} />

      {/* Right column: Image */}
      <AuthImageSidebar />
      
      {/* Login Status Debug Info (Console Only) */}
      {console.log(`[LOGIN] Status atual: Logado=${isAuthenticated ? 'Sim' : 'Não'}, Carregando=${isLoading ? 'Sim' : 'Não'}, Redirecionamento para=${from}`)}
    </div>
  );
};

export default Login;
