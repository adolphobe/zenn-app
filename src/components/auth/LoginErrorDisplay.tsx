
import React, { useEffect, useState } from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Se houver erro, torna visível com animação
    if (error) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [error]);

  // Se não há erro, ainda renderizamos o espaço, mas invisível
  if (!error) {
    return <div className="min-h-[60px]" aria-hidden="true"></div>;
  }

  return (
    <div 
      className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6 transition-all duration-300 ${
        visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <p className="font-medium">{error}</p>
      {suggestion && (
        <p className="text-xs mt-1 text-red-600">{suggestion}</p>
      )}
    </div>
  );
};

export default LoginErrorDisplay;
