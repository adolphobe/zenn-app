
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
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

const resetPasswordSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface PasswordResetFormProps {
  email: string | null;
  onSuccess: () => void;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ email, onSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setResetError(null);
    
    try {
      console.log("[ResetPassword] Tentando atualizar senha");
      console.log("[ResetPassword] DETALHES EM PORTUGUÊS: Processando solicitação de alteração de senha");
      
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });
      
      if (error) {
        console.error("[ResetPassword] Erro ao redefinir senha:", error);
        console.error("[ResetPassword] DETALHES EM PORTUGUÊS: Não foi possível atualizar a senha do usuário");
        
        const errorDetails = processAuthError(error);
        setResetError(errorDetails.message);
      } else {
        console.log("[ResetPassword] Senha redefinida com sucesso");
        console.log("[ResetPassword] DETALHES EM PORTUGUÊS: A senha foi atualizada com sucesso");
        
        setResetSuccess("Sua senha foi redefinida com sucesso!");
        form.reset();
        
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi alterada com sucesso. Você pode fazer login com sua nova senha.",
        });
        
        // Notify parent component about success
        onSuccess();
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
          navigate('/login', { state: { passwordReset: true } });
        }, 3000);
      }
    } catch (error) {
      console.error("[ResetPassword] Erro inesperado:", error);
      console.error("[ResetPassword] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao processar a alteração de senha");
      
      setResetError("Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  // Colors and icons
  const iconColor = "text-gray-800 dark:text-gray-200"; 
  const eyeIconColor = "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100";

  return (
    <>
      {resetError && (
        <Alert variant="destructive" className="py-2 mb-6 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <AlertDescription className="text-sm font-medium">
              {resetError}
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      {resetSuccess && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 py-2 mb-6 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle size={16} />
            <AlertDescription className="text-sm font-medium">
              {resetSuccess}
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
                <div className="relative flex items-center"> 
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100 z-20`}
                    size={18}
                  />
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nova senha"
                      className="pl-10 pr-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${eyeIconColor} opacity-100 focus:outline-none z-20`}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
                <div className="relative flex items-center"> 
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100 z-20`}
                    size={18}
                  />
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      className="pl-10 pr-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${eyeIconColor} opacity-100 focus:outline-none z-20`}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Redefinindo..." : "Redefinir senha"}
          </Button>
        </form>
      </Form>
    </>
  );
};
