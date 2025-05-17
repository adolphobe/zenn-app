
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  
  // Get the path to redirect to after login
  const from = location.state?.from?.pathname || "/dashboard";

  // Check if already logged in and redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('Already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    } else {
      console.log('Auth state in Login:', { isLoading, isAuthenticated });
    }
    
    // Set loaded state for animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, isLoading, from]);

  // Toggle between login and signup
  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  // If checking authentication, display a loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Animated floating items for background with random positions and continuous animations
  const floatingItems = Array(7).fill(null).map((_, i) => (
    <div 
      key={i}
      className="absolute rounded-full animated-float"
      style={{
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        left: `${Math.random() * 70}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 6 + 6}s`,
        opacity: Math.random() * 0.4 + 0.3,
      }}
    />
  ));

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      {/* Animated floating background elements */}
      <style>
        {`
        @keyframes float-animate {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -20px) scale(1.05);
            opacity: 0.5;
          }
          50% {
            transform: translate(40px, 10px) scale(1);
            opacity: 0.7;
          }
          75% {
            transform: translate(20px, 30px) scale(0.95);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
        }
        
        .animated-float {
            animation: float-animate ease-in-out infinite alternate;
        }
      `}
      </style>
      
      {floatingItems}
      
      {/* Left column: Login/Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 z-10">
        <div className={`space-y-6 w-full max-w-md mx-auto transition-all duration-1000 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          {/* Logo */}
          <div className="text-left mb-12">
            <img 
              src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-8.jpg?v=1747284016" 
              alt="Acto Logo" 
              className="w-[120px] mb-4"
            />
          </div>

          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              {isSignup ? "Crie sua conta" : "Bem vindo de volta!"}
            </h1>
            <p className="text-muted-foreground">
              {isSignup 
                ? "Cadastre-se para começar sua jornada conosco." 
                : "Um novo dia chegou. É hora de continuar sua jornada."}
            </p>
          </div>

          {isSignup ? (
            <SignupForm onCancel={toggleSignup} redirectPath={from} />
          ) : (
            <LoginForm onSwitchToSignup={toggleSignup} redirectPath={from} />
          )}
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground opacity-70">
          © {new Date().getFullYear()} Acto. Todos os direitos reservados.
        </div>
      </div>

      {/* Right column: Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1595131264264-377ba3b61f46?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fundo de login"
            className="object-cover w-full h-full object-center"
            style={{ minWidth: '100%', minHeight: '100%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/20 mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
};

export default Login;
