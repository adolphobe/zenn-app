
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { toggleTaskHidden as toggleTaskHiddenService } from '@/services/taskService';

// This function is now simplified as most of the functionality is handled by React Query
export const toggleTaskHidden = async (dispatch: AppDispatch, id: string) => {
  try {
    console.log('Iniciando processo de ocultar/mostrar tarefa com ID:', id);
    
    // Local state update for immediate UI feedback
    // This maintains backward compatibility with components using AppContext
    dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
    
    // The actual API call and optimistic updates are now handled in useTaskData.ts
    // This function just maintains compatibility with the older context-based architecture
    return await toggleTaskHiddenService(id);
    
  } catch (error) {
    console.error('Error toggling task hidden status:', error);
    
    // Show a generic error toast
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar a visibilidade da tarefa. Tente novamente.",
      variant: "destructive",
    });
    
    throw error;
  }
};
