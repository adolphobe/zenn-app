
import React, { createContext, useContext, useCallback } from 'react';
import { Task } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useTaskDataContext } from '@/context/TaskDataProvider';

// Contexto para os toasts
const TaskToastContext = createContext<{
  showToggleHiddenToast: (task: Task) => void;
} | null>(null);

export const TaskToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toggleTaskHidden } = useTaskDataContext();
  
  const showToggleHiddenToast = useCallback((task: Task) => {
    // Se estamos prestes a ocultar uma tarefa (atualmente visível)
    if (!task.hidden) {
      // Notificar o usuário que a tarefa irá desaparecer
      toast({
        title: "A tarefa será ocultada",
        description: "Esta tarefa desaparecerá da lista. Para vê-la novamente, ative a opção 'Mostrar tarefas ocultas' no menu lateral.",
      });
      
      // Aplicar uma pequena pausa para permitir que o usuário veja o toast antes da animação
      setTimeout(() => {
        toggleTaskHidden(task.id);
      }, 300);
      return;
    }
    
    // Em todos os outros casos, alternar imediatamente
    toggleTaskHidden(task.id);
  }, [toggleTaskHidden]);

  return (
    <TaskToastContext.Provider value={{ showToggleHiddenToast }}>
      {children}
    </TaskToastContext.Provider>
  );
};

export const useTaskToasts = () => {
  const context = useContext(TaskToastContext);
  if (!context) {
    throw new Error('useTaskToasts must be used within a TaskToastProvider');
  }
  return context;
};
