
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { type ToastProps } from "@/components/ui/use-toast";

// Define toast with additional properties needed for the UI
export type ToasterToast = ToastProps & {
  id: string;
  open: boolean;
  promise: boolean;
};

// Define the context type
type ToastContextType = {
  toasts: ToasterToast[];
  addToast: (toast: ToastProps) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<ToastProps>) => void;
};

// Create the context
export const ToastContext = React.createContext<ToastContextType | null>(null);

// Provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const addToast = React.useCallback((data: ToastProps) => {
    const id = data.id || uuidv4();
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { 
        ...data, 
        id, 
        open: true,
        promise: false,
      },
    ]);
    
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => 
      prevToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const updateToast = React.useCallback((id: string, data: Partial<ToastProps>) => {
    setToasts((prevToasts) => 
      prevToasts.map((toast) => 
        toast.id === id ? { ...toast, ...data } : toast
      )
    );
  }, []);

  const value = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    updateToast,
  }), [toasts, addToast, removeToast, updateToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
