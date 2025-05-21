
import { useState, useCallback } from 'react';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useToast } from '@/hooks/use-toast';

export const usePullToRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { forceSynchronize } = useTaskDataContext();
  const { addToast } = useToast();
  
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return Promise.resolve();
    
    setIsRefreshing(true);
    
    try {
      await forceSynchronize();
      
      // Show success toast
      addToast({
        title: "Atualizado",
        description: "Suas tarefas foram sincronizadas com sucesso.",
        variant: "default",
      });
      
      return Promise.resolve();
    } catch (error) {
      // Show error toast
      addToast({
        title: "Erro ao sincronizar",
        description: "Não foi possível sincronizar suas tarefas. Tente novamente.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [forceSynchronize, isRefreshing, addToast]);
  
  return {
    isRefreshing,
    handleRefresh
  };
};
