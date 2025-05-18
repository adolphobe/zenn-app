
import { useEffect, useState } from 'react';
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
    
    taskStore.setAttribute('data-tasks', JSON.stringify(tasks));
    
    return () => {
      if (taskStore && document.body.contains(taskStore)) {
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
    
    authStore.setAttribute('data-user', JSON.stringify(currentUser || {}));
    
    return () => {
      if (authStore && document.body.contains(authStore)) {
        document.body.removeChild(authStore);
      }
    };
  }, [currentUser]);
};
