
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { toggleTaskHidden as toggleTaskHiddenService } from '@/services/taskService';
import { syncTasksFromDatabase } from '../utils/syncTasks';

export const toggleTaskHidden = async (dispatch: AppDispatch, id: string) => {
  try {
    console.log('Iniciando processo de ocultar/mostrar tarefa com ID:', id);
    
    // Get current task status
    const taskStore = document.querySelector('#task-store');
    const tasks = taskStore ? JSON.parse(taskStore.getAttribute('data-tasks') || '[]') : [];
    const task = tasks.find((t: any) => t.id === id);
    
    if (!task) {
      console.error('Tarefa não encontrada no armazenamento local:', id);
      toast({
        id: uuidv4(),
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível encontrar a tarefa no estado local.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Dados da tarefa antes de chamar o serviço:', task);
    
    try {
      // Toggle in database
      const updatedTask = await toggleTaskHiddenService(id, task.hidden);
      console.log('Tarefa atualizada com sucesso:', updatedTask);
      
      // Update local state
      dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
      
      toast({
        id: uuidv4(),
        title: task.hidden ? "Tarefa visível" : "Tarefa oculta",
        description: task.hidden ? "A tarefa agora está visível." : "A tarefa foi ocultada.",
      });
    } catch (error: any) {
      console.error('Error toggling task hidden status:', error);
      
      // If the error indicates the task wasn't found, refresh the task list
      if (error.message && error.message.includes('não existe')) {
        console.log('Tentando recarregar tarefas para sincronizar com o banco de dados...');
        
        // Get current user
        const authStore = document.querySelector('#auth-store');
        const currentUser = authStore ? JSON.parse(authStore.getAttribute('data-user') || '{}') : null;
        
        if (currentUser?.id) {
          // Reload tasks from database and update state
          await syncTasksFromDatabase(dispatch, currentUser.id);
        }
      } else {
        toast({
          id: uuidv4(),
          title: "Erro ao atualizar tarefa",
          description: "Não foi possível atualizar a visibilidade da tarefa. Tente novamente.",
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
