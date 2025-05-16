
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/landing/AnimatedBackground';
import Navigation from '@/components/landing/Navigation';
import MainContent from '@/components/landing/MainContent';
import DecorativeLine from '@/components/landing/DecorativeLine';

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
      navigate(path, { state: { from: 'landing' } });
    }, 800); // Aumentando o tempo de transição para 800ms para uma saída mais suave
  };
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      {/* Animated floating circles and background image */}
      <AnimatedBackground />

      {/* Top navigation */}
      <Navigation loaded={loaded} onNavigate={handleNavigate} />

      {/* Main content */}
      <MainContent loaded={loaded} isNavigating={isNavigating} onNavigate={handleNavigate} />

      {/* Decorative element - subtle line */}
      <DecorativeLine />
    </div>
  );
};

export default Index;
