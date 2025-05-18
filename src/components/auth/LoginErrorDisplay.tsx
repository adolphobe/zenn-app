
import React, { useEffect, useState } from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  const [visible, setVisible] = useState(false);
  
  // Animation effect when error changes
  useEffect(() => {
    if (error) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [error]);

  return (
    <div className="min-h-[80px] transition-all duration-300">
      {error && (
        <div className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md 
          animate-fade-in transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-sm font-medium">{error}</p>
          {suggestion && (
            <p className="text-xs mt-1 text-red-600">{suggestion}</p>
          )}
        </div>
      )}
      {!error && <div className="min-h-[60px]"></div>}
    </div>
  );
};

export default LoginErrorDisplay;
