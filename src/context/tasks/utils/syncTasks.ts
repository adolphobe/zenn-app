
import { AppDispatch } from '../../types';
import { fetchTasks } from '@/services/taskService';

/**
 * Synchronizes tasks from the database to the local state
 * @deprecated Use React Query directly instead
 */
export const syncTasksFromDatabase = async (dispatch: AppDispatch, userId: string) => {
  if (!userId) {
    console.error('No user ID provided for syncing tasks');
    return null;
  }
  
  try {
    // Fetch active tasks
    const activeTasks = await fetchTasks(userId, false);
    
    // Fetch completed tasks
    const completedTasks = await fetchTasks(userId, true);
    
    // Combine all tasks
    const allTasks = [...activeTasks, ...completedTasks];
    
    // Clear existing tasks and update with fetched ones
    dispatch({ type: 'CLEAR_TASKS' });
    
    // Only dispatch if we have tasks
    if (allTasks.length > 0) {
      allTasks.forEach(task => {
        dispatch({
          type: 'ADD_TASK',
          payload: {
            ...task,
            // Convert dates back to Date objects
            idealDate: task.idealDate,
            completedAt: task.completedAt,
            createdAt: task.createdAt
          }
        });
      });
    }
    
    console.log(`Synchronized ${allTasks.length} tasks from database`);
    dispatch({ type: 'SET_SYNC_STATUS', payload: 'synced' });
    
    return allTasks;
  } catch (error) {
    console.error('Error synchronizing tasks from database:', error);
    dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
    return null;
  }
};
