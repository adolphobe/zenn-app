/**
 * This file is deprecated and will be removed in a future update.
 * All task data is now managed directly through React state and React Query.
 * The DOM-based storage approach caused type inconsistencies and synchronization issues.
 */

// Keep a minimal implementation for backward compatibility during transition
import { useEffect } from 'react';
import { Task } from '@/types';

/**
 * @deprecated Use React Query or Context API directly instead of DOM storage
 */
export const useTaskStore = (tasks: Task[]) => {
  useEffect(() => {
    console.warn('useTaskStore is deprecated and will be removed in a future update');
    // No longer storing tasks in DOM
    return () => {
      // No cleanup needed
    };
  }, [tasks]);
};

/**
 * @deprecated Use auth context directly instead of DOM storage
 */
export const useAuthStore = (currentUser: any) => {
  useEffect(() => {
    console.warn('useAuthStore is deprecated and will be removed in a future update');
    // No longer storing auth in DOM
    return () => {
      // No cleanup needed
    };
  }, [currentUser]);
};
