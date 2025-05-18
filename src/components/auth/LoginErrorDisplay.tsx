
import React from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  // Se não há erro, não renderizamos nada
  if (!error) {
    return <div className="min-h-[60px]" aria-hidden="true"></div>;
  }

  return (
    <div 
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6 animate-in fade-in duration-300"
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
