
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
  const { form, isLoading, loginError, loginSuggestion, handleSubmit } = useLoginForm(onSuccess);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Error message display with compact height */}
        <div className="min-h-[40px]">
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
