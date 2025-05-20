
import React from 'react';
import { SignupForm } from '@/components/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300">
        <div className="text-left mb-8">
          <img 
            src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-8.jpg?v=1747284016" 
            alt="Acto Logo" 
            className="w-[120px] mb-6"
          />
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Criar uma conta
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie sua conta para começar a usar o aplicativo
          </p>
        </div>
        
        <SignupForm />
        
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <a 
              href="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
            >
              Faça login
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
