
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginErrorDisplayProps {
  error: string | null;
}

const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <motion.div 
      className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-medium text-sm">{error}</p>
      </div>
    </motion.div>
  );
};

export default LoginErrorDisplay;
