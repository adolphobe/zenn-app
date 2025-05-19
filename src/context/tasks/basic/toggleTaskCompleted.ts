
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { toggleTaskCompletion as toggleTaskCompletionService } from '@/services/taskService';
import { logTaskStateChange, logDateInfo } from '@/utils/diagnosticLog';

export const toggleTaskCompleted = async (dispatch: AppDispatch, id: string) => {
  try {
    // Get current task status
    const taskStore = document.querySelector('#task-store');
    const tasks = taskStore ? JSON.parse(taskStore.getAttribute('data-tasks') || '[]') : [];
    const task = tasks.find((t: any) => t.id === id);
    
    if (!task) {
      console.error('Task not found for toggle operation:', id);
      return;
    }
    
    // Log before state
    logTaskStateChange('TOGGLE_TASK_COMPLETED_START', id, task.title, {
      completed: task.completed,
      completedAt: task.completedAt
    });
    
    // Prepare the completion data with explicit completedAt handling
    const isCompleting = !task.completed;
    const completionData = isCompleting 
      ? { completed: true, completedAt: new Date().toISOString() } 
      : { completed: false, completedAt: null };
    
    logDateInfo('TOGGLE_TASK', 'Setting completedAt', completionData.completedAt);
    
    // Toggle in database
    const updatedTask = await toggleTaskCompletionService(id, task.completed);
    
    // Log the database response
    logDateInfo('TOGGLE_TASK', 'DB returned completedAt', updatedTask.completedAt);
    
    // Update local state
    dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: id });
    
    // Log after state
    const updatedTaskStore = document.querySelector('#task-store');
    const updatedTasks = updatedTaskStore ? JSON.parse(updatedTaskStore.getAttribute('data-tasks') || '[]') : [];
    const updatedTaskLocal = updatedTasks.find((t: any) => t.id === id);
    
    if (updatedTaskLocal) {
      logTaskStateChange('TOGGLE_TASK_COMPLETED_END', id, task.title, {
        completed: task.completed,
        completedAt: task.completedAt
      }, {
        completed: updatedTaskLocal.completed,
        completedAt: updatedTaskLocal.completedAt
      });
    }
    
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
