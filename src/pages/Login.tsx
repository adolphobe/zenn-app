
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import PasswordResetForm from '../components/PasswordResetForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Map of error codes to messages
const ERROR_MESSAGES = {
  '1': 'Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.',
  '2': 'Por favor, confirme seu e-mail antes de fazer login.',
  '3': 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.',
  '4': 'Muitas tentativas de login. Aguarde um momento e tente novamente.'
};

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isJustLoggedOut, setIsJustLoggedOut] = useState(false);
  const [searchParams] = useSearchParams();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [errorFadeOut, setErrorFadeOut] = useState(false);
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Check for error parameter in URL
  useEffect(() => {
    const errorCode = searchParams.get('erro');
    
    if (errorCode && ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES]) {
      setLoginError(ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES]);
      
      // Set a timer to fade out the error message after 5 seconds
      const timer = setTimeout(() => {
        setErrorFadeOut(true);
        
        // After animation completes, clear the error
        setTimeout(() => {
          setLoginError(null);
          setErrorFadeOut(false);
          
          // Remove the error parameter from the URL without page refresh
          navigate('/login', { replace: true });
        }, 300); // Animation duration
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate]);
  
  // Check if user has just logged out
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loggedOutFromUrl = params.get('loggedOut') === 'true';
    const loggedOutFromState = location.state?.loggedOut === true;
    
    if (loggedOutFromUrl || loggedOutFromState) {
      setIsJustLoggedOut(true);
      
      localStorage.removeItem('logout_in_progress');
      
      setTimeout(() => {
        setIsJustLoggedOut(false);
      }, 800);
    }
  }, [location]);

  // Additional check for authentication using localStorage directly
  const [localAuthCheck, setLocalAuthCheck] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkLocalAuth = async () => {
      try {
        const hasToken = !!localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
        
        if (!hasToken) {
          setLocalAuthCheck(false);
          return;
        }
        
        const { data } = await supabase.auth.getSession();
        setLocalAuthCheck(!!data.session);
      } catch (err) {
        console.error("[Login] Erro ao verificar token local:", err);
        setLocalAuthCheck(false);
      }
    };

    checkLocalAuth();
  }, []);
  
  // Smooth visual loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect automatically if authenticated and not just logged out
  useEffect(() => {
    const actuallyAuthenticated = isAuthenticated || (localAuthCheck === true);
    
    if (actuallyAuthenticated && !isLoading && !isJustLoggedOut && localAuthCheck !== null) {
      toast({
        title: "Autenticado",
        description: "Redirecionando para o dashboard...",
      });
      
      const redirectTimer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isLoading, from, navigate, isJustLoggedOut, localAuthCheck]);

  // Toggle between login and signup
  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setIsForgotPassword(false);
  };

  // Toggle to forgot password view
  const showForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignup(false);
  };

  // Return to login view
  const showLogin = () => {
    setIsForgotPassword(false);
    setIsSignup(false);
  };

  // Prevent rendering content during loading
  if (isLoading || localAuthCheck === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Use both authentication checks to determine if user is truly authenticated
  const actuallyAuthenticated = isAuthenticated || (localAuthCheck === true);

  // If user is authenticated and not just logged out, show a temporary message
  if (actuallyAuthenticated && !isJustLoggedOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 max-w-lg">
          <p className="font-bold">Já Autenticado</p>
          <p>Você já está logado. Redirecionando...</p>
        </div>
        
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mt-4"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Left column: Login/Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32">
        <div className={`space-y-6 w-full max-w-md mx-auto transition-all duration-1000 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          {/* Logo */}
          <div className="text-left mb-8">
            <img 
              src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-8.jpg?v=1747284016" 
              alt="Acto Logo" 
              className="w-[120px]"
            />
          </div>

          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              {isSignup 
                ? "Crie sua conta" 
                : isForgotPassword 
                  ? "Recupere sua senha" 
                  : "Bem vindo de volta!"}
            </h1>
            <p className="text-gray-500">
              {isSignup 
                ? "Cadastre-se para começar sua jornada conosco." 
                : isForgotPassword
                  ? "Enviaremos um link para você redefinir sua senha."
                  : "Um novo dia chegou. É hora de continuar sua jornada."}
            </p>
          </div>

          {/* Error display */}
          <AnimatePresence>
            {loginError && (
              <motion.div 
                className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: errorFadeOut ? 0 : 1, y: errorFadeOut ? -10 : 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                role="alert"
                aria-live="assertive"
              >
                <div className="text-red-500 h-5 w-5 flex-shrink-0">⚠️</div>
                <div>
                  <p className="font-medium text-sm">{loginError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isSignup ? (
            <SignupForm onCancel={toggleSignup} />
          ) : isForgotPassword ? (
            <PasswordResetForm 
              onCancel={showLogin} 
              onResetSent={(email) => {
                setTimeout(showLogin, 3000);
              }}
            />
          ) : (
            <LoginForm 
              onSwitchToSignup={toggleSignup} 
              onForgotPassword={showForgotPassword}
              onSuccess={() => {
                navigate(from, { replace: true });
              }} 
            />
          )}
        </div>

        <div className="mt-12 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Acto. Todos os direitos reservados.
        </div>
      </div>

      {/* Right column: Image */}
      <div className="hidden md:block md:w-1/2 relative bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/30 mix-blend-multiply" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg text-center">
              <h2 className="text-2xl font-bold text-blue-800 mb-3">Acto</h2>
              <p className="text-blue-600">A plataforma que simplifica sua jornada profissional.</p>
            </div>
          </div>
          <div className="absolute top-[20%] left-[20%] w-32 h-32 rounded-full bg-blue-200/60"></div>
          <div className="absolute bottom-[20%] right-[20%] w-40 h-40 rounded-full bg-blue-300/60"></div>
          <div className="absolute top-[60%] right-[30%] w-24 h-24 rounded-full bg-blue-100/60"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
