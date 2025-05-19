
import { TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { updateTask as updateTaskService } from '@/services/taskService';

export const updateTask = async (dispatch: AppDispatch, id: string, data: Partial<TaskFormData>) => {
  try {
    // Update in database
    await updateTaskService(id, data);
    
    // Update local state
    dispatch({ type: 'UPDATE_TASK', payload: { id, data } });
  } catch (error) {
    console.error('Error updating task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const updateTaskTitle = async (dispatch: AppDispatch, id: string, title: string) => {
  try {
    // Update in database (reuse updateTask service)
    await updateTaskService(id, { title });
    
    // Update local state
    dispatch({ type: 'UPDATE_TASK_TITLE', payload: { id, title } });
  } catch (error) {
    console.error('Error updating task title:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar o título da tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};
