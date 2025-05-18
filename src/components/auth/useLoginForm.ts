
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { processAuthError } from '@/utils/authErrorUtils';
import { loginSchema, LoginFormValues } from './LoginFormFields';

export function useLoginForm(onSuccess?: () => void) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuggestion, setLoginSuggestion] = useState<string | null>(null);

  // Configuração do formulário com React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validação ao digitar
  });

  // Função para limpar erros quando o usuário começa a digitar novamente
  const clearErrors = () => {
    if (loginError) {
      setLoginError(null);
      setLoginSuggestion(null);
    }
  };

  // Criar uma função de observação única para limpar erros ao digitar
  const setupErrorClearing = () => {
    const subscription = form.watch(() => clearErrors());
    return subscription.unsubscribe;
  };

  // Memoized login function to prevent unnecessary re-renders
  const handleLogin = async (values: LoginFormValues) => {
    // Prevenção de múltiplas tentativas
    if (isLoading) return;
    
    console.log("[LoginForm] Iniciando processo de login");
    setIsLoading(true);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        
        if (error) {
          const errorDetails = processAuthError(error);
          console.log("[LoginForm] Erro processado:", errorDetails.message);
          
          // Definir erro e sugestão de forma definitiva
          setLoginError(errorDetails.message);
          setLoginSuggestion(errorDetails.suggestion || null);
        } else {
          setLoginError("Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.");
        }
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("[LoginForm] Erro de login não tratado:", error);
      
      const errorDetails = processAuthError(error);
      // Definir erro e sugestão
      setLoginError(errorDetails.message);
      setLoginSuggestion(errorDetails.suggestion || null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submission handler with proper error handling
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Crucial: prevenir o comportamento padrão
    console.log("[LoginForm] Formulário submetido, prevenindo comportamento padrão");
    
    form.handleSubmit(async (values) => {
      await handleLogin(values);
    })(e);
  };

  return {
    form,
    isLoading,
    loginError,
    loginSuggestion,
    onSubmit,
    setupErrorClearing
  };
}
