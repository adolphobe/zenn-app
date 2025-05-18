
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { setTaskFeedback as setFeedbackService } from '@/services/taskService';

export const useTaskFeedback = (
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const queryClient = useQueryClient();
  
  // Set feedback mutation
  const setFeedbackMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string, feedback: 'transformed' | 'relief' | 'obligation' }) => {
      return setFeedbackService(id, feedback);
    },
    onMutate: ({ id }) => {
      setTaskOperationLoading(id, 'set-feedback', true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      console.error('Error setting task feedback:', error);
      toast({
        id: uuidv4(),
        title: "Erro ao atualizar feedback",
        description: "Não foi possível salvar o feedback. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, { id }) => {
      setTaskOperationLoading(id, 'set-feedback', false);
    }
  });
  
  return {
    setTaskFeedback: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => 
      setFeedbackMutation.mutate({ id, feedback }),
    setFeedbackLoading: setFeedbackMutation.isPending
  };
};
