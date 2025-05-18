
import { useQuery } from '@tanstack/react-query';
import { Task } from '@/types';
import { fetchTasks } from '@/services/taskService';
import { useAuth } from '@/context/auth';

export const useFetchTasks = (completed: boolean = false) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Main query for fetching tasks with proper caching
  const { 
    data: tasks = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['tasks', currentUser?.id, completed],
    queryFn: () => currentUser?.id ? fetchTasks(currentUser.id, completed) : Promise.resolve([]),
    enabled: !!currentUser?.id && isAuthenticated,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true
  });
  
  // Force manual synchronization
  const forceSynchronize = async () => {
    return refetch();
  };
  
  return {
    tasks,
    isLoading,
    error,
    refetch,
    forceSynchronize
  };
};
