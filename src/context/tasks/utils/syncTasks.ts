
import { fetchTasks } from '@/services/taskService';
import { AppDispatch } from '../../types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const syncTasksFromDatabase = async (dispatch: AppDispatch, userId: string) => {
  try {
    // Show syncing status
    dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });
    
    // Clear the DOM storage to prevent any inconsistencies
    const taskStore = document.querySelector('#task-store');
    if (taskStore) {
      taskStore.setAttribute('data-tasks', JSON.stringify([]));
    }
    
    console.log("[syncTasks] Iniciando sincronização completa para usuário:", userId);
    
    // Reload tasks from database
    const activeTasks = await fetchTasks(userId, false);
    const completedTasks = await fetchTasks(userId, true);
    
    console.log("[syncTasks] Tarefas ativas carregadas:", activeTasks.length);
    console.log("[syncTasks] Tarefas concluídas carregadas:", completedTasks.length);
    
    // Combine all tasks
    const allTasks = [...activeTasks, ...completedTasks];
    
    // Clear existing tasks and set the ones from the database
    dispatch({ type: 'CLEAR_TASKS' });
    
    // Add each task to the state
    allTasks.forEach(task => {
      dispatch({ 
        type: 'ADD_TASK', 
        payload: {
          ...task,
          operationLoading: {} // Initialize with empty loading state
        }
      });
    });
    
    // Update sync status
    dispatch({ type: 'SET_SYNC_STATUS', payload: 'synced' });
    
    // Show toast only if there were any tasks loaded
    if (allTasks.length > 0) {
      toast({
        id: uuidv4(),
        title: "Tarefas sincronizadas",
        description: `${allTasks.length} tarefas carregadas do banco de dados.`,
      });
    }
    
    // Reset sync status after a delay
    setTimeout(() => {
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'idle' });
    }, 3000);
    
    return allTasks;
  } catch (error) {
    console.error('[syncTasks] Erro ao sincronizar tarefas do banco de dados:', error);
    
    // Update sync status
    dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
    
    toast({
      id: uuidv4(),
      title: "Erro ao sincronizar tarefas",
      description: "Não foi possível sincronizar suas tarefas. Tente novamente.",
      variant: "destructive",
    });
    
    return null;
  }
};
