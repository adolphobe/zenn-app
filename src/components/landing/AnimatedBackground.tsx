
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <>
      {/* Imagem de fundo com opacidade */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <img 
          src="https://images.pexels.com/photos/19294597/pexels-photo-19294597/free-photo-of-natureza-nuvens-ceu-azul-ceu-de-brigadeiro.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Céu de brigadeiro"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Balões flutuantes animados */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animated-float"
            style={{
              backgroundColor: 'rgba(142, 206, 234, 0.3)', // Aumentando a opacidade para 30%
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 20 + 15}s`,
            }}
          />
        ))}
      </div>
      
      <style>
        {`
        @keyframes float-animate {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translate(50px, -30px) scale(1.05) rotate(3deg);
            opacity: 0.4;
          }
          50% {
            transform: translate(100px, 10px) scale(1.1) rotate(6deg);
            opacity: 0.3;
          }
          75% {
            transform: translate(50px, 40px) scale(1.05) rotate(3deg);
            opacity: 0.4;
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
        }
        
        .animated-float {
          animation: float-animate ease-in-out infinite;
          animation-duration: 20s;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
          border-radius: 50%;
        }
      `}
      </style>
    </>
  );
};

export default AnimatedBackground;
