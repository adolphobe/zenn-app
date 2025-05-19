
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { deleteTask as deleteTaskService } from '@/services/task';

export const deleteTask = async (dispatch: AppDispatch, id: string) => {
  try {
    // Delete from database
    await deleteTaskService(id);
    
    // Update local state
    dispatch({ type: 'DELETE_TASK', payload: id });
    
    toast({
      id: uuidv4(),
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso."
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao excluir tarefa",
      description: "Não foi possível excluir a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};
