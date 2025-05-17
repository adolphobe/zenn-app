
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onCancel: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onCancel }) => {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await signup(values.email, values.password, values.name);
      
      if (success) {
        setSignupSuccess("Conta criada com sucesso! Você já pode fazer login.");
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Colors and icons
  const iconColor = "text-gray-800 dark:text-gray-200"; 
  const eyeIconColor = "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {signupSuccess && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 py-2 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle size={16} />
              <AlertDescription className="text-sm font-medium">
                {signupSuccess}
              </AlertDescription>
            </div>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
              <div className="relative flex items-center"> 
                <User 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100 z-20`}
                  size={18}
                />
                <FormControl>
                  <Input
                    placeholder="Nome completo"
                    className="pl-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full" 
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />
        
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
                    placeholder="E-mail"
                    className="pl-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full" 
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />

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
                    placeholder="Senha"
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

        <div className="flex flex-col space-y-3">
          <Button 
            type="submit" 
            className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={isLoading || !!signupSuccess}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
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
      </form>
    </Form>
  );
};

export default SignupForm;
