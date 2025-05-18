
import React from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  // Agora, adicionamos um log para debugging
  console.log("[LoginErrorDisplay] Rendering with error:", error);
  console.log("[LoginErrorDisplay] Rendering with suggestion:", suggestion);
  
  // Se não houver erro, não renderizamos nada
  if (!error) return null;
  
  return (
    <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md mb-2 animate-in fade-in slide-in-from-top-5 duration-300">
      <p className="text-sm font-medium">{error}</p>
      {suggestion && (
        <p className="text-xs mt-1">{suggestion}</p>
      )}
    </div>
  );
};

export default LoginErrorDisplay;
