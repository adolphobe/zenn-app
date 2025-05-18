
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { toggleTaskHidden as toggleTaskHiddenService } from '@/services/taskService';

// Esta função é simplificada e focada na comunicação com o serviço e o estado local
export const toggleTaskHidden = async (dispatch: AppDispatch, id: string) => {
  try {
    console.log('Iniciando processo de ocultar/mostrar tarefa com ID:', id);
    
    // Atualização local imediata para melhor UX
    dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
    
    // Chamada ao serviço para persistir a mudança no banco de dados
    const updatedTask = await toggleTaskHiddenService(id);
    
    // Despachamos uma ação adicional após a confirmação do serviço
    // Isso garante que o estado local esteja sincronizado com o banco de dados
    dispatch({ 
      type: 'UPDATE_TASK_VISIBILITY_CONFIRMED', 
      payload: { 
        id, 
        hidden: updatedTask.hidden 
      } 
    });
    
    // Adicionar feedback de toast para confirmar a ação
    const actionText = updatedTask.hidden ? "ocultada" : "mostrada";
    toast({
      id: uuidv4(),
      title: `Tarefa ${actionText}`,
      description: updatedTask.hidden ? 
        "A tarefa foi ocultada. Ative o filtro de tarefas ocultas para vê-la." : 
        "A tarefa agora está visível."
    });
    
    return updatedTask;
    
  } catch (error) {
    console.error('Error toggling task hidden status:', error);
    
    // Em caso de erro, revertemos a mudança local e mostramos um toast
    dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
    
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar a visibilidade da tarefa. Tente novamente.",
      variant: "destructive",
    });
    
    throw error;
  }
};
