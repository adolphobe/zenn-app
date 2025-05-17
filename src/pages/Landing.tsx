import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm';

type ModalContentType = 'pilares' | 'clareza' | 'estrategia';

// PASSO 6.1: Conteúdo final do modal com JSX
const finalModalDataContent = {
    pilares: {
      title: "🌟 Análise por Pilares",
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="font-semibold">No Zenn, você não adiciona uma tarefa apenas com um título e uma data. Você adiciona consciência.</p>
          <p>Cada tarefa é avaliada com base em três pilares:</p>
          <div className="pl-4 space-y-3">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Importância real (Risco de não fazer)</h4>
              <p className="italic text-sm">“Se eu ignorar isso, vai ter consequência?”</p>
              <p>É o que te faz priorizar o que realmente não pode ser adiado.</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Orgulho pós-execução</h4>
              <p className="italic text-sm">“Quando eu terminar, vou me sentir mais alinhado com quem quero ser?”</p>
              <p>É o pilar que mede sua conexão com o que você faz. Não é só cumprir — é se respeitar por ter feito.</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Crescimento pessoal</h4>
              <p className="italic text-sm">“Fazer isso me torna alguém melhor?”</p>
              <p>É o que separa tarefas operacionais de tarefas que constroem a sua evolução real.</p>
            </div>
          </div>
          <p className="font-semibold pt-2">Esses três pilares não são para julgar produtividade. Eles te ajudam a escolher com consciência o que realmente merece seu tempo.</p>
        </div>
      )
    },
    clareza: {
      title: "🎯 Clareza nas Escolhas",
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="font-semibold">Todo mundo tem uma lista de tarefas. O Zenn não é mais uma. Ele é o primeiro sistema que organiza a intenção por trás de cada escolha.</p>
          <p>Não basta fazer. Você precisa sentir que valeu a pena.</p>
          <p>É por isso que, no momento em que você cria uma tarefa no Zenn, você é convidado a refletir:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400 font-medium pl-2">
            <li>Isso é importante mesmo?</li>
            <li>Isso vai me deixar orgulhoso?</li>
            <li>Isso me faz crescer?</li>
          </ul>
          <p>Você começa a abandonar o excesso, a rasura, o “checklist automático”. No lugar disso, você executa com peso emocional e propósito estratégico.</p>
          <p className="font-semibold pt-2">Resultado? Menos culpa. Mais direção.</p>
        </div>
      )
    },
    estrategia: {
      title: "📊 Análise Estratégica",
      content: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="font-semibold">Você não precisa esperar uma crise para perceber que está vivendo no automático. O Zenn analisa, em tempo real, o que suas tarefas estão dizendo sobre você.</p>
          <p>A cada tarefa concluída, o sistema registra e organiza:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400 font-medium pl-2">
            <li>Qual pilar você mais fortaleceu?</li>
            <li>Quais tarefas te transformaram de verdade?</li>
            <li>O que você concluiu por obrigação?</li>
          </ul>
          <p>Esses dados geram um relatório estratégico semanal com frases claras e insights práticos. Você começa a enxergar padrões de comportamento — e pode ajustar seu foco antes de cair em ciclos improdutivos.</p>
          <p className="font-semibold pt-2">Não é só um app de tarefas. É um sistema de leitura da sua própria execução.</p>
        </div>
      )
    }
  };

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [circlesKey, setCirclesKey] = useState(Date.now());
  
  const isLoggedIn = localStorage.getItem('acto_is_logged_in') === 'true';

  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  // PASSO 6.1: Atualizar tipo para aceitar JSX no content
  const [currentModalData, setCurrentModalData] = useState<{ title: string; content: JSX.Element } | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
      return;
    }
    setShowLogin(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  useEffect(() => {
    if (!showLogin) {
      setCirclesKey(Date.now());
    }
  }, [showLogin]);

  // PASSO 6.2: Atualizar para usar finalModalDataContent
  const openExplanationModal = useCallback((type: ModalContentType) => {
    setCurrentModalData(finalModalDataContent[type]); 
    setIsExplanationModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  }, []); 

  const closeExplanationModal = useCallback(() => {
    setIsExplanationModalOpen(false);
    setCurrentModalData(null);
    document.body.style.overflow = 'auto'; 
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeExplanationModal();
      }
    };
    if (isExplanationModalOpen) {
        window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      if (document.body.style.overflow === 'hidden' && !isExplanationModalOpen) { 
        document.body.style.overflow = 'auto';
      }
    };
  }, [isExplanationModalOpen, closeExplanationModal]); 


  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-in');
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(section => observer.observe(section));
    return () => {
      elements.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(prev => (prev + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <style>
        {`
          /* Seu CSS existente ... */
          @keyframes floating { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; } 25% { transform: translateY(-15px) translateX(10px); opacity: 0.5; } 50% { transform: translateY(-25px) translateX(-10px); opacity: 0.4; } 75% { transform: translateY(-10px) translateX(-5px); opacity: 0.3; } }
          .animate-floating { animation: floating 15s ease-in-out infinite; }
          @keyframes floating-enhanced {  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.2; } 20% { transform: translateY(-25px) translateX(20px) scale(1.05); opacity: 0.4; } 40% { transform: translateY(-35px) translateX(-15px) scale(0.95); opacity: 0.5; } 60% { transform: translateY(-15px) translateX(-30px) scale(1.02); opacity: 0.4; } 80% { transform: translateY(-30px) translateX(10px) scale(0.98); opacity: 0.3; } 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.2; } }
          .animate-floating-enhanced { animation: floating-enhanced 12s ease-in-out infinite; will-change: transform, opacity; }
          @keyframes pulse-enhanced { 0%, 100% { transform: scale(1); opacity: 0.3; }  50% { transform: scale(1.1); opacity: 0.5; } }
          .animate-pulse-enhanced { animation: pulse-enhanced 8s ease-in-out infinite;  will-change: transform, opacity; }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .fade-up { animation: fadeUp 1.2s ease-out forwards; }
          .fade-up-delay-1 { animation-delay: 0.2s; }
          .fade-up-delay-2 { animation-delay: 0.4s; }
          .fade-up-delay-3 { animation-delay: 0.6s; }
          @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .slide-in { animation: slideIn 0.6s ease-out forwards; }
          @keyframes slideOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-30px); } }
          .slide-out { animation: slideOut 0.6s ease-out forwards; }
          .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
          .animate-in { opacity: 1; transform: translateY(0); }
          @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .gradient-flow-bg { background: linear-gradient(120deg, #e0f2fe, #bfdbfe, #dbeafe, #eff6ff); background-size: 300% 300%; animation: gradientFlow 15s ease infinite; }
          .gradient-card-hover { position: relative; overflow: hidden; z-index: 1; transition: transform 0.3s ease; }
          .gradient-card-hover::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(120deg, #dbeafe, #bfdbfe, #93c5fd); background-size: 300% 300%; animation: gradientFlow 8s ease infinite; z-index: -1; opacity: 0; transition: opacity 0.3s ease; border-radius: 0.5rem; }
          .gradient-card-hover:hover { transform: translateY(-5px); }
          .gradient-card-hover:hover::before { opacity: 0.07; }
          .blob-animation { position: absolute; border-radius: 50%; background: linear-gradient(45deg, rgba(191, 219, 254, 0.4), rgba(96, 165, 250, 0.2)); filter: blur(40px); }
          @keyframes float-around { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(60px, -40px) scale(1.1); } 66% { transform: translate(-30px, 40px) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
          .testimonial-card { transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out, filter 0.5s ease-in-out; will-change: transform, opacity, filter; }
          .testimonial-active { transform: scale(1); opacity: 1; filter: grayscale(0%); }
          .testimonial-inactive { transform: scale(0.9); opacity: 0.6; filter: grayscale(50%); }

          .modal-content-area::-webkit-scrollbar { width: 8px; }
          .modal-content-area::-webkit-scrollbar-track { background: transparent; }
          .modal-content-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          .modal-content-area::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          .dark .modal-content-area::-webkit-scrollbar-thumb { background: #4b5563; }
          .dark .modal-content-area::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        `}
      </style>
      
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
                Começar com Clareza
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
            <div className={`mt-32 opacity-0 ${loaded ? 'fade-up fade-up-delay-3' : ''}`}>
              <p className="text-xs text-gray-400 dark:text-gray-500">Aplicativo em Beta, bugs podem acontecer.</p>
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
                  <LoginForm />
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

      <section className="py-32 relative z-10 overflow-hidden bg-gradient-to-b from-white via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" style={{backfaceVisibility: 'hidden', transform: 'translateZ(0)'}}>
        <div className="blob-animation w-64 h-64 top-20 left-10" style={{ animation: 'float-around 25s infinite ease-in-out' }}></div>
        <div className="blob-animation w-96 h-96 bottom-40 right-20" style={{ animation: 'float-around 30s infinite ease-in-out reverse' }}></div>
        <div className="container mx-auto px-8 relative">
          <div className="text-center mb-24 animate-on-scroll">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-4">Uma lista de tarefas diferente</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-gray-900 dark:text-white">
              Não se trata apenas de <span className="text-blue-600 dark:text-blue-400">fazer</span>.<br />
              Trata-se de <span className="text-blue-600 dark:text-blue-400">escolher o que importa</span>.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              O que faz cada tarefa valer a pena? O Zenn ajuda você a avaliar e escolher o que realmente vai trazer impacto para sua vida.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
              <Card className="gradient-card-hover bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none h-full rounded-xl overflow-hidden transition-all duration-300">
                <CardContent className="p-10 flex flex-col h-full">
                  <div className="rounded-full bg-blue-50 dark:bg-blue-900/50 w-16 h-16 flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10M12 3L4.5 10.5L4.5 20.5H19.5V10.5L12 3Z" stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">Análise por pilares</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg flex-grow">Avalie cada tarefa pelos três pilares fundamentais: importância real, orgulho pós-execução e contribuição para seu crescimento pessoal.</p>
                  <div className="mt-8">
                    <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/70 p-0 flex items-center gap-2 group" onClick={() => openExplanationModal('pilares')}>
                        Saiba mais
                        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
              <Card className="gradient-card-hover bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none h-full rounded-xl overflow-hidden transition-all duration-300">
                <CardContent className="p-10 flex flex-col h-full">
                  <div className="rounded-full bg-blue-50 dark:bg-blue-900/50 w-16 h-16 flex items-center justify-center mb-8">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16.5V14M7 10.5H17M7 7.5H17M9 19.5H15C16.1046 19.5 17 18.6046 17 17.5V6.5C17 5.39543 16.1046 4.5 15 4.5H9C7.89543 4.5 7 5.39543 7 6.5V17.5C7 18.6046 7.89543 19.5 9 19.5Z" stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">Clareza nas escolhas</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg flex-grow">Abandone o ruído das tarefas sem propósito. Foque apenas no que realmente vai te levar aonde você quer chegar.</p>
                  <div className="mt-8">
                    <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/70 p-0 flex items-center gap-2 group" onClick={() => openExplanationModal('clareza')}>
                        Saiba mais 
                        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="animate-on-scroll" style={{ transitionDelay: '0.5s' }}>
              <Card className="gradient-card-hover bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none h-full rounded-xl overflow-hidden transition-all duration-300">
                <CardContent className="p-10 flex flex-col h-full">
                  <div className="rounded-full bg-blue-50 dark:bg-blue-900/50 w-16 h-16 flex items-center justify-center mb-8">
                     <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 17L15 17M12 13L12 7M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">Análise estratégica</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg flex-grow">Entenda padrões e tendências nas suas escolhas para refinar continuamente sua abordagem e melhorar sua execução.</p>
                  <div className="mt-8">
                    <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/70 p-0 flex items-center gap-2 group" onClick={() => openExplanationModal('estrategia')}>
                        Saiba mais 
                        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <section className="relative z-10 overflow-hidden bg-gradient-to-b from-white via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-24 animate-on-scroll">
                <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-4">Fluxo Simples</span>
                <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-gray-900 dark:text-white">
                  Como o <span className="text-blue-600 dark:text-blue-400">Zenn</span> funciona
                </h2>
              </div>
              <div className="relative">
                <div className="absolute left-16 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 dark:from-blue-700 dark:via-blue-500 dark:to-blue-700 hidden md:block"></div>
                <div className="space-y-20">
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start animate-on-scroll">
                    <div className="flex-shrink-0 relative"><div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 flex items-center justify-center text-white text-4xl font-bold">1</div><div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-70"></div></div>
                    <div className="md:pt-3">
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Defina suas tarefas</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Adicione suas tarefas no Zenn e as classifique usando os três pilares fundamentais: importância real para seus objetivos, orgulho que sentirá após concluí-la, e contribuição para seu crescimento pessoal.</p>
                      <div className="p-5 bg-blue-50 dark:bg-gray-800 rounded-xl" style={{ border: '1px solid #bddbff' }} ><div className="flex items-start gap-3"><CheckCircle2 className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={20} /><p className="text-blue-700 dark:text-blue-300">Interface intuitiva que torna simples a classificação de cada tarefa</p></div></div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start animate-on-scroll">
                    <div className="flex-shrink-0 relative"><div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 flex items-center justify-center text-white text-4xl font-bold">2</div><div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-70"></div></div>
                    <div className="md:pt-3">
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Priorize o que importa</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">A análise de pilares gera um score que te ajuda a distinguir o essencial do acessório. Foque nas tarefas com maior impacto e significado para seus objetivos de longo prazo.</p>
                      <div className="p-5 bg-blue-50 dark:bg-gray-800 rounded-xl" style={{ border: '1px solid #bddbff' }} ><div className="flex items-start gap-3"><CheckCircle2 className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={20} /><p className="text-blue-700 dark:text-blue-300">Sistema de score visual que permite identificar imediatamente o que merece sua atenção</p></div></div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start animate-on-scroll">
                    <div className="flex-shrink-0 relative"><div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 flex items-center justify-center text-white text-4xl font-bold">3</div><div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-70"></div></div>
                    <div className="md:pt-3">
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Revise e aprenda</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Acompanhe seu progresso através de insights estratégicos que revelam padrões em suas escolhas. Refine sua abordagem ao longo do tempo para maximizar seu impacto e satisfação pessoal.</p>
                      <div className="p-5 bg-blue-50 dark:bg-gray-800 rounded-xl" style={{ border: '1px solid #bddbff' }} ><div className="flex items-start gap-3"><CheckCircle2 className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={20} /><p className="text-blue-700 dark:text-blue-300">Relatórios semanais personalizados para aprimorar constantemente suas decisões</p></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-32 animate-on-scroll">
              <div className="relative mx-auto max-w-4xl">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-100 dark:bg-blue-900/50 rounded-full opacity-70 blur-3xl"></div><div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-200 dark:bg-blue-800/50 rounded-full opacity-70 blur-3xl"></div>
                <div className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-gray-700/30"><img src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-14_57956f3d-9daf-4aee-a20b-68f3bb0f3858.webp?v=1747464720" alt="Dashboard" className="w-full h-auto"/><div className="hidden absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-blue-400/10 to-transparent dark:from-blue-900/20 dark:via-blue-700/10"></div></div>
                <div className="absolute top-10 right-10 max-w-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-blue-100 dark:border-gray-700"><h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Visão por Pilares</h4><p className="text-sm text-gray-600 dark:text-gray-400">Visualize rapidamente suas tarefas organizadas de acordo com os três pilares fundamentais.</p></div>
                <div className="absolute bottom-10 left-10 max-w-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-blue-100 dark:border-gray-700"><h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Score Intuitivo</h4><p className="text-sm text-gray-600 dark:text-gray-400">Identifique facilmente quais tarefas merecem sua atenção prioritária através dos scores visuais.</p></div>
              </div>
            </div>
          </div>
        </section>
      <section className="py-32 relative z-10 overflow-hidden bg-gradient-to-b from-white via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="blob-animation w-72 h-72 top-40 right-20 opacity-50" style={{ animation: 'float-around 20s infinite ease-in-out' }}></div>
        <div className="blob-animation w-80 h-80 bottom-40 left-10 opacity-40" style={{ animation: 'float-around 25s infinite ease-in-out reverse' }}></div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-20 animate-on-scroll">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-4">Experiências Reais</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-gray-900 dark:text-white">O que nossos usuários dizem</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Pessoas que encontraram clareza e propósito em suas tarefas diárias com o Zenn</p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                {[ { name: "Mariana Silva", role: "Empreendedora", initials: "MS", quote: "\"Finalmente consigo focar no que realmente importa. O Zenn me ajudou a eliminar o ruído e focar nas tarefas que realmente movem minha empresa para frente.\"" }, { name: "Ricardo Mendes", role: "Gerente de Projetos", initials: "RM", quote: "\"A análise por pilares mudou completamente a maneira como eu priorizo tarefas. Agora tenho clareza sobre o que realmente vai gerar impacto no meu trabalho e na minha vida.\"" }, { name: "Juliana Costa", role: "Desenvolvedora", initials: "JC", quote: "\"Eu estava sobrecarregada com milhares de tarefas. O Zenn me ajudou a simplificar e focar apenas no que vai realmente me fazer crescer profissionalmente.\"" } ].map((testimonial, index) => ( <div key={index} className={`testimonial-card w-full lg:w-1/3 ${activeTestimonial === index ? 'testimonial-active' : 'testimonial-inactive'}`} onClick={() => setActiveTestimonial(index)} onMouseEnter={() => setActiveTestimonial(index)}> <Card className="bg-white dark:bg-gray-800 border-none transition-all duration-300 overflow-hidden rounded-2xl h-full"> <CardContent className="p-8"> <div className="mb-8"> <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => (<svg key={i} className="text-yellow-400" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div> <p className="text-gray-700 dark:text-gray-300 text-lg italic">{testimonial.quote}</p> </div> <div className="flex items-center"> <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-xl mr-4">{testimonial.initials}</div> <div><h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4><p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p></div> </div> </CardContent> </Card> </div> ))}
              </div>
              <div className="flex justify-center mt-10 gap-3"> {[0, 1, 2].map((index) => (<button key={index} onClick={() => setActiveTestimonial(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-blue-600 dark:bg-blue-400 w-10' : 'bg-blue-200 dark:bg-gray-700'}`}/>))} </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 z-0"></div>
        <div className="absolute inset-0 overflow-hidden"> <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-xl"></div> <div className="absolute top-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-xl"></div> <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl"></div> <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,256L80,261.3C160,267,320,277,480,250.7C640,224,800,160,960,138.7C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" fill="rgba(255,255,255,0.05)"></path></svg> <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,144C672,160,768,160,864,138.7C960,117,1056,75,1152,58.7C1248,43,1344,53,1392,58.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="rgba(255,255,255,0.1)"></path></svg> </div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-on-scroll">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-white">Pronto para encontrar clareza?</h2>
              <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto">Comece hoje a jornada para uma execução pessoal com propósito e direção.</p>
              <Button onClick={handleGetStarted} className="bg-white text-blue-600 dark:text-blue-700 hover:text-blue-700 dark:hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-100 px-10 py-6 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto group">
                Começar Agora <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <p className="text-blue-100/80 dark:text-blue-200/80 mt-10">Experimente gratuitamente por 14 dias. Sem compromisso.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-16 bg-gray-900 text-gray-400 relative z-10 dark:bg-gray-950">
        <div className="container mx-auto px-8">
          <div className="flex flex-col items-center text-center">
            <img src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/loogzenn.png?v=1747447750" alt="Zenn Logo" className="w-28 h-auto filter brightness-0 invert opacity-70 mb-6"/>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg">Zenn é um app de execução pessoal que te ajuda a focar no que realmente importa, avaliando cada tarefa por três pilares: importância real, orgulho pós-execução e crescimento pessoal.</p>
            <div className="flex gap-6 mb-12"> <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg></a> <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg></a> <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></a> </div>
            <div className="border-t border-gray-800 dark:border-gray-700 pt-8 w-full text-center"> <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Zenn. Todos os direitos reservados.</p> </div>
          </div>
        </div>
      </footer>


      {/* MODAL DE EXPLICAÇÃO */}
      {isExplanationModalOpen && currentModalData && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" // Adicionada classe para animação de entrada que você pode definir no CSS
          onClick={closeExplanationModal} 
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] shadow-2xl p-6 md:p-8 relative flex flex-col" // Removido animate-in, pode ser controlado por classes CSS de transição
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {currentModalData.title}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeExplanationModal} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                <X size={20} />
              </Button>
            </div>

            {/* PASSO 6.3: Renderizar o conteúdo JSX */}
            <div className="overflow-y-auto flex-grow pr-2 modal-content-area">
              {currentModalData.content} 
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
              <Button onClick={closeExplanationModal} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-2">
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;