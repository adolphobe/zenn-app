
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { throttledLog } from '@/utils/logUtils';
import { modalDataContent } from '@/components/landing/ExplanationModal';
import useImagePreloader from '@/hooks/useImagePreloader';
import '../styles/animations.css';

// Components
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ExplanationModal from '@/components/landing/ExplanationModal';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [circlesKey, setCirclesKey] = useState(Date.now());
  
  // Modal state
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [currentModalData, setCurrentModalData] = useState<{ title: string; content: JSX.Element } | null>(null);

  // Pré-carregamento de imagens críticas
  const { imagesLoaded } = useImagePreloader({
    imageUrls: [
      "https://images.unsplash.com/photo-1668853853439-923e013afff1?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://cdn.shopify.com/s/files/1/0629/1993/4061/files/loogzenn.png?v=1747447750",
      "https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-14_57956f3d-9daf-4aee-a20b-68f3bb0f3858.webp?v=1747464720"
    ]
  });

  // Combinando os efeitos de carregamento para garantir uma inicialização suave
  useEffect(() => {
    // Só inicializa a carga quando as imagens principais tiverem sido carregadas
    if (imagesLoaded) {
      throttledLog("LANDING", "Imagens principais carregadas, iniciando animações");
      
      // Usar setTimeout para garantir que o DOM tenha tempo de renderizar completamente
      const loadTimer = setTimeout(() => {
        setLoaded(true);
      }, 100);
      
      return () => {
        clearTimeout(loadTimer);
      };
    }
  }, [imagesLoaded]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (!showLogin) {
      setCirclesKey(Date.now());
    }
  }, [showLogin]);

  const openExplanationModal = (type: 'pilares' | 'clareza' | 'estrategia') => {
    setCurrentModalData(modalDataContent[type]); 
    setIsExplanationModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  }; 

  const closeExplanationModal = () => {
    setIsExplanationModalOpen(false);
    setCurrentModalData(null);
    document.body.style.overflow = 'auto'; 
  };

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
  }, [isExplanationModalOpen]); 

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(prev => (prev + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <HeroSection 
        loaded={loaded}
        showLogin={showLogin}
        circlesKey={circlesKey}
        handleGetStarted={handleGetStarted}
        setShowLogin={setShowLogin}
      />

      <FeaturesSection openExplanationModal={openExplanationModal} />
      <HowItWorksSection />
      <TestimonialsSection 
        activeTestimonial={activeTestimonial} 
        setActiveTestimonial={setActiveTestimonial} 
      />
      <CTASection handleGetStarted={handleGetStarted} />
      <Footer />

      {/* Modal de explicação */}
      <ExplanationModal 
        isOpen={isExplanationModalOpen}
        onClose={closeExplanationModal}
        currentModalData={currentModalData}
      />
    </div>
  );
};

export default Landing;
