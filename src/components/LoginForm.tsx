
import React from 'react';
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

  console.log("[LoginForm Component] Renderizando com erro:", loginError);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <LoginErrorDisplay error={loginError} suggestion={loginSuggestion} />
        
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
