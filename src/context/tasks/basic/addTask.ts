
import { TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { createTask as createTaskService } from '@/services/taskService';

export const addTask = async (dispatch: AppDispatch, task: TaskFormData) => {
  try {
    // Get current user
    const authStore = document.querySelector('#auth-store');
    const currentUser = authStore ? JSON.parse(authStore.getAttribute('data-user') || '{}') : null;
    
    if (!currentUser?.id) {
      // If offline or not logged in, just update local state
      dispatch({ type: 'ADD_TASK', payload: task });
      return;
    }

    // Create task in database
    const newTask = await createTaskService(task, currentUser.id);
    
    // Update local state with the task returned from the database
    dispatch({ type: 'ADD_TASK', payload: newTask });
    
    toast({
      id: uuidv4(),
      title: "Tarefa adicionada",
      description: `"${task.title}" foi adicionada com sucesso.`
    });
  } catch (error) {
    console.error('Error adding task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao adicionar tarefa",
      description: "Não foi possível adicionar a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};
