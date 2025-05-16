
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  useEffect(() => {
    // Set loaded state for animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    // Delay navigation to allow for exit animation
    setTimeout(() => {
      navigate(path);
    }, 400);
  };
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      {/* Animated floating circles for the background */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animated-float"
            style={{
              backgroundColor: 'rgba(142, 206, 234, 0.15)',
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 20 + 15}s`,
            }}
          />
        ))}
      </div>

      {/* Top navigation */}
      <nav className={`w-full flex justify-between items-center py-6 px-8 md:px-16 z-10 transition-all duration-1000 ease-out ${loaded ? 'opacity-100' : 'opacity-0 transform translate-y-4'}`}>
        <div className="text-2xl font-medium text-primary">Zenn</div>
        <Button 
          variant="ghost" 
          className="font-medium text-gray-600 hover:text-primary transition-all duration-300"
          onClick={() => handleNavigate('/login')}
        >
          Login
        </Button>
      </nav>

      {/* Main content */}
      <main className={`flex flex-col items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isNavigating ? 'opacity-0 transform translate-y-10' : loaded ? 'opacity-100' : 'opacity-0 transform translate-y-10'}`} style={{ height: 'calc(100vh - 140px)' }}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 leading-tight max-w-3xl mb-8 transition-all duration-700 delay-200 transform animate-fade-in">
          Comece a fazer o que realmente importa pra você.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12 transition-all duration-700 delay-400 transform animate-fade-in">
          Zenn organiza suas tarefas com base no que importa de verdade: o que pesa, o que te orgulha e o que te fortalece.
        </p>
        
        <Button 
          onClick={() => handleNavigate('/login')} 
          className="text-lg px-8 py-6 rounded-full bg-blue-400 hover:bg-blue-500 text-white shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-[1.02] animate-fade-in"
        >
          Criar minha primeira tarefa
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </main>

      {/* Animated background styling */}
      <style jsx>{`
        @keyframes float-animate {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.1;
          }
          25% {
            transform: translate(50px, -30px) scale(1.05) rotate(3deg);
            opacity: 0.2;
          }
          50% {
            transform: translate(100px, 10px) scale(1.1) rotate(6deg);
            opacity: 0.15;
          }
          75% {
            transform: translate(50px, 40px) scale(1.05) rotate(3deg);
            opacity: 0.2;
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.1;
          }
        }
        
        .animated-float {
          animation: float-animate ease-in-out infinite;
          animation-duration: 20s;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
          border-radius: 50%;
        }
      `}</style>

      {/* Decorative element - subtle line */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-200 rounded-full opacity-70"></div>
    </div>
  );
};

export default Index;
