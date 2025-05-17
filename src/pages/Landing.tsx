import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Star, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  
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

  // Add scroll animation for sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.7;
      
      const sections = [
        { ref: featuresRef, id: 'features' },
        { ref: howItWorksRef, id: 'howItWorks' },
        { ref: testimonialsRef, id: 'testimonials' }
      ];
      
      sections.forEach(section => {
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          const sectionBottom = sectionTop + section.ref.current.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            setActiveSection(section.id);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Scroll to section handler
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

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
            
            /* Animações novas para os elementos da parte inferior */
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            .fade-in-scale {
              opacity: 0;
              transform: scale(0.95);
              transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            .fade-in-scale.active {
              opacity: 1;
              transform: scale(1);
            }
            
            .hover-lift {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .hover-lift:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .feature-icon {
              transition: transform 0.5s ease, background-color 0.3s ease;
            }
            
            .feature-card:hover .feature-icon {
              transform: scale(1.1) rotate(5deg);
              background-color: rgba(59, 130, 246, 0.2);
            }
            
            .testimonial-card {
              transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
            }
            
            .testimonial-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
              border-color: rgba(59, 130, 246, 0.3);
            }
            
            .parallax-scroll {
              transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
            }
            
            .cta-button-hover {
              position: relative;
              overflow: hidden;
              z-index: 1;
            }
            
            .cta-button-hover::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
              transition: left 0.7s ease;
              z-index: -1;
            }
            
            .cta-button-hover:hover::before {
              left: 100%;
            }
            
            .section-fade-in {
              opacity: 0;
              transform: translateY(30px);
              transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .section-fade-in.active {
              opacity: 1;
              transform: translateY(0);
            }
            
            /* Efeito de respiro suave para os elementos importantes */
            @keyframes softBreathe {
              0%, 100% {
                box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0);
              }
              50% {
                box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.1);
              }
            }
            
            .soft-breathe {
              animation: softBreathe 4s infinite ease-in-out;
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
        
        {/* Scroll indicator com animação suave */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-0 animate-pulse" 
          style={{ animation: 'fadeUp 2s ease-out 2s forwards, pulse 2s infinite' }}
          onClick={() => scrollToSection(featuresRef)}
        >
          <p className="text-gray-600 mb-2 text-sm">Conheça mais</p>
          <ChevronDown className="text-gray-600 animate-bounce" size={24} />
        </div>
      </section>

      {/* Features Section - Com efeitos modernos */}
      <section 
        ref={featuresRef}
        className={`py-24 bg-white relative z-10 section-fade-in ${activeSection === 'features' ? 'active' : ''}`}
      >
        <div className="container mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center soft-breathe">
            Não se trata apenas de <span className="text-blue-600">fazer</span>.<br />
            Trata-se de <span className="text-blue-600">escolher o que importa</span>.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
            {/* Feature 1 */}
            <Card className="bg-white/70 backdrop-blur-md border-none shadow-lg hover-lift feature-card h-full">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6 feature-icon">
                  <Star className="text-blue-600" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Análise por pilares</h3>
                <p className="text-gray-600">
                  "A análise por pilares mudou completamente a maneira como eu priorizo tarefas. Agora tenho clareza sobre o que realmente vai gerar impacto no meu trabalho."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="bg-white border border-gray-100 shadow-md testimonial-card overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 overflow-hidden">
                    <span className="text-blue-600 font-semibold">JC</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Juliana Costa</h4>
                    <p className="text-gray-500 text-sm">Desenvolvedora</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Eu estava sobrecarregada com milhares de tarefas. O Zenn me ajudou a simplificar e focar apenas no que vai realmente me fazer crescer profissionalmente."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section com efeitos de hover e gradiente suave */}
      <section className="py-20 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-500"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-700/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse-enhanced"></div>
        </div>
        
        <div className="container mx-auto px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-white">
            Pronto para encontrar clareza?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Comece hoje a jornada para uma execução pessoal com propósito e direção.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-md flex items-center gap-2 mx-auto cta-button-hover"
          >
            Começar com Clareza
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
      
      {/* Novo Feature Highlight */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="fade-in-scale" id="highlight-content">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
                  Análise por <span className="text-blue-600">pilares</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  O Zenn te ajuda a avaliar cada tarefa pelos pilares que realmente importam:
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                    <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15L8 11L10 9L12 11L16 7L18 9L12 15Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Importância real</h3>
                      <p className="text-gray-600">Avalie o impacto verdadeiro da tarefa nos seus objetivos, não apenas a urgência percebida.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                    <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 7L17 9L9 17L5 13L7 11L9 13L15 7Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Orgulho pós-execução</h3>
                      <p className="text-gray-600">Considere o sentimento de realização após completar a tarefa, não apenas a sensação de alívio.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                    <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3V7M3 12H7M12 21V17M21 12H17M19.07 5L16.24 7.83M7.83 7.83L5 5M5 19.07L7.83 16.24M16.24 16.24L19.07 19.07" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Crescimento pessoal</h3>
                      <p className="text-gray-600">Avalie como a tarefa contribui para o seu desenvolvimento, não apenas para manter o status quo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl fade-in-scale" id="highlight-image">
                <img 
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Análise por pilares" 
                  className="w-full h-auto rounded-lg transform transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Inicialização dos efeitos de fade-in-scale */}
        <script dangerouslySetInnerHTML={{
          __html: `
            function handleIntersection(entries) {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('active');
                }
              });
            }
            
            const observer = new IntersectionObserver(handleIntersection, {
              threshold: 0.3
            });
            
            document.addEventListener('DOMContentLoaded', () => {
              const fadeElements = document.querySelectorAll('.fade-in-scale');
              fadeElements.forEach(el => observer.observe(el));
            });
          `
        }} />
      </section>
      
      {/* Footer com gradiente sutil e elementos interativos */}
      <footer className="py-12 bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 relative z-10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-600/20 to-transparent top-0 left-0"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo e Descrição */}
            <div className="md:col-span-1">
              <img 
                src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/loogzenn.png?v=1747447750" 
                alt="Zenn Logo" 
                className="w-24 h-auto filter brightness-0 invert opacity-50 hover:opacity-75 transition-opacity duration-300"
              />
              <p className="mt-4 text-sm text-gray-500">
                Encontre clareza no caos. Foque no que realmente importa.
              </p>
            </div>
            
            {/* Links Rápidos */}
            <div>
              <h4 className="text-white font-medium mb-4">Zenn</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-block">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-block">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-block">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-block">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Suporte */}
            <div>
              <h4 className="text-white font-medium mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-block">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-block">
                    Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-block">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h4 className="text-white font-medium mb-4">Fique por dentro</h4>
              <p className="text-sm text-gray-500 mb-4">
                Receba dicas e novidades sobre como melhorar sua execução pessoal.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="bg-gray-800 text-gray-200 rounded-l-lg py-2 px-4 outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-lg transition-colors duration-300">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2023 Zenn. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;-600 text-lg flex-grow">
                  Avalie cada tarefa pelos três pilares fundamentais: importância real, 
                  orgulho pós-execução e contribuição para seu crescimento pessoal.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="bg-white/70 backdrop-blur-md border-none shadow-lg hover-lift feature-card h-full">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6 feature-icon">
                  <Shield className="text-blue-600" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Clareza nas escolhas</h3>
                <p className="text-gray-600 text-lg flex-grow">
                  Abandone o ruído das tarefas sem propósito. 
                  Foque apenas no que realmente vai te levar aonde você quer chegar.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="bg-white/70 backdrop-blur-md border-none shadow-lg hover-lift feature-card h-full">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6 feature-icon">
                  <Zap className="text-blue-600" size={28} />
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
      
      {/* How It Works Section - Com parallax suave */}
      <section 
        ref={howItWorksRef}
        className={`py-24 bg-gradient-to-b from-gray-50 to-white relative z-10 section-fade-in ${activeSection === 'howItWorks' ? 'active' : ''}`}
      >
        <div className="container mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center soft-breathe">
            Como o <span className="text-blue-600">Zenn</span> funciona
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              {/* Step 1 */}
              <div 
                className="flex gap-6 hover-lift p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300">1</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Defina suas tarefas</h3>
                  <p className="text-gray-600 text-lg">
                    Adicione tarefas e classifique-as nos três pilares fundamentais.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div 
                className="flex gap-6 hover-lift p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300">2</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Priorize o que importa</h3>
                  <p className="text-gray-600 text-lg">
                    A análise de pilares gera um score que te ajuda a distinguir o essencial do acessório.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div 
                className="flex gap-6 hover-lift p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300">3</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Revise e aprenda</h3>
                  <p className="text-gray-600 text-lg">
                    Acompanhe seu progresso e insights estratégicos para refinar sua execução.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1555421689-3f034debb7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Dashboard" 
                className="rounded-xl shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section - Cards com hover effects */}
      <section 
        ref={testimonialsRef}
        className={`py-24 bg-white relative z-10 section-fade-in ${activeSection === 'testimonials' ? 'active' : ''}`}
      >
        <div className="container mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center soft-breathe">
            O que nossos usuários dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-white border border-gray-100 shadow-md testimonial-card overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 overflow-hidden">
                    <span className="text-blue-600 font-semibold">MS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Mariana Silva</h4>
                    <p className="text-gray-500 text-sm">Empreendedora</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Finalmente consigo focar no que realmente importa. O Zenn me ajudou a eliminar o ruído e focar nas tarefas que realmente movem minha empresa para frente."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="bg-white border border-gray-100 shadow-md testimonial-card overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 overflow-hidden">
                    <span className="text-blue-600 font-semibold">RM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Ricardo Mendes</h4>
                    <p className="text-gray-500 text-sm">Gerente de Projetos</p>
                  </div>
                </div>
                <p className="text-gray