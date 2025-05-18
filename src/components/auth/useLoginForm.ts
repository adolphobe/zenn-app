
import { useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/auth';
import { loginSchema, LoginFormValues } from './LoginFormFields';

export function useLoginForm(onSuccess?: () => void) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuggestion, setLoginSuggestion] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Função para limpar erros quando o usuário começa a digitar novamente
  const clearErrors = useCallback(() => {
    if (loginError) {
      console.log("[LoginForm] Limpando erros anteriores porque usuário está digitando");
      setLoginError(null);
      setLoginSuggestion(null);
    }
  }, [loginError]);

  // Configurar observador para limpar erros ao digitar
  const setupErrorClearing = useCallback(() => {
    console.log("[LoginForm] Configurando limpeza de erros ao digitar");
    const subscription = form.watch(() => clearErrors());
    return () => subscription.unsubscribe();
  }, [form, clearErrors]);

  // Função de login com tratamento robusto de erros
  const handleSubmit = useCallback(async (values: LoginFormValues) => {
    // Prevenção de múltiplas tentativas
    if (isLoading) return;
    
    console.log("[LoginForm] Iniciando processo de login");
    setIsLoading(true);
    setLoginError(null);
    setLoginSuggestion(null);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        
        // Definir erro diretamente
        const errorMessage = "Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.";
        const suggestionMessage = "Verifique se digitou corretamente o email e a senha. Se esqueceu sua senha, você pode redefini-la.";
        
        console.log("[LoginForm] Definindo mensagem de erro:", errorMessage);
        setLoginError(errorMessage);
        setLoginSuggestion(suggestionMessage);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("[LoginForm] Erro inesperado de login:", error);
      setLoginError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
      setLoginSuggestion("Se o problema persistir, entre em contato com o suporte.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, login, onSuccess]);
  
  // Manipulador de formulário que previne o comportamento padrão
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[LoginForm] Formulário submetido, prevenindo comportamento padrão");
    
    form.handleSubmit(handleSubmit)(e);
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
