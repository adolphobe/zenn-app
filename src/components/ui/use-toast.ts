
import * as React from "react"
import { ToastContext } from "@/hooks/use-toast-context"
import { v4 as uuidv4 } from "uuid"

type ToastProps = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

type ToastActionElement = React.ReactElement

function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    const toasts: any[] = [];
    
    const addToast = (toast: ToastProps) => {
      // This is just a stub to prevent errors when useToast is imported directly
      console.log('Toast created in stub:', toast);
    };
    
    const removeToast = (id: string) => {
      // This is just a stub
    };
    
    const updateToast = (id: string, toast: Partial<ToastProps>) => {
      // This is just a stub
    };
    
    return {
      toasts,
      addToast,
      removeToast,
      updateToast,
    };
  }

  return context;
}

function toast(props: ToastProps) {
  const { addToast } = useToast();
  // Ensure there is an ID by generating one if not provided
  addToast({
    ...props,
    id: props.id || uuidv4()
  });
}

export {
  type ToastProps,
  type ToastActionElement,
  useToast,
  toast,
}
