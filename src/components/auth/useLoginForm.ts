
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

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    setLoginSuggestion(null);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      console.log("[LoginForm] DETALHES EM PORTUGUÊS: Iniciando processo de autenticação para o usuário");
      
      // Uso do método login com credenciais do formulário
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        console.error("[LoginForm] DETALHES EM PORTUGUÊS: O login falhou. Verifique se o email e senha estão corretos e se a conta existe.");
        
        if (error) {
          const errorDetails = processAuthError(error);
          setLoginError(errorDetails.message);
          setLoginSuggestion(errorDetails.suggestion || null);
          
          console.log("[LoginForm] Erro definido:", errorDetails.message);
          console.log("[LoginForm] Sugestão:", errorDetails.suggestion);
        } else {
          setLoginError("Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.");
        }
      } else {
        console.log("[LoginForm] Login bem-sucedido para:", values.email);
        console.log("[LoginForm] DETALHES EM PORTUGUÊS: Login realizado com sucesso, redirecionando automaticamente");
        
        // Não mostramos toast de sucesso aqui pois já temos no loginService.ts
        
        if (onSuccess) {
          console.log("[LoginForm] Executando callback de sucesso");
          onSuccess();
        }
      }
    } catch (error) {
      console.error("[LoginForm] Erro de login:", error);
      console.error("[LoginForm] DETALHES EM PORTUGUÊS: Ocorreu um erro técnico durante o processo de login. Verifique a conexão com o servidor.");
      
      const errorDetails = processAuthError(error);
      setLoginError(errorDetails.message);
      setLoginSuggestion(errorDetails.suggestion || null);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug the error state to see if it's being set correctly
  console.log("[LoginForm] Estado atual do erro:", loginError);
  console.log("[LoginForm] Estado atual da sugestão:", loginSuggestion);

  return {
    form,
    isLoading,
    loginError,
    loginSuggestion,
    onSubmit: form.handleSubmit((values) => {
      // Essa wrapper function previne o comportamento padrão
      onSubmit(values);
    })
  };
}
