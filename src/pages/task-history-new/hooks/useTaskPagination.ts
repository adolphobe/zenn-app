
import { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types';
import { format, isSameDay, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

interface TaskGroup {
  label: string;
  tasks: Task[];
}

export const useTaskPagination = (sortedTasks: Task[], itemsPerPage: number = 30) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when tasks change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedTasks]);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / itemsPerPage));
  
  // Get current page items
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage, itemsPerPage]);

  // Group tasks by time periods
  const groupedTasks = useMemo(() => {
    if (!paginatedTasks.length) return [];

    const groups: TaskGroup[] = [];
    const today: Task[] = [];
    const yesterday: Task[] = [];
    const thisWeek: Task[] = [];
    const thisMonth: Task[] = [];
    const older: Task[] = [];

    // Sort tasks into groups
    paginatedTasks.forEach(task => {
      if (!task.completedAt) {
        older.push(task);
        return;
      }

      const completedDate = new Date(task.completedAt);
      
      if (isToday(completedDate)) {
        today.push(task);
      } else if (isYesterday(completedDate)) {
        yesterday.push(task);
      } else if (isThisWeek(completedDate)) {
        thisWeek.push(task);
      } else if (isThisMonth(completedDate)) {
        thisMonth.push(task);
      } else {
        older.push(task);
      }
    });

    // Add non-empty groups
    if (today.length) groups.push({ label: 'Hoje', tasks: today });
    if (yesterday.length) groups.push({ label: 'Ontem', tasks: yesterday });
    if (thisWeek.length) groups.push({ label: 'Esta semana', tasks: thisWeek });
    if (thisMonth.length) groups.push({ label: 'Este mês', tasks: thisMonth });
    if (older.length) groups.push({ label: 'Mais antigas', tasks: older });

    return groups;
  }, [paginatedTasks]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of the page for better UX
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedTasks,
    groupedTasks,
    handlePageChange
  };
};
