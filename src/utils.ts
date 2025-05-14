
import { Task } from './types';

export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getTaskPriorityClass = (score: number): string => {
  if (score >= 14) return 'task-critical';
  if (score >= 11) return 'task-important';
  if (score >= 8) return 'task-moderate';
  return 'task-light';
};

export const sortTasks = (tasks: Task[], viewMode: 'power' | 'chronological'): Task[] => {
  return [...tasks].sort((a, b) => {
    if (viewMode === 'power') {
      // Sort by score (desc), then by date (asc if exists)
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (a.idealDate && b.idealDate) return a.idealDate.getTime() - b.idealDate.getTime();
      if (a.idealDate) return -1;
      if (b.idealDate) return 1;
      return 0;
    } else {
      // Sort by date (asc if exists), then by score (desc)
      if (a.idealDate && b.idealDate) return a.idealDate.getTime() - b.idealDate.getTime();
      if (a.idealDate) return -1;
      if (b.idealDate) return 1;
      return b.totalScore - a.totalScore;
    }
  });
};
