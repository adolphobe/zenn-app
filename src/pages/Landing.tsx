
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ExplanationModal from '@/components/landing/ExplanationModal';

// Add types for HeroSectionProps
interface HeroSectionProps {
  openModal: () => void;
}

// Add types for FeaturesSectionProps
interface FeaturesSectionProps {
  openExplanationModal: () => void;
}

// Add types for TestimonialsSectionProps
interface TestimonialsSectionProps {
  activeTestimonial: number;
  setActiveTestimonial: (index: number) => void;
}

// Add types for CTASectionProps
interface CTASectionProps {
  handleGetStarted: () => void;
}

// Add types for ExplanationModalProps
interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModalData?: any;
}

const Landing: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);
  const [currentModalData, setCurrentModalData] = React.useState(null);

  console.log(`[AUTH:LANDING] Renderizando página inicial: Autenticado=${isAuthenticated}`);

  const handleLogout = async () => {
    console.log('[AUTH:LANDING] Iniciando logout');
    await logout();
    navigate('/login');
  };

  const handleGetStarted = () => {
    console.log('[AUTH:LANDING] Redirecionando para dashboard');
    navigate('/dashboard');
  };

  const openExplanationModal = () => {
    console.log('[AUTH:LANDING] Abrindo modal de explicação');
    setModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {console.log('[AUTH:LANDING] Renderizando conteúdo da página inicial')}
      
      <HeroSection openModal={openExplanationModal} />
      <FeaturesSection openExplanationModal={openExplanationModal} />
      <TestimonialsSection 
        activeTestimonial={activeTestimonial}
        setActiveTestimonial={setActiveTestimonial}
      />
      <HowItWorksSection />
      <CTASection handleGetStarted={handleGetStarted} />
      <Footer />

      <ExplanationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentModalData={currentModalData}
      />
      
      {isAuthenticated && (
        <div className="absolute top-4 right-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Landing;
