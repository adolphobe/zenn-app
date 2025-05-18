
import React from 'react';

interface LoginErrorDisplayProps {
  error: string | null;
  suggestion: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error, suggestion }) => {
  // Simplified error display component with guaranteed visible output when errors exist
  return (
    <div className="min-h-[60px]">
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
