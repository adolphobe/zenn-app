
import * as React from "react"
import { useState, useEffect } from "react"
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

import {
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/use-toast"

type ToasterToastProps = ToastProps & {
  id: string
  open: boolean
  promise: boolean
}

// Create the context
const ToastContext = React.createContext<{
  toasts: ToasterToastProps[];
  addToast: (props: ToastProps) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, data: Partial<ToastProps>) => void;
} | null>(null);

export function Toaster() {
  const [toasts, setToasts] = useState<ToasterToastProps[]>([])

  // Custom toast handler implementation
  const addToast = React.useCallback((data: ToastProps) => {
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

  const updateToast = React.useCallback((id: string, data: Partial<ToastProps>) => {
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
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
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
    </ToastProvider>
  )
}

// Provide the context through this hook
export function useToast() {
  const context = React.useContext(ToastContext);
  
  // Fallback if used outside provider
  if (!context) {
    return {
      toasts: [],
      addToast: (props: ToastProps) => {
        const id = props.id || uuidv4();
        console.log(`Toast created: ${id}`, props);
      },
      removeToast: (id: string) => {},
      updateToast: (id: string, props: Partial<ToastProps>) => {},
    };
  }
  
  return context;
}

// Helper function for creating toasts
export const toast = (props: ToastProps) => {
  // We have to create a dummy implementation for the toast function
  // that can be imported directly. In actual usage, components should
  // use the useToast hook instead
  console.log('Toast created via toast function:', props);
};

export {
  type ToastProps,
  type ToastActionElement,
}
