
import React, { useEffect, useRef } from 'react';
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
  const { form, isLoading, loginError, loginSuggestion, onSubmit } = useLoginForm(onSuccess);
  const formRef = useRef<HTMLFormElement>(null);

  // Adicionar efeito para logs quando os erros mudarem
  useEffect(() => {
    console.log("[LoginForm Component] Recebendo erro:", loginError);
    console.log("[LoginForm Component] Recebendo sugestão:", loginSuggestion);
  }, [loginError, loginSuggestion]);

  return (
    <Form {...form}>
      {/* 
        Importante: 
        1. Usar onSubmit diretamente do useLoginForm 
        2. Não adicionar onSubmit diretamente no form element nativo
      */}
      <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
        {/* Garantir que a mensagem de erro seja exibida com alta prioridade e local fixo */}
        <div className="min-h-[80px]">  {/* Altura fixa para evitar saltos no layout */}
          {loginError && (
            <LoginErrorDisplay 
              error={loginError} 
              suggestion={loginSuggestion} 
            />
          )}
        </div>
        
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
