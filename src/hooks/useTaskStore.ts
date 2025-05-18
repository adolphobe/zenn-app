
import { useEffect } from 'react';
import { Task } from '@/types';

/**
 * A hook to enable access to tasks from the DOM for non-React components
 */
export const useTaskStore = (tasks: Task[]) => {
  useEffect(() => {
    // Create a hidden element to store task data for non-React code to access
    let taskStore = document.getElementById('task-store');
    
    if (!taskStore) {
      taskStore = document.createElement('div');
      taskStore.id = 'task-store';
      taskStore.style.display = 'none';
      document.body.appendChild(taskStore);
    }
    
    // Make a clean copy of tasks that excludes methods and class instances
    // This prevents issues with JSON serialization
    const cleanTasks = tasks.map(task => {
      // Create a clean copy without any potential circular references
      const cleanTask = { ...task };
      
      // Convert Date objects to ISO strings to ensure proper serialization
      if (cleanTask.createdAt instanceof Date) {
        cleanTask.createdAt = cleanTask.createdAt.toISOString();
      }
      // No need to reassign if it's already a string
      
      if (cleanTask.idealDate instanceof Date) {
        cleanTask.idealDate = cleanTask.idealDate.toISOString();
      } 
      // No need to reassign if it's already a string or null
      
      return cleanTask;
    });
    
    // Store serialized tasks in the DOM
    taskStore.setAttribute('data-tasks', JSON.stringify(cleanTasks));
    
    return () => {
      if (taskStore && document.body.contains(taskStore)) {
        // Clear data before removal to prevent memory leaks
        taskStore.setAttribute('data-tasks', '[]');
        document.body.removeChild(taskStore);
      }
    };
  }, [tasks]);
};

/**
 * A hook to enable access to the current user from the DOM for non-React components
 */
export const useAuthStore = (currentUser: any) => {
  useEffect(() => {
    // Create a hidden element to store user data for non-React code to access
    let authStore = document.getElementById('auth-store');
    
    if (!authStore) {
      authStore = document.createElement('div');
      authStore.id = 'auth-store';
      authStore.style.display = 'none';
      document.body.appendChild(authStore);
    }
    
    // Only store minimal user data and ensure it's serializable
    const userJson = currentUser ? JSON.stringify({
      id: currentUser.id,
      email: currentUser.email
    }) : '{}';
    
    authStore.setAttribute('data-user', userJson);
    
    return () => {
      if (authStore && document.body.contains(authStore)) {
        // Clear user data before removal
        authStore.setAttribute('data-user', '{}');
        document.body.removeChild(authStore);
      }
    };
  }, [currentUser]);
};
