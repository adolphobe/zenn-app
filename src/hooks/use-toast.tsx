
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

import { ExtendedToastProps, ToastActionElement } from "@/types/toast"

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
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => 
      prevToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  const updateToast = React.useCallback((id: string, data: Partial<ExtendedToastProps>) => {
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
    return {
      toasts: [],
      addToast: (props: ExtendedToastProps) => {
        const id = props.id || uuidv4();
        console.log(`Toast created: ${id}`, props);
      },
      removeToast: (id: string) => {},
      updateToast: (id: string, props: Partial<ExtendedToastProps>) => {},
    };
  }
  
  return context;
}

// Helper function for creating toasts
export const toast = (props: ExtendedToastProps) => {
  // We have to create a dummy implementation for the toast function
  // that can be imported directly. In actual usage, components should
  // use the useToast hook instead
  console.log('Toast created via toast function:', props);
};

export {
  type ExtendedToastProps as ToastProps,
  type ToastActionElement,
}
