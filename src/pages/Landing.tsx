
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

// Make sure these interfaces match the component requirements
interface HeroSectionProps {
  // Add the required props based on the component definition
  openExplanationModal: () => void;
}

interface FeaturesSectionProps {
  openExplanationModal: () => void;
}

interface TestimonialsSectionProps {
  activeTestimonial: number;
  setActiveTestimonial: (index: number) => void;
}

interface CTASectionProps {
  handleGetStarted: () => void;
}

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

  // Log with fragment return instead of void
  const renderDebugLog = () => {
    console.log(`[AUTH:LANDING] Renderizando página inicial: Autenticado=${isAuthenticated}`);
    return <></>;
  };

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
      {renderDebugLog()}
      
      <HeroSection openExplanationModal={openExplanationModal} />
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
