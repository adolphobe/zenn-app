
import * as React from "react"
import { ToastContext } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"
import { ExtendedToastProps, ToastProps, ToastActionElement } from "@/types/toast"

function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    const toasts: any[] = [];
    
    const addToast = (toast: ExtendedToastProps) => {
      console.log('Toast created in stub:', toast);
      return toast.id || uuidv4();
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
  addToast({
    ...props,
    id: props.id || uuidv4()
  });
  return props.id || uuidv4();
}

export {
  type ToastProps,
  type ExtendedToastProps,
  type ToastActionElement,
  useToast,
  toast,
}
