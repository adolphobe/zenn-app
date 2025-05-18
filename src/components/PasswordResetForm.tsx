
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { processAuthError } from '@/utils/authErrorUtils';

// Production URL for password reset
const RESET_PASSWORD_URL = "https://zenn-app.lovable.app/reset-password";

const resetSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface PasswordResetFormProps {
  onCancel: () => void;
  onResetSent?: (email: string) => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onCancel, onResetSent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    setResetError(null);
    setResetSuccess(null);
    
    try {
      console.log("[PasswordReset] Solicitando redefinição de senha para:", values.email);
      console.log("[PasswordReset] DETALHES EM PORTUGUÊS: Iniciando processo de redefinição de senha");
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: RESET_PASSWORD_URL,
      });
      
      if (error) {
        console.error("[PasswordReset] Erro ao solicitar redefinição:", error);
        console.error("[PasswordReset] DETALHES EM PORTUGUÊS: Ocorreu um erro ao processar a solicitação de redefinição de senha");
        
        const errorDetails = processAuthError(error);
        setResetError(errorDetails.message);
      } else {
        console.log("[PasswordReset] Email de redefinição enviado para:", values.email);
        console.log("[PasswordReset] DETALHES EM PORTUGUÊS: Email de redefinição enviado com sucesso");
        
        setResetSuccess(`Um email de redefinição de senha foi enviado para ${values.email}`);
        
        toast({
          title: "Email enviado",
          description: `Verifique sua caixa de entrada em ${values.email}`,
        });
        
        if (onResetSent) {
          onResetSent(values.email);
        }
      }
    } catch (error) {
      console.error("[PasswordReset] Erro inesperado:", error);
      console.error("[PasswordReset] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado durante o processo de redefinição");
      
      setResetError("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Colors and icon
  const iconColor = "text-gray-800 dark:text-gray-200"; 

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-left mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Esqueceu sua senha?
          </h2>
          <p className="text-muted-foreground text-sm">
            Digite seu email abaixo e nós enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {resetError && (
          <Alert variant="destructive" className="py-2 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <AlertDescription className="text-sm font-medium">
                {resetError}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {resetSuccess && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 py-2 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle size={16} />
              <AlertDescription className="text-sm font-medium">
                {resetSuccess}
              </AlertDescription>
            </div>
          </Alert>
        )}
      
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
              <div className="relative flex items-center"> 
                <Mail 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100 z-20`}
                  size={18}
                />
                <FormControl>
                  <Input
                    placeholder="Seu email cadastrado"
                    className="pl-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full" 
                    {...field}
                    disabled={isLoading || !!resetSuccess}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-3">
          <Button 
            type="submit" 
            className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={isLoading || !!resetSuccess}
          >
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full h-12 text-base transition-all duration-300"
            onClick={onCancel}
            disabled={isLoading}
          >
            Voltar para login
          </Button>
        </div>

        {resetSuccess && (
          <p className="text-sm text-center text-muted-foreground mt-4">
            Não recebeu o email? Verifique sua pasta de spam ou tente novamente em alguns minutos.
          </p>
        )}
      </form>
    </Form>
  );
};

export default PasswordResetForm;
