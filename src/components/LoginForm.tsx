
import React, { useEffect } from 'react';
import { Form } from "@/components/ui/form";
import LoginErrorDisplay from './auth/LoginErrorDisplay';
import LoginFormFields from './auth/LoginFormFields';
import LoginActions from './auth/LoginActions';
import { useLoginForm } from './auth/useLoginForm';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onSwitchToSignup, 
  onForgotPassword 
}) => {
  const { 
    form, 
    isLoading, 
    loginError, 
    loginSuggestion, 
    onSubmit,
    setupErrorClearing 
  } = useLoginForm(onSuccess);

  // Configurar limpeza de erros ao digitar
  useEffect(() => {
    console.log("[LoginForm Component] Configurando efeito de limpeza de erros");
    const unsubscribe = setupErrorClearing();
    return unsubscribe;
  }, [setupErrorClearing]);

  // Este log ajuda a confirmar se o componente está recebendo o erro
  useEffect(() => {
    console.log("[LoginForm Component] Renderizado com erro:", loginError);
  }, [loginError]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* O componente de erro ACIMA dos campos para melhor visibilidade */}
        <LoginErrorDisplay 
          error={loginError} 
          suggestion={loginSuggestion} 
        />
        
        <LoginFormFields form={form} />

        <LoginActions 
          isLoading={isLoading}
          onForgotPassword={onForgotPassword}
          onSwitchToSignup={onSwitchToSignup}
        />
      </form>
    </Form>
  );
};

export default LoginForm;
