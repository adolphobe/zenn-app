
import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginErrorToastProps {
  error: string | null;
  onClose: () => void;
  autoCloseAfter?: number; // in milliseconds
}

const LoginErrorToast: React.FC<LoginErrorToastProps> = ({ 
  error, 
  onClose, 
  autoCloseAfter = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!error) return;
    
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      
      // Wait for animation to complete before removing from DOM
      setTimeout(() => {
        onClose();
      }, 300);
    }, autoCloseAfter);
    
    return () => clearTimeout(timer);
  }, [error, autoCloseAfter, onClose]);

  if (!error) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed top-4 right-4 z-50 max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-md shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">{error}</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-auto text-red-500/70 hover:text-red-500 focus:outline-none"
              aria-label="Fechar"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginErrorToast;
