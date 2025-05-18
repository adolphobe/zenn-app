
import React, { useState } from 'react';
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { useLoginForm } from './auth/useLoginForm';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onSwitchToSignup, 
  onForgotPassword 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    form, 
    isLoading, 
    onSubmit
  } = useLoginForm(onSuccess);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                    size={18}
                  />
                  <FormControl>
                    <Input
                      placeholder="E-mail"
                      className="pl-10 h-12 bg-white border-blue-100 focus:border-blue-300 shadow-sm"
                      autoComplete="email"
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
              <FormItem>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                    size={18}
                  />
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      className="pl-10 pr-10 h-12 bg-white border-blue-100 focus:border-blue-300 shadow-sm"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
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

          <div className="flex justify-end">
            <button 
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-500 hover:underline hover:text-blue-600 focus:outline-none"
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Não tem uma conta? </span>
            <button 
              type="button" 
              onClick={onSwitchToSignup}
              className="text-blue-500 hover:underline hover:text-blue-600">
              Criar conta
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
