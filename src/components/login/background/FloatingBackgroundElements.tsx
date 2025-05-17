
import React from 'react';

// Component for animated floating background elements
const FloatingBackgroundElements: React.FC = () => {
  // Generate floating items with random properties
  const floatingItems = Array(7).fill(null).map((_, i) => (
    <div 
      key={i}
      className="absolute rounded-full animated-float"
      style={{
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        left: `${Math.random() * 70}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 6 + 6}s`,
        opacity: Math.random() * 0.4 + 0.3,
      }}
    />
  ));

  return (
    <>
      <style>
        {`
        @keyframes float-animate {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -20px) scale(1.05);
            opacity: 0.5;
          }
          50% {
            transform: translate(40px, 10px) scale(1);
            opacity: 0.7;
          }
          75% {
            transform: translate(20px, 30px) scale(0.95);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
        }
        
        .animated-float {
            animation: float-animate ease-in-out infinite alternate;
        }
      `}
      </style>
      
      {/* Floating items for background */}
      {floatingItems}
    </>
  );
};

export default FloatingBackgroundElements;
