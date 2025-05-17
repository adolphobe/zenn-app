
import React, { useEffect } from 'react';

const LoadingAuth: React.FC = () => {
  useEffect(() => {
    console.log('[AUTH:LOADING] Componente de carregamento de autenticação renderizado');
    return () => {
      console.log('[AUTH:LOADING] Componente de carregamento de autenticação desmontado');
    };
  }, []);
  
  console.log('[AUTH:LOADING] Verificando autenticação...');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <div className="ml-3 text-blue-500">Verificando autenticação...</div>
    </div>
  );
};

export default LoadingAuth;
