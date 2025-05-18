
import React from 'react';
import { useAuth } from '@/context/auth';

const Dashboard2: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Dashboard 2</h1>
        
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="font-medium mb-2">Usuário logado:</h2>
          <div className="text-sm space-y-2">
            <p><span className="font-semibold">Nome:</span> {currentUser?.name || 'N/A'}</p>
            <p><span className="font-semibold">Email:</span> {currentUser?.email || 'N/A'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Sair
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Esta é uma página de teste para verificar problemas de redirecionamento</p>
      </div>
    </div>
  );
};

export default Dashboard2;
