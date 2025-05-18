
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { restoreTask as restoreTaskService } from '@/services/taskService';

export const restoreTask = async (dispatch: AppDispatch, taskId: string) => {
  try {
    // Restore in database
    await restoreTaskService(taskId);
    
    // Update local state
    dispatch({ type: 'RESTORE_TASK', payload: taskId });
    
    toast({
      id: uuidv4(),
      title: "Tarefa restaurada",
      description: "A tarefa foi restaurada com sucesso."
    });
  } catch (error) {
    console.error('Error restoring task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao restaurar tarefa",
      description: "Não foi possível restaurar a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};
