
import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { ExtendedToastProps, ToastProps, ToastActionElement } from "@/types/toast"

type ToasterToastProps = ExtendedToastProps & {
  id: string
  open: boolean
  promise: boolean
}

// Create the context
const ToastContext = React.createContext<{
  toasts: ToasterToastProps[];
  addToast: (props: ExtendedToastProps) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, data: Partial<ExtendedToastProps>) => void;
} | null>(null);

export function Toaster() {
  const [toasts, setToasts] = useState<ToasterToastProps[]>([])

  // Custom toast handler implementation
  const addToast = React.useCallback((data: ExtendedToastProps) => {
    const id = data.id || uuidv4()
    console.log("Toast: Adicionando novo toast com ID:", id);
    
    setToasts((prevToasts) => {
      return [
        ...prevToasts,
        { 
          ...data,
          id, 
          open: true,
          promise: false,
        }
      ]
    })
    
    return id;
  }, [])

  const removeToast = React.useCallback((id: string) => {
    console.log("Toast: Removendo toast com ID:", id);
    setToasts((prevToasts) => 
      prevToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  const updateToast = React.useCallback((id: string, data: Partial<ExtendedToastProps>) => {
    console.log("Toast: Atualizando toast com ID:", id);
    setToasts((prevToasts) => 
      prevToasts.map((toast) => 
        toast.id === id ? { ...toast, ...data } : toast
      )
    )
  }, [])

  // Provide the toast context
  const contextValue = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    updateToast,
  }), [toasts, addToast, removeToast, updateToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {toasts.map(function ({ id, title, description, action, icon, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {icon && <span className="inline-flex mr-2">{icon}</span>}
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastContext.Provider>
  )
}

// Provide the context through this hook
export function useToast() {
  const context = React.useContext(ToastContext);
  
  // Fallback if used outside provider
  if (!context) {
    console.warn("useToast: O hook está sendo usado fora do ToastProvider");
    return {
      toasts: [],
      addToast: (props: ExtendedToastProps) => {
        const id = props.id || uuidv4();
        console.log(`Toast criado (fallback): ${id}`, props);
        return id;
      },
      removeToast: (id: string) => {
        console.log(`Toast removido (fallback): ${id}`);
      },
      updateToast: (id: string, props: Partial<ExtendedToastProps>) => {
        console.log(`Toast atualizado (fallback): ${id}`, props);
      },
    };
  }
  
  return context;
}

// Helper function for creating toasts
export const toast = (props: ExtendedToastProps) => {
  // Em um módulo, não podemos chamar hooks diretamente
  // Esta função deve ser usada dentro de componentes
  console.log("toast(): Esta função é apenas um proxy e deve ser usada dentro de componentes");
  console.log("toast(): Dados recebidos:", props);
  
  // Esta implementação será substituída quando usada dentro de componentes
  return props.id || uuidv4();
};

export {
  type ToastProps,
  type ExtendedToastProps,
  type ToastActionElement,
  ToastContext
}
