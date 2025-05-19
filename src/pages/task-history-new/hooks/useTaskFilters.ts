
import { useState, useEffect, useMemo } from 'react';
import { Task } from '@/types';

/**
 * Hook to manage task filtering functionality
 */
export const useTaskFilters = (tasks: Task[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tasks based on search query - properly memoized
  const filteredTasks = useMemo(() => {
    if (!tasks || !tasks.length) return [];
    
    if (!searchQuery.trim()) {
      return tasks;
    }
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    return tasks.filter(task => 
      task.title.toLowerCase().includes(normalizedQuery)
    );
  }, [tasks, searchQuery]);
  
  return {
    searchQuery,
    setSearchQuery,
    filteredTasks,
  };
};
