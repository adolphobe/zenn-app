
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { fetchTasks } from '@/services/taskService';
import { useAuth } from '@/context/auth';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export const useFetchTasks = (completed: boolean = false) => {
  const { currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  
  const fetchTasksData = useCallback(async () => {
    if (!currentUser?.id || !isAuthenticated) {
      return [];
    }
    
    try {
      setSyncStatus('syncing');
      console.log('Fetching tasks for user:', currentUser.id, 'completed:', completed);
      const tasks = await fetchTasks(currentUser.id, completed);
      setSyncStatus('synced');
      console.log('Fetched tasks count:', tasks.length);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSyncStatus('error');
      return [];
    }
  }, [currentUser?.id, isAuthenticated, completed]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', { completed }],
    queryFn: fetchTasksData,
    enabled: !!currentUser?.id && isAuthenticated,
    staleTime: 60000, // 60 seconds
    refetchOnWindowFocus: false,
  });

  // Add a function to force synchronization from the database
  const forceSynchronize = useCallback(async () => {
    if (!currentUser?.id || !isAuthenticated || isSyncing) {
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatus('syncing');
      
      const tasksFromDB = await fetchTasks(currentUser.id, completed);
      
      // Update the query cache with the new data immediately
      queryClient.setQueryData(['tasks', { completed }], tasksFromDB);
      
      setSyncStatus('synced');
      return tasksFromDB;
    } catch (error) {
      console.error('Error synchronizing tasks:', error);
      setSyncStatus('error');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser?.id, isAuthenticated, completed, isSyncing, queryClient]);
  
  return { 
    tasks: data || [],
    isLoading,
    error,
    forceSynchronize,
    syncStatus,
    refetch
  };
};
