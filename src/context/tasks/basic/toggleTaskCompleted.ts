
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { toggleTaskCompletion as toggleTaskCompletionService } from '@/services/taskService';

export const toggleTaskCompleted = async (dispatch: AppDispatch, id: string) => {
  try {
    // Get current task status
    const taskStore = document.querySelector('#task-store');
    const tasks = taskStore ? JSON.parse(taskStore.getAttribute('data-tasks') || '[]') : [];
    const task = tasks.find((t: any) => t.id === id);
    
    if (!task) return;
    
    // Toggle in database
    await toggleTaskCompletionService(id, task.completed);
    
    // Update local state
    dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: id });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar o status da tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};
