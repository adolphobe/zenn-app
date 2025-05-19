
import { Task } from '@/types';
import { toast } from '@/hooks/use-toast';
import { restoreTask as restoreTaskService } from '@/services/task';

export const restoreTask = async (taskId: string): Promise<void> => {
  try {
    // Call the service to restore the task
    await restoreTaskService(taskId);
    
    // Show success message
    toast({
      title: "Tarefa restaurada",
      description: "A tarefa foi restaurada com sucesso para sua lista de tarefas.",
    });
  } catch (error) {
    console.error('Error restoring task:', error);
    toast({
      title: "Erro ao restaurar tarefa",
      description: "Não foi possível restaurar a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};
