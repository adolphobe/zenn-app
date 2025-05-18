
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoginActionsProps {
  isLoading: boolean;
  onForgotPassword: () => void;
  onSwitchToSignup: () => void;
}

const LoginActions: React.FC<LoginActionsProps> = ({ 
  isLoading, 
  onForgotPassword, 
  onSwitchToSignup 
}) => {
  return (
    <>
      <div className="flex justify-end">
        <button 
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none transition-colors duration-300"
        >
          Esqueceu a senha?
        </button>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground dark:text-gray-400">Não tem uma conta? </span>
        <button 
          type="button" 
          onClick={onSwitchToSignup}
          className="text-blue-600 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
          Criar conta
        </button>
      </div>
    </>
  );
};

export default LoginActions;
