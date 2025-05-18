
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isJustLoggedOut, setIsJustLoggedOut] = useState(false);
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Check if user has just logged out
  useEffect(() => {
    // If we detect a "loggedOut" parameter in the URL or location state, set the flag
    const params = new URLSearchParams(location.search);
    const loggedOutFromUrl = params.get('loggedOut') === 'true';
    const loggedOutFromState = location.state?.loggedOut === true;
    const forceClear = location.state?.forceClear === true;
    
    if (loggedOutFromUrl || loggedOutFromState) {
      console.log("[Login] Usuário acabou de deslogar conforme indicado por parâmetro");
      console.log("[Login] DETALHES EM PORTUGUÊS: Detectado logout recente");
      setIsJustLoggedOut(true);
      
      // Clear any lingering logout flags
      localStorage.removeItem('logout_in_progress');
      
      // Force clear any remaining auth tokens if flagged
      if (forceClear) {
        console.log("[Login] Limpando tokens de autenticação que podem ter persistido");
        localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
        localStorage.removeItem('supabase.auth.token');
      }
      
      // Reset the flag after a delay to allow re-login
      setTimeout(() => {
        setIsJustLoggedOut(false);
      }, 800);
    }
  }, [location]);
  
  // Smooth visual loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect automatically if authenticated and not just logged out
  useEffect(() => {
    if (isAuthenticated && !isLoading && !isJustLoggedOut) {
      console.log("[Login] Usuário autenticado, redirecionando para:", from);
      console.log("[Login] DETALHES EM PORTUGUÊS: Autenticação verificada. Redirecionando para " + from);
      
      // Add a small delay before redirect to prevent loops
      const redirectTimer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 200);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isLoading, from, navigate, isJustLoggedOut]);

  // Toggle between login and signup
  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  // Prevent rendering content during loading
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // If user is authenticated and not just logged out, show a temporary message
  if (isAuthenticated && !isJustLoggedOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 max-w-lg">
          <p className="font-bold">Já Autenticado</p>
          <p>Você já está logado. Redirecionando para {from.replace("/", "")}...</p>
        </div>
        
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mt-4"></div>
      </div>
    );
  }

  // Background animation elements
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
      
      {/* Floating items for background */}
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
            <SignupForm onCancel={toggleSignup} />
          ) : (
            <LoginForm 
              onSwitchToSignup={toggleSignup} 
              onSuccess={() => {
                console.log("[Login] Login bem-sucedido, redirecionando para: ", from);
                console.log("[Login] DETALHES EM PORTUGUÊS: Login realizado com sucesso, redirecionando automaticamente");
                navigate(from, { replace: true });
              }} 
            />
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
