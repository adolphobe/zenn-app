
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
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  // Garantir que os erros permaneçam visíveis após o submit e não sejam limpos acidentalmente
  useEffect(() => {
    if (formSubmitted && loginError) {
      console.log("[LoginForm] Mantendo erro visível após submit:", loginError);
      
      // Desativar flag de submit após processar
      const timer = setTimeout(() => {
        setFormSubmitted(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [formSubmitted, loginError]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevenir o comportamento padrão de refresh da página
    event.preventDefault();
    
    // Disparar a validação e obter valores do formulário
    const result = await form.trigger();
    if (!result) {
      console.log("[LoginForm] Formulário inválido, parando submit");
      return; // Não continuar se validação falhar
    }

    const values = form.getValues();
    setFormSubmitted(true);
    
    console.log("[LoginForm] Formulário válido, processando submit");
    console.log("[LoginForm] Form foi submetido:", true);
    
    // 1. Limpar erros anteriores somente se não estamos resubmetendo com erro existente
    if (!loginError) {
      setLoginError(null);
      setLoginSuggestion(null);
    }
    
    // 2. Definir loading
    setIsLoading(true);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      console.log("[LoginForm] DETALHES EM PORTUGUÊS: Iniciando processo de autenticação para o usuário");
      
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        console.error("[LoginForm] DETALHES EM PORTUGUÊS: O login falhou. Verifique se o email e senha estão corretos e se a conta existe.");
        
        if (error) {
          const errorDetails = processAuthError(error);
          
          // 3. Definir erros explicitamente e garantir que seja executado antes de desativar loading
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
        
        // Limpar qualquer erro anterior em caso de sucesso
        setLoginError(null);
        setLoginSuggestion(null);
        
        toast({
          title: "Login realizado com sucesso",
          description: "Você foi autenticado com sucesso",
        });
        
        if (onSuccess) {
          console.log("[LoginForm] Executando callback de sucesso");
          onSuccess();
        }
      }
    } catch (error) {
      console.error("[LoginForm] Erro de login:", error);
      console.error("[LoginForm] DETALHES EM PORTUGUÊS: Ocorreu um erro técnico durante o processo de login. Verifique a conexão com o servidor.");
      
      const errorDetails = processAuthError(error);
      // Definir erros explicitamente
      setLoginError(errorDetails.message);
      setLoginSuggestion(errorDetails.suggestion || null);
    } finally {
      // 4. Desativar loading após todos os outros estados serem atualizados
      setIsLoading(false);
    }
  };

  // Adicionar logs para verificar se os estados estão corretos
  console.log("[LoginForm] Estado atual do erro:", loginError);
  console.log("[LoginForm] Estado atual da sugestão:", loginSuggestion);
  console.log("[LoginForm] Form foi submetido:", formSubmitted);

  return {
    form,
    isLoading,
    loginError,
    loginSuggestion,
    onSubmit
  };
}
