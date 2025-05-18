
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Define the schema for login form
export const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({ form }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  // Colors and icons
  const iconColor = "text-gray-800 dark:text-gray-200"; 
  const eyeIconColor = "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100";

  return (
    <>
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
                  type="email"
                  className="pl-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full" 
                  {...field}
                  // Only trigger validation on blur
                  onBlur={field.onBlur}
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
                  // Only trigger validation on blur
                  onBlur={field.onBlur}
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
    </>
  );
};

export default LoginFormFields;
