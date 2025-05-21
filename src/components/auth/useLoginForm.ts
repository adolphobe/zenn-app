
import { useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/auth';
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Define esquema para validação de formulário
export const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm(onSuccess?: () => void) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched", // Changed from "onChange" to "onTouched" to validate on blur
  });

  // Mapeamento de erros para códigos de erro
  const getErrorCode = (errorMessage: string): string => {
    if (errorMessage.includes('não encontrado') || errorMessage.includes('senha incorreta')) {
      return '1';
    }
    if (errorMessage.includes('confirme seu e-mail')) {
      return '2';
    }
    if (errorMessage.includes('Muitas tentativas') || errorMessage.includes('rate limit')) {
      return '4';
    }
    return '3'; // Erro genérico
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (values: LoginFormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(values.email, values.password);
      
      if (!result.success) {
        console.log("[LoginForm] Erro de login:", result.error);
        
        // Redirecionar para a página de login com o código de erro
        const errorCode = result.error ? getErrorCode(result.error) : '3';
        navigate(`/login?erro=${errorCode}`, { replace: true });
      } else {
        // Set login_success flag to indicate that we should show the loading overlay
        localStorage.setItem('login_success', 'true');
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("[LoginForm] Erro inesperado:", error);
      // Redirecionar para a página de login com código de erro genérico
      navigate('/login?erro=3', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manipulador de envio do formulário que evita o comportamento padrão
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(handleSubmit)(e);
  }, [form, handleSubmit]);

  return {
    form,
    isLoading,
    onSubmit
  };
}
