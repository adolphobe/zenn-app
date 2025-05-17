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

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1668853853439-923e013afff1?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
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
          
          /* Animação de flutuação melhorada */
          @keyframes floating-enhanced {
            0% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0.2;
            }
            20% {
              transform: translateY(-25px) translateX(20px) scale(1.05);
              opacity: 0.4;
            }
            40% {
              transform: translateY(-35px) translateX(-15px) scale(0.95);
              opacity: 0.5;
            }
            60% {
              transform: translateY(-15px) translateX(-30px) scale(1.02);
              opacity: 0.4;
            }
            80% {
              transform: translateY(-30px) translateX(10px) scale(0.98);
              opacity: 0.3;
            }
            100% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0.2;
            }
          }
          
          .animate-floating-enhanced {
            animation: floating-enhanced 12s ease-in-out infinite;
          }
          
          /* Animação de brilho cristalino mais suave */
          @keyframes crystal-glint {
            0%, 100% {
              opacity: 0.1;
            }
            50% {
              opacity: 0.4;
            }
          }
          
          .animate-crystal-glint {
            animation: crystal-glint 4s ease-in-out infinite;
          }
          
          /* Animação de pulso mais refinada para cristais */
          @keyframes crystal-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.03);
              opacity: 0.9;
            }
          }
          
          .animate-crystal-pulse {
            animation: crystal-pulse 10s ease-in-out infinite;
          }
          
          /* Animação de pulso melhorada */
          @keyframes pulse-enhanced {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.5;
            }
          }
          
          .animate-pulse-enhanced {
            animation: pulse-enhanced 8s ease-in-out infinite;
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
      
      {/* Main content */}
      <div className="container mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left column - Text content - Always visible */}
        <div className="lg:col-span-7 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-0 transition-all duration-700">
          {/* Logo */}
          <div className={`mb-12 opacity-0 ${loaded ? 'opacity-100 transition-opacity duration-700' : ''}`}>
            <img 
              src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/loogzenn.png?v=1747447750" 
              alt="Zenn Logo" 
              style={{ width: '100px', height: 'auto' }}
            />
          </div>
          
          {/* Main headline without the circle effects */}
          <div className="relative">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight md:leading-tight lg:leading-tight text-gray-900 mb-8 opacity-0 ${loaded ? 'fade-up' : ''}`}>
              Você não precisa de mais tarefas.<br />
              Precisa de intenção.
            </h1>
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
              {/* 3D image com círculos chapados e bordas mais definidas, com os reflexos internos */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Primeiro círculo (maior) - cristal chapado com borda mais definida e reflexos */}
                <div 
                  className="w-[350px] h-[350px] rounded-full backdrop-blur-md animate-crystal-pulse overflow-hidden relative"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(111, 166, 255, 0.3) 50%, rgba(111, 166, 255, 0.4) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.4)'
                  }}
                >
                  {/* Reflexos de cristal interno */}
                  <div className="absolute top-[10%] left-[10%] w-[40px] h-[100px] bg-white/20 rounded-full rotate-45"></div>
                  <div className="absolute bottom-[20%] right-[15%] w-[30px] h-[70px] bg-white/15 rounded-full -rotate-30"></div>
                  
                  {/* Pequeno círculo brilhante simbolizando o primeiro círculo do logo */}
                  <div 
                    className="absolute top-[25%] left-[25%] w-[15px] h-[15px] rounded-full bg-white/70 animate-crystal-glint"
                  ></div>
                </div>
                
                {/* Segundo círculo (médio) - cristal chapado com borda mais definida e reflexos */}
                <div 
                  className="absolute w-[300px] h-[300px] rounded-full backdrop-blur-md animate-floating-enhanced overflow-hidden" 
                  style={{ 
                    animationDuration: '10s',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(92, 143, 255, 0.3) 50%, rgba(92, 143, 255, 0.34) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.45)'
                  }}
                >
                  {/* Reflexos de cristal interno */}
                  <div className="absolute top-[15%] left-[15%] w-[35px] h-[85px] bg-white/20 rounded-full rotate-45"></div>
                  <div className="absolute bottom-[25%] right-[20%] w-[25px] h-[60px] bg-white/15 rounded-full -rotate-30"></div>
                  
                  {/* Pequeno círculo brilhante simbolizando o segundo círculo do logo */}
                  <div 
                    className="absolute top-[35%] left-[65%] w-[12px] h-[12px] rounded-full bg-white/70 animate-crystal-glint"
                    style={{ animationDelay: '1s' }}
                  ></div>
                </div>
                
                {/* Terceiro círculo (menor) - cristal chapado com borda mais definida e reflexos */}
                <div 
                  className="absolute w-[250px] h-[250px] rounded-full backdrop-blur-lg animate-floating-enhanced overflow-hidden" 
                  style={{ 
                    animationDuration: '8s', 
                    animationDelay: '1s',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(93, 156, 255, 0.25) 60%, rgba(93, 156, 255, 0.21) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {/* Reflexos de cristal interno */}
                  <div className="absolute top-[20%] left-[20%] w-[30px] h-[70px] bg-white/20 rounded-full rotate-45"></div>
                  <div className="absolute bottom-[30%] right-[25%] w-[20px] h-[50px] bg-white/15 rounded-full -rotate-30"></div>
                  
                  {/* Pequeno círculo brilhante simbolizando o terceiro círculo do logo */}
                  <div 
                    className="absolute top-[60%] left-[45%] w-[10px] h-[10px] rounded-full bg-white/70 animate-crystal-glint"
                    style={{ animationDelay: '2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;