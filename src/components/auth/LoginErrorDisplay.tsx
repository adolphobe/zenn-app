
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LoginErrorDisplayProps {
  error: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error }) => {
  if (!error) {
    return <div className="min-h-[60px]" aria-hidden="true"></div>;
  }

  return (
    <div 
      className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-5 animate-in fade-in duration-200"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-medium text-sm">{error}</p>
      </div>
    </div>
  );
};

export default LoginErrorDisplay;
