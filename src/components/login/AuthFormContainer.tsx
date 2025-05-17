
import React, { useState, useEffect } from 'react';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';

interface AuthFormContainerProps {
  redirectPath: string;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ redirectPath }) => {
  const [loaded, setLoaded] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // Handle smooth loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle between login and signup
  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  return (
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
          <SignupForm onCancel={toggleSignup} redirectPath={redirectPath} />
        ) : (
          <LoginForm onSwitchToSignup={toggleSignup} redirectPath={redirectPath} />
        )}
      </div>

      <div className="mt-12 text-center text-xs text-muted-foreground opacity-70">
        © {new Date().getFullYear()} Acto. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default AuthFormContainer;
