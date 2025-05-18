
import { ToastActionElement as ShadcnToastActionElement } from "@/components/ui/toast";
import { ReactNode } from 'react';

// Interface base para todos os toasts
export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: ReactNode;
}

// Estender o tipo ToastProps para incluir ícones
export interface ExtendedToastProps extends ToastProps {
  // A interface já herda todos os campos de ToastProps
  // incluindo id, title e outros campos necessários
}

// Re-exportar para compatibilidade
export type ToastActionElement = ShadcnToastActionElement;
