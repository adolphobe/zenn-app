
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { Eye, EyeOff, Check } from 'lucide-react';

export const useTaskToasts = () => {
  // Toast for toggling task visibility
  const showToggleHiddenToast = (task: Task) => {
    toast({
      id: `toggle-visibility-${task.id}-${Date.now()}`,
      title: task.hidden ? "Tarefa ocultada" : "Tarefa visível",
      description: task.hidden 
        ? "A tarefa foi ocultada e só será visível com o filtro ativado." 
        : "A tarefa agora está visível.",
      icon: task.hidden ? <EyeOff size={16} /> : <Eye size={16} />,
    });
  };

  // Toast for task completion
  const showTaskCompletedToast = (task: Task) => {
    toast({
      id: `task-completed-${task.id}-${Date.now()}`,
      title: "Tarefa concluída",
      description: `"${task.title}" foi marcada como concluída.`,
      icon: <Check size={16} />,
      variant: "success",
    });
  };

  // Toast for task restoration
  const showTaskRestoredToast = (task: Task) => {
    toast({
      id: `task-restored-${task.id}-${Date.now()}`,
      title: "Tarefa restaurada",
      description: `"${task.title}" foi restaurada para a lista de tarefas ativas.`,
    });
  };

  return {
    showToggleHiddenToast,
    showTaskCompletedToast,
    showTaskRestoredToast
  };
};
