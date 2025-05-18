
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

  // Debug log para verificar quando o componente renderiza com erro
  useEffect(() => {
    console.log("[LoginForm Component] Renderizando com erro:", loginError);
    
    // Este log vai confirmar se o DOM está sendo atualizado com o novo valor de erro
    if (loginError) {
      console.log("[LoginForm Component] DOM deve ser atualizado para mostrar o erro:", loginError);
    }
  }, [loginError]);

  // Este log confirma cada renderização do componente
  console.log("[LoginForm Component] Renderizando componente, estado atual do erro:", loginError);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
