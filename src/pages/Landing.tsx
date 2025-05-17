import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/LoginForm';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
    // Handle animation on load
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Show login form with animation
  const handleGetStarted = () => {
    setShowLogin(true);
  };

  // Navigate directly to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem('acto_is_logged_in') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Generate animated floating elements with blue color
  const floatingElements = Array(6).fill(null).map((_, i) => (
    <div 
      key={i}
      className="absolute rounded-full animate-floating opacity-30"
      style={{
        backgroundColor: i % 2 === 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.2)',
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        left: `${Math.random() * 70}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 10 + 10}s`,
        filter: 'blur(4px)',
      }}
    />
  ));

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503756058522-2390ea8cff45?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Background" 
          className="object-cover w-full h-full"
        />
        {/* Overlay with reduced opacity to keep the image subtle */}
        <div className="absolute inset-0 bg-[#f9fbff]/50 backdrop-blur-[10px]"></div>
      </div>
      
      {/* Custom animations */}
      <style>
        {`
          @keyframes floating {
            0%, 100% {
              transform: translateY(0) translateX(0);
              opacity: 0.3;
            }
            25% {
              transform: translateY(-15px) translateX(10px);
              opacity: 0.5;
            }
            50% {
              transform: translateY(-25px) translateX(-10px);
              opacity: 0.4;
            }
            75% {
              transform: translateY(-10px) translateX(-5px);
              opacity: 0.3;
            }
          }
          
          .animate-floating {
            animation: floating 15s ease-in-out infinite;
          }
          
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .fade-up {
            animation: fadeUp 1.2s ease-out forwards;
          }
          
          .fade-up-delay-1 {
            animation-delay: 0.2s;
          }
          
          .fade-up-delay-2 {
            animation-delay: 0.4s;
          }
          
          .fade-up-delay-3 {
            animation-delay: 0.6s;
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .slide-in {
            animation: slideIn 0.6s ease-out forwards;
          }
          
          @keyframes slideOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-30px);
            }
          }
          
          .slide-out {
            animation: slideOut 0.6s ease-out forwards;
          }
        `}
      </style>
      
      {/* Floating elements background */}
      {floatingElements}
      
      {/* Main content */}
      <div className="container mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left column - Text content - Always visible */}
        <div className="lg:col-span-7 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-0 transition-all duration-700">
          {/* Logo */}
          <div className={`mb-12 opacity-0 ${loaded ? 'opacity-100 transition-opacity duration-700' : ''}`}>
            <h3 className="text-2xl font-bold tracking-tight text-blue-500">Zenn</h3>
          </div>
          
          {/* Main headline with the 3 circle effects */}
          <div className="relative">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight md:leading-tight lg:leading-tight text-gray-900 mb-8 opacity-0 ${loaded ? 'fade-up' : ''}`}>
              Você não precisa de mais tarefas.<br />
              Precisa de intenção.
            </h1>
            
            {/* Keep only the 3 circular effects near the headline */}
            <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-blue-500/10 to-blue-400/10 backdrop-blur-sm -z-10 -top-20 -left-10"></div>
            <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-to-bl from-blue-500/15 to-blue-300/15 backdrop-blur-md -z-10 -top-10 left-40 animate-float" style={{ animationDuration: '20s' }}></div>
            <div className="absolute w-[120px] h-[120px] rounded-full bg-gradient-to-r from-blue-300/15 to-blue-500/15 backdrop-blur-md -z-10 top-20 left-60 animate-float" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
          </div>
          
          {/* Subheadline */}
          <p className={`text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-10 opacity-0 ${loaded ? 'fade-up fade-up-delay-1' : ''}`}>
            Zenn é um app de execução pessoal.<br />
            Você avalia cada tarefa por três pilares:<br />
            importância real, orgulho pós-execução e crescimento pessoal.
          </p>
          
          {/* CTA Button using the blue color - only visible when login is not showing */}
          <div className={`opacity-0 ${loaded ? 'fade-up fade-up-delay-2' : ''} ${showLogin ? 'hidden lg:block' : 'block'}`}>
            <Button 
              onClick={handleGetStarted}
              className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-md flex items-center gap-2"
            >
              Começar com Clareza
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          
          {/* Footer text */}
          <div className={`mt-32 opacity-0 ${loaded ? 'fade-up fade-up-delay-3' : ''}`}>
            <p className="text-xs text-gray-400">Você não precisa de mais produtividade. Precisa de direção.</p>
          </div>
        </div>
        
        {/* Right column - Login or 3D Effect */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Login form that appears when CTA is clicked */}
          {showLogin ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className={`w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl ${
                showLogin ? 'slide-in' : ''
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Bem-vindo de volta!</h3>
                  <button 
                    onClick={() => setShowLogin(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <LoginForm />
              </div>
            </div>
          ) : (
            /* 3D image that shows when login is not active */
            <div className={`relative w-full h-[600px] transition-all duration-1000 ease-in-out ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* 3D image with glassmorphism effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-500/20 to-blue-400/20 backdrop-blur-sm animate-pulse-slow"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-blue-500/20 to-blue-300/20 backdrop-blur-md animate-float" style={{ animationDuration: '20s' }}></div>
                <div className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-r from-blue-300/20 to-blue-500/20 backdrop-blur-md animate-float" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
              </div>
              
              {/* Crystal/glass effect overlay with blue color */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(235, 248, 255, 0) 100%)',
                  boxShadow: '0 0 80px rgba(59, 130, 246, 0.2)',
                  animation: loaded ? 'pulse 6s ease-in-out infinite alternate' : 'none',
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
