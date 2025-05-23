
import { createContext, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { Eye, EyeOff, Check, RefreshCcw } from 'lucide-react';
import { ExtendedToastProps } from '@/types/toast';

// Create context for the toast functions
type TaskToastContextType = {
  showToggleHiddenToast: (task: Task) => void;
  showCompletionToast: (task: Task) => void;
  showTaskRestoredToast: (task: Task) => void;
  showRestoreToast: (taskTitle: string) => void; // Adicionado este método
};

const TaskToastContext = createContext<TaskToastContextType | null>(null);

// Create provider component
export const TaskToastProvider = ({ children }: { children: ReactNode }) => {
  // Toast for toggling task visibility
  const showToggleHiddenToast = (task: Task) => {
    toast({
      id: `toggle-visibility-${task.id}-${Date.now()}`,
      title: task.hidden ? "Tarefa ocultada" : "Tarefa visível",
      description: task.hidden 
        ? "A tarefa foi ocultada e só será visível com o filtro ativado." 
        : "A tarefa agora está visível.",
      icon: task.hidden ? <EyeOff size={16} /> : <Eye size={16} />
    });
  };

  // Toast for task completion - renamed to match usage in the toggle hook
  const showCompletionToast = (task: Task) => {
    toast({
      id: `task-completed-${task.id}-${Date.now()}`,
      title: "Tarefa concluída",
      description: `"${task.title}" foi marcada como concluída.`,
      variant: "default",
      icon: <Check size={16} />
    });
  };

  // Toast for task restoration
  const showTaskRestoredToast = (task: Task) => {
    toast({
      id: `task-restored-${task.id}-${Date.now()}`,
      title: "Tarefa restaurada",
      description: `"${task.title}" foi restaurada para a lista de tarefas ativas.`,
      icon: <RefreshCcw size={16} />
    });
  };

  // Toast for generic task restoration (string only version)
  const showRestoreToast = (taskTitle: string) => {
    toast({
      id: `task-restored-${Date.now()}`,
      title: "Tarefa restaurada",
      description: `"${taskTitle}" foi restaurada para a lista de tarefas ativas.`,
      icon: <RefreshCcw size={16} />
    });
  };

  const value = {
    showToggleHiddenToast,
    showCompletionToast,
    showTaskRestoredToast,
    showRestoreToast
  };

  return (
    <TaskToastContext.Provider value={value}>
      {children}
    </TaskToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useTaskToasts = () => {
  const context = useContext(TaskToastContext);
  if (!context) {
    throw new Error("useTaskToasts must be used within a TaskToastProvider");
  }
  return context;
};
