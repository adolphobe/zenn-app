import { TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../types';
import { useAuth } from '@/context/auth';
import { 
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  toggleTaskCompletion as toggleTaskCompletionService,
  toggleTaskHidden as toggleTaskHiddenService,
  setTaskFeedback as setTaskFeedbackService,
  restoreTask as restoreTaskService,
  addComment as addCommentService,
  deleteComment as deleteCommentService
} from '@/services/taskService';

// Task-related actions
export const addTask = async (dispatch: AppDispatch, task: TaskFormData) => {
  try {
    // Get current user
    const authStore = document.querySelector('#auth-store');
    const currentUser = authStore ? JSON.parse(authStore.getAttribute('data-user') || '{}') : null;
    
    if (!currentUser?.id) {
      // If offline or not logged in, just update local state
      dispatch({ type: 'ADD_TASK', payload: task });
      return;
    }

    // Create task in database
    const newTask = await createTaskService(task, currentUser.id);
    
    // Update local state with the task returned from the database
    dispatch({ type: 'ADD_TASK', payload: newTask });
    
    toast({
      id: uuidv4(),
      title: "Tarefa adicionada",
      description: `"${task.title}" foi adicionada com sucesso.`
    });
  } catch (error) {
    console.error('Error adding task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao adicionar tarefa",
      description: "Não foi possível adicionar a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const deleteTask = async (dispatch: AppDispatch, id: string) => {
  try {
    // Delete from database
    await deleteTaskService(id);
    
    // Update local state
    dispatch({ type: 'DELETE_TASK', payload: id });
    
    toast({
      id: uuidv4(),
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso."
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao excluir tarefa",
      description: "Não foi possível excluir a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const toggleTaskCompleted = async (dispatch: AppDispatch, id: string) => {
  try {
    // Get current task status
    const taskStore = document.querySelector('#task-store');
    const tasks = taskStore ? JSON.parse(taskStore.getAttribute('data-tasks') || '[]') : [];
    const task = tasks.find((t: any) => t.id === id);
    
    if (!task) return;
    
    // Toggle in database
    await toggleTaskCompletionService(id, task.completed);
    
    // Update local state
    dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: id });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar o status da tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};

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
          // Reload tasks from database
          const { fetchTasks } = await import('@/services/taskService');
          const activeTasks = await fetchTasks(currentUser.id, false);
          const completedTasks = await fetchTasks(currentUser.id, true);
          
          // Combine all tasks
          const allTasks = [...activeTasks, ...completedTasks];
          
          // Clear existing tasks and set the ones from the database
          dispatch({ type: 'CLEAR_TASKS' });
          
          // Add each task to the state
          allTasks.forEach(task => {
            dispatch({ 
              type: 'ADD_TASK', 
              payload: task 
            });
          });
          
          toast({
            id: uuidv4(),
            title: "Tarefas sincronizadas",
            description: "Suas tarefas foram recarregadas do banco de dados.",
          });
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

export const updateTask = async (dispatch: AppDispatch, id: string, data: Partial<TaskFormData>) => {
  try {
    // Update in database
    await updateTaskService(id, data);
    
    // Update local state
    dispatch({ type: 'UPDATE_TASK', payload: { id, data } });
  } catch (error) {
    console.error('Error updating task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const updateTaskTitle = async (dispatch: AppDispatch, id: string, title: string) => {
  try {
    // Update in database (reuse updateTask service)
    await updateTaskService(id, { title });
    
    // Update local state
    dispatch({ type: 'UPDATE_TASK_TITLE', payload: { id, title } });
  } catch (error) {
    console.error('Error updating task title:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar tarefa",
      description: "Não foi possível atualizar o título da tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const setTaskFeedback = async (
  dispatch: AppDispatch, 
  id: string, 
  feedback: 'transformed' | 'relief' | 'obligation'
) => {
  try {
    // Update in database
    await setTaskFeedbackService(id, feedback);
    
    // Update local state
    dispatch({ type: 'SET_TASK_FEEDBACK', payload: { id, feedback } });
  } catch (error) {
    console.error('Error setting task feedback:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar feedback",
      description: "Não foi possível salvar o feedback. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const restoreTask = async (dispatch: AppDispatch, taskId: string) => {
  try {
    // Restore in database
    await restoreTaskService(taskId);
    
    // Update local state
    dispatch({ type: 'RESTORE_TASK', payload: taskId });
    
    toast({
      id: uuidv4(),
      title: "Tarefa restaurada",
      description: "A tarefa foi restaurada com sucesso."
    });
  } catch (error) {
    console.error('Error restoring task:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao restaurar tarefa",
      description: "Não foi possível restaurar a tarefa. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const completeTaskWithDate = (
  dispatch: AppDispatch,
  title: string,
  completedAt: string
) => {
  dispatch({ type: 'COMPLETE_TASK_WITH_DATE', payload: { title, completedAt } });
};

export const addComment = async (dispatch: AppDispatch, taskId: string, text: string) => {
  try {
    // Get current user
    const authStore = document.querySelector('#auth-store');
    const currentUser = authStore ? JSON.parse(authStore.getAttribute('data-user') || '{}') : null;
    
    if (!currentUser?.id) {
      toast({
        id: uuidv4(),
        title: "Erro ao adicionar comentário",
        description: "Você precisa estar logado para adicionar comentários.",
        variant: "destructive",
      });
      return;
    }

    // Add comment to database
    await addCommentService(taskId, currentUser.id, text);
    
    // Update local state
    dispatch({ type: 'ADD_COMMENT', payload: { taskId, text } });
    
    toast({
      id: uuidv4(),
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso."
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao adicionar comentário",
      description: "Não foi possível adicionar o comentário. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const deleteComment = async (dispatch: AppDispatch, taskId: string, commentId: string) => {
  try {
    // Delete from database
    await deleteCommentService(commentId);
    
    // Update local state
    dispatch({ type: 'DELETE_COMMENT', payload: { taskId, commentId } });
    
    toast({
      id: uuidv4(),
      title: "Comentário removido",
      description: "O comentário foi removido com sucesso."
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao remover comentário",
      description: "Não foi possível remover o comentário. Tente novamente.",
      variant: "destructive",
    });
  }
};
