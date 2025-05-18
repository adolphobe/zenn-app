
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { restoreTask as restoreTaskService } from '@/services/taskService';

export const useTaskRestore = (
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const queryClient = useQueryClient();
  
  // Restore task mutation
  const restoreTaskMutation = useMutation({
    mutationFn: (id: string) => {
      return restoreTaskService(id);
    },
    onMutate: (id) => {
      setTaskOperationLoading(id, 'restore', true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        id: uuidv4(),
        title: "Tarefa restaurada",
        description: "A tarefa foi restaurada com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Error restoring task:', error);
      toast({
        id: uuidv4(),
        title: "Erro ao restaurar tarefa",
        description: "Não foi possível restaurar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, id) => {
      setTaskOperationLoading(id, 'restore', false);
    }
  });
  
  return {
    restoreTask: (id: string) => restoreTaskMutation.mutate(id),
    restoreLoading: restoreTaskMutation.isPending
  };
};
