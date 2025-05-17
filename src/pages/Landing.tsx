
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  // Parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e) => {
      const parallaxBg = document.getElementById('parallax-bg');
      if (parallaxBg) {
        // Ajustado para um movimento um pouco mais suave mas ainda perceptível
        const x = (window.innerWidth - e.pageX * 2.5) / 60;
        const y = (window.innerHeight - e.pageY * 2.5) / 60;
        
        parallaxBg.style.transform = `scale(1.12) translate(${x}px, ${y}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with full height */}
      <section className="relative h-screen overflow-hidden">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="parallax-container w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1668853853439-923e013afff1?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Background" 
              className="object-cover w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: 'scale(1.12)' }}
              id="parallax-bg"
            />
            {/* Overlay com blur */}
            <div className="absolute inset-0 bg-[#f9fbff]/50 backdrop-blur-[10px]"></div>
          </div>
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
        
        {/* Main hero content */}
        <div className="container mx-auto h-full grid grid-cols-1 lg:grid-cols-12 relative z-10">
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
                {/* 3D image com os 3 círculos com as cores atualizadas */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Primeiro círculo (maior) - cor atualizada */}
                  <div 
                    className="w-[350px] h-[350px] rounded-full backdrop-blur-sm animate-pulse-enhanced"
                    style={{
                      backgroundColor: 'rgb(159 215 255)',
                      boxShadow: 'rgba(129, 177, 255, 0.3) 0px 0px 25px'
                    }}
                  ></div>
                  
                  {/* Segundo círculo (médio) - cor atualizada */}
                  <div 
                    className="absolute w-[300px] h-[300px] rounded-full backdrop-blur-md animate-floating-enhanced" 
                    style={{ 
                      animationDuration: '10s',
                      backgroundColor: 'rgb(164 211 245)',
                      boxShadow: 'rgba(255, 255, 255, 0.28) 0px 0px 20px'
                    }}
                  ></div>
                  
                  {/* Terceiro círculo (menor) - cor atualizada */}
                  <div 
                    className="absolute w-[250px] h-[250px] rounded-full backdrop-blur-md animate-floating-enhanced" 
                    style={{ 
                      animationDuration: '8s', 
                      animationDelay: '1s',
                      backgroundColor: 'rgb(159 209 243)',
                      boxShadow: 'rgba(255, 255, 255, 0.25) 0px 0px 20px'
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 animate-pulse" style={{ animation: 'fadeUp 2s ease-out 2s forwards, pulse 2s infinite' }}>
          <p className="text-gray-600 mb-2 text-sm">Conheça mais</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7L12 12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center">
            Não se trata apenas de <span className="text-blue-600">fazer</span>.<br />
            Trata-se de <span className="text-blue-600">escolher o que importa</span>.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
            {/* Feature 1 */}
            <Card className="bg-white/70 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M12 3L4.5 10.5L4.5 20.5H19.5V10.5L12 3Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Análise por pilares</h3>
                <p className="text-gray-600 text-lg flex-grow">
                  Avalie cada tarefa pelos três pilares fundamentais: importância real, 
                  orgulho pós-execução e contribuição para seu crescimento pessoal.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="bg-white/70 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16.5V14M7 10.5H17M7 7.5H17M9 19.5H15C16.1046 19.5 17 18.6046 17 17.5V6.5C17 5.39543 16.1046 4.5 15 4.5H9C7.89543 4.5 7 5.39543 7 6.5V17.5C7 18.6046 7.89543 19.5 9 19.5Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Clareza nas escolhas</h3>
                <p className="text-gray-600 text-lg flex-grow">
                  Abandone o ruído das tarefas sem propósito. 
                  Foque apenas no que realmente vai te levar aonde você quer chegar.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="bg-white/70 backdrop-blur-md border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17L15 17M12 13L12 7M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Análise estratégica</h3>
                <p className="text-gray-600 text-lg flex-grow">
                  Entenda padrões e tendências nas suas escolhas para refinar 
                  continuamente sua abordagem e melhorar sua execução.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 bg-gray-50 relative z-10">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center">
            Como o <span className="text-blue-600">Zenn</span> funciona
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Defina suas tarefas</h3>
                    <p className="text-gray-600 text-lg">
                      Adicione tarefas e classifique-as nos três pilares fundamentais.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Priorize o que importa</h3>
                    <p className="text-gray-600 text-lg">
                      A análise de pilares gera um score que te ajuda a distinguir o essencial do acessório.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Revise e aprenda</h3>
                    <p className="text-gray-600 text-lg">
                      Acompanhe seu progresso e insights estratégicos para refinar sua execução.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1555421689-3f034debb7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Dashboard" 
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center">
            O que nossos usuários dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Mariana Silva</h4>
                    <p className="text-gray-500 text-sm">Empreendedora</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Finalmente consigo focar no que realmente importa. O Zenn me ajudou a eliminar o ruído e focar nas tarefas que realmente movem minha empresa para frente."
                </p>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Ricardo Mendes</h4>
                    <p className="text-gray-500 text-sm">Gerente de Projetos</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "A análise por pilares mudou completamente a maneira como eu priorizo tarefas. Agora tenho clareza sobre o que realmente vai gerar impacto no meu trabalho."
                </p>
              </CardContent>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Juliana Costa</h4>
                    <p className="text-gray-500 text-sm">Desenvolvedora</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Eu estava sobrecarregada com milhares de tarefas. O Zenn me ajudou a simplificar e focar apenas no que vai realmente me fazer crescer profissionalmente."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 bg-blue-600 relative z-10">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-white">
            Pronto para encontrar clareza?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Comece hoje a jornada para uma execução pessoal com propósito e direção.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-md flex items-center gap-2 mx-auto"
          >
            Começar com Clareza
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400 relative z-10">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img 
                src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/loogzenn.png?v=1747447750" 
                alt="Zenn Logo" 
                className="w-24 h-auto filter brightness-0 invert opacity-50"
              />
            </div>
            <div>
              <p className="text-sm">© 2023 Zenn. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
