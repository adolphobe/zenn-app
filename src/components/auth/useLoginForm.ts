
import { useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { loginSchema, LoginFormValues } from './LoginFormFields';

export function useLoginForm(onSuccess?: () => void) {
  const { login } = useAuth();
  const navigate = useNavigate();
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
  const clearErrors = useCallback(() => {
    if (loginError) {
      console.log("[LoginForm] Limpando erros anteriores porque usuário está digitando");
      setLoginError(null);
      setLoginSuggestion(null);
    }
  }, [loginError]);

  // Criar uma função de observação única para limpar erros ao digitar
  const setupErrorClearing = useCallback(() => {
    console.log("[LoginForm] Configurando limpeza de erros ao digitar");
    const subscription = form.watch(() => clearErrors());
    return () => subscription.unsubscribe();
  }, [form, clearErrors]);

  // Função de login com tratamento robusto de erros
  const handleLogin = useCallback(async (values: LoginFormValues) => {
    // Prevenção de múltiplas tentativas
    if (isLoading) return;
    
    console.log("[LoginForm] Iniciando processo de login");
    setIsLoading(true);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        
        // Definir erro de forma direta e garantida
        const errorMessage = "Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.";
        const suggestionMessage = "Verifique se digitou corretamente o email e a senha. Se esqueceu sua senha, você pode redefini-la.";
        
        console.log("[LoginForm] Definindo mensagem de erro:", errorMessage);
        setLoginError(errorMessage);
        setLoginSuggestion(suggestionMessage);
        
        // Log para confirmar que o erro foi definido
        console.log("[LoginForm] Estado de erro após definição:", errorMessage);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("[LoginForm] Erro inesperado de login:", error);
      
      // Mensagem de erro genérica para qualquer falha inesperada
      setLoginError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
      setLoginSuggestion("Se o problema persistir, entre em contato com o suporte.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, login, onSuccess]);
  
  // Gerenciador de submissão com prevenção de refresh
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    // CRUCIAL: prevenir o comportamento padrão ANTES de qualquer outra operação
    e.preventDefault();
    console.log("[LoginForm] Formulário submetido, prevenindo comportamento padrão");
    
    // Usar handleSubmit do React Hook Form com nosso manipulador personalizado
    form.handleSubmit(async (values) => {
      await handleLogin(values);
    })(e);
  }, [form, handleLogin]);

  return {
    form,
    isLoading,
    loginError,
    loginSuggestion,
    onSubmit,
    setupErrorClearing
  };
}
