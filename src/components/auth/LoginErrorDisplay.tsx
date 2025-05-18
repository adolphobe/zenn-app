
import React from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  if (!error) return <div className="min-h-[60px]"></div>; // Fixed height placeholder to prevent layout shifts
  
  return (
    <div className="min-h-[60px] bg-red-50 text-red-700 px-4 py-3 rounded-md mb-3 animate-in fade-in slide-in-from-top duration-500">
      <p className="text-sm font-medium">{error}</p>
      {suggestion && (
        <p className="text-xs mt-1">{suggestion}</p>
      )}
    </div>
  );
};

export default LoginErrorDisplay;
