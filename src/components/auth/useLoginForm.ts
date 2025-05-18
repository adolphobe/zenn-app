
import { useState, useEffect } from 'react';
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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

  // Clear errors when user starts typing again
  useEffect(() => {
    const subscription = form.watch(() => {
      if (loginError) {
        setLoginError(null);
        setLoginSuggestion(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, loginError]);

  // Main login function - completely synchronous with manual form handling
  const handleLogin = async (values: LoginFormValues) => {
    // Prevent login while already loading
    if (isLoading) return;
    
    setIsLoading(true);
    setLoginError(null);
    setLoginSuggestion(null);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        
        if (error) {
          const errorDetails = processAuthError(error);
          setLoginError(errorDetails.message);
          setLoginSuggestion(errorDetails.suggestion || null);
        } else {
          setLoginError("Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.");
        }
      } else {
        console.log("[LoginForm] Login bem-sucedido para:", values.email);
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("[LoginForm] Erro de login:", error);
      
      const errorDetails = processAuthError(error);
      setLoginError(errorDetails.message);
      setLoginSuggestion(errorDetails.suggestion || null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manual form submission handler to ensure synchronous processing
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Critical: prevent form from refreshing page
    
    const isValid = form.trigger();
    isValid.then(valid => {
      if (valid) {
        const values = form.getValues();
        handleLogin(values);
      }
    });
  };

  // Debug logs
  console.log("[LoginForm] Estado atual do erro:", loginError);
  console.log("[LoginForm] Estado atual da sugestão:", loginSuggestion);

  return {
    form,
    isLoading,
    loginError,
    loginSuggestion,
    onSubmit
  };
}
