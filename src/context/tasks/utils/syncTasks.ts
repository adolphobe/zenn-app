
import { fetchTasks } from '@/services/taskService';
import { AppDispatch } from '../../types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const syncTasksFromDatabase = async (dispatch: AppDispatch, userId: string) => {
  try {
    // Reload tasks from database
    const activeTasks = await fetchTasks(userId, false);
    const completedTasks = await fetchTasks(userId, true);
    
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
    
    return allTasks;
  } catch (error) {
    console.error('Error syncing tasks from database:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao sincronizar tarefas",
      description: "Não foi possível sincronizar suas tarefas. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
};
