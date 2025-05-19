
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { toggleTaskHidden as toggleTaskHiddenService } from '@/services/task';

// Esta função é simplificada e focada na comunicação com o serviço e o estado local
export const toggleTaskHidden = async (dispatch: AppDispatch, id: string) => {
  try {
    console.log('Iniciando processo de ocultar/mostrar tarefa com ID:', id);
    
    // Primeiro buscamos a tarefa inteira para saber seu estado atual
    // Obtenha o estado atual da tarefa usando TOGGLE_TASK_HIDDEN com um payload especial
    dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
    
    // Agora vamos obter a tarefa atualizada do estado para saber se está oculta
    // Esta é uma ação especial para atualizar o estado local imediatamente
    
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
