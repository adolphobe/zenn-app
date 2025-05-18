
import React, { createContext, useContext } from 'react';
import { Task } from '@/types';
import { toast } from '@/hooks/use-toast';

// Context for task toasts
interface TaskToastContextType {
  showToggleHiddenToast: (task: Task) => void;
  showCompleteTaskToast: (task: Task) => void;
  showDeleteTaskToast: (task: Task) => void;
}

const TaskToastContext = createContext<TaskToastContextType | undefined>(undefined);

// Provider component
export const TaskToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showToggleHiddenToast = (task: Task) => {
    toast({
      title: task.hidden ? "Tarefa ocultada" : "Tarefa visível",
      description: task.hidden 
        ? "A tarefa foi ocultada e só será visível com o filtro ativado."
        : "A tarefa agora está visível.",
    });
  };

  const showCompleteTaskToast = (task: Task) => {
    toast({
      title: "Tarefa completa",
      description: `A tarefa "${task.title}" foi marcada como concluída.`,
    });
  };

  const showDeleteTaskToast = (task: Task) => {
    toast({
      title: "Tarefa excluída",
      description: `A tarefa "${task.title}" foi excluída.`,
      variant: "destructive",
    });
  };

  const value = {
    showToggleHiddenToast,
    showCompleteTaskToast,
    showDeleteTaskToast
  };

  return (
    <TaskToastContext.Provider value={value}>
      {children}
    </TaskToastContext.Provider>
  );
};

// Custom hook for using task toasts
export const useTaskToasts = () => {
  const context = useContext(TaskToastContext);
  if (context === undefined) {
    throw new Error("useTaskToasts must be used within a TaskToastProvider");
  }
  return context;
};
