
import { useState, useEffect, useCallback } from 'react';
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
  const [formSubmissionAttempted, setFormSubmissionAttempted] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Valida ao digitar para feedback imediato
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

  // Clear errors when user starts typing again, but only after first submission attempt
  useEffect(() => {
    if (!formSubmissionAttempted) return;
    
    const subscription = form.watch(() => {
      if (loginError) {
        console.log("[LoginForm] Usuário está digitando, limpando erros anteriores");
        setLoginError(null);
        setLoginSuggestion(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, loginError, formSubmissionAttempted]);

  // Debug logs para monitorar o estado do erro
  useEffect(() => {
    console.log("[LoginForm] Estado atual do erro:", loginError);
    console.log("[LoginForm] Estado atual da sugestão:", loginSuggestion);
    console.log("[LoginForm] Estado atual de carregamento:", isLoading);
  }, [loginError, loginSuggestion, isLoading]);

  // Memoized login function to prevent unnecessary re-renders
  const handleLogin = useCallback(async (values: LoginFormValues) => {
    // Prevent login while already loading
    if (isLoading) {
      console.log("[LoginForm] Já existe um login em andamento, ignorando tentativa");
      return;
    }
    
    console.log("[LoginForm] Iniciando processo de login");
    setIsLoading(true);
    setLoginError(null);
    setLoginSuggestion(null);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        console.error("[LoginForm] Erro detectado:", error);
        
        if (error) {
          const errorDetails = processAuthError(error);
          console.log("[LoginForm] Erro processado:", errorDetails.message);
          setLoginError(errorDetails.message);
          setLoginSuggestion(errorDetails.suggestion || null);
          
          // Log para confirmar que o estado foi atualizado
          console.log("[LoginForm] Estado de erro atualizado para:", errorDetails.message);
        } else {
          setLoginError("Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.");
          console.log("[LoginForm] Estado de erro definido para mensagem padrão (credenciais inválidas)");
        }
      } else {
        console.log("[LoginForm] Login bem-sucedido para:", values.email);
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("[LoginForm] Erro de login não tratado:", error);
      
      const errorDetails = processAuthError(error);
      setLoginError(errorDetails.message);
      setLoginSuggestion(errorDetails.suggestion || null);
      
      console.log("[LoginForm] Estado de erro atualizado após exceção:", errorDetails.message);
    } finally {
      setIsLoading(false);
      console.log("[LoginForm] Processo de login finalizado, isLoading =", false);
    }
  }, [isLoading, login, onSuccess]);
  
  // Submission handler that properly prevents default form behavior
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    // Critical: prevent form from refreshing page
    e.preventDefault();
    console.log("[LoginForm] Formulário submetido, prevenindo comportamento padrão");
    
    // Mark that a submission was attempted
    setFormSubmissionAttempted(true);
    
    // Validate form and handle submission
    form.trigger().then(valid => {
      console.log("[LoginForm] Validação do formulário:", valid ? "válido" : "inválido");
      
      if (valid) {
        const values = form.getValues();
        handleLogin(values);
      } else {
        console.log("[LoginForm] Formulário inválido, não prosseguindo com login");
      }
    });
  }, [form, handleLogin]);

  return {
    form,
    isLoading,
    loginError,
    loginSuggestion,
    onSubmit
  };
}
