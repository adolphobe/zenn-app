
import React, { useEffect, useState } from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  // Estado para controlar a animação de entrada
  const [isVisible, setIsVisible] = useState(false);
  
  // Efeito para ativar a animação quando o erro muda
  useEffect(() => {
    if (error) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [error]);
  
  // Sempre renderiza o container para evitar saltos de layout
  return (
    <div 
      className={`min-h-[60px] transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-1'
      }`}
      aria-live="polite"
    >
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <p className="text-sm font-medium">{error}</p>
          {suggestion && (
            <p className="text-xs mt-1 text-red-600">{suggestion}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginErrorDisplay;
