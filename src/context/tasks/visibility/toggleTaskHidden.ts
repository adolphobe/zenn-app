
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { toggleTaskHidden as toggleTaskHiddenService } from '@/services/taskService';
import { syncTasksFromDatabase } from '../utils/syncTasks';

export const toggleTaskHidden = async (dispatch: AppDispatch, id: string) => {
  try {
    console.log('Iniciando processo de ocultar/mostrar tarefa com ID:', id);
    
    // Dispatch a loading state to give immediate feedback
    dispatch({ type: 'SET_TASK_OPERATION_LOADING', payload: { id, operation: 'toggle-hidden', loading: true } });
    
    // Dispatch local state change immediately for UI responsiveness
    // This gives instant visual feedback even before the API call completes
    dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
    
    try {
      // Call service in background
      const updatedTask = await toggleTaskHiddenService(id);
      console.log('Tarefa atualizada com sucesso:', updatedTask);
      
      // Reset loading state
      dispatch({ type: 'SET_TASK_OPERATION_LOADING', payload: { id, operation: 'toggle-hidden', loading: false } });
      
      // The toast is now handled by the React Query mutation in useTaskData.ts
      return updatedTask;
    } catch (error: any) {
      console.error('Error toggling task hidden status:', error);
      
      // Reset loading state
      dispatch({ type: 'SET_TASK_OPERATION_LOADING', payload: { id, operation: 'toggle-hidden', loading: false } });
      
      // Revert the optimistic update since the API call failed
      dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
      
      // Attempt data recovery - fetch from database regardless of specific error
      console.log('Tentando recarregar tarefas para sincronizar com o banco de dados...');
      
      // Get current user
      const authStore = document.querySelector('#auth-store');
      const currentUser = authStore ? JSON.parse(authStore.getAttribute('data-user') || '{}') : null;
      
      if (currentUser?.id) {
        // Show sync toast
        toast({
          id: uuidv4(),
          title: "Sincronizando dados...",
          description: "Detectamos uma inconsistência. Sincronizando com o servidor.",
        });
        
        // Force sync with database to resolve inconsistency
        await syncTasksFromDatabase(dispatch, currentUser.id);
      } else {
        toast({
          id: uuidv4(),
          title: "Erro ao atualizar tarefa",
          description: "Não foi possível atualizar a visibilidade da tarefa. Tente novamente após fazer login.",
          variant: "destructive",
        });
      }
      
      throw error;
    }
  } catch (generalError) {
    console.error('Erro geral ao processar ocultação da tarefa:', generalError);
    toast({
      id: uuidv4(),
      title: "Erro ao processar operação",
      description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      variant: "destructive",
    });
    throw generalError;
  }
};
