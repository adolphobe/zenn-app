
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
    
    try {
      // Call service directly without relying on local state
      const updatedTask = await toggleTaskHiddenService(id);
      console.log('Tarefa atualizada com sucesso:', updatedTask);
      
      // Update local state
      dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
      
      // Reset loading state
      dispatch({ type: 'SET_TASK_OPERATION_LOADING', payload: { id, operation: 'toggle-hidden', loading: false } });
      
      toast({
        id: uuidv4(),
        title: updatedTask.hidden ? "Tarefa oculta" : "Tarefa visível",
        description: updatedTask.hidden ? "A tarefa foi ocultada." : "A tarefa agora está visível.",
      });
    } catch (error: any) {
      console.error('Error toggling task hidden status:', error);
      
      // Reset loading state
      dispatch({ type: 'SET_TASK_OPERATION_LOADING', payload: { id, operation: 'toggle-hidden', loading: false } });
      
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
    }
  } catch (generalError) {
    console.error('Erro geral ao processar ocultação da tarefa:', generalError);
    toast({
      id: uuidv4(),
      title: "Erro ao processar operação",
      description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      variant: "destructive",
    });
  }
};
