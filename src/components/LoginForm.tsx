
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

  // Manipular o submit do formulário para prevenir o comportamento padrão
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impedir o refresh da página
    onSubmit(e);
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
        {/* Garantir que a mensagem de erro seja exibida com alta prioridade */}
        {loginError && (
          <LoginErrorDisplay 
            error={loginError} 
            suggestion={loginSuggestion} 
          />
        )}
        
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
