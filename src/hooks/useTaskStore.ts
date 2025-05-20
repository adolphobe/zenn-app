/**
 * This file is deprecated and will be removed in a future update.
 * All task data is now managed directly through React state and React Query.
 * The DOM-based storage approach has been replaced with NavigationStore.
 */

// Keep a minimal implementation for backward compatibility during transition
import { useEffect } from 'react';
import { Task } from '@/types';
import { NavigationStore } from '@/utils/navigationStore';
import { setLocalStorage } from '@/utils/localStorage';

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

/**
 * Hook to properly preload important pages for faster navigation
 */
export const usePagePreloader = () => {
  useEffect(() => {
    // Preload important pages in the background
    const preloadHistory = import('@/pages/task-history-new/TaskHistoryNewPage').catch(() => {});
    const preloadStrategic = import('@/pages/StrategicReview').catch(() => {});
    const preloadMobileHistory = import('@/pages/mobile/MobileTaskHistoryPage').catch(() => {});
    
    // Mark that we've done the initial loading - using localStorage directly
    // since NavigationStore doesn't have a specific method for this flag
    setLocalStorage('initial_load_complete', true);
    
    return () => {
      // No cleanup needed
    };
  }, []);
};
