
import React, { useEffect, useState } from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  // Adicionar estado para controlar a visibilidade da animação
  const [isVisible, setIsVisible] = useState(false);
  
  // Adicionar um efeito para garantir que o erro seja exibido com animação
  useEffect(() => {
    if (error) {
      // Primeiro, forçamos um reset da animação definindo como false
      setIsVisible(false);
      
      // Em seguida, disparamos a animação após um pequeno delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        console.log("[LoginErrorDisplay] Exibindo erro animado:", error);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Logs para debugging
  console.log("[LoginErrorDisplay] Rendering with error:", error);
  console.log("[LoginErrorDisplay] Rendering with suggestion:", suggestion);
  console.log("[LoginErrorDisplay] Visibility state:", isVisible);
  
  // Se não houver erro, não renderizamos nada
  if (!error) return null;
  
  return (
    <div 
      className={`bg-red-50 text-red-700 px-3 py-2 rounded-md mb-4 transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform -translate-y-2'
      }`}
      style={{ zIndex: 10 }}
    >
      <p className="text-sm font-medium">{error}</p>
      {suggestion && (
        <p className="text-xs mt-1">{suggestion}</p>
      )}
    </div>
  );
};

export default LoginErrorDisplay;
