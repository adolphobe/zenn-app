
import React, { useEffect, useState } from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (error) {
      // Reset animation first
      setIsVisible(false);
      
      // Trigger animation after a small delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  // If no error, return minimal space holder
  if (!error) return <div className="h-0"></div>;
  
  return (
    <div 
      className={`bg-red-50 text-red-700 px-3 py-2 rounded-md mb-2 transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform -translate-y-2'
      }`}
      style={{ 
        zIndex: 10,
        borderLeft: '4px solid #ef4444',
        boxShadow: '0 2px 5px rgba(239, 68, 68, 0.1)'
      }}
    >
      <p className="text-sm font-medium">{error}</p>
      {suggestion && (
        <p className="text-xs mt-1 text-red-600">{suggestion}</p>
      )}
    </div>
  );
};

export default LoginErrorDisplay;
