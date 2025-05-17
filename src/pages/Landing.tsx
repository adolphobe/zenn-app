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

const Landing: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <HeroSection openModal={() => setModalOpen(true)} />
      <FeaturesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />

      <ExplanationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
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

