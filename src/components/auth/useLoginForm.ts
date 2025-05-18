
import { useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/auth';
import { z } from "zod";

// Define esquema para validação de formulário
export const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm(onSuccess?: () => void) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Função para limpar erros
  const clearErrors = useCallback(() => {
    if (loginError) {
      setLoginError(null);
    }
  }, [loginError]);

  // Configurar limpeza de erros ao digitar
  const setupErrorClearing = useCallback(() => {
    const subscription = form.watch(() => clearErrors());
    return () => subscription.unsubscribe();
  }, [form, clearErrors]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (values: LoginFormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const result = await login(values.email, values.password);
      
      if (!result.success) {
        console.log("[LoginForm] Erro de login:", result.error);
        setLoginError(result.error);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("[LoginForm] Erro inesperado:", error);
      setLoginError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manipulador de envio do formulário
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(handleSubmit)(e);
  };

  return {
    form,
    isLoading,
    loginError,
    onSubmit,
    setupErrorClearing
  };
}
