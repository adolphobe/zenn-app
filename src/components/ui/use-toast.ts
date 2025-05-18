
import * as React from "react"
import { ToastContext } from "@/hooks/use-toast-context"
import { v4 as uuidv4 } from "uuid"
import { ExtendedToastProps, ToastActionElement } from "@/types/toast"

function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    const toasts: any[] = [];
    
    const addToast = (toast: ExtendedToastProps) => {
      // This is just a stub to prevent errors when useToast is imported directly
      console.log('Toast created in stub:', toast);
    };
    
    const removeToast = (id: string) => {
      // This is just a stub
    };
    
    const updateToast = (id: string, toast: Partial<ExtendedToastProps>) => {
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

function toast(props: ExtendedToastProps) {
  const { addToast } = useToast();
  // Ensure there is an ID by generating one if not provided
  addToast({
    ...props,
    id: props.id || uuidv4()
  });
}

export {
  type ExtendedToastProps as ToastProps,
  type ToastActionElement,
  useToast,
  toast,
}
