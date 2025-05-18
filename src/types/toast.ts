
import { ToastProps as ShadcnToastProps } from "@/components/ui/use-toast";
import { ReactNode } from 'react';

// Estender o tipo ToastProps para incluir ícones
export interface ExtendedToastProps extends ShadcnToastProps {
  icon?: ReactNode;
}

// Re-exportar para compatibilidade
export type ToastActionElement = React.ReactElement;
