
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedBackground from '@/components/login/AnimatedBackground';
import LoginForm from '@/components/login/LoginForm';
import LoginImagePanel from '@/components/login/LoginImagePanel';
import LoginBranding from '@/components/login/LoginBranding';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [entranceAnimation, setEntranceAnimation] = useState('fade-in');

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem('acto_is_logged_in') === 'true') {
      navigate('/app/dashboard');
    }
    
    // Determine animation based on navigation source
    if (location.state?.from === 'landing') {
      setEntranceAnimation('slide-in-right');
    }
    
    // Set loaded state for animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      {/* Animation styles */}
      <style>
        {`
        @keyframes slide-in-right {
          from { 
            transform: translateX(100px);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
        `}
      </style>
      
      {/* Animated floating background elements */}
      <AnimatedBackground />
      
      {/* Left column: Login Form */}
      <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 z-10`}>
        <div className={`space-y-6 w-full max-w-md mx-auto transition-all duration-1000 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'} ${entranceAnimation === 'slide-in-right' ? 'animate-slide-in-right' : ''}`}>
          {/* Logo */}
          <LoginBranding />

          {/* Login Form */}
          <LoginForm />
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground opacity-70">
          © {new Date().getFullYear()} Zenn. Todos os direitos reservados.
        </div>
      </div>

      {/* Right column: Image */}
      <LoginImagePanel />
    </div>
  );
};

export default Login;
