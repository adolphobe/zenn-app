
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
  const { form, isLoading, loginError, loginSuggestion, onSubmit } = useLoginForm(onSuccess);

  // Adicionar efeito para logs quando os erros mudarem
  useEffect(() => {
    console.log("[LoginForm Component] Recebendo erro:", loginError);
    console.log("[LoginForm Component] Recebendo sugestão:", loginSuggestion);
  }, [loginError, loginSuggestion]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Certifique-se de que o componente de erro recebe as props corretamente */}
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
