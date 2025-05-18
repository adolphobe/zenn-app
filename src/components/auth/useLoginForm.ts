
import { useState, useCallback, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';
import { loginSchema, LoginFormValues } from './LoginFormFields';

export function useLoginForm(onSuccess?: () => void) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuggestion, setLoginSuggestion] = useState<string | null>(null);

  // Setup form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange" // Validate on change for better UX
  });

  // Check if user just reset their password
  useEffect(() => {
    if (location.state?.passwordReset) {
      toast({
        title: "Senha redefinida com sucesso",
        description: "Você pode fazer login com sua nova senha agora.",
      });
    }
  }, [location.state]);

  // Handle form submission with background authentication
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission
    e.preventDefault();
    
    // Validate the form
    const isValid = await form.trigger();
    if (!isValid) {
      return; // Stop if form validation fails
    }

    // Clear previous errors
    setLoginError(null);
    setLoginSuggestion(null);
    
    // Get the form values
    const values = form.getValues();
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Attempt login
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        // Handle login failure
        if (error) {
          const errorDetails = processAuthError(error);
          setLoginError(errorDetails.message);
          setLoginSuggestion(errorDetails.suggestion || null);
        } else {
          setLoginError("Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.");
        }
      } else {
        // Handle login success
        toast({
          title: "Login realizado com sucesso",
          description: "Você foi autenticado com sucesso",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      // Handle unexpected errors
      const errorDetails = processAuthError(error);
      setLoginError(errorDetails.message);
      setLoginSuggestion(errorDetails.suggestion || null);
    } finally {
      setIsLoading(false);
    }
  }, [form, login, onSuccess]);

  return {
    form,
    isLoading,
    loginError,
    loginSuggestion,
    handleSubmit
  };
}
