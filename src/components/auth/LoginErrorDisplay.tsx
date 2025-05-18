
import React, { useEffect, useState } from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Animation and persistence effect when error changes
  useEffect(() => {
    if (error) {
      console.log("[LoginErrorDisplay] Recebido novo erro:", error);
      setErrorMessage(error);
      setVisible(true);
      
      // Log para debug
      console.log("[LoginErrorDisplay] Estado atualizado - visible:", true, "errorMessage:", error);
    } else {
      // Não limpa a mensagem de erro imediatamente para permitir a animação de saída
      const timer = setTimeout(() => {
        setVisible(false);
        // Só limpa a mensagem depois que a animação terminar
        setTimeout(() => setErrorMessage(null), 300);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  // Se não há erro para exibir, ainda mantém o espaço reservado
  if (!errorMessage) {
    return <div className="min-h-[80px]"></div>;
  }

  return (
    <div className="min-h-[80px] transition-all duration-300 mb-6">
      <div 
        className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md 
          transition-all duration-300 ease-in-out transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        role="alert"
        aria-live="assertive"
      >
        <p className="text-sm font-medium">{errorMessage}</p>
        {suggestion && (
          <p className="text-xs mt-1 text-red-600">{suggestion}</p>
        )}
      </div>
    </div>
  );
};

export default LoginErrorDisplay;
