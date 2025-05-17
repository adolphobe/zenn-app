
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/LoginForm';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  loaded: boolean;
  showLogin: boolean;
  circlesKey: number;
  handleGetStarted: () => void;
  setShowLogin: (show: boolean) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  loaded, 
  showLogin, 
  circlesKey, 
  handleGetStarted, 
  setShowLogin 
}) => {
  const navigate = useNavigate();

  return (
    <section 
      className="relative h-screen overflow-hidden"
      style={{transform: 'translateZ(0)'}} 
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="parallax-container w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1668853853439-923e013afff1?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Background" 
            className="object-cover w-full h-full"
            style={{ transform: 'scale(1.12)' }}
          />
          <div className="absolute inset-0 bg-[#f9fbff]/50 dark:bg-gray-950/50 backdrop-blur-[6px]"></div>
        </div>
      </div>
      <div className="container mx-auto h-full grid grid-cols-1 lg:grid-cols-12 relative z-10">
        <div className="lg:col-span-7 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 lg:py-0 transition-all duration-700">
          <div className={`mb-12 opacity-0 ${loaded ? 'opacity-100 transition-opacity duration-700' : ''}`}>
            <img 
              src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/loogzenn.png?v=1747447750" 
              alt="Zenn Logo" 
              className="dark:brightness-0 dark:invert-[0.8]"
              style={{ width: '100px', height: 'auto' }}
            />
          </div>
          <div className="relative">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight md:leading-tight lg:leading-tight text-gray-900 dark:text-white mb-8 opacity-0 ${loaded ? 'fade-up' : ''}`}>
              Listas fazem você lembrar.<br />
              Zenn faz você evoluir.
            </h1>
          </div>
          <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-10 opacity-0 ${loaded ? 'fade-up fade-up-delay-1' : ''}`}>
            Zenn é um app de execução pessoal.<br />
            Você avalia cada tarefa por três pilares:<br />
            importância real, orgulho pós-execução e crescimento pessoal.
          </p>
          <div className={`opacity-0 ${loaded ? 'fade-up fade-up-delay-2' : ''} ${showLogin ? 'hidden lg:block' : 'block'}`}>
            <Button 
              onClick={handleGetStarted}
              className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-[1.03] flex items-center gap-2"
            >
              Começar Agora
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          <div className={`mt-32 opacity-0 ${loaded ? 'fade-up fade-up-delay-3' : ''}`}>
            <p className="text-xs text-gray-700 dark:text-gray-500">Aplicativo em Beta, bugs podem acontecer.</p>
          </div>
        </div>
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {showLogin ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className={`w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-xl ${showLogin ? 'slide-in' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Faça seu login</h3>
                  <button onClick={() => { setShowLogin(false); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">✕</button>
                </div>
                <LoginForm onSuccess={() => navigate('/dashboard')} />
              </div>
            </div>
          ) : (
            <div 
              key={circlesKey} 
              className={`relative w-full h-[600px] transition-all duration-1000 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ isolation: 'isolate', transform: 'translateZ(0)' }} 
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[350px] h-[350px] rounded-full backdrop-blur-sm animate-pulse-enhanced" style={{ backgroundColor: 'rgb(159 215 255)', isolation: 'isolate', transform: 'translateZ(0px)', opacity: 0.3 }}></div>
                <div className="absolute w-[300px] h-[300px] rounded-full backdrop-blur-md animate-floating-enhanced" style={{ animationDuration: '10s', backgroundColor: 'rgb(164 211 245)', isolation: 'isolate', transform: 'translateZ(0px)', opacity: 0.2 }}></div>
                <div className="absolute w-[250px] h-[250px] rounded-full backdrop-blur-md animate-floating-enhanced" style={{ animationDuration: '8s', animationDelay: '1s', backgroundColor: 'rgb(159 209 243)', isolation: 'isolate', transform: 'translateZ(0px)', willChange: 'backdrop-filter, transform, opacity', opacity: 0.2 }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 mx-auto w-max flex flex-col items-center opacity-0 animate-pulse" style={{ animation: 'fadeUp 2s ease-out 2s forwards, pulse 2s infinite' }}>
        <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">Conheça mais</p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600 dark:text-gray-400">
          <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 7L12 12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
